import { NextResponse } from 'next/server';
import { getMerchantByUsername } from '@/data/merchants';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  
  // Find the merchant with the matching username
  const merchant = getMerchantByUsername(username);
  
  // If merchant not found, return 404
  if (!merchant) {
    return NextResponse.json(
      { error: 'Merchant not found' },
      { status: 404 }
    );
  }
  
  // Return the merchant data
  return NextResponse.json(merchant);
} 