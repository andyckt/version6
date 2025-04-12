import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { ProcessedImageSet, ProcessedImage, ImageVariantType } from '@/lib/image-processing';
import { deleteImage } from '@/lib/image-processing';

// Collection name
const COLLECTION = 'media';

// Media type enum
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video', // For future implementation
}

// Status of the media
export enum MediaStatus {
  PROCESSING = 'processing',  // Being uploaded/processed
  ACTIVE = 'active',          // Successfully processed and available
  DELETED = 'deleted',        // Soft deleted
  FAILED = 'failed',          // Failed to process
}

// Database Media Item interface
export interface IMediaItem {
  _id?: ObjectId;             // MongoDB ObjectId
  userId: ObjectId | string;  // Reference to user who uploaded
  type: MediaType;            // Type of media (image, video)
  originalFilename: string;   // Original filename
  mimeType: string;           // MIME type of original file
  created: Date;              // When it was uploaded
  status: MediaStatus;        // Current status
  
  // For images only
  width?: number;             // Width of the original
  height?: number;            // Height of the original
  aspectRatio?: string;       // Aspect ratio string (e.g., "16:9")
  
  // Media variants for different sizes
  variants: {
    [key in ImageVariantType]?: {
      url: string;            // URL to access this variant
      width: number;          // Width in pixels
      height: number;         // Height in pixels
      size: number;           // File size in bytes
      cloudinaryId?: string;  // Cloudinary ID if using Cloudinary
    }
  };
  
  // Metadata for potential future use
  metadata?: Record<string, any>;
}

/**
 * Create a media item record in the database
 */
export async function createMediaItem(imageSet: ProcessedImageSet, userId: string | ObjectId, type = MediaType.IMAGE): Promise<IMediaItem> {
  const { db } = await connectToDatabase();
  
  // Convert the ProcessedImageSet to database structure
  const mediaItem: Omit<IMediaItem, '_id'> = {
    userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
    type,
    originalFilename: imageSet.metadata.originalFilename,
    mimeType: imageSet.metadata.mimeType,
    created: new Date(),
    status: MediaStatus.ACTIVE,
    width: imageSet.original.width,
    height: imageSet.original.height,
    aspectRatio: imageSet.original.aspectRatio,
    variants: {
      original: {
        url: imageSet.original.url,
        width: imageSet.original.width,
        height: imageSet.original.height,
        size: imageSet.original.size,
        cloudinaryId: imageSet.original.cloudinaryId,
      },
      grid: {
        url: imageSet.variants.grid.url,
        width: imageSet.variants.grid.width,
        height: imageSet.variants.grid.height,
        size: imageSet.variants.grid.size,
        cloudinaryId: imageSet.variants.grid.cloudinaryId,
      },
      thumbnail: {
        url: imageSet.variants.thumbnail.url,
        width: imageSet.variants.thumbnail.width,
        height: imageSet.variants.thumbnail.height,
        size: imageSet.variants.thumbnail.size,
        cloudinaryId: imageSet.variants.thumbnail.cloudinaryId,
      },
      medium: {
        url: imageSet.variants.medium.url,
        width: imageSet.variants.medium.width,
        height: imageSet.variants.medium.height,
        size: imageSet.variants.medium.size,
        cloudinaryId: imageSet.variants.medium.cloudinaryId,
      },
      large: {
        url: imageSet.variants.large.url,
        width: imageSet.variants.large.width,
        height: imageSet.variants.large.height,
        size: imageSet.variants.large.size,
        cloudinaryId: imageSet.variants.large.cloudinaryId,
      },
    },
    metadata: {
      originalUploadTimestamp: imageSet.metadata.timestamp,
    },
  };
  
  // Insert into database
  const result = await db.collection<IMediaItem>(COLLECTION).insertOne(mediaItem);
  
  // Return the new media item with the generated ID
  return {
    ...mediaItem,
    _id: result.insertedId,
  };
}

/**
 * Get a media item by ID
 */
export async function getMediaById(id: string | ObjectId): Promise<IMediaItem | null> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  return db.collection<IMediaItem>(COLLECTION).findOne({ _id: objectId });
}

/**
 * Get media items by user ID
 */
