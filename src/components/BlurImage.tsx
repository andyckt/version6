"use client";

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { validateCloudinaryUrl, fixCloudinaryUrl, getCloudinaryCloudName } from '@/lib/cloudinary-config';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
}

// Default tiny blurDataURL for empty images (light gray)
const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg==';

/**
 * BlurImage component for optimized and progressively loaded images
 * 
 * This component provides:
 * - Progressive loading with blur-up effect
 * - Placeholder during loading
 * - Error handling
 * - Responsive sizing via Next.js Image
 * - Automatic WebP/AVIF format serving
 */
export default function BlurImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-square',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onError,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  quality = 75
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Validate if the src is a valid URL string
  const isValidUrl = typeof src === 'string' && src.length > 0 && (
    src.startsWith('http://') || 
    src.startsWith('https://') || 
    src.startsWith('/')
  );

  // If src is invalid, set error state immediately
  useEffect(() => {
    if (!isValidUrl) {
      setHasError(true);
      setIsLoading(false);
      setDebugInfo('Invalid image URL format');
    }
  }, [isValidUrl, src]);

  // Check if this is a Cloudinary image URL
  const isCloudinaryUrl = typeof src === 'string' && src.includes('res.cloudinary.com');

  // For Cloudinary URLs, fix potential issues and apply optimization parameters
  const optimizedSrc = useMemo(() => {
    if (!isValidUrl) return '';
    if (!isCloudinaryUrl || !src) return src;
    
    try {
      // Fix potentially malformed Cloudinary URL
      let fixedUrl = fixCloudinaryUrl(src);
      
      // Cloud name for debugging
      const cloudName = getCloudinaryCloudName();
      
      // Only add parameters if they're not already in the URL
      if (fixedUrl.includes('/upload/') && !fixedUrl.includes('q_auto')) {
        // Handle different image variants
        if (fixedUrl.includes('w_800') || fixedUrl.includes('medium')) {
          // For medium images in content grid, use good quality but with loading optimizations
          fixedUrl = fixedUrl.replace('/upload/', '/upload/q_auto:good,f_auto,dpr_auto,c_limit/');
        } else if (fixedUrl.includes('w_300') || fixedUrl.includes('thumbnail')) {
          fixedUrl = fixedUrl.replace('/upload/', '/upload/q_auto:good,f_auto,dpr_auto/');
        } else {
          fixedUrl = fixedUrl.replace('/upload/', '/upload/q_auto,f_auto,dpr_auto/');
        }
      }
      
      // Validation - if cloudName is found but not in the URL, log an issue
      if (cloudName && !fixedUrl.includes(`res.cloudinary.com/${cloudName}`)) {
        console.warn(`Cloudinary URL uses different cloud name than configured: ${fixedUrl}`);
        setDebugInfo(`Cloudinary cloud name mismatch: expected ${cloudName}`);
      }
      
      return fixedUrl;
    } catch (err) {
      console.error('Error optimizing Cloudinary URL:', err, src);
      setDebugInfo(`Cloudinary URL error: ${err}`);
      return src; // Return original src on error
    }
  }, [src, isCloudinaryUrl, isValidUrl]);

  useEffect(() => {
    // Set a small timeout to prevent layout shifts during initial load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // Set debug info with image URL to help diagnose the issue
    setDebugInfo(`Failed to load image: ${src?.substring(0, 100)}${isCloudinaryUrl ? ' (Cloudinary)' : ''}`);
    console.error('Image failed to load:', src);
    if (onError) onError();
  };

  // Determine the object-fit style
  const objectFit = className.includes('object-contain') 
    ? 'contain' 
    : className.includes('object-cover') 
      ? 'cover' 
      : 'cover'; // Default to cover

  if (hasError) {
    return (
      <div className={`relative overflow-hidden ${aspectRatio} bg-gray-100 flex items-center justify-center flex-col`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <span className="text-xs text-red-400 mt-1 px-2 text-center">{debugInfo}</span>
        )}
      </div>
    );
  }

  // If source is invalid, avoid rendering Image component at all
  if (!isValidUrl) {
    return (
      <div className={`relative overflow-hidden ${aspectRatio} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {/* Shimmer loading effect */}
      <div className={`
        absolute inset-0 transition-opacity duration-300 ease-in-out
        ${isLoading ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%]"></div>
      </div>
      
      {/* Actual image */}
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        quality={quality}
        className={`
          transition-all duration-300 ease-in-out will-change-transform
          ${isLoading ? 'scale-110 blur-2xl' : 'scale-100 blur-0'}
          ${className}
        `}
        style={{ objectFit }}
        onLoad={() => {
          setIsLoading(false);
          // Clear any debug info on successful load
          setDebugInfo(null);
        }}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        // Enable next-gen formats like WebP and AVIF
        // and serve appropriate one based on browser support
        // This is handled automatically by Next.js Image component when configured in next.config.js
      />
    </div>
  );
} 