import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { IMediaItem, MediaStatus } from '@/lib/db/models/media';
import { getMediaByUserId } from '@/lib/db/models/media';

/**
 * Get media items by user ID
 * GET /api/media?userId=123
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    // Get media items for user
    const mediaItems = await getMediaByUserId(userId);
    
    // Format the response
    const formattedMedia = mediaItems.map(item => transformMediaItem(item));
    
    return NextResponse.json({
      success: true,
      media: formattedMedia,
      count: formattedMedia.length
    });
    
  } catch (error) {
    console.error('Error getting media items:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get media items',
      error: (error as Error).message
    }, { status: 500 });
  }
}

// Function to transform a MediaItem for the API response
function transformMediaItem(item: IMediaItem) {
  return {
    id: item._id?.toString(),
    userId: item.userId.toString(),
    type: item.type,
    filename: item.originalFilename,
    mimeType: item.mimeType,
    width: item.width,
    height: item.height,
    aspectRatio: item.aspectRatio,
    status: item.status,
    created: item.created,
    // Get URLs from variants - use large variant as the highest quality
    url: item.variants.large?.url || '',
    thumbnailUrl: item.variants.thumbnail?.url || '',
    gridUrl: item.variants.grid?.url || '',
    mediumUrl: item.variants.medium?.url || '',
    largeUrl: item.variants.large?.url || '',
    // Total file size (large variant)
    fileSize: item.variants.large?.size || 0
  };
}

/**
 * Define allowed HTTP methods
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
} 