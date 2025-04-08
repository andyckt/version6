import Redis from 'ioredis';
import { recordCacheHit, recordCacheMiss, recordCacheSet } from './monitoring';

// Initialize Redis client
const getRedisClient = () => {
  // Redis connection string from environment variables
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      // Retry with exponential backoff
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
  
  // Log connection events (useful for debugging)
  client.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  client.on('error', (error: Error) => {
    console.error('Redis connection error:', error);
  });
  
  return client;
};

// Create a singleton instance of the Redis client
let redisClient: Redis | null = null;

// Get or create the Redis client (singleton pattern)
export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = getRedisClient();
  }
  return redisClient;
}

// Helper for setting cache with TTL
export async function setCache<T>(key: string, data: T, ttlSeconds = 300): Promise<void> {
  try {
    const redis = getRedis();
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    recordCacheSet();
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

// Helper for getting cache
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const value = await redis.get(key);
    
    if (!value) {
      recordCacheMiss();
      return null;
    }
    
    recordCacheHit();
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Redis get error:', error);
    recordCacheMiss();
    return null;
  }
}

// Helper for deleting cache keys
export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

// Delete keys by pattern (example: "user:*" would delete all user keys)
export async function deleteCacheByPattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis delete by pattern error:', error);
  }
}

// Publish a message to a channel (for cache invalidation)
export async function publishMessage(channel: string, message: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.publish(channel, message);
  } catch (error) {
    console.error('Redis publish error:', error);
  }
}

// Subscribe to a channel (for cache invalidation)
export function subscribeToChannel(
  channel: string, 
  callback: (channel: string, message: string) => void
): Redis {
  try {
    // Create a separate client for pub/sub to avoid blocking other operations
    const subscriber = getRedisClient();
    subscriber.subscribe(channel);
    subscriber.on('message', callback);
    return subscriber;
  } catch (error) {
    console.error('Redis subscribe error:', error);
    throw error;
  }
}

// Close Redis connection
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
} 