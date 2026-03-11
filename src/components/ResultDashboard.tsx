'use client';

import { useEffect, useRef, useState } from 'react';
import { useTaxStore } from '@/store/tax-store';
import { formatKRWFull } from './ui/NumberDisplay';

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    function step(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(from + (target - from) * ease));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

interface TaxCardProps {
  variant: 'danger' | 'success';
  label: string;
  taxAmount: number;
  highlight?: string;
  items: { label: string; value: number }[];
}

function TaxCard({ variant, label, taxAmount, highlight, items }: TaxCardProps) {
  const animatedTax = useCountUp(taxAmount);
  const isDanger = variant === 'danger';

  const accentColor = isDanger ? 'var(--accent-red)' : 'var(--accent-green)';

  return (
    <div className="card-elevated p-5 flex flex-col gap-4">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: accentColor }}
        />
        <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-tertiary)]">
          {label}
        </span>
      </div>

      {/* Main tax amount */}
      <div>
        <p className="text-[10px] text-[var(--text-tertiary)] mb-1">예상 납부 세액</p>
        <p
          className="font-display text-2xl font-bold tabular-nums tracking-tight"
          style={{ color: accentColor }}
        >
          {formatKRWFull(animatedTax)}
        </p>
        {highlight && (
          <p
            className="mt-1.5 text-xs font-medium"
            style={{ color: accentColor }}
          >
            {highlight}
          </p>
        )}
      </div>

      {/* Breakdown */}
      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
        {items.map(({ label: itemLabel, value }) => (
          <div key={itemLabel} className="flex justify-between text-xs">
            <span className="text-[var(--text-tertiary)]">{itemLabel}</span>
            <span className="font-display tabular-nums text-[var(--text-secondary)]">
              {formatKRWFull(value)}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function ResultDashboard() {
  const result = useTaxStore((s) => s.result);

  if (!result) return null;

  const savedTaxFormatted =
    result.savedTax > 0
      ? `${formatKRWFull(result.savedTax)} 절세 가능`
      : undefined;

  const dangerItems = [
    { label: '양도차익', value: Math.max(0, result.profit) },
    { label: '취득가액', value: result.cost },
    { label: '기본공제', value: 2_500_000 },
  ];

  const successItems = [
    { label: '최적화 후 세액', value: result.idealTax },
    { label: '절세 금액', value: result.savedTax },
    { label: '총 자산 가치', value: result.totalValue },
  ];

  return (
    <div className="mt-8 space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-tertiary)] font-medium">
          Result
        </span>
        <div className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TaxCard
          variant="danger"
          label="방치 시"
          taxAmount={result.currentTax}
          items={dangerItems}
        />
        <TaxCard
          variant="success"
          label="솔루션 적용 시"
          taxAmount={result.idealTax}
          highlight={savedTaxFormatted}
          items={successItems}
        />
      </div>

      {/* Detailed Action Plan */}
      {result.actionPlan && result.actionPlan.length > 0 && (
        <div className="card-elevated p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-blue)' }} />
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-tertiary)]">
              맞춤형 절세 전략
            </span>
          </div>
          <div className="space-y-3">
            {result.actionPlan.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(91,156,246,0.06)', border: '1px solid rgba(91,156,246,0.1)' }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ backgroundColor: 'rgba(91,156,246,0.15)', color: 'var(--accent-blue)' }}
                >
                  {i + 1}
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="card-elevated p-4 space-y-1.5 border-l-2" style={{ borderLeftColor: 'var(--accent-amber)' }}>
          <p className="text-[10px] font-medium text-[var(--accent-amber)] uppercase tracking-wider">
            주의사항
          </p>
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed">{w}</p>
          ))}
        </div>
      )}

      {/* Report CTA */}
      <div className="flex justify-center pt-1">
        <a
          href="#report-section"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all" style={{ backgroundColor: '#1c1d28', borderColor: 'rgba(255,255,255,0.06)', color: '#9a9caa' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#252636'; e.currentTarget.style.color = '#e8e9ed'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1c1d28'; e.currentTarget.style.color = '#9a9caa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          리포트 다운로드
        </a>
      </div>
    </div>
  );
}
