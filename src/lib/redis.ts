import Redis from 'ioredis';

// Check if Redis URL is defined in environment variables
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis Client
let redisClient: Redis | null = null;

// Configure Redis client options
const redisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    // Retry with exponential backoff
    return Math.min(times * 50, 2000);
  },
};

// Get Redis client with singleton pattern
export function getRedisClient(): Redis {
  if (redisClient === null) {
    try {
      redisClient = new Redis(redisUrl, redisOptions);
      console.log('Redis client initialized');
      
      // Handle errors to prevent app crashes
      redisClient.on('error', (err) => {
        console.error('Redis error:', err);
      });
      
      // Log successful connection
      redisClient.on('connect', () => {
        console.log('Connected to Redis server');
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      throw error;
    }
  }
  
  return redisClient;
}

// Gracefully close Redis connection
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
}

/**
 * Cache helper: Get data from cache or fetch from source and cache the result
 * @param key - Cache key
 * @param ttl - Time to live in seconds
 * @param fetchFn - Function to fetch data if not in cache
 */
export async function cacheFetch<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>,
  prefixKey = true
): Promise<T> {
  const cacheKey = prefixKey ? `cache:${key}` : key;
  const redis = getRedisClient();
  
  try {
    // Try to get from cache first
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      // Data found in cache
      console.log(`Cache hit: ${cacheKey}`);
      
      // Record metrics if available
      try {
        const { recordCacheHit } = await import('@/app/api/cache/status/route');
        recordCacheHit();
      } catch (err) {
        // Ignore errors from metrics recording
      }
      
      return JSON.parse(cachedData) as T;
    }
    
    // Cache miss, fetch from source
    console.log(`Cache miss: ${cacheKey}`);
    
    // Record metrics if available
    try {
      const { recordCacheMiss } = await import('@/app/api/cache/status/route');
      recordCacheMiss();
    } catch (err) {
      // Ignore errors from metrics recording
    }
    
    const data = await fetchFn();
    
    // Store in cache with TTL
    await redis.set(cacheKey, JSON.stringify(data), 'EX', ttl);
    console.log(`Cached: ${cacheKey} for ${ttl} seconds`);
    
    return data;
  } catch (error) {
    console.error(`Cache error for key ${cacheKey}:`, error);
    
    // Record metrics if available
    try {
      const { recordCacheError } = await import('@/app/api/cache/status/route');
      recordCacheError();
    } catch (err) {
      // Ignore errors from metrics recording
    }
    
    // If error with Redis, fall back to source data
    return fetchFn();
  }
}

/**
 * Invalidate a specific cache entry
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string, prefixKey = true): Promise<void> {
  const cacheKey = prefixKey ? `cache:${key}` : key;
  const redis = getRedisClient();
  
  try {
    await redis.del(cacheKey);
    console.log(`Cache invalidated: ${cacheKey}`);
  } catch (error) {
    console.error(`Failed to invalidate cache for key ${cacheKey}:`, error);
  }
}

/**
 * Invalidate multiple cache entries by pattern
 * @param pattern - Pattern to match cache keys
 */
export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  const redis = getRedisClient();
  
  try {
    // Use SCAN to find keys matching pattern
    let cursor = '0';
    let keys: string[] = [];
    
    do {
      // @ts-ignore - ioredis types need fixing
      const [nextCursor, matchedKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      keys = keys.concat(matchedKeys);
    } while (cursor !== '0');
    
    // Delete all matched keys
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Invalidated ${keys.length} cache entries matching pattern: ${pattern}`);
    }
  } catch (error) {
    console.error(`Failed to invalidate cache by pattern ${pattern}:`, error);
  }
} 