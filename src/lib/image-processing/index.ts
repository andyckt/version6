import { v4 as uuidv4 } from 'uuid';

// Define image sizes and quality
export const IMAGE_VARIANTS = {
  grid: { width: 200, height: null, quality: 75 },    // New smaller variant for grid views
  thumbnail: { width: 300, height: null, quality: 75 },  // Small thumbnail for grids
  medium: { width: 800, height: null, quality: 80 },     // Medium-size (typical display)
  large: { width: 1600, height: null, quality: 90 }      // Large (full screen/zoom) - now highest quality
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
 * Determines if Cloudinary should be used in the current environment
 * Client-safe version that only checks environment variables
 */
export function shouldUseCloudinary(): boolean {
  // Client-safe version only checks if we're in production
  if (typeof window !== 'undefined') {
    // In browser context, assume Cloudinary based on environment
    return process.env.NODE_ENV === 'production';
  }
  
  // Server-side logic now lives in server.ts
  // For SSR, dynamically import the server version
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    (process.env.NODE_ENV === 'production' || process.env.FORCE_CLOUDINARY === 'true')
  );
}

// Export types and constants for use in other files
// The actual processing functions are now in server.ts 