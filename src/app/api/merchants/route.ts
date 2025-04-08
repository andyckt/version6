import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { MerchantModel } from '@/models/Merchant';
import { getCachedMerchantList } from '@/services/merchantCache';

// Collection names
const MERCHANT_COLLECTION = 'merchants';

export async function GET(request: Request) {
  let client: MongoClient | null = null;
  
  try {
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const accountType = searchParams.get('accountType');
    const district = searchParams.get('district');
    const recommended = searchParams.get('recommended') === 'true';
    
    // Create a params object for cache key generation
    const params = {
      limit,
      page,
      accountType: accountType || undefined,
      district: district || undefined,
      recommended: searchParams.has('recommended') ? recommended : undefined
    };
    
    // Use caching layer to get merchants
    const result = await getCachedMerchantList(params, async () => {
      console.log('Cache miss for merchants list, fetching from MongoDB...');
      
      // Get MongoDB URI from environment variable
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('Please add your MongoDB URI to .env.local');
      }
      
      // Create a new MongoDB client
      client = new MongoClient(uri);
      
      // Connect to the MongoDB server
      await client.connect();
      console.log('Connected to MongoDB server');
      
      // Get the database
      const db = client.db('bobe');
      console.log('Connected to database: bobe');
      
      const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
      
      // Build query
      const query: any = {};
      
      if (accountType) {
        query.accountType = accountType;
      }
      
      if (district) {
        query.district = district;
      }
      
      if (searchParams.has('recommended')) {
        query.recommended = recommended;
      }
      
      console.log('Executing query:', JSON.stringify(query));
      
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const total = await merchantsCollection.countDocuments(query);
      console.log('Total merchants found:', total);
      
      // Get paginated merchants
      const merchants = await merchantsCollection
        .find(query)
        .sort({ id: 1 }) // Sort by id
        .skip(skip)
        .limit(limit)
        .toArray();
      
      console.log(`Retrieved ${merchants.length} merchants from database`);
      
      // Return merchants with pagination metadata
      return {
        merchants,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    });
    
    // Return the result with cache headers
    return NextResponse.json(result, {
      headers: {
        // Cache for 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error retrieving merchants:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve merchants', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB connection is closed
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
      }
    }
  }
}

export async function POST(request: Request) {
  let client: MongoClient | null = null;
  
  try {
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    // Create a new MongoDB client
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Get the database
    const db = client.db('bobe');
    
    const merchantsCollection = db.collection<MerchantModel>(MERCHANT_COLLECTION);
    
    // Parse request body
    const merchantData = await request.json();
    
    // Find the highest merchant ID
    const highestMerchant = await merchantsCollection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = highestMerchant.length > 0 ? highestMerchant[0].id + 1 : 1;
    
    // Add timestamps
    const newMerchantData: MerchantModel = {
      ...merchantData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create new merchant with incremented ID
    const result = await merchantsCollection.insertOne(newMerchantData);
    
    // Invalidate cache for merchant list
    try {
      const { invalidateMerchantListCache } = await import('@/services/merchantCache');
      await invalidateMerchantListCache();
      console.log('Merchant list cache invalidated');
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
    }
    
    return NextResponse.json({ 
      ...newMerchantData, 
      _id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { error: 'Failed to create merchant', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 