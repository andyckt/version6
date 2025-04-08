import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

// Cache metrics storage (in-memory for simplicity)
const cacheMetrics = {
  totalCalls: 0,
  hits: 0,
  misses: 0,
  errors: 0,
  lastReset: new Date(),
};

// Export metrics for use in other parts of the application
export const getCacheMetrics = () => ({ ...cacheMetrics });

// Increment metric counters
export const recordCacheHit = () => { 
  cacheMetrics.hits++;
  cacheMetrics.totalCalls++;
};

export const recordCacheMiss = () => {
  cacheMetrics.misses++;
  cacheMetrics.totalCalls++;
};

export const recordCacheError = () => {
  cacheMetrics.errors++;
  cacheMetrics.totalCalls++;
};

export const resetCacheMetrics = () => {
  cacheMetrics.totalCalls = 0;
  cacheMetrics.hits = 0;
  cacheMetrics.misses = 0;
  cacheMetrics.errors = 0;
  cacheMetrics.lastReset = new Date();
};

// GET endpoint to check Redis cache status and metrics
export async function GET(request: Request) {
  try {
    const redis = getRedisClient();
    
    // Check Redis server info
    const info = await redis.info();
    const memory = await redis.info('memory');
    const stats = await redis.info('stats');
    
    // Get cache keys count by pattern
    const merchantListCount = await getKeysCount('cache:merchant:list:*');
    const merchantDetailCount = await getKeysCount('cache:merchant:detail:*');
    const merchantByTypeCount = await getKeysCount('cache:merchant:type:*');
    
    // Calculate hit rate
    const hitRate = cacheMetrics.totalCalls > 0 
      ? (cacheMetrics.hits / cacheMetrics.totalCalls * 100).toFixed(2) 
      : '0';
      
    return NextResponse.json({
      status: 'connected',
      metrics: {
        ...cacheMetrics,
        hitRate: `${hitRate}%`,
      },
      cacheKeys: {
        merchantList: merchantListCount,
        merchantDetail: merchantDetailCount,
        merchantByType: merchantByTypeCount,
        total: merchantListCount + merchantDetailCount + merchantByTypeCount
      },
      // Include selected Redis metrics
      redisInfo: {
        version: extractValue(info, 'redis_version'),
        uptime: extractValue(info, 'uptime_in_seconds') + ' seconds',
        connectedClients: extractValue(info, 'connected_clients'),
        usedMemory: formatMemory(extractValue(memory, 'used_memory')),
        maxMemory: formatMemory(extractValue(memory, 'maxmemory')),
        hitRatio: extractValue(stats, 'keyspace_hits') + '/' + 
                  (parseInt(extractValue(stats, 'keyspace_hits') || '0') + 
                  parseInt(extractValue(stats, 'keyspace_misses') || '0'))
      }
    });
  } catch (error) {
    console.error('Redis status check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Redis server',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST endpoint to reset cache metrics
export async function POST(request: Request) {
  try {
    // Check for action in request body
    const body = await request.json();
    
    if (body.action === 'reset-metrics') {
      resetCacheMetrics();
      return NextResponse.json({
        status: 'success',
        message: 'Cache metrics reset successfully',
        metrics: getCacheMetrics()
      });
    } else if (body.action === 'flush-cache') {
      // Flush all cache keys matching pattern
      const redis = getRedisClient();
      await redis.flushdb();
      return NextResponse.json({
        status: 'success',
        message: 'Cache flushed successfully'
      });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Cache management error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to perform cache operation',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Helper function to get key count by pattern
async function getKeysCount(pattern: string): Promise<number> {
  const redis = getRedisClient();
  
  try {
    let cursor = '0';
    let count = 0;
    
    do {
      // @ts-ignore - ioredis types need fixing
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      count += keys.length;
    } while (cursor !== '0');
    
    return count;
  } catch (error) {
    console.error(`Failed to get keys count for pattern ${pattern}:`, error);
    return 0;
  }
}

// Helper to extract values from Redis INFO command
function extractValue(info: string, key: string): string {
  const regex = new RegExp(`^${key}:(.*)$`, 'm');
  const match = info.match(regex);
  return match ? match[1].trim() : 'N/A';
}

// Format memory values to human-readable format
function formatMemory(bytes: string): string {
  const bytesNum = parseInt(bytes || '0');
  if (isNaN(bytesNum)) return 'N/A';
  
  if (bytesNum < 1024) return bytesNum + ' B';
  if (bytesNum < 1024 * 1024) return (bytesNum / 1024).toFixed(2) + ' KB';
  if (bytesNum < 1024 * 1024 * 1024) return (bytesNum / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytesNum / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
} 