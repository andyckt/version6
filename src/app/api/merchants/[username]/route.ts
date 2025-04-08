import { NextResponse } from 'next/server';
import { findMerchantByUsername } from '@/models/merchant';

// Cache control helper
function setCacheHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);
    
    // Check if we need only basic data (optimization)
    const includeParam = searchParams.get('include');
    const basicOnly = includeParam === 'basic';
    
    // Get merchant from database
    const merchant = await findMerchantByUsername(username);
    
    if (!merchant) {
      return NextResponse.json(
        { error: `Merchant with username ${username} not found` },
        { status: 404 }
      );
    }
    
    // If basic only, return a subset of fields
    if (basicOnly) {
      const { 
        _id, username, accountType, displayName, verified, 
        profileInterface, merchantType, district 
      } = merchant;
      
      return setCacheHeaders(NextResponse.json({
        _id, username, accountType, displayName, verified, 
        profileInterface, merchantType, district
      }));
    }
    
    // Return full merchant data
    return setCacheHeaders(NextResponse.json(merchant));
    
  } catch (error) {
    console.error(`Error fetching merchant by username:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant data' },
      { status: 500 }
    );
  }
} 