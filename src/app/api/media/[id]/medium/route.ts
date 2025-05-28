import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Get a media medium variant by ID
 * GET /api/media/[id]/medium
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
    
    // Get the medium URL
    let mediumUrl = '';
    
    if (media.variants) {
      // Prefer medium variant
      if (media.variants.medium && media.variants.medium.url) {
        mediumUrl = media.variants.medium.url;
      }
      // Fallback to grid variant
      else if (media.variants.grid && media.variants.grid.url) {
        mediumUrl = media.variants.grid.url;
      }
      // Fallback to original
      else if (media.variants.original && media.variants.original.url) {
        mediumUrl = media.variants.original.url;
      }
    }
    
    if (!mediumUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Medium variant not available' 
      }, { status: 404 });
    }
    
    // Redirect to the actual image URL
    return NextResponse.redirect(mediumUrl);
    
  } catch (error) {
    console.error('Error getting media medium variant:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get media medium variant' 
    }, { status: 500 });
  }
} 