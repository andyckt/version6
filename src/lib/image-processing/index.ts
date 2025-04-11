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

// Define image sizes and quality with enhanced settings
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: null, quality: 75 },  // Small thumbnail for grids
  medium: { width: 800, height: null, quality: 80 },     // Medium-size (typical display)
  large: { width: 1600, height: null, quality: 85 },     // Large (full screen/zoom)
  original: { width: null, height: null, quality: 95 }   // Original with light compression
};

// Important EXIF tags to preserve
const IMPORTANT_EXIF_TAGS = [
  'exif:DateTimeOriginal',
  'exif:Make',
  'exif:Model',
  'exif:GPSLatitude',
  'exif:GPSLongitude',
  'exif:Orientation',
  'iptc:Copyright',
  'iptc:Creator',
  'iptc:Caption'
];

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ProcessedImage {
  url: string;                  // URL where the image is stored
  cloudinaryId?: string;        // Cloudinary public ID (if using Cloudinary)
  width: number;                // Width in pixels
  height: number;               // Height in pixels 
  aspectRatio: string;          // Aspect ratio as string (e.g., "16:9")
  size: number;                 // File size in bytes
  format: string;               // Image format (jpg, png, webp, avif)
  variantType: ImageVariantType; // Which variant this is
  blurhash?: string;            // Optional BlurHash for placeholder
  dominantColor?: string;       // Optional dominant color for placeholders
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
    exif?: Record<string, any>;  // Preserved EXIF data
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
 * Extract important EXIF metadata from image
 */
async function extractImageMetadata(filePath: string): Promise<Record<string, any>> {
  try {
    const metadata = await sharp(filePath).metadata();
    const exifData: Record<string, any> = {};
    
    // Extract relevant EXIF data if available
    if (metadata.exif) {
      try {
        const exifParsed = await sharp(filePath).metadata();
        
        // Add only important EXIF tags
        for (const tag of IMPORTANT_EXIF_TAGS) {
          if (exifParsed[tag]) {
            exifData[tag] = exifParsed[tag];
          }
        }
      } catch (error) {
        console.warn('Could not extract EXIF data:', error);
      }
    }
    
    return exifData;
  } catch (error) {
    console.warn('Error extracting metadata:', error);
    return {};
  }
}

/**
 * Calculate dominant color from image
 */
async function calculateDominantColor(filePath: string): Promise<string | undefined> {
  try {
    // Resize to tiny thumbnail for quick processing
    const { data, info } = await sharp(filePath)
      .resize(10, 10, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Calculate the average color (simple approach)
    let r = 0, g = 0, b = 0;
    const pixelCount = info.width * info.height;
    const channels = info.channels;
    
    for (let i = 0; i < data.length; i += channels) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (error) {
    console.warn('Error calculating dominant color:', error);
    return undefined;
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

    // Extract EXIF data to preserve
    const exifData = await extractImageMetadata(filePath);
    
    // Calculate dominant color for placeholder
    const dominantColor = await calculateDominantColor(filePath);

    // Create processed image set
    const processedSet: Partial<ProcessedImageSet> = {
      metadata: {
        originalFilename: fileName,
        mimeType,
        timestamp: new Date().toISOString(),
        exif: exifData
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
      
      // Determine format strategy based on input type and variant
      let outputFormat: 'jpeg' | 'png' | 'webp' | 'avif';
      let outputOptions: any = {};
      
      // Check if image has transparency
      const hasAlpha = metadata.hasAlpha || metadata.channels === 4;
      
      // Check if the image is a photo or a graphic
      // Photos typically benefit from lossy compression, graphics with transparency need lossless
      const isPhoto = mimeType.includes('jpeg') || mimeType.includes('jpg');
      
      if (isPhoto) {
        // Photos look best with WebP (or AVIF for best quality/size ratio)
        if (variantName === 'original') {
          // For originals, prioritize quality
          outputFormat = 'webp';
          outputOptions = { 
            quality: config.quality,
            effort: 5, // Higher effort for originals (0-6)
            smartSubsample: true,
            nearLossless: false // Standard lossy for better compression
          };
        } else {
          // For non-originals, prioritize size/speed
          outputFormat = 'webp';
          outputOptions = {
            quality: config.quality,
            effort: variantName === 'thumbnail' ? 2 : 4, // Lower effort for smaller variants
            smartSubsample: true,
            reductionEffort: 2 // 0-6, higher means more reduction but slower
          };
        }
      } else if (hasAlpha) {
        // Graphics with transparency - use WebP lossless or PNG
        outputFormat = 'webp';
        outputOptions = {
          lossless: true, // Lossless compression for transparency
          quality: 100,   // Not used with lossless but set anyway
          effort: 4       // Compression effort (0-6)
        };
      } else if (mimeType.includes('gif')) {
        // Handle GIFs - convert to static WebP
        outputFormat = 'webp';
        outputOptions = { 
          quality: config.quality,
          effort: 3
        };
      } else {
        // General default - WebP with standard settings
        outputFormat = 'webp';
        outputOptions = { 
          quality: config.quality,
          effort: 4
        };
      }
      
      // Apply format-specific options
      const outputBuffer = await sharpInstance
        [outputFormat](outputOptions)
        .toBuffer({ resolveWithObject: true });

      // New dimensions after resize
      const { data, info } = outputBuffer;
      
      // Generate appropriate filename for this variant
      const extension = info.format;
      const variantFilename = `${fileBaseName}-${variantName}-${uniqueId}.${extension}`;
      
      // Determine where to store the image
      let url: string;
      let cloudinaryId: string | undefined;
      
      if (useCloudinary) {
        // Enhanced Cloudinary upload with better options
        const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
          const uploadOptions = {
            resource_type: 'image' as 'image',
            public_id: `media/${variantName}/${fileBaseName.substring(0, 40)}-${uniqueId}`,
            format: extension as string,
            quality: config.quality.toString(),
            
            // Enhanced Cloudinary-specific optimizations
            fetch_format: 'auto',             // Auto-select format based on browser
            dpr: 'auto',                      // Responsive to device pixel ratio
            responsive: true,                 // Enable responsive features
            accessibility: 'darkmode',        // Support dark mode
            
            // Add EXIF metadata preservation for original variant
            ...(variantName === 'original' && Object.keys(exifData).length > 0 
                ? { exif: 'true' } 
                : {}),
                
            // Color profile handling - sRGB is standard for web
            color_profile: 'srgb',
            
            // Add metadata for performance features
            eager_async: true,                // Async transformations
            eager_notification_url: process.env.CLOUDINARY_WEBHOOK_URL, // Optional webhook for completion
            
            // Add tags for better organization in Cloudinary dashboard
            tags: ['app-media', variantName, new Date().toISOString().split('T')[0]]
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
        dominantColor
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