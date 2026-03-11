"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const target = new Date("2027-01-01T00:00:00+09:00").getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function TimerBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="card-elevated px-3 py-2.5 sm:px-5 sm:py-3.5 min-w-[52px] sm:min-w-[72px] text-center">
        <span className="timer-value text-2xl sm:text-4xl font-semibold tracking-tight">
          {value}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[var(--text-tertiary)]">
        {label}
      </span>
    </div>
  );
}

function TimerSeparator() {
  return (
    <div className="flex flex-col items-center gap-1.5 px-0.5 sm:px-1 pt-1">
      <div className="flex flex-col gap-1.5 py-2">
        <div className="timer-dot" />
        <div className="timer-dot" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const placeholder = (
    <div className="flex items-start gap-1 sm:gap-2">
      <TimerBlock value="---" label="DAYS" />
      <TimerSeparator />
      <TimerBlock value="--" label="HRS" />
      <TimerSeparator />
      <TimerBlock value="--" label="MIN" />
      <TimerSeparator />
      <TimerBlock value="--" label="SEC" />
    </div>
  );

  if (!timeLeft) return placeholder;

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="flex items-start gap-1 sm:gap-2">
      <TimerBlock value={String(days)} label="DAYS" />
      <TimerSeparator />
      <TimerBlock value={pad2(hours)} label="HRS" />
      <TimerSeparator />
      <TimerBlock value={pad2(minutes)} label="MIN" />
      <TimerSeparator />
      <TimerBlock value={pad2(seconds)} label="SEC" />
    </div>
  );
}
