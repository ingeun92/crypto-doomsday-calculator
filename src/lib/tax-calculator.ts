import type { CoinEntry, StorageLocation, TaxResult } from '@/types';

export interface TaxCalculatorParams {
  coins: CoinEntry[];
  storageLocations: StorageLocation[];
  hasUnprovableAssets: boolean;
  totalInvestment: number;
  currentValue: number;
  expectedSellValue: number;
}

const UNPROVABLE_RISK_RATIO = 0.3; // R = 30%
const TAX_FREE_THRESHOLD = 2_500_000; // 250만원 기본공제
const TAX_RATE = 0.22; // 22% (소득세 20% + 지방소득세 2%)

// FIFO는 이동평균법 대비 취득가액이 불리하게 산정됨 (저가 매수분이 먼저 매도 처리)
// 시뮬레이션에서 FIFO 불이익을 15%로 가정
const FIFO_COST_PENALTY = 0.15;

/**
 * 보관 위치에 따른 취득가액 조정 비율
 * domestic: 이동평균법 → 유리한 취득가액 (패널티 없음)
 * overseas/defi: 선입선출법(FIFO) → 저가 매수분 우선 매도로 취득가액 불리
 */
function getLocationPenalty(location: StorageLocation): number {
  return location === 'domestic' ? 0 : FIFO_COST_PENALTY;
}

/**
 * Formula 1: Cost Basis 계산
 */
export function calculateCostBasis(params: {
  coin: CoinEntry;
  storageLocation: StorageLocation;
  hasUnprovableAssets: boolean;
  expectedSellPrice: number;
}): { cost: number; warnings: string[] } {
  const { coin, storageLocation, hasUnprovableAssets, expectedSellPrice } = params;
  const warnings: string[] = [];

  const P_buy = coin.avgBuyPrice;
  const P_current = coin.currentPrice ?? P_buy;
  const Q = coin.quantity;
  const P_sell = expectedSellPrice;

  // Cost_base = max(P_buy, P_current) - 의제취득가액 룰
  const costBase = Math.max(P_buy, P_current);

  // FIFO 패널티 적용 (해외/DeFi)
  const penalty = getLocationPenalty(storageLocation);
  const adjustedCostBase = costBase * (1 - penalty);

  if (storageLocation !== 'domestic') {
    warnings.push(
      `[${coin.ticker || '자산'}] 해외/DeFi 보관 → 선입선출법(FIFO) 적용. ` +
      `저가 매수분이 먼저 매도 처리되어 취득가액이 약 ${penalty * 100}% 불리하게 산정될 수 있습니다.`
    );
  }

  let cost: number;

  if (hasUnprovableAssets) {
    const R = UNPROVABLE_RISK_RATIO;
    cost = (adjustedCostBase * Q * (1 - R)) + (P_sell * Q * R * 0.5);
    warnings.push(
      `[${coin.ticker || '자산'}] 입증 불가 자산(에어드랍/스테이킹 등) ${R * 100}% 포함 가정. ` +
      `해당 물량은 취득가액 0원 또는 50% 의제경비율만 인정될 수 있습니다.`
    );
  } else {
    cost = adjustedCostBase * Q;
  }

  return { cost, warnings };
}

/**
 * Formula 2: 세금 계산 (현재 상태 기준)
 */
export function calculateTax(params: TaxCalculatorParams): TaxResult {
  const {
    coins,
    storageLocations,
    hasUnprovableAssets,
    totalInvestment,
    currentValue,
    expectedSellValue,
  } = params;

  const warnings: string[] = [];

  const priceMultiplier = currentValue > 0 ? (expectedSellValue || currentValue) / currentValue : 1;

  let totalCost = 0;
  let totalSellValue = 0;
  let totalRiskAmount = 0;

  // 가장 불리한 보관 위치 우선 적용
  const primaryLocation: StorageLocation = storageLocations.includes('defi')
    ? 'defi'
    : storageLocations.includes('overseas')
    ? 'overseas'
    : 'domestic';

  const penalty = getLocationPenalty(primaryLocation);

  for (const coin of coins) {
    const P_current = coin.currentPrice ?? coin.avgBuyPrice;
    const expectedSellPrice = P_current * priceMultiplier;
    const Q = coin.quantity;

    const { cost, warnings: coinWarnings } = calculateCostBasis({
      coin,
      storageLocation: primaryLocation,
      hasUnprovableAssets,
      expectedSellPrice,
    });

    warnings.push(...coinWarnings);
    totalCost += cost;
    totalSellValue += expectedSellPrice * Q;

    if (hasUnprovableAssets) {
      totalRiskAmount += expectedSellPrice * Q * UNPROVABLE_RISK_RATIO * 0.5;
    }
  }

  // 코인 미입력 시 (간편 모드)
  if (coins.length === 0 && (totalInvestment > 0 || currentValue > 0)) {
    const sellValue = expectedSellValue || currentValue;
    const costBase = Math.max(totalInvestment, currentValue);
    const adjustedCostBase = costBase * (1 - penalty);
    totalSellValue = sellValue;

    if (hasUnprovableAssets) {
      totalCost = adjustedCostBase * (1 - UNPROVABLE_RISK_RATIO)
        + totalSellValue * UNPROVABLE_RISK_RATIO * 0.5;
      totalRiskAmount = totalSellValue * UNPROVABLE_RISK_RATIO * 0.5;
    } else {
      totalCost = adjustedCostBase;
    }

    if (primaryLocation !== 'domestic') {
      warnings.push(
        `해외/DeFi 보관 자산 → 선입선출법(FIFO) 적용. ` +
        `이동평균법 대비 취득가액이 약 ${penalty * 100}% 불리하게 산정됩니다.`
      );
    }
    if (hasUnprovableAssets) {
      warnings.push(
        `입증 불가 자산 포함 → 전체 자산의 ${UNPROVABLE_RISK_RATIO * 100}%에 대해 ` +
        `취득가액 0원 또는 50% 의제경비율 적용 리스크가 있습니다.`
      );
    }
  }

  const profit = totalSellValue - totalCost;
  const taxableProfit = Math.max(0, profit - TAX_FREE_THRESHOLD);
  const currentTax = taxableProfit * TAX_RATE;

  // Formula 3: 이상적 세금 (국내 이동평균법 + 리스크 해소)
  const idealResult = calculateIdealTax(params);
  const savedTax = Math.max(0, currentTax - idealResult.currentTax);

  // 상세 액션 플랜 생성
  const actionPlan = generateActionPlan({
    storageLocations,
    hasUnprovableAssets,
    savedTax,
    currentTax,
    primaryLocation,
    profit,
  });

  return {
    currentTax,
    idealTax: idealResult.currentTax,
    savedTax,
    profit,
    cost: totalCost,
    totalValue: totalSellValue,
    totalInvestment,
    riskAmount: totalRiskAmount,
    warnings,
    actionPlan,
  };
}

