import CountdownTimer from "@/components/CountdownTimer";
import CalculatorSection from "@/components/CalculatorSection";

export default function Home() {
  return (
    <main className="noise-overlay min-h-screen text-[var(--text-primary)]">
      {/* ── Hero Section ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
        {/* Subtle radial ambient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232, 64, 87, 0.04) 0%, transparent 70%)",
          }}
        />

        {/* Top badge */}
        <div className="anim-fade-up anim-delay-1 mb-10">
          <a
            href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40370&cntntsId=238935"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-1.5 transition-all duration-200 hover:border-[var(--border-medium)] hover:bg-[var(--bg-elevated)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-red)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-red)]" />
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              2027년 가상자산 과세 시행 예정
            </span>
            <svg className="h-3 w-3 text-[var(--text-tertiary)]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Countdown */}
        <div className="anim-fade-up anim-delay-2">
          <CountdownTimer />
        </div>

        {/* Headline */}
        <div className="anim-fade-up anim-delay-3 mt-12 max-w-2xl">
          <h1 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)]">
            아무것도 안 하면{" "}
            <br className="hidden sm:block" />
            코인 수익의{" "}
            <span className="text-[var(--accent-red)]">22%</span>
            가{" "}
            <br className="hidden sm:block" />
            세금으로 사라집니다
          </h1>
        </div>

        {/* Subhead */}
        <div className="anim-fade-up anim-delay-4 mt-5">
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md leading-relaxed">
            지금 바로 예상 세금을 확인하고,
            <br className="hidden sm:block" />
            합법적인 절세 전략을 받아보세요.
          </p>
        </div>

        {/* CTA */}
        <div className="anim-fade-up anim-delay-5 mt-10">
          <a
            href="#calculator"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#e8e9ed] px-7 py-3.5 text-sm font-semibold text-[#0c0d14] transition-all duration-200 hover:bg-[#ffffff] hover:text-[#000000] hover:scale-[1.02] active:scale-[0.98]"
          >
            무료 세금 진단 시작하기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        {/* Trust line */}
        <div className="anim-fade-up anim-delay-5 mt-6 flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            회원가입 불필요
          </span>
          <span className="h-3 w-px bg-[var(--border-subtle)]" />
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            개인정보 저장 없음
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 anim-fade-in anim-delay-5">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-px bg-gradient-to-b from-transparent to-[var(--text-tertiary)]" />
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <CalculatorSection />
    </main>
  );
}
