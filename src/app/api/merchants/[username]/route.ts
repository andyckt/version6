import { NextResponse } from 'next/server';
import { getMerchantByUsername } from '@/lib/merchantRepository';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  
  try {
    // Find the merchant with the matching username using our repository
    const merchant = await getMerchantByUsername(username);
    
    // If merchant not found, return 404
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Return the merchant data
    return NextResponse.json(merchant);
  } catch (error) {
    console.error(`Error fetching merchant ${username}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 