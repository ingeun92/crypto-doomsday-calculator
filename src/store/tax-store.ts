import { create } from 'zustand';
import type { CalculationMode, CoinEntry, StorageLocation, TaxResult } from '@/types';
import { calculateTax } from '@/lib/tax-calculator';

interface TaxStore {
  // State
  mode: CalculationMode;
  storageLocations: StorageLocation[];
  coins: CoinEntry[];
  hasUnprovableAssets: boolean;
  totalInvestment: number;
  currentValue: number;
  expectedSellValue: number;
  result: TaxResult | null;
  isLoading: boolean;

  // Actions
  setMode: (mode: CalculationMode) => void;
  setStorageLocations: (locations: StorageLocation[]) => void;
  addCoin: (coin: CoinEntry) => void;
  removeCoin: (id: string) => void;
  updateCoin: (id: string, updates: Partial<CoinEntry>) => void;
  setHasUnprovableAssets: (value: boolean) => void;
  setTotalInvestment: (value: number) => void;
  setCurrentValue: (value: number) => void;
  setExpectedSellValue: (value: number) => void;
  calculate: () => void;
}

function runCalculation(state: {
  mode: CalculationMode;
  storageLocations: StorageLocation[];
  coins: CoinEntry[];
  hasUnprovableAssets: boolean;
  totalInvestment: number;
  currentValue: number;
  expectedSellValue: number;
}): TaxResult | null {
  try {
    return calculateTax({
      coins: state.coins,
      storageLocations: state.storageLocations,
      hasUnprovableAssets: state.hasUnprovableAssets,
      totalInvestment: state.totalInvestment,
      currentValue: state.currentValue,
      expectedSellValue: state.expectedSellValue,
    });
  } catch {
    return null;
  }
}

export const useTaxStore = create<TaxStore>((set, get) => ({
  // Initial state
  mode: 'simple',
  storageLocations: ['domestic'],
  coins: [],
  hasUnprovableAssets: false,
  totalInvestment: 0,
  currentValue: 0,
  expectedSellValue: 0,
  result: null,
  isLoading: false,

  // Actions
  setMode: (mode) => {
    set({ mode });
    get().calculate();
  },

  setStorageLocations: (locations) => {
    set({ storageLocations: locations });
    get().calculate();
  },

  addCoin: (coin) => {
    set((state) => ({ coins: [...state.coins, coin] }));
    get().calculate();
  },

  removeCoin: (id) => {
    set((state) => ({ coins: state.coins.filter((c) => c.id !== id) }));
    get().calculate();
  },

  updateCoin: (id, updates) => {
    set((state) => ({
      coins: state.coins.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().calculate();
  },

  setHasUnprovableAssets: (value) => {
    set({ hasUnprovableAssets: value });
    get().calculate();
  },

  setTotalInvestment: (value) => {
    set({ totalInvestment: value });
    get().calculate();
  },

  setCurrentValue: (value) => {
    set({ currentValue: value });
    get().calculate();
  },

  setExpectedSellValue: (value) => {
    set({ expectedSellValue: value });
    get().calculate();
  },

  calculate: () => {
    const state = get();
    const result = runCalculation({
      mode: state.mode,
      storageLocations: state.storageLocations,
      coins: state.coins,
      hasUnprovableAssets: state.hasUnprovableAssets,
      totalInvestment: state.totalInvestment,
      currentValue: state.currentValue,
      expectedSellValue: state.expectedSellValue,
    });
    set({ result });
  },
}));
