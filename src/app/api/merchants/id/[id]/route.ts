import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MERCHANT_COLLECTION, MERCHANT_DETAIL_COLLECTION, MerchantModel } from '@/models/Merchant';
import { getCachedMerchantDetail } from '@/services/merchantCache';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  // Check if id is a valid number
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid merchant ID' },
      { status: 400 }
    );
  }
  
  try {
    // Use caching layer to get merchant detail by ID
    const merchantData = await getCachedMerchantDetail(id, false, async () => {
      console.log(`Cache miss for merchant with ID: ${id}, fetching from MongoDB...`);
      
      // Connect to MongoDB
      const { db } = await connectToDatabase();
      console.log('Connected to database: bobe');
      
      // Find the merchant with the matching ID
      const merchant = await db.collection<MerchantModel>(MERCHANT_COLLECTION).findOne({ id });
      
      // If merchant not found, return null
      if (!merchant) {
        console.log(`Merchant not found with ID: ${id}`);
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
    
    // If merchant not found, return 404
    if (!merchantData) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Cache the response for 5 minutes
    return NextResponse.json(merchantData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error retrieving merchant by ID:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve merchant data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 