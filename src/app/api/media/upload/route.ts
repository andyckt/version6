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
    
    // Process each uploaded file - in parallel with a concurrency limit
    const results = [];
    let totalQualityScores = {
      thumbnail: 0,
      medium: 0,
      large: 0
    };
    let belowThresholdCount = 0;
    let totalProcessed = 0;
    
    // Define a maximum concurrency to avoid overwhelming the server
    const MAX_CONCURRENCY = 3; // Process up to 3 files at once
    
    // Process files in batches to control concurrency
    for (let i = 0; i < files.length; i += MAX_CONCURRENCY) {
      const batch = files.slice(i, i + MAX_CONCURRENCY);
      
      // Process current batch in parallel
      const batchResults = await Promise.all(
        batch.map(async (file) => {
          try {
            console.log('Processing file:', file.originalname);
            
            // Process the image (resize, optimize, etc.)
            const processedImages = await processImage(
              file.path,
              file.originalname,
              file.mimetype
            );
            
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
            
            console.log('Image processed successfully. Variants created:', Object.keys(processedImages.variants).join(', '));
            
            let mediaItem;
            try {
              // Create a database record for the media
              mediaItem = await createMediaItem(processedImages, userId, MediaType.IMAGE);
              
              if (!mediaItem || !mediaItem._id) {
                throw new Error('Failed to create media item: No ID returned');
              }
              
              console.log(`Media item created with ID: ${mediaItem._id}`);
              
              // Return the media item information for the response
              return {
                id: mediaItem._id.toString(),
                url: processedImages.variants.large.url, // Use large as the default URL
                thumbnailUrl: processedImages.variants.thumbnail.url,
                gridUrl: processedImages.variants.grid.url,
                mediumUrl: processedImages.variants.medium.url,
                largeUrl: processedImages.variants.large.url,
                width: processedImages.variants.large.width,
                height: processedImages.variants.large.height,
                aspectRatio: processedImages.variants.large.aspectRatio,
                originalFilename: file.originalname
              };
            } catch (dbError) {
              console.error('Failed to create media database record:', dbError);
              throw new Error('Database error: Failed to create media record');
            }
          } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
            // Return an error result for this file
            return {
              error: `Failed to process ${file.originalname}: ${(error as Error).message}`
            };
          } finally {
            // Clean up the temp file
            try {
              await fs.promises.unlink(file.path);
              console.log(`Cleaned up temp file: ${file.path}`);
            } catch (unlinkError) {
              console.warn(`Failed to clean up temp file ${file.path}:`, unlinkError);
            }
          }
        })
      );
      
      // Add successful results to our array, filter out errors
      const successfulResults = batchResults.filter(result => !result.error);
      results.push(...successfulResults);
      
      // Log any errors
      batchResults.filter(result => result.error).forEach(result => {
        console.error(result.error);
      });
    }
    
    // Calculate average quality scores if any images were processed
    try {
      // Get existing analytics from localStorage (or create new)
      const analyticsData = typeof localStorage !== 'undefined' && localStorage.getItem('mediaAnalytics')
        ? JSON.parse(localStorage.getItem('mediaAnalytics') || '{}')
        : { 
            highResViews: 0, 
            totalViews: 0, 
            uploadQualityChoices: { standard: 0, high: 0 },
            qualityMetrics: {
              averageSSIM: {
                thumbnail: 0,
                medium: 0,
                large: 0
              },
              belowThresholdCount: 0,
              totalProcessed: 0
            }
          };
      
      // Initialize quality metrics if not present
      if (!analyticsData.qualityMetrics) {
        analyticsData.qualityMetrics = {
          averageSSIM: {
            thumbnail: 0,
            medium: 0,
            large: 0
          },
          belowThresholdCount: 0,
          totalProcessed: 0
        };
      }
      
      // Update metrics
      analyticsData.qualityMetrics.totalProcessed += totalProcessed;
      analyticsData.qualityMetrics.belowThresholdCount += belowThresholdCount;
      
      if (totalProcessed > 0) {
        // Update average SSIM scores - now using estimated values for Cloudinary
        analyticsData.qualityMetrics.averageSSIM.thumbnail = 
          (analyticsData.qualityMetrics.averageSSIM.thumbnail + (totalQualityScores.thumbnail / totalProcessed)) / 2;
        analyticsData.qualityMetrics.averageSSIM.medium = 
          (analyticsData.qualityMetrics.averageSSIM.medium + (totalQualityScores.medium / totalProcessed)) / 2;
        analyticsData.qualityMetrics.averageSSIM.large = 
          (analyticsData.qualityMetrics.averageSSIM.large + (totalQualityScores.large / totalProcessed)) / 2;
      }
      
      // Save updated analytics
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mediaAnalytics', JSON.stringify(analyticsData));
      }
    } catch (analyticsError) {
      // Non-critical error, just log it
      console.warn('Failed to update media analytics:', analyticsError);
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