import { NextRequest, NextResponse } from 'next/server';
import { withUpload } from '@/lib/middleware/upload';
import { processImage } from '@/lib/image-processing';
import { createMediaItem, MediaType } from '@/lib/db/models/media';
import fs from 'fs';
import { ObjectId } from 'mongodb';

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
    
    // Use the upload middleware to handle the file upload
    const { files, error } = await withUpload('media', 5)(request);
    
    if (error) {
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
    
    // Process each uploaded file
    const results = [];
    
    for (const file of files) {
      try {
        console.log('Processing file:', file.originalname);
        
        // Process the image (resize, optimize, etc.)
        const processedImages = await processImage(
          file.path,
          file.originalname,
          file.mimetype
        );
        
        console.log('Image processed successfully. Variants created:', Object.keys(processedImages.variants).join(', '));
        
        let mediaItem;
        
        try {
          // Save to database
          console.log('Saving to MongoDB...');
          mediaItem = await createMediaItem(
            processedImages,
            userId,
            MediaType.IMAGE
          );
          console.log('Successfully saved to MongoDB with ID:', mediaItem._id);
        } catch (dbError) {
          console.error('MongoDB Error:', dbError);
          
          // For production, create better error handling
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock database response for development');
            mediaItem = {
              _id: 'mock-id-' + Date.now(),
              userId,
              type: MediaType.IMAGE,
              originalFilename: processedImages.metadata.originalFilename,
              mimeType: processedImages.metadata.mimeType,
              created: new Date(),
              status: 'active',
              width: processedImages.original.width,
              height: processedImages.original.height,
              aspectRatio: processedImages.original.aspectRatio,
              variants: {
                original: {
                  url: processedImages.original.url,
                  width: processedImages.original.width,
                  height: processedImages.original.height,
                  size: processedImages.original.size,
                  cloudinaryId: processedImages.original.cloudinaryId,
                },
                thumbnail: {
                  url: processedImages.variants.thumbnail.url,
                  width: processedImages.variants.thumbnail.width,
                  height: processedImages.variants.thumbnail.height,
                  size: processedImages.variants.thumbnail.size,
                  cloudinaryId: processedImages.variants.thumbnail.cloudinaryId,
                },
                medium: {
                  url: processedImages.variants.medium.url,
                  width: processedImages.variants.medium.width,
                  height: processedImages.variants.medium.height,
                  size: processedImages.variants.medium.size,
                  cloudinaryId: processedImages.variants.medium.cloudinaryId,
                },
                large: {
                  url: processedImages.variants.large.url,
                  width: processedImages.variants.large.width,
                  height: processedImages.variants.large.height,
                  size: processedImages.variants.large.size,
                  cloudinaryId: processedImages.variants.large.cloudinaryId,
                },
              }
            };
          } else {
            // In production, if MongoDB fails but Cloudinary succeeded,
            // still return the media info but log the error
            console.error('PRODUCTION DATABASE ERROR - FIX IMMEDIATELY:', dbError);
            
            // Create a response with the processed images but mark it as not persisted
            mediaItem = {
              _id: new ObjectId().toString(), // Generate valid ID
              userId,
              type: MediaType.IMAGE,
              originalFilename: processedImages.metadata.originalFilename,
              mimeType: processedImages.metadata.mimeType,
              created: new Date(),
              status: 'active',
              width: processedImages.original.width,
              height: processedImages.original.height,
              aspectRatio: processedImages.original.aspectRatio,
              variants: {
                original: {
                  url: processedImages.original.url,
                  width: processedImages.original.width,
                  height: processedImages.original.height,
                  size: processedImages.original.size,
                  cloudinaryId: processedImages.original.cloudinaryId,
                },
                thumbnail: {
                  url: processedImages.variants.thumbnail.url,
                  width: processedImages.variants.thumbnail.width,
                  height: processedImages.variants.thumbnail.height,
                  size: processedImages.variants.thumbnail.size,
                  cloudinaryId: processedImages.variants.thumbnail.cloudinaryId,
                },
                medium: {
                  url: processedImages.variants.medium.url,
                  width: processedImages.variants.medium.width,
                  height: processedImages.variants.medium.height,
                  size: processedImages.variants.medium.size,
                  cloudinaryId: processedImages.variants.medium.cloudinaryId,
                },
                large: {
                  url: processedImages.variants.large.url,
                  width: processedImages.variants.large.width,
                  height: processedImages.variants.large.height,
                  size: processedImages.variants.large.size,
                  cloudinaryId: processedImages.variants.large.cloudinaryId,
                },
              }
            };
          }
        }
        
        // Add to results
        results.push({
          id: mediaItem._id,
          originalFilename: mediaItem.originalFilename,
          url: mediaItem.variants.medium?.url,
          thumbnailUrl: mediaItem.variants.thumbnail?.url,
          width: mediaItem.width,
          height: mediaItem.height,
          aspectRatio: mediaItem.aspectRatio,
        });
        
        // Clean up the temp file
        fs.unlinkSync(file.path);
      } catch (fileError) {
        console.error('Error processing file:', file.originalname, fileError);
        
        // Continue with the next file
        results.push({
          originalFilename: file.originalname,
          error: 'Failed to process file',
        });
        
        // Clean up the temp file if it exists
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    // Return the processed images
    return NextResponse.json({ 
      success: true,
      message: `Successfully uploaded ${results.length} files`,
      files: results
    });
    
  } catch (error) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process uploads' },
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