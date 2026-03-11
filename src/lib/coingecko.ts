export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number | null;
}

export interface PopularCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap_rank: number;
}

// 5분 캐시
const CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const priceCache = new Map<string, CacheEntry<number>>();
const searchCache = new Map<string, CacheEntry<CoinSearchResult[]>>();
const popularCache: { entry: CacheEntry<PopularCoin[]> | null } = { entry: null };

function isCacheValid<T>(entry: CacheEntry<T> | undefined | null): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * 특정 코인의 현재 KRW 가격 조회
 */
export async function getCoinPrice(coinId: string): Promise<number> {
  const cached = priceCache.get(coinId);
  if (isCacheValid(cached)) {
    return cached!.data;
  }

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=krw`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const price: number = data[coinId]?.krw;

  if (price === undefined) {
    throw new Error(`코인 ID '${coinId}'의 가격을 찾을 수 없습니다.`);
  }

  priceCache.set(coinId, { data: price, timestamp: Date.now() });
  return price;
}

/**
 * 코인 검색
 */
export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const cacheKey = query.toLowerCase().trim();
  const cached = searchCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached!.data;
  }

  const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko 검색 API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const results: CoinSearchResult[] = (data.coins ?? []).map((coin: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number | null;
  }) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    thumb: coin.thumb,
    market_cap_rank: coin.market_cap_rank,
  }));

  searchCache.set(cacheKey, { data: results, timestamp: Date.now() });
  return results;
}

/**
 * 시가총액 상위 20개 인기 코인 (KRW 가격 포함)
 */
export async function getPopularCoins(): Promise<PopularCoin[]> {
  if (isCacheValid(popularCache.entry)) {
    return popularCache.entry!.data;
  }

  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=krw&order=market_cap_desc&per_page=20&page=1';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko markets API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const coins: PopularCoin[] = data.map((coin: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
    market_cap_rank: number;
  }) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    image: coin.image,
    market_cap_rank: coin.market_cap_rank,
  }));

  popularCache.entry = { data: coins, timestamp: Date.now() };
  return coins;
}
