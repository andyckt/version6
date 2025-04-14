import { NextRequest, NextResponse } from 'next/server';
import { getPostById, getPostWithDetails, updatePost, deletePost, incrementPostStat, PostStatus, IPost } from '@/lib/db/models/post';
import { ObjectId } from 'mongodb';

/**
 * Get a specific post by ID
 * GET /api/posts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the post with full details including media
    const post = await getPostWithDetails(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Transform MongoDB object for the API response
    const postFormatted = {
      id: post._id?.toString(),
      title: post.title,
      description: post.description,
      location: post.location,
      hashtags: post.hashtags,
      created: post.created,
      status: post.status,
      // Include detailed media information
      media: post.mediaDetails.map((media: any) => ({
        id: media._id?.toString(),
        type: media.type || 'image',
        sortOrder: media.sortOrder,
        width: media.width,
        height: media.height,
        aspectRatio: media.aspectRatio,
        // Include all available variant URLs
        url: media.variants?.medium?.url || '',
        variants: {
          grid: media.variants?.grid,
          thumbnail: media.variants?.thumbnail,
          medium: media.variants?.medium,
          large: media.variants?.large,
        }
      })),
      user: post.user,
      taggedAccounts: post.taggedAccounts,
      likes: post.likes,
      views: post.views,
      bookmarks: post.bookmarks
    };
    
    return NextResponse.json({ 
      success: true,
      post: postFormatted
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
    // Get the post ID from the URL
    const id = params.id;
    
    // In production, get the user ID from the authenticated session
    // For now, we'll get it from the request headers for testing
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }
    
    // Get the existing post to verify ownership
    const existingPost = await getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the post
    const postUserId = existingPost.userId.toString();
    if (postUserId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Prepare the media array if it exists
    let mediaArray;
    if (body.mediaIds && Array.isArray(body.mediaIds)) {
      // New format - array of media IDs
      mediaArray = body.mediaIds.map((mediaId: string, index: number) => ({
        mediaId,
        sortOrder: index
      }));
    } else if (body.media && Array.isArray(body.media)) {
      // Legacy format
      mediaArray = body.media.map((media: any, index: number) => {
        // Check if the media item is an object with id property or just an ID string
        const mediaId = typeof media === 'object' ? media.id || media.mediaId : media;
        return {
          mediaId,
          sortOrder: typeof media === 'object' && media.sortOrder !== undefined ? media.sortOrder : index
        };
      });
    }
    
    // Prepare the post data for update
    const updateData: Partial<IPost> = {};
    
    // Only add fields that were provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.hashtags !== undefined) updateData.hashtags = body.hashtags;
    if (mediaArray !== undefined) updateData.media = mediaArray;
    if (body.taggedAccounts !== undefined) updateData.taggedAccounts = body.taggedAccounts;
    if (body.status !== undefined) {
      updateData.status = body.status === 'draft' ? PostStatus.DRAFT : PostStatus.PUBLISHED;
    }
    
    // Update the post
    const updatedPost = await updatePost(id, updateData);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Post updated successfully',
      id: updatedPost._id?.toString(),
      status: updatedPost.status
    });
    
  } catch (error) {
    console.error('Post update error:', error);
    
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