import { NextRequest, NextResponse } from 'next/server';
import { getPostWithDetails, updatePost, deletePost, incrementPostStat, PostStatus } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';

/**
 * Get a post by ID
 * GET /api/posts/[id]
 */
export async function GET(
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
    
    // Get the post with full details (including media and user info)
    const post = await getPostWithDetails(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    await incrementPostStat(postId, 'views');
    
    return NextResponse.json({ 
      success: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        description: post.description,
        location: post.location,
        hashtags: post.hashtags,
        created: post.created,
        updated: post.updated,
        likes: post.likes,
        views: post.views + 1, // Add the current view
        bookmarks: post.bookmarks,
        user: post.user ? {
          id: post.user._id.toString(),
          username: post.user.username,
          displayName: post.user.displayName,
          profileImage: post.user.profileImage,
          verified: post.user.verified
        } : null,
        media: post.mediaDetails.map((media: any) => ({
          id: media._id.toString(),
          type: media.type,
          width: media.width,
          height: media.height,
          aspectRatio: media.aspectRatio,
          url: media.variants.medium?.url,
          thumbnailUrl: media.variants.thumbnail?.url,
          largeUrl: media.variants.large?.url,
          originalUrl: media.variants.original?.url,
          sortOrder: media.sortOrder,
        })),
        taggedAccounts: post.taggedAccounts
      }
    });
    
  } catch (error) {
    console.error('Get post error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get post' },
      { status: 500 }
    );
  }
}

/**
 * Update a post
 * PATCH /api/posts/[id]
 */
export async function PATCH(
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
    
    // In production, verify the user is authorized to update this post
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Prepare the update data
    const updateData = {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.hashtags && { hashtags: body.hashtags }),
      ...(body.taggedAccounts && { taggedAccounts: body.taggedAccounts }),
      ...(body.status && { status: body.status }),
      ...(body.media && { 
        media: body.media.map((mediaItem: any, index: number) => ({
          mediaId: mediaItem.id || mediaItem.mediaId,
          sortOrder: mediaItem.sortOrder || index
        }))
      })
    };
    
    // Update the post
    const updatedPost = await updatePost(postId, updateData);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Post updated successfully',
      post: {
        id: updatedPost._id?.toString(),
        title: updatedPost.title,
        status: updatedPost.status
      }
    });
    
  } catch (error) {
    console.error('Update post error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * Delete a post
 * DELETE /api/posts/[id]
 */
export async function DELETE(
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
    
    // In production, verify the user is authorized to delete this post
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }
    
    // Delete the post (soft delete)
    const result = await deletePost(postId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Post not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete post error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete post' },
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
} 