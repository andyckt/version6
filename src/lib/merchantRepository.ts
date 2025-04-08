import clientPromise from './mongodb';
import { 
  merchantSchemaValidation, 
  merchantIndexes, 
  convertFromDocument 
} from '@/models/merchant';
import { 
  BaseMerchant, 
  ProfileInterface, 
  AccountType,
  SingleLocationMerchant,
  MultiLocationMerchant,
  HotelMerchant,
  AttractionMerchant,
  BarClubMerchant,
  BuildingMerchant,
  StreetMerchant
} from '@/data/merchants';
import { Collection, Db, Document, IndexDirection } from 'mongodb';
import { getCache, setCache, deleteCache, deleteCacheByPattern, publishMessage } from './redis';
import { recordDbRead, recordDbWrite, recordDbDelete } from './monitoring';

// Cache constants
const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_CHANNEL = 'merchant:cache:invalidation';

// Function to get or create the merchant collection
async function getMerchantCollection(): Promise<Collection<Document>> {
  const client = await clientPromise;
  const db: Db = client.db();
  
  // Check if the collection exists
  const collections = await db.listCollections({ name: 'merchants' }).toArray();
  if (collections.length === 0) {
    // Create the collection with validation
    await db.createCollection('merchants', merchantSchemaValidation);
    
    // Create indexes
    const collection = db.collection('merchants');
    for (const index of merchantIndexes) {
      await collection.createIndex(index.key, { unique: !!index.unique });
    }
  }
  
  return db.collection('merchants');
}

// Helper to log cache operations for monitoring
function logCacheOperation(operation: string, key: string, hit: boolean): void {
  console.log(`[CACHE] ${operation} - ${key} - ${hit ? 'HIT' : 'MISS'}`);
}

// Repository functions
export async function getMerchantByUsername<T extends BaseMerchant>(username: string): Promise<T | null> {
  // Try to get from cache first
  const cacheKey = `merchant:username:${username.toLowerCase()}`;
  const cachedMerchant = await getCache<T>(cacheKey);
  
  if (cachedMerchant) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchant;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  // Not in cache, query the database
  const collection = await getMerchantCollection();
  const merchant = await collection.findOne({ username: username.toLowerCase() });
  
  if (!merchant) return null;
  
  // Convert to the right type and cache
  const typedMerchant = convertFromDocument<T>(merchant);
  await setCache(cacheKey, typedMerchant, CACHE_TTL);
  
  return typedMerchant;
}

export async function getMerchantById<T extends BaseMerchant>(id: number): Promise<T | null> {
  // Try to get from cache first
  const cacheKey = `merchant:id:${id}`;
  const cachedMerchant = await getCache<T>(cacheKey);
  
  if (cachedMerchant) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchant;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  // Not in cache, query the database
  const startTime = Date.now();
  const collection = await getMerchantCollection();
  const merchant = await collection.findOne({ id });
  const duration = Date.now() - startTime;
  
  // Record DB read operation
  recordDbRead('getMerchantById', duration);
  
  if (!merchant) return null;
  
  // Convert to the right type and cache
  const typedMerchant = convertFromDocument<T>(merchant);
  await setCache(cacheKey, typedMerchant, CACHE_TTL);
  
  return typedMerchant;
}

