import { subscribeToChannel, deleteCache, deleteCacheByPattern } from './redis';

const CACHE_CHANNEL = 'merchant:cache:invalidation';
let isInitialized = false;

/**
 * Initialize cache invalidation listener for distributed caching
 * This sets up a Redis pub/sub mechanism for cache invalidation across server instances
 */
export function initializeCacheInvalidation(): void {
  // Prevent multiple initializations
  if (isInitialized) {
    console.log('Cache invalidation already initialized');
    return;
  }
  
  try {
    // Subscribe to cache invalidation channel
    const subscriber = subscribeToChannel(CACHE_CHANNEL, async (channel, message) => {
      try {
        // Parse the invalidation message
        const invalidationEvent = JSON.parse(message);
        
        console.log(`[CACHE] Received invalidation event: ${message}`);
        
        if (invalidationEvent.action === 'invalidateAll') {
          // Invalidate all merchant caches
          await deleteCacheByPattern('merchant:*');
          await deleteCacheByPattern('merchants:*');
          console.log('[CACHE] All merchant caches invalidated');
        } else if (invalidationEvent.action === 'invalidate' && Array.isArray(invalidationEvent.keys)) {
          // Invalidate specific cache keys
          for (const key of invalidationEvent.keys) {
            await deleteCache(key);
            console.log(`[CACHE] Cache key invalidated: ${key}`);
          }
        }
      } catch (error) {
        console.error('[CACHE] Error processing invalidation event:', error);
      }
    });
    
    // Setup error handler
    subscriber.on('error', (error: Error) => {
      console.error('[CACHE] Redis subscription error:', error);
    });
    
    isInitialized = true;
    console.log('[CACHE] Cache invalidation initialized successfully');
  } catch (error) {
    console.error('[CACHE] Failed to initialize cache invalidation:', error);
  }
}

// Export for use in server startup process
export default initializeCacheInvalidation; 