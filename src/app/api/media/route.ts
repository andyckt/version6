import { NextRequest, NextResponse } from 'next/server';
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
    const formattedMedia = mediaItems.map(item => ({
      id: item._id?.toString(),
      userId: item.userId.toString(),
      type: item.type,
      originalFilename: item.originalFilename,
      mimeType: item.mimeType,
      created: item.created,
      width: item.width || 0,
      height: item.height || 0,
      aspectRatio: item.aspectRatio,
      // Get URLs from variants
      url: item.variants.original?.url || '',
      thumbnailUrl: item.variants.thumbnail?.url || '',
      gridUrl: item.variants.grid?.url || '',
      mediumUrl: item.variants.medium?.url || '',
      largeUrl: item.variants.large?.url || '',
      // Total file size (original variant)
      fileSize: item.variants.original?.size || 0
    }));
    
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