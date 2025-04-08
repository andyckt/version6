import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createMerchant } from '@/lib/merchantRepository';

// This endpoint is for admin use only - in production, 
// additional authentication/authorization would be required

export async function GET(request: Request) {
  // Get pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  // Validate parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters. Page must be ≥ 1 and limit must be between 1-100.' },
      { status: 400 }
    );
  }
  
  try {
    // Connect to database directly to bypass caching for admin functions
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('merchants');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Query merchants with pagination
    const merchants = await collection
      .find({}, { 
        // Project only fields needed for the admin list view
        projection: {
          _id: 0,
          id: 1,
          username: 1,
          displayName: 1,
          accountType: 1,
          district: 1,
          verified: 1,
          recommended: 1,
          merchantType: 1
        }
      })
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination (optional for better UX)
    const totalCount = await collection.countDocuments();
    
    // Return results with pagination info
    return NextResponse.json({
      merchants,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching merchants for admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new merchant
export async function POST(request: Request) {
  try {
    // Get merchant data from request body
    const merchantData = await request.json();
    
    // Basic validation
    if (!merchantData.displayName || !merchantData.username || !merchantData.accountType) {
      return NextResponse.json(
        { error: 'Display name, username, and account type are required' },
        { status: 400 }
      );
    }
    
    // Check if username is valid (alphanumeric only)
    if (!/^[a-z0-9]+$/.test(merchantData.username)) {
      return NextResponse.json(
        { error: 'Username must contain only lowercase letters and numbers, no spaces or special characters' },
        { status: 400 }
      );
    }
    
    // Connect to database to check if username is already taken
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('merchants');
    
    const existingMerchant = await collection.findOne({ username: merchantData.username });
    if (existingMerchant) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }
    
    // Get the highest existing merchant ID
    const highestIdMerchant = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = highestIdMerchant.length > 0 ? highestIdMerchant[0].id + 1 : 1;
    
    // Add ID to merchant data
    const newMerchant = {
      ...merchantData,
      id: nextId
    };
    
    // Create the new merchant
    const result = await createMerchant(newMerchant);
    
    // Return the created merchant
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 