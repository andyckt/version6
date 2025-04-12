import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPublishedPosts, IPost, PostStatus } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';

/**
 * Create a new post
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
  try {
    // In production, get the user ID from the authenticated session
    // For now, we'll get it from the request headers for testing
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.media || !Array.isArray(body.media) || body.media.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one media item are required' },
        { status: 400 }
      );
    }
    
    // Prepare the post data
    const postData: Omit<IPost, 'created' | 'likes' | 'views' | 'bookmarks'> = {
      userId,
      title: body.title,
      description: body.description || '',
      location: body.location || '',
      hashtags: body.hashtags || [],
      media: body.media.map((mediaId: string, index: number) => ({
        mediaId,
        sortOrder: index
      })),
      taggedAccounts: body.taggedAccounts || [],
      status: body.status === 'draft' ? PostStatus.DRAFT : PostStatus.PUBLISHED
    };
    
    // Create the post
    const post = await createPost(postData);
    
    return NextResponse.json({ 
      success: true,
      message: 'Post created successfully',
      post: {
        id: post._id.toString(),
        title: post.title,
        status: post.status
      }
    });
    
  } catch (error) {
    console.error('Post creation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
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
      id: post._id.toString(),
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