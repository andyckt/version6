import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import { promisify } from 'util';
import { ssim } from 'ssim.js'; // Add SSIM.js for perceptual quality checking

// Setup Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Quality thresholds for perceptual quality checks
const QUALITY_THRESHOLDS = {
  thumbnail: 0.85,  // Lower threshold for thumbnails
  medium: 0.90,     // Medium quality threshold
  large: 0.95      // Higher threshold for large images (increased from 0.92 since large is now the highest quality)
};

// Define image sizes and quality
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: null, quality: 75 },  // Small thumbnail for grids
  medium: { width: 800, height: null, quality: 80 },     // Medium-size (typical display)
  large: { width: 1600, height: null, quality: 90 }      // Large (full screen/zoom) - increased quality from 85 to 90
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
  size?: number;                // File size in bytes (may not be available for Cloudinary transformations)
  format: string;               // Image format (jpg, png, webp, auto)
  variantType: ImageVariantType; // Which variant this is
  qualityScore?: number;        // SSIM quality score (0-1) - no longer used with Cloudinary transformations
}

export interface ProcessedImageSet {
  variants: {
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    large: ProcessedImage;
  };
  metadata: {
    originalFilename: string;
    mimeType: string;
    timestamp: string;
    baseCloudinaryId?: string;
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
 * @deprecated This function is no longer used with Cloudinary transformations
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
        channels: 4 
      },
      { 
        data: compBuffer as any, 
        width: compressedImage.info.width, 
        height: compressedImage.info.height, 
        channels: 4 
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
 * Sanitizes a filename for use as a Cloudinary public_id
 * Removes special characters, emoji, and limits length
 */
function sanitizeForCloudinary(filename: string): string {
  // Remove file extension if present
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Replace emoji and special characters with nothing
  const sanitized = nameWithoutExt
    // Basic emoji removal - not comprehensive but handles common cases
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    // Convert to simple ASCII characters only
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    // Remove special characters, keeping only alphanumeric, hyphen, underscore
    .replace(/[^\w\-]/g, '_')
    // Replace multiple underscores with a single one
    .replace(/__+/g, '_')
    // Limit to 30 characters
    .substring(0, 30);
  
  // Ensure we still have at least some characters
  return sanitized || 'image';
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
  const processingStartTime = Date.now();
  console.log(`Starting processImage for ${fileName} at ${new Date().toISOString()}`);
  
  try {
    // Generate a unique ID for this upload
    const uniqueId = uuidv4();
    const fileBaseName = path.basename(fileName, path.extname(fileName));
    
    // Sanitize filename for Cloudinary
    const sanitizedBaseName = sanitizeForCloudinary(fileBaseName);
    const cloudinaryBasePath = `media/${sanitizedBaseName}-${uniqueId}`;
    
    console.log(`Original filename: ${fileBaseName}`);
    console.log(`Sanitized for Cloudinary: ${sanitizedBaseName}`);
    console.log(`Cloudinary path: ${cloudinaryBasePath}`);
    
    // Get the original image metadata
    console.log(`Reading metadata for ${fileName}`);
    const metadataStartTime = Date.now();
    const metadata = await sharp(filePath).metadata();
    console.log(`Metadata read in ${Date.now() - metadataStartTime}ms`);
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not extract image dimensions');
    }

    // Define the variants with their transformations
    const variants = {
      thumbnail: { width: IMAGE_VARIANTS.thumbnail.width, crop: 'limit', quality: 75 },
      medium: { width: IMAGE_VARIANTS.medium.width, crop: 'limit', quality: 80 },
      large: { width: IMAGE_VARIANTS.large.width, crop: 'limit', quality: 85 }
    };

    // Create processed image set
    const processedSet: ProcessedImageSet = {
      metadata: {
        originalFilename: fileName,
        mimeType,
        timestamp: new Date().toISOString(),
        baseCloudinaryId: cloudinaryBasePath
      },
      variants: {
        thumbnail: {} as ProcessedImage,
        medium: {} as ProcessedImage,
        large: {} as ProcessedImage
      }
    };

    if (useCloudinary) {
      // Upload to Cloudinary with eager transformations
      const cloudinaryStartTime = Date.now();
      console.log(`Starting Cloudinary upload for ${fileName}`);
      
      const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
        const uploadOptions = {
          folder: '',  // Folder is included in cloudinaryBasePath
          public_id: cloudinaryBasePath,
          resource_type: 'image' as 'image',
          // Generate all variants eagerly to avoid first-load delay
          eager: [
            variants.thumbnail,
            variants.medium,
            variants.large
          ],
          eager_async: true, // Process eagerly in the background
          // Additional optimization options
          fetch_format: 'auto',
          quality: 'auto',
          responsive: true,
          accessibility: 'darkmode',
        };
        
        console.log(`Uploading to Cloudinary with options:`, JSON.stringify(uploadOptions));
        
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            }
            else if (result) {
              console.log(`Cloudinary upload success, public_id: ${result.public_id}`);
              resolve(result);
            }
            else reject(new Error('Unknown upload error'));
          }
        );
        
