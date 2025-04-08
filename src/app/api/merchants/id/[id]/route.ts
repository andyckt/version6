import { NextResponse } from 'next/server';
import { getMerchantById } from '@/lib/merchantRepository';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idStr = params.id;
  const id = parseInt(idStr, 10);
  
  // Check if ID is a valid number
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid merchant ID' },
      { status: 400 }
    );
  }
  
  try {
    // Find the merchant with the matching ID using our repository
    const merchant = await getMerchantById(id);
    
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
    console.error(`Error fetching merchant with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 