import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Process an uploaded image file - server-side only
 * This uses Cloudinary with eager transformations to create multiple variants
 */
export async function processUploadedImage(
  filePath: string,
  fileName: string,
  mimeType: string
) {
  try {
    // Generate a unique ID for this upload
    const uniqueId = uuidv4().slice(0, 8);
    const fileBaseName = path.basename(fileName, path.extname(fileName));
    const safeFileName = fileBaseName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    // Get the original image metadata
    const metadata = await sharp(filePath).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not extract image dimensions');
    }

    // Define the Cloudinary upload folder
    const folder = 'media';
    
    // Define transformation variants
    const transformations = [
      { name: 'thumbnail', width: 300, height: 300, crop: 'fill', quality: 75 },
      { name: 'medium', width: 800, height: 800, crop: 'limit', quality: 80 },
      { name: 'large', width: 1600, height: 1600, crop: 'limit', quality: 90 }
    ];
    
    // Generate eager transformation array for Cloudinary
    const eager = transformations.map(t => ({
      width: t.width,
      height: t.height,
      crop: t.crop,
      quality: t.quality,
      format: 'webp',
      folder: `${folder}/${t.name}`,
      public_id: `${t.name}/${safeFileName}-${uniqueId}`
    }));
    
    // Upload to Cloudinary with eager transformations
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: `${folder}/original`,
          public_id: `original/${safeFileName}-${uniqueId}`,
          resource_type: 'image',
          eager: eager,
          eager_async: false, // Wait for all transformations to complete
          format: 'webp'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Stream the file to Cloudinary
      fs.createReadStream(filePath).pipe(uploadStream);
    });
    
    // Process the results
    const variantUrls: Record<string, string> = {
      original: result.secure_url
    };
    
    // Extract the URLs from the eager results
    if (result.eager && Array.isArray(result.eager)) {
      for (let i = 0; i < result.eager.length; i++) {
        const variant = transformations[i];
        variantUrls[variant.name] = result.eager[i].secure_url;
      }
    }
    
    // Calculate aspect ratio
    const width = metadata.width;
    const height = metadata.height;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const aspectRatio = `${width / divisor}:${height / divisor}`;

    return {
      originalFilename: fileName,
      width: metadata.width,
      height: metadata.height,
      aspectRatio,
      cloudinaryId: result.public_id, // The original public_id
      thumbnailUrl: variantUrls.thumbnail,
      mediumUrl: variantUrls.medium,
      largeUrl: variantUrls.large,
      originalUrl: variantUrls.original
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`Failed to process image: ${(error as Error).message}`);
  }
} 