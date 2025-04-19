import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/db/models/user';
import { initUserCollection } from '@/lib/db/models/user';
import { connectToDatabase } from '@/lib/mongodb';

// Initialize the user collection when the API is first loaded
initUserCollection().catch(console.error);

/**
 * GET /api/users
 * Retrieves a paginated list of users
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    
    const { db } = await connectToDatabase();
    
    // Build the query
    const query = search 
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { displayName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
      
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Get total count of matching users for pagination
    const totalUsers = await db.collection('users').countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    
    // Get paginated users
    const users = await db.collection('users')
      .find(query)
      .project({
        _id: 1,
        username: 1,
        displayName: 1,
        profileImage: 1,
        email: 1,
        verified: 1,
        role: 1,
        stats: 1,
        status: 1, // Include status field for filtering
        joinDate: 1,
        lastLogin: 1
      })
      .sort({ displayName: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Return users with pagination info
    return NextResponse.json({ 
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages
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