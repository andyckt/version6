"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';

export type AvatarSize = 'micro' | 'media';

interface AvatarProps {
  profileImage?: string | { micro: string; media: string; original?: string };
  size?: AvatarSize;
  className?: string;
  alt?: string;
}

export default function Avatar({ 
  profileImage, 
  size = 'micro', 
  className = '',
  alt = 'User avatar'
}: AvatarProps) {
  const [error, setError] = useState(false);
  
  // Get the appropriate URL based on size and image format
  const getImageUrl = (): string | null => {
    if (!profileImage) return null;
    
    if (typeof profileImage === 'string') {
      // Legacy format: just a string URL
      return profileImage;
    } else {
      // New format: object with micro and media variants
      return profileImage[size];
    }
  };
  
  const imageUrl = getImageUrl();
  
  // Determine dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'micro':
        return 40;
      case 'media':
        return 300;
      default:
        return 40;
    }
  };
  
  const dimension = getDimensions();
  
  // If no image or error loading, show placeholder
  if (!imageUrl || error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 rounded-full overflow-hidden ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <FiUser size={dimension * 0.6} className="text-gray-400" />
      </div>
    );
  }
  
  // Otherwise, show the image
  return (
    <div 
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width={dimension}
        height={dimension}
        className="rounded-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
} 