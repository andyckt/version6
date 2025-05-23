import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getMerchantById } from '@/data/merchants';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get merchant ID from route params
    const merchantId = parseInt(params.id);
    if (isNaN(merchantId)) {
      return NextResponse.json({ success: false, error: "Invalid merchant ID" }, { status: 400 });
    }

    // Get pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = parseInt(searchParams.get('skip') || '0');
    const cursor = searchParams.get('cursor');

    // Check if the merchant exists
    const merchant = getMerchantById(merchantId);
    if (!merchant) {
      return NextResponse.json({ success: false, error: "Merchant not found" }, { status: 404 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Build query - find posts that tag this merchant
    let query: any = {
      "taggedAccounts.username": merchant.username
    };

    // If cursor is provided, add it to the query for pagination
    if (cursor) {
      query._id = { $lt: new ObjectId(cursor) };
    }

    // Fetch posts from MongoDB
    const posts = await db
      .collection('posts')
      .find(query)
      .sort({ _id: -1 }) // Sort by newest first
      .limit(limit + 1) // Fetch one extra to check if there are more
      .toArray();

    // Check if there are more posts
    const hasMore = posts.length > limit;
    // Remove the extra post if we fetched one
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

    // Extract media IDs to fetch in a single query
    const mediaIds = postsToReturn.flatMap(post => post.mediaIds || []);
    
    // Fetch all media items in a single query
    const mediaItems = mediaIds.length > 0 
      ? await db.collection('media').find({ _id: { $in: mediaIds.map(id => new ObjectId(id)) } }).toArray()
      : [];

    // Create a lookup map for media
    const mediaMap = mediaItems.reduce((acc, item) => {
      acc[item._id.toString()] = {
        id: item._id.toString(),
        url: item.url,
        type: item.type,
        width: item.width,
        height: item.height,
        blurDataUrl: item.blurDataUrl
      };
      return acc;
    }, {} as Record<string, any>);

    // Fetch user information for the posts
    const userIds = postsToReturn.map(post => post.userId);
    const users = userIds.length > 0
      ? await db.collection('users').find({ _id: { $in: userIds.map(id => new ObjectId(id)) } }).toArray()
      : [];

    // Create a lookup map for users
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        profileImage: user.profileImage
      };
      return acc;
    }, {} as Record<string, any>);

    // Format posts for client
    const formattedPosts = postsToReturn.map(post => {
      // Get media items for this post
      const media = (post.mediaIds || []).map(id => mediaMap[id] || null).filter(Boolean);
      
      // Get user data
      const user = userMap[post.userId?.toString()];

      return {
        id: post._id.toString(),
        title: post.title,
        description: post.description,
        likes: post.likes || 0,
        views: post.views || 0,
        bookmarks: post.bookmarks || 0,
        hashtags: post.hashtags || [],
        createdAt: post.createdAt,
        taggedAccounts: post.taggedAccounts || [],
        location: post.location,
        media,
        user
      };
    });

    // Count total posts for this merchant
    const totalPosts = await db.collection('posts').countDocuments({
      "taggedAccounts.username": merchant.username
    });

    // Calculate next cursor from the last post's ID
    const nextCursor = hasMore ? postsToReturn[postsToReturn.length - 1]._id.toString() : undefined;

    // Return the formatted posts with pagination info
    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      nextCursor,
      hasMore,
      total: totalPosts
    });
  } catch (error) {
    console.error('Error fetching merchant posts by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchant posts' },
      { status: 500 }
    );
  }
} 