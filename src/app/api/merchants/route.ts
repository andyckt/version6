import { NextResponse } from 'next/server';
import { getMerchantCollection, MerchantDocument, convertToMongoDocument } from '@/models/merchant';

// Cache control helper
function setCacheHeaders(response: NextResponse) {
  // Use Next.js Edge Runtime cache capabilities
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if we're fetching multiple merchants by username
    const usernames = searchParams.get('usernames');
    if (usernames) {
      // Split comma-separated usernames
      const usernameArray = usernames.split(',').filter(Boolean);
      
      // Get collection and execute query
      const collection = await getMerchantCollection();
      const merchants = await collection
        .find({ username: { $in: usernameArray } })
        .toArray();
      
      // Return merchants with longer cache time for batched requests
      const response = NextResponse.json({ merchants });
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
      return response;
    }
    
    // Standard query parameters
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const type = searchParams.get('type');
    const district = searchParams.get('district');
    const search = searchParams.get('search');
    
    // Create query object
    const query: any = {};
    
    if (type) {
      query.accountType = type;
    }
    
    if (district) {
      query.district = district;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Get collection and execute query
    const collection = await getMerchantCollection();
    
    // For queries with text search, sort by text score
    const sort: any = search 
      ? { score: { $meta: 'textScore' } } 
      : { recommended: -1, 'stats.mentionedPosts': -1 };
    
    const merchants = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await collection.countDocuments(query);
    
    // Build response with pagination info
    const response = {
      merchants,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
    
    return setCacheHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('Error reading merchants:', error);
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newMerchant = await request.json();
    
    // Convert to MongoDB document format
    const merchantDoc = convertToMongoDocument(newMerchant);
    
    // Get collection and insert
    const collection = await getMerchantCollection();
    const result = await collection.insertOne(merchantDoc as any);
    
    return NextResponse.json({ 
      success: true, 
      merchant: { ...merchantDoc, _id: result.insertedId } 
    });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 });
  }
} 