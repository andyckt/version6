import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MerchantModel } from '@/models/Merchant';
import { getCachedMerchantDetail, invalidateMerchantDetailCache } from '@/services/merchantCache';
import { MongoClient } from 'mongodb';

// Collection names
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  console.log(`Fetching merchant with username: ${username}`);
  
  try {
    // Use caching layer to get merchant detail
    const merchantData = await getCachedMerchantDetail(username, true, async () => {
      console.log(`Cache miss for merchant detail: ${username}, fetching from MongoDB...`);
      
      // Connect to MongoDB using the utility function
      const { db } = await connectToDatabase();
      console.log('Connected to database: bobe');
      
      // Find the merchant with the matching username
      const merchant = await db.collection<MerchantModel>(MERCHANT_COLLECTION).findOne({ username });
      
      // If merchant not found, return null
      if (!merchant) {
        console.log(`Merchant not found with username: ${username}`);
        return null;
      }
      
      console.log(`Found merchant: ${merchant.displayName}`);
      
      // Get merchant details if available
      let merchantDetails = null;
      if (merchant.merchantDetailsId) {
        console.log(`Fetching merchant details with ID: ${merchant.merchantDetailsId}`);
        merchantDetails = await db.collection(MERCHANT_DETAIL_COLLECTION).findOne({ _id: merchant.merchantDetailsId });
        console.log('Merchant details retrieved successfully');
      }
      
      // Combine the data
      return {
        ...merchant,
        ...(merchantDetails || {})
      };
    });
    
    // If no merchant found, return 404
    if (!merchantData) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Return merchant data
    return NextResponse.json(merchantData);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 