export async function getMerchantsByAccountType(accountType: AccountType, page = 1, limit = 20): Promise<BaseMerchant[]> {
  const cacheKey = `merchants:accountType:${accountType}:${page}:${limit}`;
  const cachedMerchants = await getCache<BaseMerchant[]>(cacheKey);
  
  if (cachedMerchants) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchants;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  const collection = await getMerchantCollection();
  const skip = (page - 1) * limit;
  
  const merchants = await collection
    .find({ accountType })
    .sort({ id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const typedMerchants = merchants.map(m => convertFromDocument<BaseMerchant>(m));
  await setCache(cacheKey, typedMerchants, CACHE_TTL);
  
  return typedMerchants;
}

export async function getMerchantsByDistrict(district: string, page = 1, limit = 20): Promise<BaseMerchant[]> {
  const cacheKey = `merchants:district:${district}:${page}:${limit}`;
  const cachedMerchants = await getCache<BaseMerchant[]>(cacheKey);
  
  if (cachedMerchants) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchants;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  const collection = await getMerchantCollection();
  const skip = (page - 1) * limit;
  
  const merchants = await collection
    .find({ district: district })
    .sort({ id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const typedMerchants = merchants.map(m => convertFromDocument<BaseMerchant>(m));
  await setCache(cacheKey, typedMerchants, CACHE_TTL);
  
  return typedMerchants;
}

export async function getRecommendedMerchants(page = 1, limit = 20): Promise<BaseMerchant[]> {
  const cacheKey = `merchants:recommended:${page}:${limit}`;
  const cachedMerchants = await getCache<BaseMerchant[]>(cacheKey);
  
  if (cachedMerchants) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchants;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  const collection = await getMerchantCollection();
  const skip = (page - 1) * limit;
  
  const merchants = await collection
    .find({ recommended: true })
    .sort({ id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const typedMerchants = merchants.map(m => convertFromDocument<BaseMerchant>(m));
  await setCache(cacheKey, typedMerchants, CACHE_TTL);
  
  return typedMerchants;
}

export async function searchMerchants(query: string, page = 1, limit = 20): Promise<BaseMerchant[]> {
  const cacheKey = `merchants:search:${query}:${page}:${limit}`;
  const cachedMerchants = await getCache<BaseMerchant[]>(cacheKey);
  
  if (cachedMerchants) {
    logCacheOperation('GET', cacheKey, true);
    return cachedMerchants;
  }
  
  logCacheOperation('GET', cacheKey, false);
  
  const collection = await getMerchantCollection();
  const skip = (page - 1) * limit;
  
  // Text search - requires a text index on relevant fields
  const merchants = await collection
    .find({ 
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { merchantType: { $regex: query, $options: 'i' } },
        { hashtags: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ id: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const typedMerchants = merchants.map(m => convertFromDocument<BaseMerchant>(m));
  await setCache(cacheKey, typedMerchants, CACHE_TTL);
  
  return typedMerchants;
}

// Helper function to clear cache for a specific merchant
async function invalidateMerchantCache(merchant: BaseMerchant): Promise<void> {
  await deleteCache(`merchant:username:${merchant.username.toLowerCase()}`);
  await deleteCache(`merchant:id:${merchant.id}`);
  
  // Publish cache invalidation event for other instances
  await publishMessage(CACHE_CHANNEL, JSON.stringify({
    action: 'invalidate',
    keys: [
      `merchant:username:${merchant.username.toLowerCase()}`, 
      `merchant:id:${merchant.id}`
    ]
  }));
  
  // Also invalidate list caches since they might contain this merchant
  await deleteCacheByPattern('merchants:*');
}

// CRUD operations for admin
export async function createMerchant<T extends BaseMerchant>(merchant: T): Promise<T> {
  const collection = await getMerchantCollection();
  
  // Check if a merchant with the same username or ID already exists
  const existingMerchant = await collection.findOne({
    $or: [
      { username: merchant.username.toLowerCase() },
      { id: merchant.id }
    ]
  });
  
  if (existingMerchant) {
    throw new Error(`Merchant with username ${merchant.username} or ID ${merchant.id} already exists`);
  }
  
  // Force username to lowercase
  merchant.username = merchant.username.toLowerCase();
  
  // Insert the new merchant
  const startTime = Date.now();
  await collection.insertOne(merchant);
  const duration = Date.now() - startTime;
  
  // Record DB write operation
  recordDbWrite('createMerchant', duration);
  
  // Invalidate relevant caches
  await invalidateMerchantCache(merchant);
  
  return merchant;
}

export async function updateMerchant<T extends BaseMerchant>(merchant: T): Promise<T> {
  const collection = await getMerchantCollection();
  
  // Force username to lowercase
  merchant.username = merchant.username.toLowerCase();
  
  // Update the merchant
  const result = await collection.findOneAndUpdate(
    { id: merchant.id },
    { $set: merchant },
    { returnDocument: 'after' }
  );
  
  if (!result || !result.value) {
    throw new Error(`Merchant with ID ${merchant.id} not found`);
  }
  
  // Invalidate relevant caches
  await invalidateMerchantCache(merchant);
  
  return convertFromDocument<T>(result.value);
}

export async function deleteMerchant(id: number): Promise<boolean> {
  const collection = await getMerchantCollection();
  
  // Find the merchant first to get the username for cache clearing
  const merchant = await collection.findOne({ id });
  if (!merchant) {
    return false;
  }
  
  // Invalidate cache before deletion
  await invalidateMerchantCache(convertFromDocument<BaseMerchant>(merchant));
  
  // Delete the merchant
  const startTime = Date.now();
  const result = await collection.deleteOne({ id });
  const duration = Date.now() - startTime;
  
  // Record DB delete operation
  recordDbDelete('deleteMerchant', duration);
  
  if (!result || result.deletedCount === 0) {
    return false;
  }
  
  return true;
}

// Migration function to import all merchants from static data
export async function migrateAllMerchants(merchants: BaseMerchant[]): Promise<number> {
  const collection = await getMerchantCollection();
  
  // Drop the existing collection to start fresh
  await collection.drop().catch(() => console.log('Collection does not exist yet, creating new'));
  
  // Create the collection again with validation
  await getMerchantCollection();
  
  // Force all usernames to lowercase for consistency
  const processedMerchants = merchants.map(merchant => ({
    ...merchant,
    username: merchant.username.toLowerCase()
  }));
  
  // Insert all merchants
  const result = await collection.insertMany(processedMerchants);
  
  // Invalidate all merchant caches
  await deleteCacheByPattern('merchant:*');
  await deleteCacheByPattern('merchants:*');
  
  // Publish cache invalidation event for other instances
  await publishMessage(CACHE_CHANNEL, JSON.stringify({
    action: 'invalidateAll'
  }));
  
  return result.insertedCount;
}

// Helper function to check if a merchant exists by username
export async function checkMerchantExists(username: string): Promise<boolean> {
  const collection = await getMerchantCollection();
  
  const startTime = Date.now();
  const result = await collection.findOne({ username: username.toLowerCase() }, { projection: { _id: 1 } });
  const duration = Date.now() - startTime;
  
  // Record DB read operation
  recordDbRead('checkMerchantExists', duration);
  
  return !!result;
} 