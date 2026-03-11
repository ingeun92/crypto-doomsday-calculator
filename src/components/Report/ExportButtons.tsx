'use client';

import { useRef, useState } from 'react';
import { exportToPDF, exportToImage } from '@/lib/report-exporter';
import ReportTemplate from './ReportTemplate';
import { useTaxStore } from '@/store/tax-store';
import type { UserInput } from '@/types';

interface ExportButtonsProps {
  reportRef: React.RefObject<HTMLDivElement | null>;
}

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ExportButtons({ reportRef }: ExportButtonsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  async function handlePDF() {
    if (!reportRef.current) return;
    setPdfLoading(true);
    try {
      await exportToPDF(reportRef.current);
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleImage() {
    if (!reportRef.current) return;
    setImgLoading(true);
    try {
      await exportToImage(reportRef.current);
    } finally {
      setImgLoading(false);
    }
  }

  const btnStyle: React.CSSProperties = {
    backgroundColor: '#1c1d28',
    borderColor: 'rgba(255,255,255,0.06)',
    color: '#9a9caa',
  };

  const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#252636';
    e.currentTarget.style.color = '#e8e9ed';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
  };

  const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#1c1d28';
    e.currentTarget.style.color = '#9a9caa';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
  };

  const btnCls =
    "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={handlePDF}
        disabled={pdfLoading}
        className={btnCls}
        style={btnStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {pdfLoading ? <Spinner /> : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )}
        PDF
      </button>

      <button
        onClick={handleImage}
        disabled={imgLoading}
        className={btnCls}
        style={btnStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {imgLoading ? <Spinner /> : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        PNG
      </button>
    </div>
  );
}

export default function ReportSection() {
  const reportRef = useRef<HTMLDivElement>(null);
  const { result, mode, storageLocations, coins, hasUnprovableAssets, totalInvestment, currentValue, expectedSellValue } = useTaxStore();

  if (!result) return null;

  const userInput: UserInput = {
    mode,
    storageLocations,
    coins,
    hasUnprovableAssets,
    totalInvestment,
    currentValue,
    expectedSellValue,
  };

  return (
    <div id="report-section" className="mt-6 space-y-4">
      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-tertiary)] font-medium">
          Report
        </span>
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>

      {/* Report preview */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div ref={reportRef} style={{ width: '794px' }}>
          <ReportTemplate result={result} userInput={userInput} />
        </div>
      </div>

      {/* Export buttons */}
      <ExportButtons reportRef={reportRef} />
    </div>
  );
}
