/**
 * Image utility functions for working with Cloudinary transformations
 */

import { ImageVariantType, IMAGE_VARIANTS } from './image-processing';

/**
 * Get a Cloudinary transformation URL for a specific variant
 * @param baseUrl The base Cloudinary URL (without transformations)
 * @param variantType The variant type (grid, thumbnail, medium, large)
 * @returns The transformed URL
 */
export function getVariantUrl(baseUrl: string, variantType: ImageVariantType): string {
  // If the URL already contains transformation parameters, return as is
  if (baseUrl.includes('/w_') || baseUrl.includes('/upload/v') && baseUrl.includes('/f_auto')) {
    return baseUrl;
  }
  
  // Get the variant configuration
  const config = IMAGE_VARIANTS[variantType];
  
  // Remove any file extension from the base URL
  const urlWithoutExtension = baseUrl.replace(/\.[^/.]+$/, '');
  
  // Construct the transformation URL
  return `${urlWithoutExtension}/w_${config.width},q_${config.quality},f_auto`;
}

/**
 * Get a responsive image URL for different device pixel ratios
 * @param baseUrl The base Cloudinary URL
 * @param variantType The base variant to start with
 * @param dpr The device pixel ratio (1, 2, 3)
 * @returns The responsive URL
 */
export function getResponsiveUrl(baseUrl: string, variantType: ImageVariantType, dpr: number = 1): string {
  // If not a Cloudinary URL, return as is
  if (!baseUrl.includes('cloudinary.com')) {
    return baseUrl;
  }
  
  // Get variant config
  const config = IMAGE_VARIANTS[variantType];
  
  // Remove any file extension from the base URL
  const urlWithoutExtension = baseUrl.replace(/\.[^/.]+$/, '');
  
  // Calculate responsive width based on DPR
  const responsiveWidth = Math.round(config.width * dpr);
  
  // Construct the responsive URL
  return `${urlWithoutExtension}/w_${responsiveWidth},q_${config.quality},dpr_${dpr},f_auto`;
}

/**
 * Format image srcset attribute for responsive images
 * @param baseUrl The base Cloudinary URL
 * @param variantType The variant type to create srcset for
 * @returns A srcset string for use in <img> elements
 */
export function formatSrcSet(baseUrl: string, variantType: ImageVariantType): string {
  // If not a Cloudinary URL, return empty srcset
  if (!baseUrl.includes('cloudinary.com')) {
    return '';
  }
  
  // Create srcset with multiple DPRs
  return [
    `${getResponsiveUrl(baseUrl, variantType, 1)} 1x`,
    `${getResponsiveUrl(baseUrl, variantType, 2)} 2x`,
    `${getResponsiveUrl(baseUrl, variantType, 3)} 3x`
  ].join(', ');
}

/**
 * Get the appropriate image URL for a specific usage context
 * @param mediaItem The media item from the database
 * @param context The usage context (grid, post, zoom, etc.)
 * @returns The best URL for the context
 */
export function getContextualImageUrl(mediaItem: any, context: 'grid' | 'thumbnail' | 'post' | 'zoom'): string {
  // Handle legacy media items that don't have variants
  if (!mediaItem?.variants) {
    return mediaItem?.url || '';
  }
  
  // Map context to the appropriate variant
  const variantMapping = {
    grid: 'grid',
    thumbnail: 'thumbnail',
    post: 'medium',
    zoom: 'large'
  } as const;
  
  const variantType = variantMapping[context];
  
  // For newer items with Cloudinary transformations, the main URL is the base URL
  // and we need to construct the variant URL
  if (mediaItem.variants[variantType]?.url) {
    return mediaItem.variants[variantType].url;
  }
  
  // Fallback to constructing from the base URL
  if (mediaItem.url && mediaItem.url.includes('cloudinary.com')) {
    return getVariantUrl(mediaItem.url, variantType);
  }
  
  // Final fallback
  return mediaItem.url || '';
}