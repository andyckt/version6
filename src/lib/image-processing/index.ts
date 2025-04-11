import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import { promisify } from 'util';

// Setup Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define image sizes and quality
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: null, quality: 75 },  // Small thumbnail for grids
  medium: { width: 800, height: null, quality: 80 },     // Medium-size (typical display)
  large: { width: 1600, height: null, quality: 85 },     // Large (full screen/zoom)
  original: { width: null, height: null, quality: 90 }   // Original with moderate compression
};

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ProcessedImage {
  url: string;                  // URL where the image is stored
  cloudinaryId?: string;        // Cloudinary public ID (if using Cloudinary)
  width: number;                // Width in pixels
  height: number;               // Height in pixels 
  aspectRatio: string;          // Aspect ratio as string (e.g., "16:9")
  size: number;                 // File size in bytes
  format: string;               // Image format (jpg, png, webp)
  variantType: ImageVariantType; // Which variant this is
}

export interface ProcessedImageSet {
  original: ProcessedImage;
  variants: {
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    large: ProcessedImage;
  };
  metadata: {
    originalFilename: string;
    mimeType: string;
    timestamp: string;
  };
}

/**
 * Extracts aspect ratio as a string from width and height
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Determines if Cloudinary should be used for this environment
 */
export function shouldUseCloudinary(): boolean {
  // For testing purposes: allow Cloudinary in all environments if credentials exist
  // In production, always use Cloudinary; in development, use it only if FORCE_CLOUDINARY is true
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    (process.env.NODE_ENV === 'production' || process.env.FORCE_CLOUDINARY === 'true')
  );
}

/**
 * Process image from a local file path
 */
export async function processImage(
  filePath: string,
  fileName: string,
  mimeType: string,
  useCloudinary: boolean = shouldUseCloudinary()
): Promise<ProcessedImageSet> {
  try {
    // Generate a unique ID for this upload
    const uniqueId = uuidv4();
    const fileBaseName = path.basename(fileName, path.extname(fileName));
    
    // Get the original image metadata
    const metadata = await sharp(filePath).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not extract image dimensions');
    }

    // Create processed image set
    const processedSet: Partial<ProcessedImageSet> = {
      metadata: {
        originalFilename: fileName,
        mimeType,
        timestamp: new Date().toISOString(),
      },
      variants: {} as any,
    };

    // Process each variant
    const variants = Object.entries(IMAGE_VARIANTS) as [ImageVariantType, typeof IMAGE_VARIANTS[ImageVariantType]][];
    const variantPromises = variants.map(async ([variantName, config]) => {
      // Only resize if dimensions are provided
      let sharpInstance = sharp(filePath);
      
      // If this is not the original, resize accordingly
      if (config.width || config.height) {
        sharpInstance = sharpInstance.resize({
          width: config.width || undefined,
          height: config.height || undefined,
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Determine if this is a photo or graphic/illustration
      // (Photos compress better with WebP, while graphics may benefit from PNG for certain cases)
      const isPhoto = mimeType.includes('jpeg') || mimeType.includes('jpg');
      
      // Choose output format and options
      let outputBuffer;
      if (isPhoto || mimeType.includes('webp')) {
        // Photos or existing WebP - use WebP with appropriate quality
        outputBuffer = await sharpInstance
          .webp({ 
            quality: config.quality,
            effort: 4, // 0-6, higher means more compression but slower processing (4 is a good balance)
            smartSubsample: true, // Better quality for lower file size
            nearLossless: variantName === 'original' // Use near-lossless for original quality
          })
          .toBuffer({ resolveWithObject: true });
      } else if (mimeType.includes('png') && !isPhoto) {
        // PNG graphics/illustrations with transparency - keep as PNG with compression
        outputBuffer = await sharpInstance
          .png({ 
            quality: config.quality,
            compressionLevel: 9, // 0-9, higher means more compression
            palette: true // Use palette to reduce colors for smaller file size
          })
          .toBuffer({ resolveWithObject: true });
      } else if (mimeType.includes('gif')) {
        // Handle GIFs - first frame only as static WebP
        outputBuffer = await sharpInstance
          .webp({ quality: config.quality })
          .toBuffer({ resolveWithObject: true });
      } else {
        // Default - use WebP
        outputBuffer = await sharpInstance
          .webp({ quality: config.quality })
          .toBuffer({ resolveWithObject: true });
      }

      // New dimensions after resize
      const { data, info } = outputBuffer;
      
      // Generate appropriate filename for this variant
      const extension = info.format;
      const variantFilename = `${fileBaseName}-${variantName}-${uniqueId}.${extension}`;
      
      // Determine where to store the image
      let url: string;
      let cloudinaryId: string | undefined;
      
      if (useCloudinary) {
        // Upload to Cloudinary with transformation parameters
        // This allows Cloudinary to apply further optimizations and CDN benefits
        const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
          const uploadOptions = {
            resource_type: 'image' as 'image',
            public_id: `media/${variantName}/${fileBaseName.substring(0, 40)}-${uniqueId}`,
            format: extension,
            quality: config.quality.toString(),
            // Add Cloudinary-specific optimizations
            fetch_format: 'auto',
            dpr: 'auto',
            responsive: true,
            accessibility: 'darkmode',
          };
          
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error('Unknown upload error'));
            }
          );
          
          uploadStream.end(data);
        });
        
        url = uploadResult.secure_url;
        cloudinaryId = uploadResult.public_id;
      } else {
        // Store locally
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const outputPath = path.join(uploadDir, variantFilename);
        await promisify(fs.writeFile)(outputPath, data);
        
        // URL is relative to the public directory
        url = `/uploads/${variantFilename}`;
      }
      
      // Create the processed image object
      const processedImage: ProcessedImage = {
        url,
        cloudinaryId,
        width: info.width,
        height: info.height,
        aspectRatio: calculateAspectRatio(info.width, info.height),
        size: data.length,
        format: info.format,
        variantType: variantName,
      };
      
      // Add to the correct place in the result
      if (variantName === 'original') {
        processedSet.original = processedImage;
      } else {
        (processedSet.variants as any)[variantName] = processedImage;
      }
    });
    
    // Wait for all variants to be processed
    await Promise.all(variantPromises);
    
    // Return the complete set
    return processedSet as ProcessedImageSet;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`Failed to process image: ${(error as Error).message}`);
  }
}

/**
 * Delete an image and all its variants
 */
export async function deleteImage(
  imageSet: ProcessedImageSet,
  useCloudinary: boolean = shouldUseCloudinary()
): Promise<void> {
  try {
    // Delete all variants
    const allImages = [
      imageSet.original,
      ...Object.values(imageSet.variants)
    ];
    
    for (const image of allImages) {
      if (useCloudinary && image.cloudinaryId) {
        // Delete from Cloudinary
        await cloudinary.v2.uploader.destroy(image.cloudinaryId);
      } else if (!useCloudinary && image.url.startsWith('/uploads/')) {
        // Delete local file
        const filePath = path.join(process.cwd(), 'public', image.url);
        if (fs.existsSync(filePath)) {
          await promisify(fs.unlink)(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting images:', error);
    throw new Error(`Failed to delete images: ${(error as Error).message}`);
  }
} 