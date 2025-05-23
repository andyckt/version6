import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/users/[username]/posts
 * Get posts by a specific username
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the username from params
    const { username } = params;
    
    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const cursor = searchParams.get('cursor');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // First, find the user to get their ID
    const user = await db.collection('users').findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Build the query for posts
    const query: any = { userId: user._id };
    
    // Add cursor-based pagination if cursor is provided
    if (cursor && ObjectId.isValid(cursor)) {
      query._id = { $lt: new ObjectId(cursor) };
    }
    
    // Fetch posts with a query optimized for faster loading
    const posts = await db.collection('posts')
      .find(query)
      .sort({ _id: -1 }) // Sort by newest first (ObjectId includes timestamp)
      .skip(cursor ? 0 : skip) // Skip only used when cursor pagination isn't in effect
      .limit(limit)
      .project({
        _id: 1,
        title: 1,
        description: 1,
        media: 1,
        hashtags: 1,
        likes: 1,
        views: 1,
        bookmarks: 1,
        created: 1,
        taggedAccounts: 1,
        location: 1
      })
      .toArray();
    
    // Get all media IDs from the posts to fetch in a single query
    const mediaIds = posts
      .flatMap(post => post.media || [])
      .map(media => new ObjectId(media.mediaId));
    
    // Fetch all media items in a single query for efficiency
    const mediaItems = mediaIds.length > 0 
      ? await db.collection('media')
          .find({ _id: { $in: mediaIds } })
          .project({
            _id: 1,
            variants: 1,
            width: 1,
            height: 1,
            aspectRatio: 1
          })
          .toArray()
      : [];
    
    // Create a lookup map for media
    const mediaMap = mediaItems.reduce((map, media) => {
      map[media._id.toString()] = media;
      return map;
    }, {} as Record<string, any>);
    
    // Transform the posts for client rendering
    const formattedPosts = posts.map(post => {
      // Format the media for each post
      const postMedia = post.media?.map((media: any) => {
        const mediaItem = mediaMap[media.mediaId.toString()];
        if (!mediaItem) return null;
        
        // Use the medium variant for the grid view
        return {
          id: media.mediaId.toString(),
          type: 'image',
          url: mediaItem.variants?.medium?.url || '',
          width: mediaItem.variants?.medium?.width || 800,
          height: mediaItem.variants?.medium?.height || 800,
          aspectRatio: mediaItem.aspectRatio || '1:1'
        };
      }).filter(Boolean) || [];
      
      return {
        id: post._id.toString(),
        title: post.title,
        description: post.description || '',
        media: postMedia,
        likes: post.likes || 0,
        views: post.views || 0,
        bookmarks: post.bookmarks || 0,
        hashtags: post.hashtags || [],
        createdAt: post.created ? post.created.toISOString() : new Date().toISOString(),
        taggedAccounts: post.taggedAccounts || [],
        location: post.location || ''
      };
    });
    
    // Get the last post ID for cursor pagination
    const lastPost = posts.length > 0 ? posts[posts.length - 1] : null;
    const nextCursor = lastPost ? lastPost._id.toString() : null;
    
    // Return the formatted posts with pagination metadata
    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      nextCursor,
      hasMore: posts.length === limit,
      total: await db.collection('posts').countDocuments({ userId: user._id })
    });
    
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
} 