import { NextRequest, NextResponse } from 'next/server';
import { merchants } from '@/data/merchants';

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Search query must be at least 2 characters' 
      }, { status: 400 });
    }
    
    // Search for merchants in merchants.ts instead of MongoDB
    const lowercaseQuery = query.toLowerCase();
    const matchingMerchants = merchants.filter(merchant => 
      merchant.username.toLowerCase().includes(lowercaseQuery) || 
      merchant.displayName.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 10)
    .map(merchant => ({
      _id: merchant.id.toString(),
      username: merchant.username,
      displayName: merchant.displayName,
      verified: merchant.verified,
      accountType: merchant.accountType,
      merchantType: merchant.merchantType
    }));
    
    return NextResponse.json({ 
      success: true, 
      merchants: matchingMerchants
    });
  } catch (error) {
    console.error('Error searching merchants:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search merchants' 
    }, { status: 500 });
  }
} 