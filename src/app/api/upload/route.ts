import { NextRequest, NextResponse } from 'next/server';
import { withUpload } from '@/lib/middleware/upload';
import { processUploadedImage } from '@/lib/serverUtils';
import fs from 'fs';

// Configure the API route
export const runtime = 'nodejs'; // Use Node.js runtime
export const dynamic = 'force-dynamic'; // Ensure the route is not cached

/**
 * Simple API endpoint for uploading files
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Use the upload middleware to handle the file upload
    const { files, error } = await withUpload('file', 1)(request);
    
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
    
    const file = files[0];
    console.log('Processing file:', file.originalname);
    
    // Process the image using our simplified server utility
    const processedImage = await processUploadedImage(
      file.path,
      file.originalname,
      file.mimetype
    );
    
    // Clean up the temp file
    fs.unlinkSync(file.path);
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: processedImage
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}