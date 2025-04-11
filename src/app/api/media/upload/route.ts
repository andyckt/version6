import { NextRequest, NextResponse } from 'next/server';
import { withUpload } from '@/lib/middleware/upload';
import { processImage } from '@/lib/image-processing';
import { createMediaItem, MediaType } from '@/lib/db/models/media';
import fs from 'fs';

/**
 * API endpoint for uploading media (images)
 * POST /api/media/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from request headers (for testing purposes)
    // In a real application, this would come from authentication
    const userId = request.headers.get('x-user-id') || '106'; // Default to a test user ID
    
    // Use the upload middleware to handle the file upload
    const { files, fields, error } = await withUpload('media', 5)(request);
    
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
    
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        console.log('Processing file:', file.originalname);
        
        // Check if we have a dominant color for this file from client-side processing
        const dominantColorKey = `color_${i}`;
        const dominantColor = fields[dominantColorKey] as string | undefined;
        
        // Process the image (resize, optimize, etc.)
        const processedImages = await processImage(
          file.path,
          file.originalname,
          file.mimetype,
          undefined,  // Use default Cloudinary setting
          dominantColor // Pass the dominant color if available
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
          // In development, continue without DB
          console.error('Database error:', dbError);
          
          if (process.env.NODE_ENV !== 'production') {
            console.log('Using in-memory records since we are in development mode');
            mediaItem = {
              _id: `temp-${Date.now()}-${i}`,
              userId,
              type: MediaType.IMAGE,
              created: new Date(),
              originalFilename: file.originalname,
              mimeType: file.mimetype,
              width: processedImages.original.width,
              height: processedImages.original.height,
              aspectRatio: processedImages.original.aspectRatio,
              dominantColor: processedImages.original.dominantColor,
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
            // In production, we should fail if the database isn't working
            throw dbError;
          }
        }
        
        // Add to results
        results.push({
          id: mediaItem._id ? mediaItem._id.toString() : `temp-${Date.now()}`,
          url: mediaItem.variants?.medium?.url || '',
          thumbnailUrl: mediaItem.variants?.thumbnail?.url || '',
          width: mediaItem.width || 0,
          height: mediaItem.height || 0,
          aspectRatio: mediaItem.aspectRatio || '1:1',
          originalFilename: mediaItem.originalFilename || '',
          dominantColor: mediaItem.dominantColor,
        });
        
        // Clean up temp file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        
        // Continue with other files
        continue;
      }
    }
    
    // Return success with files info
    return NextResponse.json({
      success: true,
      files: results,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { error: 'File upload failed', details: (error as Error).message },
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