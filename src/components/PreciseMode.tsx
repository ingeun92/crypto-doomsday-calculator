'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTaxStore } from '@/store/tax-store';
import { searchCoins, getCoinPrice } from '@/lib/coingecko';
import type { CoinSearchResult } from '@/lib/coingecko';
import type { CoinEntry } from '@/types';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface CoinInputRowProps {
  coin: CoinEntry;
  onUpdate: (id: string, updates: Partial<CoinEntry>) => void;
  onRemove: (id: string) => void;
}

function CoinInputRow({ coin, onUpdate, onRemove }: CoinInputRowProps) {
  const [query, setQuery] = useState(coin.ticker || '');
  const [suggestions, setSuggestions] = useState<CoinSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 1) { setSuggestions([]); return; }
    try {
      const results = await searchCoins(q);
      setSuggestions(results.slice(0, 6));
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  async function selectCoin(result: CoinSearchResult) {
    setQuery(result.symbol.toUpperCase());
    setShowSuggestions(false);
    setSuggestions([]);
    onUpdate(coin.id, { ticker: result.symbol.toUpperCase(), name: result.name });

    setLoadingPrice(true);
    try {
      const price = await getCoinPrice(result.id);
      onUpdate(coin.id, { ticker: result.symbol.toUpperCase(), name: result.name, currentPrice: price });
    } catch {
      // ignore
    } finally {
      setLoadingPrice(false);
    }
  }

  const inputCls =
    "w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-medium)] transition-colors";

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-start">
      {/* Ticker search */}
      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          placeholder="BTC, ETH..."
          value={query}
          onChange={handleQueryChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className={inputCls}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 top-full mt-1 w-64 rounded-lg overflow-hidden" style={{ backgroundColor: '#1c1d28', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 30px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.3)' }}>
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onMouseDown={() => selectCoin(s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#252636'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="font-display font-medium text-[var(--accent-amber)] w-14 shrink-0 text-xs">
                    {s.symbol.toUpperCase()}
                  </span>
                  <span className="text-[var(--text-secondary)] truncate text-xs">{s.name}</span>
                  {s.market_cap_rank && (
                    <span className="ml-auto text-[var(--text-tertiary)] text-[10px] shrink-0">
                      #{s.market_cap_rank}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quantity */}
      <input
        type="number"
        placeholder="수량"
        min={0}
        step="any"
        value={coin.quantity || ''}
        onChange={(e) => onUpdate(coin.id, { quantity: parseFloat(e.target.value) || 0 })}
        className={inputCls}
      />

      {/* Avg buy price */}
      <input
        type="number"
        placeholder="매수 평단가"
        min={0}
        step="any"
        value={coin.avgBuyPrice || ''}
        onChange={(e) => onUpdate(coin.id, { avgBuyPrice: parseFloat(e.target.value) || 0 })}
        className={inputCls}
      />

      {/* Current price */}
      <div className="flex items-center justify-center min-w-[72px] h-9">
        {loadingPrice ? (
          <span className="text-[10px] text-[var(--text-tertiary)] animate-pulse">loading</span>
        ) : coin.currentPrice ? (
          <span className="text-[11px] font-display tabular-nums text-[var(--accent-green)]">
            {coin.currentPrice.toLocaleString('ko-KR')}
          </span>
        ) : (
          <span className="text-[10px] text-[var(--text-tertiary)]">-</span>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(coin.id)}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors"
        title="삭제"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function PreciseMode() {
  const [expanded, setExpanded] = useState(false);
  const { coins, addCoin, removeCoin, updateCoin, hasUnprovableAssets, setHasUnprovableAssets } = useTaxStore();

  function handleAddCoin() {
    const newCoin: CoinEntry = {
      id: generateId(),
      ticker: '',
      name: '',
      quantity: 0,
      avgBuyPrice: 0,
    };
    addCoin(newCoin);
    if (!expanded) setExpanded(true);
  }

  return (
    <div className="mt-6 border-t border-[var(--border-subtle)] pt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
      >
        <span className={`transition-transform duration-200 text-[10px] ${expanded ? 'rotate-90' : ''}`}>
          &#9654;
        </span>
        <span>코인별 상세 입력</span>
        <span className="text-[var(--text-tertiary)] text-xs font-normal ml-1">
          더 정확한 결과
        </span>
      </button>

      {expanded && (
        <div className="mt-5 space-y-4">
          {/* Column headers */}
          {coins.length > 0 && (
            <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 text-[10px] tracking-wider uppercase text-[var(--text-tertiary)] px-0.5">
              <span>Ticker</span>
              <span>수량</span>
              <span>매수 평단가</span>
              <span className="text-center min-w-[72px]">현재가</span>
              <span className="w-9" />
            </div>
          )}

          {/* Coin rows */}
          <div className="space-y-2">
            {coins.map((coin) => (
              <CoinInputRow
                key={coin.id}
                coin={coin}
                onUpdate={updateCoin}
                onRemove={removeCoin}
              />
            ))}
          </div>

          {/* Add coin */}
          <button
            onClick={handleAddCoin}
            className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors border border-dashed border-[var(--border-subtle)] hover:border-[var(--border-medium)] rounded-lg px-4 py-2.5 w-full justify-center"
          >
            <span className="text-base leading-none">+</span>
            <span>코인 추가</span>
          </button>

          {/* Risk checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group pt-2">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={hasUnprovableAssets}
                onChange={(e) => setHasUnprovableAssets(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4.5 h-4.5 rounded border transition-all flex items-center justify-center ${
                  hasUnprovableAssets
                    ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)]'
                    : 'border-[var(--text-tertiary)] group-hover:border-[var(--text-secondary)]'
                }`}
                style={{ width: '18px', height: '18px' }}
              >
                {hasUnprovableAssets && (
                  <svg className="w-2.5 h-2.5 text-[var(--bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug">
              에어드랍, 스테이킹 이자 등 매수 단가를 증명하기 어려운 코인이 포함되어 있습니까?
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
