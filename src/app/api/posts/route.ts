import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPublishedPosts, IPost, PostStatus } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * Create a new post
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Get the user ID from the request body
    if (!body.userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title is required' 
      }, { status: 400 });
    }
    
    if (!body.media || !Array.isArray(body.media) || body.media.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'At least one media item is required' 
      }, { status: 400 });
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Look up the user to get their username
    const user = await db.collection('users').findOne({ _id: new ObjectId(body.userId) });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // For the example, we'll skip media verification
    // In a real app, you would verify that the media exists and belongs to the user
    
    // Create the post document
    const post = {
      title: body.title.trim(),
      description: body.description ? body.description.trim() : '',
      userId: new ObjectId(body.userId),
      username: user.username,
      createdAt: new Date(),
      
      // Initialize engagement metrics
      likes: 0,
      bookmarks: 0,
      views: 0,
      
      // Content categorization
      hashtags: Array.isArray(body.hashtags) ? body.hashtags : [],
      location: body.location ? body.location.trim() : '',
      
      // Tagged accounts
      taggedAccounts: Array.isArray(body.taggedAccounts) 
        ? body.taggedAccounts.map((account: { username: string }) => ({ username: account.username }))
        : [],
      
      // Media references
      media: body.media.map((item: { mediaId: string, position: number, isPrimary: boolean }) => ({
        mediaId: new ObjectId(item.mediaId),
        position: item.position || 0,
        isPrimary: item.isPrimary || false
      }))
    };
    
    // Insert the post into the database
    const result = await db.collection('posts').insertOne(post);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert post');
    }
    
    // Return the created post with its ID
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create post' 
    }, { status: 500 });
  }
}

/**
 * Get all published posts
 * GET /api/posts
 */
export async function GET(request: NextRequest) {
  try {
    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Get published posts
    const posts = await getPublishedPosts(limit, skip);
    
    // Transform MongoDB objects for the API response
    const postsFormatted = posts.map(post => ({
      id: post._id?.toString() || '',
      title: post.title,
      description: post.description,
      location: post.location,
      hashtags: post.hashtags,
      created: post.created,
      media: post.media.map(m => ({
        id: m.mediaId.toString(),
        sortOrder: m.sortOrder
      })),
      taggedAccounts: post.taggedAccounts,
      likes: post.likes,
      views: post.views,
      bookmarks: post.bookmarks
    }));
    
    return NextResponse.json({ 
      success: true,
      posts: postsFormatted,
      metadata: {
        count: posts.length,
        limit,
        skip
      }
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get posts' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
} 