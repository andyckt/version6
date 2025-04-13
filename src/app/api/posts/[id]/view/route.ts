import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate post ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid post ID'
      }, { status: 400 });
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Increment the post's view count
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'View count incremented'
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to increment view count'
    }, { status: 500 });
  }
} 