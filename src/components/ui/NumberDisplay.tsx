'use client';

interface NumberDisplayProps {
  value: number;
  className?: string;
  showSign?: boolean;
}

export function formatKRW(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100_000_000) {
    const eok = abs / 100_000_000;
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  if (abs >= 10_000) {
    const man = abs / 10_000;
    return `${man % 1 === 0 ? man.toFixed(0) : man.toFixed(0)}만원`;
  }
  return `${abs.toLocaleString('ko-KR')}원`;
}

export function formatKRWFull(value: number): string {
  return `${Math.abs(value).toLocaleString('ko-KR')}원`;
}

export default function NumberDisplay({ value, className = '', showSign = false }: NumberDisplayProps) {
  const formatted = formatKRW(value);
  const sign = showSign && value > 0 ? '+' : '';
  return (
    <span className={`font-mono ${className}`}>
      {sign}{value < 0 ? '-' : ''}{formatted}
    </span>
  );
}
