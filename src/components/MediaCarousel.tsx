"use client";

/**
 * Media Carousel Component
 * 
 * This component displays multiple images and videos in a carousel format
 * with navigation controls, dots indicator, and support for swipe gestures.
 */

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize, FiPlayCircle } from 'react-icons/fi';
import { PostMedia } from '@/types/post';
import Image from 'next/image';

interface MediaCarouselProps {
  media: PostMedia[];
  aspectRatio?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  media,
  aspectRatio = 'aspect-square'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Handle left/right navigation
  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Pause all videos when navigating
  useEffect(() => {
    // Pause all videos
    Object.values(videoRefs.current).forEach(videoEl => {
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
    
    // Reset playing state
    setIsVideoPlaying(false);
    
  }, [currentIndex]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, media.length]);
  
  // Touch handling for swipe
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    let startX: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const threshold = 50;
      
      if (diffX > threshold) {
        goToNext();
      } else if (diffX < -threshold) {
        goToPrevious();
      }
    };
    
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, media.length]);
  
  const toggleVideo = (id: string) => {
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;
    
    if (videoEl.paused) {
      videoEl.play();
      setIsVideoPlaying(true);
    } else {
      videoEl.pause();
      setIsVideoPlaying(false);
    }
  };
  
  // Single image/video display
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className={`relative overflow-hidden rounded-lg ${aspectRatio}`}>
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              ref={(el) => {
                videoRefs.current[item.id] = el;
              }}
              src={item.url}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
              poster={item.thumbnail}
            />
          </div>
        )}
      </div>
    );
  }
  
  // Multiple media display with carousel
  return (
    <div 
      ref={carouselRef}
      className={`relative overflow-hidden rounded-lg ${aspectRatio}`}
    >
      {/* Main media display */}
      <div className="relative w-full h-full">
        {media.map((item, index) => (
          <div 
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => {
                    videoRefs.current[item.id] = el;
                  }}
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls={isVideoPlaying}
                  preload="metadata"
                  poster={item.thumbnail}
                  onClick={() => toggleVideo(item.id)}
                />
                {!isVideoPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
                    onClick={() => toggleVideo(item.id)}
                  >
                    <FiPlayCircle className="w-16 h-16 text-white opacity-80" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button 
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 shadow-md z-20 transition-opacity duration-200 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
            }`}
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 shadow-md z-20 transition-opacity duration-200 ${
              currentIndex === media.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
            }`}
            onClick={goToNext}
            disabled={currentIndex === media.length - 1}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      
      {/* Dots indicator */}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-20">
          <div className="flex space-x-1.5 bg-black bg-opacity-30 rounded-full px-2 py-1.5">
            {media.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-white' : 'bg-gray-400'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Media counter */}
      {media.length > 1 && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1 z-20">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel; 