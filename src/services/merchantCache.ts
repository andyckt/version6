import { cacheFetch, invalidateCache, invalidateCacheByPattern } from '@/lib/redis';
import { MerchantModel } from '@/models/Merchant';

// Cache TTL values (in seconds)
const CACHE_TTL = {
  MERCHANT_LIST: 60 * 5, // 5 minutes
  MERCHANT_DETAIL: 60 * 15, // 15 minutes
  MERCHANT_BY_TYPE: 60 * 10, // 10 minutes
};

// Cache key prefixes
const CACHE_KEY = {
  MERCHANT_LIST: 'merchant:list',
  MERCHANT_DETAIL: 'merchant:detail',
  MERCHANT_BY_TYPE: 'merchant:type',
};

/**
 * Generate a cache key for merchant list with filters
 */
export function getMerchantListCacheKey(params: Record<string, any>): string {
  const { page = 1, limit = 20, accountType, district, recommended } = params;
  
  // Create a key that includes all the filter parameters
  let key = `${CACHE_KEY.MERCHANT_LIST}:page=${page}:limit=${limit}`;
  
  if (accountType) key += `:type=${accountType}`;
  if (district) key += `:district=${district}`;
  if (recommended !== undefined) key += `:recommended=${recommended}`;
  
  return key;
}

/**
 * Get cached merchant list or fetch from database
 */
export async function getCachedMerchantList(
  params: Record<string, any>,
  fetchFn: () => Promise<{ merchants: MerchantModel[], pagination: any }>
) {
  const cacheKey = getMerchantListCacheKey(params);
  return cacheFetch(cacheKey, CACHE_TTL.MERCHANT_LIST, fetchFn);
}

/**
 * Get cached merchant detail or fetch from database
 */
export async function getCachedMerchantDetail(
  identifier: string | number,
  isUsername: boolean = true,
  fetchFn: () => Promise<MerchantModel | null>
) {
  const idType = isUsername ? 'username' : 'id';
  const cacheKey = `${CACHE_KEY.MERCHANT_DETAIL}:${idType}:${identifier}`;
  return cacheFetch(cacheKey, CACHE_TTL.MERCHANT_DETAIL, fetchFn);
}

/**
 * Get cached merchants by type or fetch from database
 */
export async function getCachedMerchantsByType(
  type: string,
  fetchFn: () => Promise<MerchantModel[]>
) {
  const cacheKey = `${CACHE_KEY.MERCHANT_BY_TYPE}:${type}`;
  return cacheFetch(cacheKey, CACHE_TTL.MERCHANT_BY_TYPE, fetchFn);
}

/**
 * Invalidate merchant list cache
 */
export async function invalidateMerchantListCache(): Promise<void> {
  await invalidateCacheByPattern(`cache:${CACHE_KEY.MERCHANT_LIST}:*`);
}

/**
 * Invalidate merchant detail cache
 */
export async function invalidateMerchantDetailCache(identifier: string | number, isUsername: boolean = true): Promise<void> {
  const idType = isUsername ? 'username' : 'id';
  const cacheKey = `${CACHE_KEY.MERCHANT_DETAIL}:${idType}:${identifier}`;
  await invalidateCache(cacheKey);
  
  // Also invalidate the lists since they might include this merchant
  await invalidateMerchantListCache();
}

/**
 * Invalidate merchant type cache
 */
export async function invalidateMerchantTypeCache(type: string): Promise<void> {
  const cacheKey = `${CACHE_KEY.MERCHANT_BY_TYPE}:${type}`;
  await invalidateCache(cacheKey);
} 