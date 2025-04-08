/**
 * Performance monitoring utility for API and cache operations
 */

// Store metrics in memory for the lifetime of the server
interface MetricStore {
  apiRequests: {
    total: number;
    success: number;
    error: number;
    timings: Record<string, number[]>; // endpoint -> array of response times in ms
  };
  cacheOperations: {
    gets: number;
    sets: number;
    hits: number;
    misses: number;
    hitRatio: number;
  };
  dbOperations: {
    reads: number;
    writes: number;
    deletes: number;
    timings: Record<string, number[]>; // operation -> array of query times in ms
  };
}

// Initialize metrics store
const metrics: MetricStore = {
  apiRequests: {
    total: 0,
    success: 0,
    error: 0,
    timings: {},
  },
  cacheOperations: {
    gets: 0,
    sets: 0,
    hits: 0,
    misses: 0,
    hitRatio: 0,
  },
  dbOperations: {
    reads: 0,
    writes: 0,
    deletes: 0,
    timings: {},
  },
};

// API request metrics
export function recordApiRequest(
  endpoint: string,
  statusCode: number,
  durationMs: number
): void {
  metrics.apiRequests.total++;
  
  if (statusCode >= 200 && statusCode < 400) {
    metrics.apiRequests.success++;
  } else {
    metrics.apiRequests.error++;
  }
  
  // Initialize timing array for this endpoint if it doesn't exist
  if (!metrics.apiRequests.timings[endpoint]) {
    metrics.apiRequests.timings[endpoint] = [];
  }
  
  // Record timing
  metrics.apiRequests.timings[endpoint].push(durationMs);
  
  // Limit array size to prevent memory leaks
  if (metrics.apiRequests.timings[endpoint].length > 1000) {
    metrics.apiRequests.timings[endpoint].shift();
  }
}

// Cache operation metrics
export function recordCacheHit(): void {
  metrics.cacheOperations.gets++;
  metrics.cacheOperations.hits++;
  updateCacheHitRatio();
}

export function recordCacheMiss(): void {
  metrics.cacheOperations.gets++;
  metrics.cacheOperations.misses++;
  updateCacheHitRatio();
}

export function recordCacheSet(): void {
  metrics.cacheOperations.sets++;
}

// Update cache hit ratio
function updateCacheHitRatio(): void {
  const totalGets = metrics.cacheOperations.gets;
  if (totalGets > 0) {
    metrics.cacheOperations.hitRatio = 
      Math.round((metrics.cacheOperations.hits / totalGets) * 100) / 100;
  }
}

// Database operation metrics
export function recordDbRead(operationType: string, durationMs: number): void {
  metrics.dbOperations.reads++;
  recordDbTiming(operationType, durationMs);
}

export function recordDbWrite(operationType: string, durationMs: number): void {
  metrics.dbOperations.writes++;
  recordDbTiming(operationType, durationMs);
}

export function recordDbDelete(operationType: string, durationMs: number): void {
  metrics.dbOperations.deletes++;
  recordDbTiming(operationType, durationMs);
}

// Record DB operation timing
function recordDbTiming(operationType: string, durationMs: number): void {
  // Initialize timing array for this operation if it doesn't exist
  if (!metrics.dbOperations.timings[operationType]) {
    metrics.dbOperations.timings[operationType] = [];
  }
  
  // Record timing
  metrics.dbOperations.timings[operationType].push(durationMs);
  
  // Limit array size to prevent memory leaks
  if (metrics.dbOperations.timings[operationType].length > 1000) {
    metrics.dbOperations.timings[operationType].shift();
  }
}

// Get metrics for reporting
export function getMetrics(): {
  apiRequests: {
    total: number;
    success: number;
    error: number;
    timings: Record<string, { avg: number; p95: number; count: number }>;
  };
  cacheOperations: {
    gets: number;
    sets: number;
    hits: number;
    misses: number;
    hitRatio: number;
  };
  dbOperations: {
    reads: number;
    writes: number;
    deletes: number;
    timings: Record<string, { avg: number; p95: number; count: number }>;
  };
} {
  // Calculate average timings for API endpoints
  const apiTimings: Record<string, { avg: number; p95: number; count: number }> = {};
  
  Object.entries(metrics.apiRequests.timings).forEach(([endpoint, timings]) => {
    if (timings.length > 0) {
      // Sort timings for percentile calculation
      const sorted = [...timings].sort((a, b) => a - b);
      
      // Calculate p95 (95th percentile)
      const p95Index = Math.floor(sorted.length * 0.95);
      
      apiTimings[endpoint] = {
        avg: timings.reduce((sum, time) => sum + time, 0) / timings.length,
        p95: sorted[p95Index],
        count: timings.length
      };
    }
  });
  
  // Calculate average timings for DB operations
  const dbTimings: Record<string, { avg: number; p95: number; count: number }> = {};
  
  Object.entries(metrics.dbOperations.timings).forEach(([operation, timings]) => {
    if (timings.length > 0) {
      // Sort timings for percentile calculation
      const sorted = [...timings].sort((a, b) => a - b);
      
      // Calculate p95 (95th percentile)
      const p95Index = Math.floor(sorted.length * 0.95);
      
      dbTimings[operation] = {
        avg: timings.reduce((sum, time) => sum + time, 0) / timings.length,
        p95: sorted[p95Index],
        count: timings.length
      };
    }
  });
  
  // Return a deep copy to prevent external modifications
  return {
    apiRequests: {
      total: metrics.apiRequests.total,
      success: metrics.apiRequests.success,
      error: metrics.apiRequests.error,
      timings: apiTimings
    },
    cacheOperations: { ...metrics.cacheOperations },
    dbOperations: {
      reads: metrics.dbOperations.reads,
      writes: metrics.dbOperations.writes,
      deletes: metrics.dbOperations.deletes,
      timings: dbTimings
    }
  };
}

// Reset metrics
export function resetMetrics(): void {
  metrics.apiRequests.total = 0;
  metrics.apiRequests.success = 0;
  metrics.apiRequests.error = 0;
  metrics.apiRequests.timings = {};
  
  metrics.cacheOperations.gets = 0;
  metrics.cacheOperations.sets = 0;
  metrics.cacheOperations.hits = 0;
  metrics.cacheOperations.misses = 0;
  metrics.cacheOperations.hitRatio = 0;
  
  metrics.dbOperations.reads = 0;
  metrics.dbOperations.writes = 0;
  metrics.dbOperations.deletes = 0;
  metrics.dbOperations.timings = {};
} 