import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/merchants/[username]/posts
 * Get posts that tag/mention a specific merchant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the merchant username from params
    const { username } = params;
    
    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const cursor = searchParams.get('cursor');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // First, check if the merchant exists in the database
    const merchant = await db.collection('merchants').findOne({ username });
    
    if (!merchant) {
      // If not in MongoDB, return 404 (the frontend will handle using static data)
      return NextResponse.json(
        { success: false, error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    // Build the query for posts that tag this merchant
    const query: any = { 
      'taggedAccounts.username': username 
    };
    
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
        userId: 1,
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
    
    // Get all user IDs from the posts
    const userIds = posts
      .map(post => post.userId)
      .filter((id, index, self) => 
        // Remove duplicates
        index === self.findIndex(t => t.toString() === id.toString())
      );
    
    // Fetch all users in a single query
    const users = userIds.length > 0
      ? await db.collection('users')
          .find({ _id: { $in: userIds } })
          .project({
            _id: 1,
            username: 1,
            displayName: 1,
            profileImage: 1,
            verified: 1
          })
          .toArray()
      : [];
    
    // Create a lookup map for users
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
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
      
      // Get the user who created this post
      const user = userMap[post.userId.toString()];
      
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
        location: post.location || '',
        user: user ? {
          id: user._id.toString(),
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage,
          verified: user.verified
        } : null
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
      total: await db.collection('posts').countDocuments(query)
    });
    
  } catch (error) {
    console.error('Error fetching merchant posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchant posts' },
      { status: 500 }
    );
  }
} 