'use client';

import Link from 'next/link';
import SimpleMode from './SimpleMode';
import PreciseMode from './PreciseMode';
import ResultDashboard from './ResultDashboard';
import ReportSection from './Report';

export default function CalculatorSection() {
  return (
    <section
      id="calculator"
      className="w-full flex justify-center px-5 pb-24 pt-8"
    >
      <div className="w-full max-w-xl">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          <h2 className="font-display text-xs font-medium tracking-[0.2em] uppercase text-[var(--text-tertiary)]">
            Tax Diagnosis
          </h2>
          <div className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        {/* Main card */}
        <div className="card p-6 sm:p-8">
          {/* Heading */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              세금 진단
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              보유 현황을 입력하면 예상 세금과 절세 전략을 알려드립니다.
            </p>
          </div>

          {/* Forms */}
          <div className="space-y-6">
            <SimpleMode />
            <PreciseMode />
          </div>

          {/* Results */}
          <ResultDashboard />
        </div>

        {/* Report */}
        <ReportSection />

        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-center text-xs text-[var(--text-tertiary)]">
            본 계산기는 참고용이며, 실제 세금은 전문 세무사와 상담하세요.
          </p>
          <Link
            href="/formula"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-blue)] hover:underline transition-colors"
          >
            세액 산출 공식 자세히 보기
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