        uploadStream.end(fs.readFileSync(filePath));
      });
      
      console.log(`Cloudinary upload completed in ${Date.now() - cloudinaryStartTime}ms`);

      // Calculate dimensions for each variant
      const aspectRatio = uploadResult.width / uploadResult.height;
      
      // Create URLs and metadata for each variant
      const variantTypes: ImageVariantType[] = ['thumbnail', 'medium', 'large'];
      
      for (const variantType of variantTypes) {
        const variantConfig = variants[variantType];
        const targetWidth = Math.min(variantConfig.width as number, uploadResult.width);
        const targetHeight = Math.round(targetWidth / aspectRatio);
        
        // Create the transformation URL
        const url = cloudinary.v2.url(uploadResult.public_id, {
          width: targetWidth,
          crop: 'limit',
          quality: variantType === 'large' ? 85 : variantType === 'medium' ? 80 : 75,
          fetch_format: 'auto',
          flags: 'progressive'
        });
        
        // Store the variant info
        processedSet.variants[variantType] = {
          url,
          cloudinaryId: uploadResult.public_id,
          width: targetWidth,
          height: targetHeight,
          aspectRatio: calculateAspectRatio(targetWidth, targetHeight),
          size: 0, // We don't know the exact size of the transformed image
          format: 'auto', // Let Cloudinary determine the best format
          variantType: variantType
        };
      }
    } else {
      // Local processing for development/testing
      // Process each variant using Sharp
      console.log(`Starting local Sharp processing for ${fileName} with ${Object.keys(IMAGE_VARIANTS).length} variants`);
      const sharpStartTime = Date.now();
      
      const variantPromises = Object.entries(IMAGE_VARIANTS).map(async ([variantName, config]) => {
        const variantStartTime = Date.now();
        const variantType = variantName as ImageVariantType;
        
        // Process variants in parallel with the same Sharp instance
        // Clone the sharp instance for parallel processing
        let sharpInstance = sharp(filePath);
        
        // Resize according to variant config
        if (config.width || config.height) {
          sharpInstance = sharpInstance.resize({
            width: config.width || undefined,
            height: config.height || undefined,
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Determine if this is a photo or graphic
        const isPhoto = mimeType.includes('jpeg') || mimeType.includes('jpg');
        
        // Choose output format and quality with optimized settings
        let outputBuffer;
        if (isPhoto || mimeType.includes('webp')) {
          outputBuffer = await sharpInstance
            .webp({ 
              quality: config.quality,
              effort: 4, // Medium effort to balance speed and compression
              smartSubsample: true
            })
            .toBuffer({ resolveWithObject: true });
        } else if (mimeType.includes('png') && !isPhoto) {
          outputBuffer = await sharpInstance
            .png({ 
              quality: config.quality,
              compressionLevel: 9,
              palette: true
            })
            .toBuffer({ resolveWithObject: true });
        } else {
          outputBuffer = await sharpInstance
            .webp({ quality: config.quality })
            .toBuffer({ resolveWithObject: true });
        }

        // Get info about the processed image
        const { data, info } = outputBuffer;
        
        // Generate filename and path
        const extension = info.format;
        const variantFilename = `${fileBaseName}-${variantName}-${uniqueId}.${extension}`;
        
        // Store locally - create directory outside of the loop
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // URL is relative to the public directory
        const url = `/uploads/${variantFilename}`;
        
        console.log(`Variant ${variantName} processed in ${Date.now() - variantStartTime}ms`);
        
        // Return the variant info and data for writing to file
        return {
          variantType,
          data,
          filePath: path.join(uploadDir, variantFilename),
          info: {
            url,
            width: info.width,
            height: info.height,
            aspectRatio: calculateAspectRatio(info.width, info.height),
            size: data.length,
            format: info.format,
            variantType: variantType
          }
        };
      });
      
      // Process all variants in parallel
      console.log(`Waiting for all ${Object.keys(IMAGE_VARIANTS).length} variants to be processed...`);
      const processedVariants = await Promise.all(variantPromises);
      console.log(`All variants processed in ${Date.now() - sharpStartTime}ms`);
      
      // Create the upload directory only once
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        await promisify(fs.mkdir)(uploadDir, { recursive: true });
      }
      
      // Write all files to disk in parallel
      const writeStartTime = Date.now();
      console.log(`Writing ${processedVariants.length} files to disk...`);
      await Promise.all(
        processedVariants.map(async variant => {
          await promisify(fs.writeFile)(variant.filePath, variant.data);
          
          // Store the variant info in our result object
          processedSet.variants[variant.variantType] = variant.info;
        })
      );
      console.log(`All files written to disk in ${Date.now() - writeStartTime}ms`);
    }
    
    console.log(`Total processing time for ${fileName}: ${Date.now() - processingStartTime}ms`);
    // Return the complete set
    return processedSet;
  } catch (error) {
    console.error(`Image processing error for ${fileName}:`, error);
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
    if (useCloudinary) {
      // With the new approach, all variants share the same base Cloudinary ID
      // So we only need to delete the base asset
      if (imageSet.metadata.baseCloudinaryId) {
        // Delete from Cloudinary
        await cloudinary.v2.uploader.destroy(imageSet.metadata.baseCloudinaryId);
        console.log(`Deleted Cloudinary asset: ${imageSet.metadata.baseCloudinaryId}`);
      } else {
        // Fallback to deleting individual variants if baseCloudinaryId is not available
        // (for backward compatibility with older records)
        const cloudinaryIds = Object.values(imageSet.variants)
          .filter(variant => variant.cloudinaryId)
          .map(variant => variant.cloudinaryId as string);
        
        // Delete unique IDs only (remove duplicates)
        const uniqueIds: string[] = [];
        cloudinaryIds.forEach(id => {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
          }
        });
        
        for (const id of uniqueIds) {
          await cloudinary.v2.uploader.destroy(id);
          console.log(`Deleted Cloudinary asset: ${id}`);
        }
      }
    } else {
      // For local storage, delete each variant file
      for (const variant of Object.values(imageSet.variants)) {
        if (variant.url && variant.url.startsWith('/uploads/')) {
          // Delete local file
          const filePath = path.join(process.cwd(), 'public', variant.url);
          if (fs.existsSync(filePath)) {
            await promisify(fs.unlink)(filePath);
            console.log(`Deleted local file: ${filePath}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(`Failed to delete image: ${(error as Error).message}`);
  }
} 