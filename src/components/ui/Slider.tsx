'use client';

import { formatKRW } from './NumberDisplay';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  isLog?: boolean;
}

export function logToLinear(logValue: number, min: number, max: number): number {
  const minLog = Math.log10(min);
  const maxLog = Math.log10(max);
  return Math.pow(10, minLog + (logValue / 100) * (maxLog - minLog));
}

export function linearToLog(value: number, min: number, max: number): number {
  const minLog = Math.log10(min);
  const maxLog = Math.log10(max);
  return ((Math.log10(value) - minLog) / (maxLog - minLog)) * 100;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  isLog = false,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : formatKRW(value);
  const sliderValue = isLog ? linearToLog(Math.max(value, min), min, max) : value;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseFloat(e.target.value);
    if (isLog) {
      onChange(Math.round(logToLinear(raw, min, max)));
    } else {
      onChange(raw);
    }
  }

  const percentage = isLog
    ? linearToLog(Math.max(value, min), min, max)
    : ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label className="text-sm text-[var(--text-secondary)]">{label}</label>
        <span className="font-display text-sm font-medium text-[var(--text-primary)] tabular-nums bg-[var(--bg-primary)] px-2.5 py-0.5 rounded-md">
          {displayValue}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={isLog ? 0 : min}
          max={isLog ? 100 : max}
          step={isLog ? 0.1 : step}
          value={sliderValue}
          onChange={handleChange}
          className="w-full"
          style={{
            background: `linear-gradient(to right, var(--text-tertiary) ${percentage}%, var(--border-subtle) ${percentage}%)`,
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}
