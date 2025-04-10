import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/db/models/user';
import { initUserCollection } from '@/lib/db/models/user';

// Initialize the user collection when the API is first loaded
initUserCollection().catch(console.error);

/**
 * GET /api/users
 * Retrieves a paginated list of users
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Validate query parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
    }
    
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 });
    }
    
    // Fetch users from database
    const { users, total } = await getUsers(page, limit);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Return response
    return NextResponse.json({
      users: users.map(user => ({
        ...user,
        _id: user._id?.toString(), // Convert ObjectId to string
        password: undefined // Remove password from response
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 