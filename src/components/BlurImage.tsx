"use client";

import Image from 'next/image'
import { useState } from 'react'

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
}

export default function BlurImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-square',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onError
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
      <div className={`relative overflow-hidden ${aspectRatio} bg-gray-800 flex items-center justify-center`}>
        <span className="text-white text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} bg-gray-100`}>
      <div className={`
        absolute inset-0 transition-opacity duration-500 ease-in-out
        ${isLoading ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%]"></div>
      </div>
      
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`
          transition-opacity duration-500 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${className}
        `}
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
} 