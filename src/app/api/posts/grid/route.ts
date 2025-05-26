import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '30');
    const cursor = searchParams.get('cursor');
    const category = searchParams.get('category');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Build query
    const query: any = {};
    
    // Add category filter if provided
    if (category) {
      query.hashtags = { $regex: category, $options: 'i' };
    }
    
    // Add cursor-based pagination if cursor is provided
    if (cursor && ObjectId.isValid(cursor)) {
      query._id = { $lt: new ObjectId(cursor) };
    }
    
    // Fetch posts with optimized projection for grid view
    const posts = await db.collection('posts')
      .find(query)
      .sort({ _id: -1 }) // Sort by newest first
      .limit(limit)
      .project({
        title: 1,
        userId: 1, // Get userId instead of relying on username
        username: 1, // Keep the original username for fallback
        likes: 1,
        bookmarks: 1,
        views: 1,
        hashtags: 1,
        media: 1, // We need this to find the primary image
        createdAt: 1
      })
      .toArray();
    
    // Get all media IDs from the posts to fetch in a single query
    const mediaIds = posts
      .flatMap(post => post.media || [])
      .filter(media => media.isPrimary)
      .map(media => media.mediaId);
    
    // Fetch all primary media items in a single query
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
    
    // Extract all user IDs from posts
    const userIds = posts.map(post => 
      typeof post.userId === 'string' ? new ObjectId(post.userId) : post.userId
    ).filter(id => id); // Filter out any undefined/null values
    
    // Fetch user profiles by ID - this ensures we get the most up-to-date username
    const userProfiles = userIds.length > 0 
      ? await db.collection('users')
          .find({ _id: { $in: userIds } })
          .project({
            _id: 1,
            username: 1, // Get current username
            profileImage: 1
          })
          .toArray()
      : [];
    
    // Create a lookup map for user profiles by ID
    const userProfileMap = userProfiles.reduce((map, user) => {
      // Handle profileImage which can be a string (for backward compatibility) or an object
      let profileImageUrl = '';
      if (typeof user.profileImage === 'string') {
        profileImageUrl = user.profileImage;
      } else if (user.profileImage && typeof user.profileImage === 'object') {
        // Use micro variant for avatars in grid view
        profileImageUrl = user.profileImage.micro || '';
      }
      
      map[user._id.toString()] = {
        username: user.username,
        profileImage: profileImageUrl
      };
      
      return map;
    }, {} as Record<string, { username: string, profileImage: string }>);
    
    // Transform the posts for grid view
    const gridPosts = posts.map(post => {
      // Find the primary media item for this post
      const primaryMediaRef = post.media && post.media.find((media: any) => media.isPrimary);
      const primaryMediaId = primaryMediaRef?.mediaId?.toString();
      const mediaItem = primaryMediaId ? mediaMap[primaryMediaId] : null;
      
      // Get the grid variant URL for the primary image
      const primaryImage = mediaItem ? {
        url: mediaItem.variants?.medium?.url || '',
        aspectRatio: mediaItem.aspectRatio || '1:1',
        width: mediaItem.variants?.medium?.width || 800,
        height: mediaItem.variants?.medium?.height || 800
      } : null;
      
      // Get updated user info from the map, or fall back to original data
      const userIdStr = post.userId ? post.userId.toString() : '';
      const userInfo = userProfileMap[userIdStr] || { 
        username: post.username, // Fall back to the stored username
        profileImage: '' 
      };
      
      return {
        _id: post._id,
        title: post.title,
        username: userInfo.username, // Use the current username from users collection
        userProfileImage: userInfo.profileImage,
        likes: post.likes || 0,
        bookmarks: post.bookmarks || 0,
        views: post.views || 0,
        hashtags: post.hashtags || [],
        createdAt: post.createdAt,
        primaryImage
      };
    });
    
    // Get the last post ID for cursor pagination
    const lastPost = posts.length > 0 ? posts[posts.length - 1] : null;
    const nextCursor = lastPost ? lastPost._id.toString() : null;
    
    return NextResponse.json({
      success: true,
      posts: gridPosts,
      nextCursor
    });
  } catch (error) {
    console.error('Error fetching grid posts:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts'
    }, { status: 500 });
  }
} 