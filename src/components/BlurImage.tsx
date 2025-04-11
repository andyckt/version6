"use client";

import Image from 'next/image'
import { useState, useEffect, useMemo, useRef } from 'react'

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
  dominantColor?: string;
  lazyBoundary?: string;
  rootMargin?: string;
}

// Default tiny blurDataURL for empty images (light gray)
const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg==';

/**
 * BlurImage component for optimized and progressively loaded images
 * 
 * This component provides:
 * - Progressive loading with blur-up effect
 * - Placeholder during loading with dominantColor support
 * - Intersection Observer based lazy loading
 * - Error handling
 * - Responsive sizing via Next.js Image
 * - Automatic WebP/AVIF format serving
 * - Enhanced Cloudinary optimizations
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
  quality = 75,
  dominantColor,
  lazyBoundary = '200px',
  rootMargin = '50px',
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(priority);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check if this is a Cloudinary image URL
  const isCloudinaryUrl = typeof src === 'string' && src.includes('res.cloudinary.com');

  // For Cloudinary URLs, apply enhanced optimization parameters
  const optimizedSrc = useMemo(() => {
    if (!isCloudinaryUrl || !src) return src;
    
    // Only add parameters if they're not already in the URL
    if (src.includes('/upload/')) {
      // Comprehensive optimizations for Cloudinary
      return src.replace('/upload/', '/upload/q_auto:good,f_auto,dpr_auto,c_limit,w_auto/');
    }
    
    return src;
  }, [src, isCloudinaryUrl]);

  // Use color placeholder if available
  const colorPlaceholder = useMemo(() => {
    if (!dominantColor) return blurDataURL;
    
    // Create a simple SVG with the dominant color
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${dominantColor}"/>
      </svg>`
    )}`;
  }, [dominantColor, blurDataURL]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    // Skip if priority is true (eager loading) or already loaded
    if (priority || shouldRender) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger when even a tiny part is visible
      }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [priority, shouldRender, rootMargin]);

  // Initial visibility timeout to prevent layout shifts
  useEffect(() => {
    if (!shouldRender) return;
    
    // Set a small timeout to prevent layout shifts during initial load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [shouldRender]);

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
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${aspectRatio} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={
        dominantColor 
          ? { backgroundColor: dominantColor } 
          : undefined
      }
    >
      {/* Shimmer loading effect */}
      <div className={`
        absolute inset-0 transition-opacity duration-300 ease-in-out
        ${isLoading && shouldRender ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%]"></div>
      </div>
      
      {/* Render image only when needed (priority or in viewport) */}
      {shouldRender && (
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={colorPlaceholder}
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
          lazyBoundary={lazyBoundary}
          // Enable next-gen formats like WebP and AVIF
          // and serve appropriate one based on browser support
          // This is handled automatically by Next.js Image component when configured in next.config.js
        />
      )}
    </div>
  );
} 