"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

interface LivePhotoPlayerProps {
  imageUrl: string;
  videoUrl: string;
  className?: string;
  onError?: () => void;
}

export default function LivePhotoPlayer({ 
  imageUrl, 
  videoUrl, 
  className = '',
  onError
}: LivePhotoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle press and hold to play
  const handlePointerDown = () => {
    if (hasError) return;
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => {
        console.warn('Failed to play live photo video:', err);
        setHasError(true);
        onError?.();
      });
    }
  };
  
  const handlePointerUp = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);
  
  // Log mounting for debugging
  useEffect(() => {
    console.log('LivePhotoPlayer mounted with:', { imageUrl, videoUrl });
    
    // Preload the video
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    return () => console.log('LivePhotoPlayer unmounted');
  }, [imageUrl, videoUrl]);
  
  // Error display fallback
  if (hasError) {
    return (
      <div className={`relative bg-black flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center text-white text-center p-4">
          <FiImage className="w-12 h-12 mb-2 opacity-50" />
          <p className="text-sm opacity-75">Live Photo could not be played</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative ${className} select-none touch-none`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Static image */}
      <Image
        src={imageUrl}
        alt="Live Photo"
        fill
        className="object-cover md:object-contain"
        onError={() => {
          console.error('Live Photo image failed to load:', imageUrl);
          setHasError(true);
          onError?.();
        }}
        sizes="(max-width: 768px) 100vw, 600px"
        priority
        unoptimized={true}
      />
      
      {/* Video element - only visible when playing */}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`absolute inset-0 w-full h-full object-cover md:object-contain ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        preload="auto"
        onError={() => {
          console.error('Live Photo video failed to load:', videoUrl);
          setHasError(true);
          onError?.();
        }}
      />
      
      {/* LIVE indicator */}
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        LIVE
      </div>
    </div>
  );
} 