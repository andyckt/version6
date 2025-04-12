import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Search for users by username or displayName
    // Using a case-insensitive regex search
    const users = await db.collection('users')
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } }
        ]
      })
      .project({
        _id: 1,
        username: 1,
        displayName: 1,
        profileImage: 1,
        verified: 1
      })
      .limit(10)
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search users' 
    }, { status: 500 });
  }
} 