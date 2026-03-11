export interface CoinEntry {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice?: number;
}

export type StorageLocation = 'domestic' | 'overseas' | 'defi';
export type CalculationMode = 'simple' | 'precise';

export interface TaxResult {
  currentTax: number;
  idealTax: number;
  savedTax: number;
  profit: number;
  cost: number;
  totalValue: number;
  totalInvestment: number;
  riskAmount: number;
  warnings: string[];
  actionPlan: string[];
}

export interface UserInput {
  mode: CalculationMode;
  storageLocations: StorageLocation[];
  coins: CoinEntry[];
  hasUnprovableAssets: boolean;
  totalInvestment: number;
  currentValue: number;
  expectedSellValue: number;
}
