'use client';

import { useState, useCallback, useRef } from 'react';
import { useTaxStore } from '@/store/tax-store';
import type { StorageLocation } from '@/types';

const STORAGE_OPTIONS: { value: StorageLocation; label: string; desc: string; tag: string }[] = [
  { value: 'domestic', label: '국내 거래소', desc: '업비트, 빗썸 등', tag: '이동평균법' },
  { value: 'overseas', label: '해외 거래소', desc: '바이낸스, 코인베이스 등', tag: '선입선출법' },
  { value: 'defi', label: '개인지갑 / DeFi', desc: '메타마스크, 콜드월렛 등', tag: '선입선출법' },
];

function formatNumberWithCommas(value: number): string {
  if (!value || value === 0) return '';
  return value.toLocaleString('ko-KR');
}

function parseFormattedNumber(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

function formatDisplayUnit(value: number): string {
  if (!value || value === 0) return '';
  if (value >= 100_000_000) {
    const eok = value / 100_000_000;
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  if (value >= 10_000) {
    const man = Math.round(value / 10_000);
    return `${man.toLocaleString('ko-KR')}만원`;
  }
  return `${value.toLocaleString('ko-KR')}원`;
}

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  hint?: string;
}

function CurrencyInput({ label, value, onChange, placeholder = '0', hint }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatNumberWithCommas(value);
  const unitDisplay = value > 0 ? formatDisplayUnit(value) : null;

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawBefore = input.value;
    const cursorPos = input.selectionStart ?? rawBefore.length;

    // Count digits before cursor in the raw input
    const digitsBefore = rawBefore.slice(0, cursorPos).replace(/[^0-9]/g, '').length;

    // Parse to number
    const digitsOnly = rawBefore.replace(/[^0-9]/g, '');
    const parsed = parseInt(digitsOnly, 10) || 0;
    onChange(parsed);

    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      const formatted = formatNumberWithCommas(parsed);
      // Find cursor position: count digitsBefore digits in formatted string
      let digits = 0;
      let newPos = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9]/.test(formatted[i])) {
          digits++;
          if (digits === digitsBefore) {
            newPos = i + 1;
            break;
          }
        }
      }
      if (digitsBefore === 0) newPos = 0;
      inputRef.current.setSelectionRange(newPos, newPos);
    });
  }, [onChange]);

  return (
    <div className="space-y-1.5">
      <label className="flex justify-between items-baseline">
        <span className="text-sm text-[#9a9caa]">{label}</span>
        {unitDisplay && (
          <span className="font-display text-xs text-[#5b9cf6] tabular-nums">
            {unitDisplay}
          </span>
        )}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-3.5 font-display text-base tabular-nums text-[#e8e9ed] placeholder-[#3a3b4a] focus:outline-none transition-all duration-200"
          style={{
            backgroundColor: '#0c0d14',
            border: focused ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#5d5f6e] pointer-events-none select-none">
          KRW
        </span>
      </div>
      {hint && (
        <p className="text-[11px] text-[#5d5f6e]">{hint}</p>
      )}
    </div>
  );
}

interface PercentInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function PercentInput({ label, value, onChange }: PercentInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-[#9a9caa]">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={9999}
          value={value || ''}
          placeholder="0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="w-full rounded-xl px-4 py-3.5 font-display text-base tabular-nums text-[#e8e9ed] placeholder-[#3a3b4a] focus:outline-none transition-all duration-200"
          style={{
            backgroundColor: '#0c0d14',
            border: focused ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
          }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#5d5f6e] pointer-events-none select-none">
          %
        </span>
      </div>
    </div>
  );
}

export default function SimpleMode() {
  const {
    storageLocations,
    setStorageLocations,
    totalInvestment,
    setTotalInvestment,
    currentValue,
    setCurrentValue,
    expectedSellValue,
    setExpectedSellValue,
  } = useTaxStore();

  function selectLocation(loc: StorageLocation) {
    setStorageLocations([loc]);
  }

  return (
    <div className="space-y-8">
      {/* Storage location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#9a9caa]">
            주요 보관 위치
          </label>
          <span className="text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(232,64,87,0.12)', color: '#e84057' }}>
            필수
          </span>
        </div>
        <p className="text-[12px] text-[#5d5f6e] leading-relaxed -mt-1">
          2027년 1월 1일(과세 시행일) 기준으로 가장 많은 자산이 보관된 위치를 선택하세요.
          보관 위치에 따라 취득가액 산정 방식(이동평균법/선입선출법)이 달라집니다.
        </p>
        <div className="space-y-2">
          {STORAGE_OPTIONS.map(({ value, label, desc, tag }) => {
            const selected = storageLocations[0] === value;
            return (
              <button
                key={value}
                onClick={() => selectLocation(value)}
                className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-3"
                style={{
                  backgroundColor: selected ? '#1c1d28' : 'transparent',
                  border: selected ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Radio indicator */}
                <div
                  className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    border: selected ? '2px solid #34d399' : '2px solid #5d5f6e',
                  }}
                >
                  {selected && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34d399' }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: selected ? '#e8e9ed' : '#9a9caa' }}>
                      {label}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: tag === '이동평균법' ? 'rgba(52,211,153,0.1)' : 'rgba(240,185,85,0.1)', color: tag === '이동평균법' ? '#34d399' : '#f0b955' }}
                    >
                      {tag}
                    </span>
                  </div>
                  <span className="block text-[11px] mt-0.5" style={{ color: '#5d5f6e' }}>{desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input fields */}
      <div className="space-y-5">
        <CurrencyInput
          label="총 투자금액"
          value={totalInvestment}
          onChange={setTotalInvestment}
          placeholder="10,000,000"
          hint="원화(KRW) 기준 총 매수 금액"
        />
        <CurrencyInput
          label="현재 평가금액"
          value={currentValue}
          onChange={setCurrentValue}
          placeholder="15,000,000"
          hint="현재 시세 기준 총 평가액"
        />
        <CurrencyInput
          label="예상 매도 시 총 평가금액"
          value={expectedSellValue}
          onChange={setExpectedSellValue}
          placeholder="20,000,000"
          hint="매도 시점에 예상하는 총 평가액 (미입력 시 현재 평가금액 기준)"
        />
      </div>
    </div>
  );
}
