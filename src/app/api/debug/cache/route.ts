import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET() {
  try {
    const redis = getRedisClient();
    const ping = await redis.ping();
    const keys = await redis.keys('cache:merchant:*');
    
    return NextResponse.json({
      redis_status: ping === 'PONG' ? 'connected' : 'error',
      cached_keys: keys.length,
      merchant_details_keys: keys.filter(k => k.includes('merchant:detail')).length,
      merchant_list_keys: keys.filter(k => k.includes('merchant:list')).length,
      keys: keys.slice(0, 20) // Show at most 20 keys for inspection
    });
  } catch (error) {
    return NextResponse.json({
      redis_status: 'error',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 