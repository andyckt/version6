import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * API endpoint to trigger media cleanup tasks
 * - Deletes media not referenced by any posts
 * - Cleans up unused media
 * 
 * POST /api/media/cleanup
 * 
 * Note: In production, this should be secured with proper authentication
 * and typically triggered by a CRON job or admin action
 */

// Define interface for variant to fix TypeScript error
interface MediaVariant {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  cloudinaryId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaIds } = body;
    
    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No media IDs provided'
      }, { status: 400 });
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Convert string IDs to ObjectIds
    const objectIds = mediaIds.map(id => {
      try {
        return new ObjectId(id);
      } catch (error) {
        // Invalid ID format - we'll just return the original
        console.warn(`Invalid ObjectId format: ${id}`);
        return id;
      }
    });
    
    // Check if any of these media items are referenced by posts
    const referencedMedia = await db.collection('posts').distinct('media.mediaId', {
      'media.mediaId': { $in: objectIds }
    });
    
    // Convert to strings for easier comparison
    const referencedMediaIds = referencedMedia.map(id => id.toString());
    
    // Filter out media that is referenced by posts
    const mediaToDelete = objectIds.filter(id => !referencedMediaIds.includes(id.toString()));
    
    if (mediaToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        skipped: objectIds.length,
        message: 'No media deleted - all items are referenced by posts'
      });
    }
    
    // Find media records to get Cloudinary IDs before deletion
    const mediaRecords = await db.collection('media')
      .find({ _id: { $in: mediaToDelete } })
      .toArray();
    
    // Extract Cloudinary IDs for deletion
    const cloudinaryIds = mediaRecords.flatMap(record => {
      const variants = record.variants || {};
      return Object.values(variants)
        .filter((variant): variant is MediaVariant => 
          variant !== null && 
          typeof variant === 'object' && 
          'cloudinaryId' in variant
        )
        .map(variant => variant.cloudinaryId);
    });
    
    // Delete media records from MongoDB
    const result = await db.collection('media')
      .deleteMany({ _id: { $in: mediaToDelete } });
    
    // Delete from Cloudinary in the background
    if (cloudinaryIds.length > 0) {
      deleteFromCloudinary(cloudinaryIds).catch(error => {
        console.error('Error deleting from Cloudinary:', error);
      });
    }
    
    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
      skipped: objectIds.length - mediaToDelete.length,
      message: `Media cleanup completed: ${result.deletedCount} deleted, ${objectIds.length - mediaToDelete.length} skipped (referenced by posts)`
    });
  } catch (error) {
    console.error('Error cleaning up media:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clean up media'
    }, { status: 500 });
  }
}

// Function to delete resources from Cloudinary
async function deleteFromCloudinary(cloudinaryIds: string[]) {
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    try {
      // Import Cloudinary dynamically to avoid bundling it on the client
      const { v2: cloudinary } = await import('cloudinary');
      
      // Configure Cloudinary with credentials
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      
      // Delete resources in batches of 100 (Cloudinary API limit)
      for (let i = 0; i < cloudinaryIds.length; i += 100) {
        const batch = cloudinaryIds.slice(i, i + 100);
        await cloudinary.api.delete_resources(batch);
      }
      
      return true;
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      return false;
    }
  } else {
    console.warn('Cloudinary credentials not configured');
    return false;
  }
}

/**
 * Validate the API key from the Authorization header
 * This is a simple example - in production use proper authentication
 */
function validateApiKey(authHeader: string | null): boolean {
  // Simple validation - in production use environment variables and secure comparison
  const expectedApiKey = process.env.MEDIA_CLEANUP_API_KEY || 'media-cleanup-secret-key';
  
  if (!authHeader) {
    return false;
  }
  
  // Check if it's a Bearer token with our API key
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return false;
  }
  
  return token === expectedApiKey;
} 