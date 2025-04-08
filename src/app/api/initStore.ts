import initializeCacheInvalidation from '@/lib/cacheInitializer';

// Initialize cache invalidation for distributed Redis caching
// This will be imported by the server
if (process.env.NODE_ENV !== 'test') {
  console.log('[SERVER] Initializing cache system');
  initializeCacheInvalidation();
  console.log('[SERVER] Cache system initialization complete');
}

export { }; 