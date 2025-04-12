import { NextRequest, NextResponse } from 'next/server';
import { incrementPostStat, getPostById } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';

/**
 * Update post stats (likes, views, bookmarks)
 * POST /api/posts/[id]/stats
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // Validate post ID
    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate stat type
    const validStats = ['likes', 'views', 'bookmarks'];
    if (!body.stat || !validStats.includes(body.stat)) {
      return NextResponse.json(
        { error: 'Invalid stat type. Must be one of: likes, views, bookmarks' },
        { status: 400 }
      );
    }
    
    // Validate increment value
    const increment = body.increment === false ? -1 : 1;
    
    // Update the post stat
    await incrementPostStat(postId, body.stat, increment);
    
    // Get the updated post for the response
    const updatedPost = await getPostById(postId);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Return the updated stat value
    return NextResponse.json({
      success: true,
      stat: body.stat,
      value: body.stat === 'likes' 
        ? updatedPost.likes 
        : body.stat === 'views' 
          ? updatedPost.views 
          : updatedPost.bookmarks
    });
    
  } catch (error) {
    console.error('Update post stats error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update post stats' },
      { status: 500 }
    );
  }
}

/**
 * Define allowed HTTP methods
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 