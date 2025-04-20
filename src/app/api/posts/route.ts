import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPublishedPosts, IPost, PostStatus } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/db/mongodb';

// Helper functions
async function countMedia(query: any) {
  const { db } = await connectToDatabase();
  return await db.collection('media').countDocuments(query);
}

async function getMediaByIds(mediaIds: (ObjectId | string)[], userId: string) {
  const { db } = await connectToDatabase();
  
  // Convert the query to handle both string and ObjectId IDs
  const query: any = { userId: new ObjectId(userId) };
  
  // Split IDs into ObjectIds and string IDs (for development mock IDs)
  const objectIds = mediaIds.filter(id => id instanceof ObjectId) as ObjectId[];
  const stringIds = mediaIds.filter(id => typeof id === 'string') as string[];
  
  if (objectIds.length > 0 && stringIds.length === 0) {
    // Only ObjectIds
    query._id = { $in: objectIds };
  } else if (stringIds.length > 0 && objectIds.length === 0) {
    // Only string IDs (mock IDs in development)
    query._id = { $in: stringIds };
  } else {
    // Mixed IDs - use $or
    query.$or = [
      { _id: { $in: objectIds } },
      { _id: { $in: stringIds } }
    ];
  }
  
  return await db.collection('media').find(query).toArray();
}

/**
 * Create a new post
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    console.log('POST /api/posts - Request body:', {
      userId: body.userId,
      title: body.title?.substring(0, 30),
      mediaCount: body.media?.length,
      hashtags: body.hashtags?.length
    });
    
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
      console.error('User not found:', body.userId);
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Validate and convert media IDs to ObjectId
    const mediaIds = body.media.map((item: { mediaId: string }) => {
      if (process.env.NODE_ENV === 'development' && item.mediaId.startsWith('mock-id-')) {
        return item.mediaId; // Allow mock IDs in development
      } else if (/^[0-9a-fA-F]{24}$/.test(item.mediaId)) {
        return new ObjectId(item.mediaId);
      } else {
        throw new Error(`Invalid media ID format: ${item.mediaId}`);
      }
    });
    
    // For development only - if using mock IDs, skip the DB lookup
    if (process.env.NODE_ENV === 'development' && mediaIds.some(id => typeof id === 'string' && id.toString().startsWith('mock-id-'))) {
      // Skip media validation in development with mock IDs
      console.log('Development mode: Using mock media IDs without validation');
    } else {
      // In production, verify that media exists and belongs to user
      const count = await countMedia({
        $or: [
          { _id: { $in: mediaIds.filter(id => id instanceof ObjectId) } },
          { _id: { $in: mediaIds.filter(id => typeof id === 'string') } }
        ],
        userId: new ObjectId(body.userId)
      });
      
      console.log('Found media items:', count);
      console.log('Media IDs from request:', mediaIds.map(id => id.toString()));
      
      // Get actual media IDs from database to confirm they exist
      const mediaItems = await getMediaByIds(mediaIds, body.userId);
      
      if (!mediaItems || mediaItems.length !== mediaIds.length) {
        console.error(`Not all media found. Requested: ${mediaIds.length}, Found: ${mediaItems?.length || 0}`);
        console.log('Media IDs found in DB:', mediaItems?.map(item => item._id.toString()));
        return NextResponse.json({ 
          success: false, 
          error: 'One or more media items not found or do not belong to user'
        }, { status: 404 });
      }
    }
    
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
        ? body.taggedAccounts.map((account: { username: string, accountType?: string }) => ({ 
            username: account.username,
            accountType: account.accountType || 'user'
          }))
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