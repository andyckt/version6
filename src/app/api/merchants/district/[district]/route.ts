import { NextResponse } from 'next/server';
import { getMerchantsByDistrict } from '@/lib/merchantRepository';

export async function GET(
  request: Request,
  { params }: { params: { district: string } }
) {
  const district = params.district;
  
  // Get pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  // Validate parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters. Page must be ≥ 1 and limit must be between 1-100.' },
      { status: 400 }
    );
  }
  
  try {
    // Find merchants in the given district
    const merchants = await getMerchantsByDistrict(district, page, limit);
    
    // Return results with pagination info
    return NextResponse.json({
      merchants,
      district,
      page,
      limit
    });
  } catch (error) {
    console.error(`Error fetching merchants in district ${district}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 