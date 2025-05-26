import { NextRequest, NextResponse } from 'next/server';
import { withUpload } from '@/lib/middleware/upload';
import { processImage } from '@/lib/image-processing';
import { createMediaItem, MediaType } from '@/lib/db/models/media';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface FileMetadata {
  originalname: string;
  filename: string;
  mediaId: string;
}

/**
 * API endpoint for uploading media (images)
 * POST /api/media/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from request headers or generate a valid ObjectId
    // In a real application, this would come from authentication
    let userId;
    const userIdHeader = request.headers.get('x-user-id');
    
    if (userIdHeader && /^[0-9a-fA-F]{24}$/.test(userIdHeader)) {
      // If a valid 24-character hex string is provided, use it
      userId = userIdHeader;
    } else {
      // Generate a valid MongoDB ObjectId
      userId = new ObjectId().toString();
    }
    
    // Check if this is a profile image upload
    const formData = await request.formData();
    const type = formData.get('type');
    const isProfileUpload = type === 'profile';
    
    // If profile upload, handle it differently
    if (isProfileUpload) {
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }
      
      try {
        // Create a buffer from the file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a temporary file to upload to Cloudinary
        const tempPath = `/tmp/upload-${Date.now()}-${file.name}`;
        fs.writeFileSync(tempPath, buffer);
        
        // Create a unique public_id for Cloudinary
        const timestamp = new Date().getTime();
        const publicId = `profiles/${userId}-${timestamp}`;
        
        // Upload to Cloudinary with eager transformations for both variants
        const uploadResult = await cloudinary.v2.uploader.upload(tempPath, {
          public_id: publicId,
          eager: [
            // Micro variant (40x40px) for small avatars, face detection
            { 
              width: 40, 
              height: 40, 
              crop: 'fill', 
              gravity: 'face', 
              quality: 'auto:good' 
            },
            // Media variant (300x300px) for profile pages, face detection
            { 
              width: 300, 
              height: 300, 
              crop: 'fill', 
              gravity: 'face', 
              quality: 'auto' 
            }
          ],
          eager_async: false // Process immediately since it's just two variants
        });
        
        // Clean up temp file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        
        // Return URLs for both variants
        return NextResponse.json({
          success: true,
          micro: cloudinary.v2.url(uploadResult.public_id, {
            width: 40, 
            height: 40, 
            crop: 'fill', 
            gravity: 'face',
            quality: 'auto:good', 
            fetch_format: 'auto'
          }),
          media: cloudinary.v2.url(uploadResult.public_id, {
            width: 300, 
            height: 300, 
            crop: 'fill', 
            gravity: 'face',
            quality: 'auto', 
            fetch_format: 'auto'
          }),
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });
        
      } catch (error) {
        console.error('Profile image upload error:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to upload profile image' },
          { status: 500 }
        );
      }
    }
    
    // If not a profile upload, handle as a regular media upload with the existing code
    // Use the upload middleware to handle the file upload
    const { files, error } = await withUpload('media', 10)(request);
    
    if (error) {
      console.error('Upload error from middleware:', error);
      return NextResponse.json(
        { error },
        { status: 400 }
      );
    }
    
    if (!files.length) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    // Log received files for debugging
    console.log(`Received ${files.length} files for processing:`);
    files.forEach((file, index) => {
      console.log(`[${index + 1}] ${file.originalname} (${file.size} bytes)`);
    });
    
    // Track file metadata to ensure we don't lose original filenames
    const fileMetadata: FileMetadata[] = [];
    
    // Process each uploaded file
    const results = [];
    let totalQualityScores = {
      thumbnail: 0,
      medium: 0,
      large: 0
    };
    let belowThresholdCount = 0;
    let totalProcessed = 0;
    
    try {
      // Process files in sequence to avoid issues
      console.log(`Starting sequential processing of ${files.length} files at ${new Date().toISOString()}`);
      
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const startTime = Date.now();
        const fileId = `file-${index+1}`;
        
        try {
          console.log(`[${fileId}] Starting processing for ${file.originalname} at ${new Date().toISOString()}`);
          
          // Store metadata about this file
          const metadata: FileMetadata = {
            originalname: file.originalname,
            filename: file.filename,
            mediaId: ''
          };
          
          // Process the image (resize, optimize, etc.)
          console.log(`[${fileId}] Calling Sharp processing for ${file.originalname}`);
          const processedImages = await processImage(
            file.path,
            file.originalname,
            file.mimetype
          );
          
          console.log(`[${fileId}] Sharp processing completed in ${Date.now() - startTime}ms`);
          
          // Track quality metrics for analytics
          totalProcessed++;
          
          // Using large variant quality as the reference
          Object.entries(processedImages.variants).forEach(([variantName, variant]) => {
            if (['thumbnail', 'medium', 'large'].includes(variantName)) {
              const typedVariantName = variantName as keyof typeof totalQualityScores;
              // Set a default quality score since we're not using SSIM anymore
              totalQualityScores[typedVariantName] += 0.9; // Assume good quality with Cloudinary
            }
          });
          
          console.log(`[${fileId}] Image processed successfully. Variants created: ${Object.keys(processedImages.variants).join(', ')}`);
          
          let mediaItem;
          
          // Create a media entry in the database
          mediaItem = await createMediaItem(processedImages, userId, MediaType.IMAGE);
          
          // Store the media ID in our metadata tracking
          if (mediaItem && mediaItem._id) {
            metadata.mediaId = mediaItem._id.toString();
            fileMetadata.push(metadata);
            console.log(`[${fileId}] Media item created in database with ID: ${metadata.mediaId}`);
          }
          
          // Return the processed result
          const result = {
            id: mediaItem?._id?.toString() || 'temp-' + new ObjectId().toString(),
            url: processedImages.variants.large.url,
            thumbnailUrl: processedImages.variants.thumbnail.url,
            mediumUrl: processedImages.variants.medium.url,
            largeUrl: processedImages.variants.large.url,
            width: processedImages.variants.large.width,
            height: processedImages.variants.large.height,
            aspectRatio: processedImages.variants.large.aspectRatio,
            originalFilename: file.originalname
          };
          
          results.push(result);
          console.log(`[${fileId}] Successfully added result for ${file.originalname}`);
          
        } catch (error) {
          console.error(`[${fileId}] Error processing file ${file.originalname}:`, error);
        } finally {
          // Clean up temporary files
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
              console.log(`[${fileId}] Cleaned up temporary file: ${file.path}`);
            }
          } catch (e) {
            console.error(`[${fileId}] Error cleaning up temp file: ${file.path}`, e);
          }
        }
      }
      
      // Log final results for debugging
      console.log(`Upload complete. Processed ${results.length} files.`);
      console.log(`File metadata tracking:`, fileMetadata);
      console.log(`Result media IDs:`, results.map(r => r.id));
      
      // Check for any integrity issues
      const filenameCheck = new Set<string>();
      const duplicateFilenames: string[] = [];
      
      fileMetadata.forEach(meta => {
        if (filenameCheck.has(meta.originalname)) {
          duplicateFilenames.push(meta.originalname);
        } else {
          filenameCheck.add(meta.originalname);
        }
      });
      
      if (duplicateFilenames.length > 0) {
        console.warn(`⚠️ Detected duplicate filenames: ${duplicateFilenames.join(', ')}`);
      }
      
      return NextResponse.json({
        success: true,
        media: results,
        processingStats: {
          totalProcessed,
          thumbnailQuality: totalQualityScores.thumbnail / totalProcessed,
          mediumQuality: totalQualityScores.medium / totalProcessed,
          largeQuality: totalQualityScores.large / totalProcessed,
          belowThresholdCount
        },
        metadata: fileMetadata
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process images' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload images' },
      { status: 500 }
    );
  }
}

/**
 * Define allowed HTTP methods
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    },
  });
} 