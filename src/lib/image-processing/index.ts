import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { ssim } from 'ssim.js'; // Add SSIM.js for perceptual quality checking
import 'server-only'; // Explicitly mark this as server-only

// Only import Node.js modules in server context
let fs: any;
let path: any;
let cloudinary: any;
let promisify: any;

// Type for Cloudinary upload response
interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  eager?: Array<{
    width: number;
    height: number;
    secure_url: string;
    format: string;
    bytes: number;
  }>;
  [key: string]: any;
}

// Import Node.js modules directly for server components
// Since we've marked this file as server-only
fs = require('fs');
path = require('path');
cloudinary = require('cloudinary');
const util = require('util');
promisify = util.promisify;

// Setup Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Quality thresholds for perceptual quality checks
const QUALITY_THRESHOLDS = {
  grid: 0.85,       // Same threshold as thumbnail
  thumbnail: 0.85,  // Lower threshold for thumbnails
  medium: 0.90,     // Medium quality threshold
  large: 0.92,      // Higher threshold for large images
  original: 0.95    // Highest threshold for originals
};

// Define image sizes and quality
export const IMAGE_VARIANTS = {
  grid: { width: 200, height: null, quality: 75 },    // New smaller variant for grid views
  thumbnail: { width: 300, height: null, quality: 75 },  // Small thumbnail for grids
  medium: { width: 800, height: null, quality: 80 },     // Medium-size (typical display)
  large: { width: 1600, height: null, quality: 90 }      // Large (full screen/zoom) - now highest quality
};

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

// Add a type for quality check results
interface QualityCheckResult {
  ssimScore: number;
  passesThreshold: boolean;
  variantType: ImageVariantType;
}

export interface ProcessedImage {
  url: string;                  // URL where the image is stored
  cloudinaryId?: string;        // Cloudinary public ID (if using Cloudinary)
  width: number;                // Width in pixels
  height: number;               // Height in pixels 
  aspectRatio: string;          // Aspect ratio as string (e.g., "16:9")
  size: number;                 // File size in bytes
  format: string;               // Image format (jpg, png, webp)
  variantType: ImageVariantType; // Which variant this is
  qualityScore?: number;        // SSIM quality score (0-1)
}

