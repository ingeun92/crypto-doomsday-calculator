<div align="center">

# Crypto Tax Saver

**가상자산 절세 시뮬레이터**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

2027년 가상자산 분리과세에 대비하여,<br/>
예상 세액을 시뮬레이션하고 합법적인 절세 전략을 제공합니다.

[세금 진단 시작하기](#getting-started) · [공식 산출 근거](/formula) · [국세청 안내](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40370&cntntsId=238935)

</div>

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **세액 시뮬레이션** | 보관 위치·투자금액·매도 예정가 기반의 실시간 예상 세액 계산 |
| **절세 전략 제공** | 방치 시 vs 솔루션 적용 시 비교 및 맞춤형 액션 플랜 |
| **코인별 정밀 계산** | CoinGecko API 연동, 코인별 수량·매수가 입력 지원 |
| **리포트 내보내기** | 회계법인 수준의 세무 진단 리포트 (PDF / PNG) |
| **공식 설명 페이지** | 의제취득가액, FIFO, 이동평균법 등 산출 공식 상세 해설 |

## 세액 산출 로직

```
취득가액   Cost_base = max(매수가, 2026.12.31 시가)
FIFO 패널티  해외/DeFi 보관 시 취득가액 15% 불리 산정
양도차익   Profit = 매도가 × 수량 − 취득가액 × 수량
과세표준   Taxable = max(0, Profit − 250만원)
납부세액   Tax = Taxable × 22%
```

> 보관 위치에 따라 이동평균법(국내) 또는 선입선출법(해외/DeFi)이 적용됩니다.

## 기술 스택

```
Frontend     Next.js 16  ·  React 19  ·  TypeScript
Styling      Tailwind CSS v4  ·  CSS Custom Properties
State        Zustand v5 (자동 재계산)
API          CoinGecko (실시간 시세, 5분 캐시)
Export       html2canvas  ·  jsPDF
Font         Sora (Display)  ·  Noto Sans KR (Body)
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 랜딩 페이지 (카운트다운, CTA)
│   ├── formula/page.tsx      # 세액 산출 공식 설명
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 디자인 시스템 (CSS 변수)
├── components/
│   ├── CountdownTimer.tsx    # 2027년 카운트다운
│   ├── CalculatorSection.tsx # 계산기 섹션 오케스트레이션
│   ├── SimpleMode.tsx        # 기본 입력 (보관 위치, 투자금액)
│   ├── PreciseMode.tsx       # 코인별 정밀 입력
│   ├── ResultDashboard.tsx   # 결과 대시보드
│   ├── Report/               # PDF/PNG 리포트
│   └── ui/                   # 공통 UI 컴포넌트
├── lib/
│   ├── tax-calculator.ts     # 세금 계산 엔진
│   ├── coingecko.ts          # CoinGecko API 클라이언트
│   └── report-exporter.ts    # PDF/이미지 내보내기
├── store/
│   └── tax-store.ts          # Zustand 상태 관리
└── types/
    └── index.ts              # TypeScript 타입 정의
```

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 참고 자료

- [국세청 - 가상자산 소득 과세 안내](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40370&cntntsId=238935)
- 소득세법 제37조 (필요경비), 제84조 (가상자산소득)
- 의제취득가액: 2026년 12월 31일 시가와 실제 매수가 중 높은 금액 적용

## 면책 조항

본 서비스는 시뮬레이션 목적의 참고용이며, 법적 효력이 없습니다. 실제 세무 신고 시에는 반드시 전문 세무사와 상담하시기 바랍니다. FIFO 패널티(15%), 입증 불가 자산 비율(30%) 등은 시뮬레이션을 위한 가정치입니다.

---

<div align="center">
<sub>Built with Claude Code</sub>
</div>
