import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import { deleteImage } from '@/lib/image-processing';
import { MediaStatus, IMediaItem } from './models/media';

const ORIGINAL_RETENTION_DAYS = 60; // Keep original images for 60 days

/**
 * Delete original variants of images that are older than the retention period
 * Keep the large variant as the highest quality version
 */
export async function cleanupOriginalMediaVariants(): Promise<{
  processed: number;
  errors: number;
  message: string;
}> {
  const { db } = await connectToDatabase();
  const now = new Date();
  
  // Calculate the cutoff date (60 days ago)
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - ORIGINAL_RETENTION_DAYS);
  
  // Find media items older than the cutoff that still have original variants
  const mediaItems = await db.collection<IMediaItem>('media')
    .find({
      created: { $lt: cutoffDate },
      'variants.original': { $exists: true },
      status: MediaStatus.ACTIVE,
    })
    .limit(100) // Process in batches to avoid memory issues
    .toArray();
  
  console.log(`Found ${mediaItems.length} media items with originals older than ${ORIGINAL_RETENTION_DAYS} days`);
  
  let processed = 0;
  let errors = 0;
  
  for (const item of mediaItems) {
    try {
      // Only keep the CloudinaryId of the original for deletion
      const originalCloudinaryId = item.variants.original?.cloudinaryId;
      
      // Delete the original variant from storage (Cloudinary)
      if (originalCloudinaryId) {
        await deleteOriginalVariantOnly(originalCloudinaryId);
      }
      
      // Remove the original variant from the database document
      await db.collection<IMediaItem>('media')
        .updateOne(
          { _id: item._id },
          { $unset: { 'variants.original': '' } }
        );
      
      processed++;
    } catch (error) {
      console.error(`Error cleaning up original variant for media ID ${item._id}:`, error);
      errors++;
    }
  }
  
  return {
    processed,
    errors,
    message: `Processed ${processed} items, with ${errors} errors. ${mediaItems.length} items found.`
  };
}

/**
 * Helper function to delete only the original variant from Cloudinary
 * without affecting other variants
 */
async function deleteOriginalVariantOnly(cloudinaryId: string): Promise<void> {
  try {
    const cloudinary = require('cloudinary').v2;
    await cloudinary.uploader.destroy(cloudinaryId);
    console.log(`Deleted original variant: ${cloudinaryId}`);
  } catch (error) {
    console.error(`Failed to delete Cloudinary resource: ${cloudinaryId}`, error);
    throw error;
  }
}

/**
 * Clean up unused media items (e.g., for deleted posts)
 * This would be implemented based on your application's specific needs
 */
export async function cleanupUnusedMedia(): Promise<{
  processed: number;
  errors: number;
  message: string;
}> {
  // This function would identify and clean up media items that are no longer referenced
  // by any posts or other content
  
  // Implementation depends on your data model - how media is associated with posts
  
  return {
    processed: 0,
    errors: 0,
    message: "Not implemented yet. Will clean up unused media."
  };
}

/**
 * Main cleanup function that runs all clean up tasks
 */
export async function runMediaCleanupTasks(): Promise<{
  originals: { processed: number; errors: number; message: string };
  unused: { processed: number; errors: number; message: string };
}> {
  const originals = await cleanupOriginalMediaVariants();
  const unused = await cleanupUnusedMedia();
  
  return {
    originals,
    unused
  };
} 