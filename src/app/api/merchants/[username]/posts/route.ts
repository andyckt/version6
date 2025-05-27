import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getMerchantByUsername } from '@/data/merchants';
import { PostStatus } from '@/lib/db/models/post';

/**
 * Get posts that tag a specific merchant
 * GET /api/merchants/[username]/posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    // Check if the merchant exists
    const merchant = getMerchantByUsername(username);
    if (!merchant) {
      return NextResponse.json({ 
        success: false, 
        error: 'Merchant not found' 
      }, { status: 404 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Find posts that tag this merchant
    const posts = await db.collection('posts')
      .find({
        'taggedAccounts': { $elemMatch: { username: username } },
        $or: [
          { 'status': PostStatus.PUBLISHED },
          { 'status': { $exists: false } }  // Include posts without a status field
        ]
      })
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get user data for each post
    const userIds = posts.map(post => post.userId);
    const users = await db.collection('users')
      .find({ _id: { $in: userIds } })
      .project({
        _id: 1,
        username: 1,
        displayName: 1,
        profileImage: 1,
        verified: 1
      })
      .toArray();
    
    // Create a map of users by ID
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});
    
    // Format the posts for the response
    const formattedPosts = posts.map(post => {
      const user = userMap[post.userId.toString()] || {};
      
      // Get media details for the post
      const primaryMedia = post.media && post.media.length > 0 ? post.media[0] : null;
      
      return {
        _id: post._id.toString(),
        title: post.title,
        description: post.description,
        hashtags: post.hashtags || [],
        username: user.username || '',
        displayName: user.displayName || '',
        userProfileImage: user.profileImage || '',
        likes: post.likes || 0,
        views: post.views || 0,
        bookmarks: post.bookmarks || 0,
        createdAt: post.created,
        media: primaryMedia ? [
          {
            mediaId: primaryMedia.mediaId.toString(),
            sortOrder: primaryMedia.sortOrder || 0
          }
        ] : []
      };
    });
    
    // Get the total count of posts for this merchant
    const totalPosts = await db.collection('posts').countDocuments({
      'taggedAccounts': { $elemMatch: { username: username } },
      $or: [
        { 'status': PostStatus.PUBLISHED },
        { 'status': { $exists: false } }  // Include posts without a status field
      ]
    });
    
    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      total: totalPosts,
      metadata: {
        merchant: {
          username: merchant.username,
          displayName: merchant.displayName
        },
        pagination: {
          limit,
          skip,
          total: totalPosts
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching merchant posts:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch merchant posts'
    }, { status: 500 });
  }
}

/**
 * Define allowed HTTP methods
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
} 