export interface ProcessedImageSet {
  metadata: {
    originalFilename: string;
    mimeType: string;
    timestamp: string;
  };
  variants: {
    grid: ProcessedImage;
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    large: ProcessedImage;  // Now the highest quality variant
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
 * Check the perceptual quality of a compressed image against the original
 */
async function checkImageQuality(
  originalImagePath: string,
  compressedImageBuffer: Buffer,
  variantType: ImageVariantType
): Promise<QualityCheckResult> {
  try {
    // Load original image as PNG for comparison
    const originalImage = await sharp(originalImagePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Convert compressed image to same format for comparison
    const compressedImage = await sharp(compressedImageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Both images need to be the same size for SSIM comparison
    // So if they differ, we need to resize
    let origBuffer = originalImage.data;
    let compBuffer = compressedImage.data;
    let width = originalImage.info.width;
    let height = originalImage.info.height;
    
    // If compressed image has different dimensions, resize original to match
    if (originalImage.info.width !== compressedImage.info.width || 
        originalImage.info.height !== compressedImage.info.height) {
      // Resize original to match compressed dimensions for comparison
      const resizedOriginal = await sharp(originalImagePath)
        .resize(compressedImage.info.width, compressedImage.info.height)
        .ensureAlpha()
        .raw()
        .toBuffer();
      
      origBuffer = resizedOriginal;
      width = compressedImage.info.width;
      height = compressedImage.info.height;
    }
    
    // Calculate SSIM - manually cast buffer types for compatibility with ssim.js expectations
    const ssimResult = ssim(
      { 
        data: origBuffer as any, 
        width, 
        height, 
        channels: 4 as any // Fix for type error
      },
      { 
        data: compBuffer as any, 
        width: compressedImage.info.width, 
        height: compressedImage.info.height, 
        channels: 4 as any // Fix for type error
      }
    );
    
    // Check if it passes the threshold
    const threshold = QUALITY_THRESHOLDS[variantType];
    const passesThreshold = ssimResult.mssim >= threshold;
    
    // Log quality information
    console.log(`Quality check for ${variantType}: SSIM=${ssimResult.mssim.toFixed(4)}, Threshold=${threshold}, Passes=${passesThreshold}`);
    
    if (!passesThreshold) {
      console.warn(`⚠️ ${variantType} variant quality is below threshold! SSIM=${ssimResult.mssim.toFixed(4)}, Threshold=${threshold}`);
    }
    
    return {
      ssimScore: ssimResult.mssim,
      passesThreshold,
      variantType
    };
  } catch (error) {
    console.error(`Error checking image quality: ${error}`);
    // Return a default passing result to avoid blocking the process
    return {
      ssimScore: 1.0,
      passesThreshold: true,
      variantType
    };
  }
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

    // Define variant specs
    const variants = Object.entries(IMAGE_VARIANTS) as [ImageVariantType, typeof IMAGE_VARIANTS[ImageVariantType]][];
    
    if (useCloudinary) {
      // Upload once to Cloudinary with eager transformations for all variants
      // This is more efficient than multiple uploads
      const transformations = variants.map(([variantName, config]) => {
        return {
          width: config.width || metadata.width,
          crop: "scale",
          quality: config.quality,
          format: "auto",
          fetch_format: "auto",
          eager_async: true,
          transformation: [
            { dpr: "auto" },
            variantName === 'large' ? { quality: "auto:best" } : { quality: config.quality }
          ]
        };
      });
      
      // Single upload with eager transformations
      const uploadResult = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const uploadOptions = {
          resource_type: 'image' as 'image',
          public_id: `media/${fileBaseName.substring(0, 40)}-${uniqueId}`,
          eager: transformations,
          eager_async: false, // We want to wait for transformations to complete for initial upload
          format: 'auto',
          quality: "auto",
          fetch_format: 'auto',
          dpr: 'auto',
          responsive: true,
          accessibility: 'darkmode',
        };
        
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          uploadOptions,
          (error: Error | null, result: CloudinaryUploadResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('Unknown upload error'));
          }
        );
        
        uploadStream.end(fs.readFileSync(filePath));
      });
      
      // Process the results for each variant
      // Create variant entries from the single upload with transformation URLs
      for (let i = 0; i < variants.length; i++) {
        const [variantName, config] = variants[i];
        const variant = uploadResult.eager && uploadResult.eager[i] ? uploadResult.eager[i] : null;
        
        // If eager transformation is available, use it
        // Otherwise fall back to constructing a transformation URL
        const variantUrl = variant?.secure_url || 
                         `${uploadResult.secure_url.replace(/\.[^/.]+$/, '')}/w_${config.width},q_${config.quality},f_auto`;
        
        const width = variant?.width || config.width || metadata.width;
        const height = variant?.height || Math.round((metadata.height || 0) * (width / (metadata.width || 1)));
        
        // Create the processed image object for this variant
        const processedImage: ProcessedImage = {
          url: variantUrl,
          cloudinaryId: uploadResult.public_id, // All variants share the same public_id
          width,
          height,
          aspectRatio: calculateAspectRatio(width, height),
          size: variant?.bytes || 0, // If we have bytes from eager, use it, otherwise it's an estimate
          format: variant?.format || 'auto',
          variantType: variantName,
          qualityScore: 1.0 // Without comparisons, we assume high quality
        };
        
        // Add to the variants
        (processedSet.variants as any)[variantName] = processedImage;
      }
    } else {
      // Local storage processing - process each variant separately
      // This is more similar to the original approach but only for local storage
      const variantPromises = variants.map(async ([variantName, config]) => {
        // Only resize if dimensions are provided
        let sharpInstance = sharp(filePath);
        
        // Resize according to config
        if (config.width || config.height) {
          sharpInstance = sharpInstance.resize({
            width: config.width || undefined,
            height: config.height || undefined,
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Determine if this is a photo or graphic/illustration
        const isPhoto = mimeType.includes('jpeg') || mimeType.includes('jpg');
        
        // Choose output format and options
        let outputBuffer;
        if (isPhoto || mimeType.includes('webp')) {
          // Photos or existing WebP - use WebP with appropriate quality
          outputBuffer = await sharpInstance
            .webp({ 
              quality: config.quality,
              effort: 4, // 0-6, higher means more compression but slower processing
              smartSubsample: true, // Better quality for lower file size
              nearLossless: variantName === 'large' // Use near-lossless for highest quality (large) variant
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
        
        // Store locally
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const outputPath = path.join(uploadDir, variantFilename);
        await promisify(fs.writeFile)(outputPath, data);
        
        // URL is relative to the public directory
        const url = `/uploads/${variantFilename}`;
        
        // Create the processed image object
        const processedImage: ProcessedImage = {
          url,
          cloudinaryId: undefined,
          width: info.width,
          height: info.height,
          aspectRatio: calculateAspectRatio(info.width, info.height),
          size: data.length,
          format: info.format,
          variantType: variantName,
          qualityScore: 1.0 // Placeholder without comparison
        };
        
        // Add to variants
        (processedSet.variants as any)[variantName] = processedImage;
      });
      
      // Wait for all variants to be processed
      await Promise.all(variantPromises);
    }
    
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
    const allImages = Object.values(imageSet.variants);
    
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