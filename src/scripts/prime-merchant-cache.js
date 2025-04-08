/**
 * Prime Merchant Cache Script
 * 
 * This script manually warms the cache for specific merchants to improve 
 * their loading performance.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fetch = require('node-fetch');
const Redis = require('ioredis');

// Get Redis URL from environment variables
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Configure merchants to prime
const MERCHANTS_TO_PRIME = [
  'taikangroad',     // Problematic merchant mentioned by user
  'familymart',      // Common merchants
  'lawson',
  'shanghaitaste',
  'dumplinghouse',
  'shanghaimuseum',
  'peacehotel',
  'iapmmall',
  'xintiandi',
  'wukangroad'
];

// Create Redis client
const redis = new Redis(redisUrl);

// Base URL (change for production)
const baseUrl = 'http://localhost:3000';

/**
 * Prime cache for specific merchants
 */
async function primeMerchantCache() {
  console.log('🔍 Starting merchant cache priming...');
  console.log(`📦 Will prime cache for ${MERCHANTS_TO_PRIME.length} merchants`);
  
  const results = {
    successful: 0,
    failed: 0,
    errors: []
  };
  
  // Process each merchant
  for (const username of MERCHANTS_TO_PRIME) {
    try {
      console.log(`\n🔄 Priming cache for merchant: ${username}`);
      
      // Create API URL
      const apiUrl = `${baseUrl}/api/merchants/${username}`;
      console.log(`📡 Fetching from API: ${apiUrl}`);
      
      // Make API request
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
      }
      
      // Get merchant data
      const merchantData = await response.json();
      console.log(`✅ Successfully fetched data for ${merchantData.displayName || username}`);
      
      // Verify the data was cached
      const cacheKey = `cache:merchant:detail:username:${username}`;
      const cachedValue = await redis.get(cacheKey);
      
      if (cachedValue) {
        console.log(`📋 Found in Redis cache: ${cacheKey}`);
        results.successful++;
      } else {
        console.log(`⚠️ Warning: Cache may not be working for ${username}`);
        results.failed++;
      }
    } catch (error) {
      console.error(`❌ Error priming cache for ${username}:`, error.message);
      results.failed++;
      results.errors.push({ username, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n📊 Cache priming summary:');
  console.log(`   Total merchants: ${MERCHANTS_TO_PRIME.length}`);
  console.log(`   Successfully primed: ${results.successful}`);
  console.log(`   Failed to prime: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(({ username, error }, index) => {
      console.log(`   ${index + 1}. ${username}: ${error}`);
    });
  }
  
  console.log('\n🏁 Cache priming completed');
}

// Run the script
primeMerchantCache()
  .then(() => {
    redis.quit();
    console.log('Redis connection closed');
  })
  .catch(error => {
    console.error('Script failed:', error);
    redis.quit();
    process.exit(1);
  }); 