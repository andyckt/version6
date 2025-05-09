// Cloudinary configuration utility

/**
 * Checks if Cloudinary is properly configured in the environment
 */
export function isCloudinaryConfigured(): boolean {
  const hasConfig = 
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
    process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!hasConfig) {
    // Log only in development to avoid cluttering production logs
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Cloudinary configuration missing. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.'
      );
    }
    return false;
  }
  
  return true;
}

/**
 * Gets the Cloudinary cloud name from environment variables
 * Made public for client-side access
 */
export function getCloudinaryCloudName(): string {
  // Check for the public version first (for client components)
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
         process.env.CLOUDINARY_CLOUD_NAME || 
         '';
}

/**
 * Validates a Cloudinary URL to ensure it's correctly formed
 */
export function validateCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  
  // Basic validation for Cloudinary URLs
  const validCloudinaryPattern = /^https?:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload/;
  return validCloudinaryPattern.test(url);
}

/**
 * Fixes malformed Cloudinary URLs if possible
 */
export function fixCloudinaryUrl(url: string): string {
  if (!url) return url;
  
  // If not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  try {
    // Get the cloud name from environment or URL
    const envCloudName = getCloudinaryCloudName();
    
    // If URL doesn't match expected cloud name, try to fix it
    if (envCloudName && !url.includes(`res.cloudinary.com/${envCloudName}`)) {
      // Extract current cloud name from URL (if possible)
      const cloudNameMatch = url.match(/res\.cloudinary\.com\/([^\/]+)\//);
      if (cloudNameMatch && cloudNameMatch[1]) {
        const currentCloudName = cloudNameMatch[1];
        // Replace incorrect cloud name with the one from environment
        return url.replace(
          `res.cloudinary.com/${currentCloudName}`, 
          `res.cloudinary.com/${envCloudName}`
        );
      }
    }
    
    return url;
  } catch (error) {
    console.error('Error fixing Cloudinary URL:', error);
    return url;
  }
} 