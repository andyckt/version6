import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Get a media thumbnail by ID
 * GET /api/media/[id]/thumbnail
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid media ID format' 
      }, { status: 400 });
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find the media item
    const media = await db.collection('media').findOne(
      { _id: new ObjectId(id) },
      { projection: { variants: 1, type: 1 } }
    );
    
    if (!media) {
      return NextResponse.json({ 
        success: false, 
        error: 'Media not found' 
      }, { status: 404 });
    }
    
    // Get the thumbnail URL
    let thumbnailUrl = '';
    
    if (media.variants) {
      // Prefer thumbnail variant
      if (media.variants.thumbnail && media.variants.thumbnail.url) {
        thumbnailUrl = media.variants.thumbnail.url;
      }
      // Fallback to grid variant
      else if (media.variants.grid && media.variants.grid.url) {
        thumbnailUrl = media.variants.grid.url;
      }
      // Fallback to medium variant
      else if (media.variants.medium && media.variants.medium.url) {
        thumbnailUrl = media.variants.medium.url;
      }
    }
    
    if (!thumbnailUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Thumbnail not available' 
      }, { status: 404 });
    }
    
    // Redirect to the actual image URL
    return NextResponse.redirect(thumbnailUrl);
    
  } catch (error) {
    console.error('Error getting media thumbnail:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get media thumbnail' 
    }, { status: 500 });
  }
} 