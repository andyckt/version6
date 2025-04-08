/**
 * Cache Initialization Script
 * 
 * Run this script to manually initialize the Redis cache with commonly accessed data.
 * This helps improve performance for first-time visitors.
 */

import { prewarmCache } from './cachePrewarming';

// Function to initialize the cache
export async function initializeCache() {
  console.log('🚀 Starting cache initialization...');
  
  try {
    await prewarmCache();
    console.log('✅ Cache successfully initialized!');
  } catch (error) {
    console.error('❌ Failed to initialize cache:', error);
  }
}

// Check if this file is being executed directly
if (require.main === module) {
  // Run the initialization
  initializeCache()
    .then(() => {
      console.log('🏁 Cache initialization process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error during cache initialization:', error);
      process.exit(1);
    });
} 