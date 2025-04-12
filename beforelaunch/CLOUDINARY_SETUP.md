# Cloudinary Setup for Vercel Deployment

## Overview

This document outlines how to configure Cloudinary for your photo sharing application when deploying to Vercel.

## Current Configuration

Your application uses Cloudinary for:
- Storing uploaded images in multiple variants (original, grid, thumbnail, medium, large)
- Image optimization and transformation
- Content delivery via CDN

## Vercel Deployment Steps

### 1. Configure Cloudinary Environment Variables

Add your Cloudinary credentials to Vercel:

1. **Open your Vercel dashboard**
2. **Navigate to your project**
3. **Go to Settings → Environment Variables**
4. **Add the following variables**:
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your API key
   - `CLOUDINARY_API_SECRET`: Your API secret
   - `FORCE_CLOUDINARY`: Set to "true" to ensure Cloudinary is used in all environments

### 2. Verify Image Processing Configuration

Ensure your image processing code is properly configured for production:

1. **Check the `shouldUseCloudinary()` function**:
   - Verify it uses the environment variables correctly
   - Ensure it returns true in production environment

2. **Review variants configuration**:
   - You've added a new 200px "grid" variant
   - Ensure all variants are properly defined and working as expected

### 3. Set Up Upload Security

For added security:

1. **Use Signed Uploads**:
   - Consider implementing signed uploads to prevent abuse
   - This requires adding a signature to upload requests

2. **Configure Upload Presets** (optional):
   - Create an upload preset in Cloudinary dashboard for more control
   - Configure allowed formats, max file size, etc.

### 4. Optimize for Production

1. **Enable Auto-Format Delivery**:
   - Use Cloudinary's auto format feature (`f_auto`) in production URLs
   - This serves images in WebP or AVIF format to browsers that support them

2. **Enable Auto-Quality**:
   - Use `q_auto` to optimize quality vs file size dynamically

3. **Configure Transformations**:
   - Consider adding responsive breakpoints for better mobile experience
   - Use Cloudinary's transformation URL parameters for any additional optimization

### 5. Monitoring and Limits

1. **Check Your Plan Limits**:
   - Verify your Cloudinary plan can handle your expected usage
   - Monitor bandwidth and transformations usage

2. **Set Up Usage Alerts**:
   - Configure usage alerts in Cloudinary to avoid unexpected bills
   - Set up monitoring for approaching limits

## Code Updates

### Optimized Cloudinary Configuration

Consider updating your Cloudinary configuration for production:

```javascript
// In src/lib/image-processing/index.ts

// Setup Cloudinary configuration with better error handling
try {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS
  });
  
  // Verify configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary configuration incomplete - check environment variables');
  }
} catch (error) {
  console.error('Failed to configure Cloudinary:', error);
  // Don't throw here - allow the app to start even if Cloudinary config fails
  // It will be caught when trying to use Cloudinary features
}
```

### Error Handling for Uploads

Add robust error handling for Cloudinary uploads:

```javascript
// Example of improved error handling for uploads
try {
  // Upload to Cloudinary with transformation parameters
  const uploadResult = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image' as 'image',
      public_id: `media/${variantName}/${fileBaseName.substring(0, 40)}-${uniqueId}`,
      format: extension,
      quality: config.quality.toString(),
      fetch_format: 'auto',
      dpr: 'auto',
      responsive: true,
      accessibility: 'darkmode',
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
} catch (cloudinaryError) {
  console.error('Cloudinary upload failed:', cloudinaryError);
  
  // Fallback strategy - you can implement a retry or alternate storage
  // For now, we'll rethrow to be handled by the caller
  throw new Error(`Cloudinary upload failed: ${cloudinaryError.message}`);
}
```

## Pre-Launch Cloudinary Checklist

Before launching to production:

- [ ] Cloudinary credentials added to Vercel environment variables
- [ ] Test Cloudinary uploads in Vercel preview deployment
- [ ] Verify all image variants are being created correctly
- [ ] Check image URLs in HTML source are using Cloudinary's CDN
- [ ] Review Cloudinary plan limits vs expected usage
- [ ] Set up usage monitoring if needed
- [ ] Test image upload and rendering across different browsers and devices

## Troubleshooting

### Common Issues

1. **Upload Failures**:
   - Check credentials are correctly set in environment variables
   - Verify network connectivity from Vercel to Cloudinary
   - Check for exceeded plan limits

2. **Missing Images**:
   - Verify cloudinaryId is stored correctly in MongoDB
   - Check for URL construction issues in frontend
   - Ensure image transformation parameters are valid

3. **Slow Image Loading**:
   - Review image optimization settings
   - Check network performance with browser devtools
   - Consider implementing progressive loading techniques

## Future Optimization Ideas

As your application grows:

1. **Custom Domain for Cloudinary URLs**:
   - Set up a CNAME for your Cloudinary URLs (e.g., images.yourdomain.com)
   - Updates URLs to use your branded domain

2. **Advanced Transformations**:
   - Implement face detection for better thumbnail cropping
   - Use AI content-aware cropping for different aspect ratios

3. **Lazy Loading Implementation**:
   - Optimize the user experience with better lazy loading strategies
   - Consider using Intersection Observer API for smoother loading 