/**
 * Cache Prewarming Utility
 * 
 * This utility preloads frequently accessed data into the Redis cache
 * to improve response times for common requests.
 */

import { MongoClient } from 'mongodb';
import { getRedisClient } from '@/lib/redis';
import { getCachedMerchantDetail, getCachedMerchantList, getCachedMerchantsByType } from '@/services/merchantCache';
import { MerchantModel } from '@/models/Merchant';

// Collection names
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Types for prewarming config
interface MerchantFilter {
  accountType?: string;
  district?: string;
  recommended?: boolean;
}

// Configuration for prewarming
const PREWARM_CONFIG = {
  // Top merchant types to prewarm
  popularTypes: ['restaurant', 'hotel', 'attraction'],
  
  // Number of recommended merchants to prewarm
  topRecommendedCount: 10,
  
  // Specific popular merchant usernames to always prewarm
  popularMerchantUsernames: ['restaurant1', 'hotel1', 'attraction1'],
  
  // Common filter combinations to prewarm
  commonFilters: [
    { accountType: 'restaurant', recommended: true },
    { accountType: 'hotel', recommended: true },
    { district: 'Central' },
    { district: 'Pudong' }
  ] as MerchantFilter[]
};

/**
 * Prewarm the entire cache with common data
 */
export async function prewarmCache(): Promise<void> {
  console.log('Starting cache prewarming...');
  
  try {
    // Prewarm specific merchants by username
    await prewarmPopularMerchants();
    
    // Prewarm merchant lists by type
    await prewarmMerchantsByType();
    
    // Prewarm filtered merchant lists
    await prewarmFilteredMerchantLists();
    
    console.log('Cache prewarming completed successfully');
  } catch (error) {
    console.error('Cache prewarming failed:', error);
  }
}

/**
 * Prewarm specific popular merchants by username
 */
async function prewarmPopularMerchants(): Promise<void> {
  console.log('Prewarming popular merchants...');
  
  const { popularMerchantUsernames } = PREWARM_CONFIG;
  let client: MongoClient | null = null;
  
  try {
    // Get MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    
    // Create MongoDB client
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('bobe');
    
    // Fetch and cache each popular merchant
    for (const username of popularMerchantUsernames) {
      await getCachedMerchantDetail(username, true, async () => {
        console.log(`Prewarming merchant: ${username}`);
        
        // Find merchant by username
        const merchant = await db.collection<MerchantModel>(MERCHANT_COLLECTION).findOne({ username });
        
        if (!merchant) {
          console.log(`Merchant not found: ${username}`);
          return null;
        }
        
        // Get merchant details
        let merchantDetails = null;
        if (merchant.merchantDetailsId) {
          merchantDetails = await db.collection(MERCHANT_DETAIL_COLLECTION).findOne({ _id: merchant.merchantDetailsId });
        }
        
        // Return combined data
        return {
          ...merchant,
          ...(merchantDetails || {})
        };
      });
    }
    
    console.log(`Prewarmed ${popularMerchantUsernames.length} popular merchants`);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Prewarm merchant lists by type
 */
async function prewarmMerchantsByType(): Promise<void> {
  console.log('Prewarming merchants by type...');
  
  const { popularTypes } = PREWARM_CONFIG;
  let client: MongoClient | null = null;
  
  try {
    // Get MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    
    // Create MongoDB client
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('bobe');
    
    // Fetch and cache merchants for each popular type
    for (const type of popularTypes) {
      await getCachedMerchantsByType(type, async () => {
        console.log(`Prewarming merchants of type: ${type}`);
        
        // Find merchants by accountType
        return db.collection<MerchantModel>(MERCHANT_COLLECTION)
          .find({ accountType: type as any })
          .sort({ recommended: -1, id: 1 })
          .limit(20)
          .toArray();
      });
    }
    
    console.log(`Prewarmed merchants for ${popularTypes.length} types`);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Prewarm filtered merchant lists
 */
async function prewarmFilteredMerchantLists(): Promise<void> {
  console.log('Prewarming filtered merchant lists...');
  
  const { commonFilters } = PREWARM_CONFIG;
  let client: MongoClient | null = null;
  
  try {
    // Get MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    
    // Create MongoDB client
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('bobe');
    
    // Fetch and cache merchants for each common filter
    for (const filter of commonFilters) {
      // Create params for cache key generation
      const params = {
        limit: 20,
        page: 1,
        ...filter
      };
      
      await getCachedMerchantList(params, async () => {
        console.log(`Prewarming merchants with filter: ${JSON.stringify(filter)}`);
        
        // Create query from filter
        const query: Record<string, any> = {};
        if (filter.accountType) query.accountType = filter.accountType;
        if (filter.district) query.district = filter.district;
        if (filter.recommended !== undefined) query.recommended = filter.recommended;
        
        // Get total count
        const total = await db.collection(MERCHANT_COLLECTION).countDocuments(query);
        
        // Get filtered merchants
        const merchants = await db.collection<MerchantModel>(MERCHANT_COLLECTION)
          .find(query)
          .sort({ id: 1 })
          .limit(20)
          .toArray();
        
        return {
          merchants,
          pagination: {
            total,
            page: 1,
            limit: 20,
            pages: Math.ceil(total / 20)
          }
        };
      });
    }
    
    console.log(`Prewarmed merchant lists for ${commonFilters.length} common filters`);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Run cache prewarming on application startup
 * This should be called from the main application entry point
 */
export async function initializeCacheOnStartup(): Promise<void> {
  // Check if we should run prewarming (can be controlled by env var)
  if (process.env.DISABLE_CACHE_PREWARMING === 'true') {
    console.log('Cache prewarming is disabled');
    return;
  }
  
  try {
    // Wait a bit to let the application start up properly
    setTimeout(async () => {
      await prewarmCache();
    }, 5000);
  } catch (error) {
    console.error('Failed to initialize cache on startup:', error);
  }
} 