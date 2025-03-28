import { NextResponse } from 'next/server';
import { getMerchantById } from '@/data/merchants';

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
  
  // Find the merchant with the matching id
  const merchant = getMerchantById(id);
  
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