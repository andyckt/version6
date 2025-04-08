/**
 * Redis Connection Test Script
 * 
 * This script checks if Redis is correctly connected and working.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const Redis = require('ioredis');

// Get Redis URL from environment variables
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
console.log(`Connecting to Redis at: ${redisUrl}`);

// Create Redis client
const redis = new Redis(redisUrl);

// Test Redis connection
async function testRedisConnection() {
  try {
    // Test basic operations
    console.log('Testing connection...');
    const ping = await redis.ping();
    console.log(`Redis ping response: ${ping}`);

    // Set a test value
    await redis.set('test:connection', 'successful', 'EX', 60);
    console.log('Set test value in Redis');

    // Get the test value
    const value = await redis.get('test:connection');
    console.log(`Retrieved test value: ${value}`);

    // Test cache keys
    console.log('\nChecking for existing merchant cache keys...');
    const merchantKeys = await redis.keys('cache:merchant:*');
    console.log(`Found ${merchantKeys.length} merchant cache keys`);

    if (merchantKeys.length > 0) {
      console.log('Sample keys:');
      merchantKeys.slice(0, 5).forEach(key => console.log(`- ${key}`));
    }

    // Add test merchant to cache
    console.log('\nAdding test merchant to cache...');
    const testMerchant = {
      id: 999,
      username: 'test-merchant',
      displayName: 'Test Merchant',
      cachedAt: new Date().toISOString()
    };

    await redis.set(
      'cache:merchant:detail:username:test-merchant',
      JSON.stringify(testMerchant),
      'EX',
      300
    );

    console.log('Test merchant added to cache');

    // Success
    console.log('\n✅ Redis connection test completed successfully!');
  } catch (error) {
    console.error('\n❌ Redis connection test failed:', error);
  } finally {
    // Close the Redis connection
    redis.quit();
  }
}

// Run the test
testRedisConnection().then(() => {
  console.log('Test completed. Connection closed.');
}); 