export async function getMediaByUserId(
  userId: string | ObjectId,
  options: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: MediaType;
  } = {}
): Promise<IMediaItem[]> {
  const { db } = await connectToDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const {
    limit = 20,
    skip = 0,
    sortBy = 'created',
    sortOrder = 'desc',
    type,
  } = options;
  
  // Build query
  const query: any = {
    userId: objectId,
    status: MediaStatus.ACTIVE,
  };
  
  // Add type filter if provided
  if (type) {
    query.type = type;
  }
  
  return db
    .collection<IMediaItem>(COLLECTION)
    .find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Delete media item and associated files
 */
export async function deleteMediaItem(id: string | ObjectId): Promise<boolean> {
  const { db } = await connectToDatabase();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  // Get the media item first
  const mediaItem = await getMediaById(objectId);
  
  if (!mediaItem) {
    return false; // Item not found
  }
  
  try {
    // Mark as deleted in the database first (soft delete)
    await db.collection<IMediaItem>(COLLECTION).updateOne(
      { _id: objectId },
      { $set: { status: MediaStatus.DELETED } }
    );
    
    // Only try to delete from storage if it's an image
    if (mediaItem.type === MediaType.IMAGE) {
      // Convert IMediaItem structure to ProcessedImageSet for the delete function
      const imageSet: ProcessedImageSet = {
        original: {
          url: mediaItem.variants.original?.url || '',
          cloudinaryId: mediaItem.variants.original?.cloudinaryId,
          width: mediaItem.variants.original?.width || 0,
          height: mediaItem.variants.original?.height || 0,
          aspectRatio: mediaItem.aspectRatio || '1:1',
          size: mediaItem.variants.original?.size || 0,
          format: 'webp',
          variantType: 'original',
        },
        variants: {
          grid: {
            url: mediaItem.variants.grid?.url || '',
            cloudinaryId: mediaItem.variants.grid?.cloudinaryId,
            width: mediaItem.variants.grid?.width || 0,
            height: mediaItem.variants.grid?.height || 0,
            aspectRatio: calculateAspectRatio(
              mediaItem.variants.grid?.width || 1,
              mediaItem.variants.grid?.height || 1
            ),
            size: mediaItem.variants.grid?.size || 0,
            format: 'webp',
            variantType: 'grid',
          },
          thumbnail: {
            url: mediaItem.variants.thumbnail?.url || '',
            cloudinaryId: mediaItem.variants.thumbnail?.cloudinaryId,
            width: mediaItem.variants.thumbnail?.width || 0,
            height: mediaItem.variants.thumbnail?.height || 0,
            aspectRatio: calculateAspectRatio(
              mediaItem.variants.thumbnail?.width || 1,
              mediaItem.variants.thumbnail?.height || 1
            ),
            size: mediaItem.variants.thumbnail?.size || 0,
            format: 'webp',
            variantType: 'thumbnail',
          },
          medium: {
            url: mediaItem.variants.medium?.url || '',
            cloudinaryId: mediaItem.variants.medium?.cloudinaryId,
            width: mediaItem.variants.medium?.width || 0,
            height: mediaItem.variants.medium?.height || 0,
            aspectRatio: calculateAspectRatio(
              mediaItem.variants.medium?.width || 1,
              mediaItem.variants.medium?.height || 1
            ),
            size: mediaItem.variants.medium?.size || 0,
            format: 'webp',
            variantType: 'medium',
          },
          large: {
            url: mediaItem.variants.large?.url || '',
            cloudinaryId: mediaItem.variants.large?.cloudinaryId,
            width: mediaItem.variants.large?.width || 0,
            height: mediaItem.variants.large?.height || 0,
            aspectRatio: calculateAspectRatio(
              mediaItem.variants.large?.width || 1,
              mediaItem.variants.large?.height || 1
            ),
            size: mediaItem.variants.large?.size || 0,
            format: 'webp',
            variantType: 'large',
          },
        },
        metadata: {
          originalFilename: mediaItem.originalFilename,
          mimeType: mediaItem.mimeType,
          timestamp: mediaItem.created.toISOString(),
        },
      };
      
      // Delete the actual files
      await deleteImage(imageSet);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete media files:', error);
    
    // Update the status to reflect the partial deletion failure
    await db.collection<IMediaItem>(COLLECTION).updateOne(
      { _id: objectId },
      {
        $set: {
          status: MediaStatus.FAILED,
          metadata: {
            ...mediaItem.metadata,
            deletionError: (error as Error).message,
            deletionAttemptTime: new Date().toISOString(),
          },
        },
      }
    );
    
    return false;
  }
}

/**
 * Calculate aspect ratio from width and height
 */
function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Initialize Media Collection with indexes
 */
export async function initMediaCollection(): Promise<void> {
  const { db } = await connectToDatabase();
  
  // Create indexes
  await db.collection(COLLECTION).createIndexes([
    { key: { userId: 1 }, name: 'userId_idx' },
    { key: { status: 1 }, name: 'status_idx' },
    { key: { created: -1 }, name: 'created_idx' },
    { key: { type: 1 }, name: 'type_idx' },
  ]);
}

// Export for use in other modules
export default {
  createMediaItem,
  getMediaById,
  getMediaByUserId,
  deleteMediaItem,
  initMediaCollection,
}; 