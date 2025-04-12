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
    const { db } = await connectToDatabase();
    
    // Get all users from the users collection
    // Limit the data to what we need to display users
    const users = await db.collection('users')
      .find({})
      .project({
        username: 1,
        displayName: 1,
        profileImage: 1
      })
      .sort({ displayName: 1 })
      .toArray();
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 