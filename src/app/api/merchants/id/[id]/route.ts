import { NextResponse } from 'next/server';
import { findMerchantById } from '@/models/merchant';
import { ObjectId } from 'mongodb';

// Cache control helper
function setCacheHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Get merchant from database
    const merchant = await findMerchantById(objectId);
    
    if (!merchant) {
      return NextResponse.json(
        { error: `Merchant with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Return merchant data with cache headers
    return setCacheHeaders(NextResponse.json(merchant));
    
  } catch (error) {
    console.error(`Error fetching merchant by ID:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant data' },
      { status: 500 }
    );
  }
} 