import { NextResponse } from 'next/server';
import { searchMerchants } from '@/lib/merchantRepository';

export async function GET(request: Request) {
  // Get search query from URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  // Validate parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters. Page must be ≥ 1 and limit must be between 1-100.' },
      { status: 400 }
    );
  }
  
  // If no query provided, return empty result
  if (!query.trim()) {
    return NextResponse.json({ merchants: [], total: 0 });
  }
  
  try {
    // Search for merchants
    const merchants = await searchMerchants(query, page, limit);
    
    // Return results
    return NextResponse.json({
      merchants,
      page,
      limit,
      query
    });
  } catch (error) {
    console.error('Error searching merchants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 