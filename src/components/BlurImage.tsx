"use client";

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'

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

  // Check if this is a Cloudinary image URL
  const isCloudinaryUrl = typeof src === 'string' && src.includes('res.cloudinary.com');

  // For Cloudinary URLs, apply automatic optimization parameters if not already present
  const optimizedSrc = useMemo(() => {
    if (!isCloudinaryUrl || !src) return src;
    
    // Only add parameters if they're not already in the URL
    if (src.includes('/upload/')) {
      return src.replace('/upload/', '/upload/q_auto,f_auto,dpr_auto/');
    }
    
    return src;
  }, [src, isCloudinaryUrl]);

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
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        // Enable next-gen formats like WebP and AVIF
        // and serve appropriate one based on browser support
        // This is handled automatically by Next.js Image component when configured in next.config.js
      />
    </div>
  );
} 