/**
 * Formula 3: 이상적 세금 (국내 이동평균법 + 리스크 완전 소명)
 */
export function calculateIdealTax(params: TaxCalculatorParams): TaxResult {
  const { coins, totalInvestment, currentValue, expectedSellValue } = params;
  const priceMultiplier = currentValue > 0 ? (expectedSellValue || currentValue) / currentValue : 1;

  let totalCost = 0;
  let totalSellValue = 0;

  // 이동평균법 + 리스크 없음 → 패널티 0, 최대 취득가액
  for (const coin of coins) {
    const P_current = coin.currentPrice ?? coin.avgBuyPrice;
    const expectedSellPrice = P_current * priceMultiplier;
    const Q = coin.quantity;
    const costBase = Math.max(coin.avgBuyPrice, P_current);
    totalCost += costBase * Q; // 패널티 없음
    totalSellValue += expectedSellPrice * Q;
  }

  if (coins.length === 0 && (totalInvestment > 0 || currentValue > 0)) {
    const costBase = Math.max(totalInvestment, currentValue);
    totalCost = costBase; // 패널티 없음, 리스크 없음
    totalSellValue = expectedSellValue || currentValue;
  }

  const profit = totalSellValue - totalCost;
  const taxableProfit = Math.max(0, profit - TAX_FREE_THRESHOLD);
  const idealTaxAmount = taxableProfit * TAX_RATE;

  return {
    currentTax: idealTaxAmount,
    idealTax: idealTaxAmount,
    savedTax: 0,
    profit,
    cost: totalCost,
    totalValue: totalSellValue,
    totalInvestment,
    riskAmount: 0,
    warnings: [],
    actionPlan: [],
  };
}

/**
 * 상세 액션 플랜 생성
 */
function generateActionPlan(context: {
  storageLocations: StorageLocation[];
  hasUnprovableAssets: boolean;
  savedTax: number;
  currentTax: number;
  primaryLocation: StorageLocation;
  profit: number;
}): string[] {
  const { storageLocations, hasUnprovableAssets, savedTax, currentTax, profit } = context;
  const plan: string[] = [];

  if (currentTax === 0) {
    plan.push('현재 예상 양도차익이 기본공제(250만원) 이하이므로 세금이 발생하지 않습니다.');
    return plan;
  }

  // 해외/DeFi → 국내 이전
  if (storageLocations.some(l => l !== 'domestic')) {
    plan.push(
      '국내 거래소로 자산 이전 → 이동평균법 적용으로 취득가액을 유리하게 산정받을 수 있습니다. ' +
      '2026년 12월 31일 이전에 이전을 완료해야 의제취득가액을 적용받을 수 있습니다.'
    );
    plan.push(
      '지갑 분리(Siloing) 전략 → 국내/해외 거래소별 자산을 분리 관리하면 ' +
      '취득가액 산정 시 유리한 방식을 선택적으로 적용받을 수 있습니다.'
    );
  }

  // 입증 불가 자산
  if (hasUnprovableAssets) {
    plan.push(
      '에어드랍/스테이킹 소명 자료 확보 → 트랜잭션 해시, 스냅샷 기록, 거래소 이체 내역을 ' +
      '반드시 보관하세요. 미소명 시 취득가액 0원으로 간주되어 세금이 대폭 증가합니다.'
    );
    plan.push(
      '증여세 리스크 점검 → 무상 취득으로 판단될 경우 별도 증여세가 부과될 수 있으므로 ' +
      '취득 경위를 명확히 기록해 두세요.'
    );
  }

  // 과세 이연
  if (profit > TAX_FREE_THRESHOLD) {
    plan.push(
      '토큰 스왑을 통한 과세 이연 → 매도 시점을 분산하거나, 과세 연도를 넘겨 ' +
      '기본공제(연 250만원)를 복수 연도에 걸쳐 활용하는 것이 유리합니다.'
    );
  }

  // 의제취득가액 활용
  plan.push(
    '의제취득가액 활용 → 2026.12.31 기준 시가와 실제 매수가 중 높은 금액을 취득가액으로 ' +
    '인정받으므로, 과세 시행 전 포트폴리오 정리가 유리할 수 있습니다.'
  );

  if (savedTax > 0) {
    plan.push(
      `위 전략을 모두 실행할 경우 약 ${savedTax.toLocaleString('ko-KR')}원의 절세가 가능합니다.`
    );
  }

  return plan;
}
