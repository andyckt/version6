"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/data/posts';
import { FiChevronLeft, FiChevronRight, FiImage, FiVideo } from 'react-icons/fi';
import BlurImage from './BlurImage';
import LivePhotoPlayer from './LivePhotoPlayer';

interface MediaGalleryProps {
  media: MediaItem[];
  className?: string;
}

export default function MediaGallery({ media, className = '' }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaErrors, setMediaErrors] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentItem = media[currentIndex];
  const totalItems = media.length;
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Set up video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, media.filter(m => m.type === 'video').length);
  }, [media]);
  
  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };
  
  // Handle swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && totalItems > 1) {
      goToNext();
    } else if (isRightSwipe && totalItems > 1) {
      goToPrevious();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);
  
  // Pause all videos when changing slide
  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
  }, [currentIndex]);
  
  // Auto-play video when swiping to it
  useEffect(() => {
    if (currentItem && currentItem.type === 'video') {
      const videoIndex = media.filter(m => m.type === 'video').findIndex(m => m.id === currentItem.id);
      const videoElement = videoRefs.current[videoIndex];
      if (videoElement && !mediaErrors[currentItem.id]) {
        // Small timeout to ensure the DOM has updated
        setTimeout(() => {
          // First try to play with sound
          videoElement.muted = false;
          videoElement.play().catch(err => {
            console.warn('Auto-play with sound failed, trying muted:', err);
            // If autoplay with sound fails, try muted autoplay
            videoElement.muted = true;
            videoElement.play().catch(secondErr => {
              console.warn('Muted auto-play also failed:', secondErr);
            });
          });
        }, 100);
      }
    }
  }, [currentIndex, currentItem, mediaErrors]);
  
  // Handle media loading errors
  const handleMediaError = (itemId: number) => {
    setMediaErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
    console.error(`Error loading media item with ID: ${itemId}`);
  };
  
  if (!media || media.length === 0) {
    return null;
  }
  
  return (
    <div className={`relative w-full ${className}`}>
      {/* Main media display */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden touch-pan-y group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Current media item */}
        {currentItem.type === 'image' ? (
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[450px] bg-black md:bg-white">
            {mediaErrors[currentItem.id] ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:text-gray-500 text-center p-4">
                <FiImage className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm opacity-75">Image could not be loaded</p>
                <p className="text-xs opacity-50 mt-2">{currentItem.url.substring(0, 50)}</p>
              </div>
            ) : (
              <Image
                src={currentItem.url}
                alt="Post media"
                fill
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover md:object-contain"
                onError={() => handleMediaError(currentItem.id)}
                draggable={false}
              />
            )}
          </div>
        ) : currentItem.type === 'livePhoto' ? (
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[450px] bg-black md:bg-white">
            {mediaErrors[currentItem.id] ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:text-gray-500 text-center p-4">
                <FiImage className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm opacity-75">Live Photo could not be loaded</p>
                <p className="text-xs opacity-50 mt-2">{currentItem.url.substring(0, 50)}</p>
              </div>
            ) : (
              <LivePhotoPlayer
                imageUrl={currentItem.url}
                videoUrl={currentItem.livePhotoVideoUrl || ''}
                className="w-full h-full"
                onError={() => {
                  console.error('LivePhotoPlayer reported an error for item:', currentItem.id);
                  handleMediaError(currentItem.id);
                }}
              />
            )}
          </div>
        ) : (
          <div className="relative aspect-video bg-black md:bg-white">
            {mediaErrors[currentItem.id] ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:text-gray-500 text-center p-4">
                <FiVideo className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm opacity-75">Video could not be loaded</p>
                <p className="text-xs opacity-50 mt-2">{currentItem.url.substring(0, 50)}</p>
              </div>
            ) : (
              <video
                ref={el => {
                  const videoIndex = media.filter(m => m.type === 'video').findIndex(m => m.id === currentItem.id);
                  if (videoIndex !== -1) videoRefs.current[videoIndex] = el;
                }}
                src={currentItem.url}
                poster={currentItem.thumbnail}
                controls
                playsInline
                autoPlay
                crossOrigin="anonymous"
                preload="auto"
                className="w-full h-full object-contain"
                onError={() => handleMediaError(currentItem.id)}
              />
            )}
          </div>
        )}
        
        {/* Navigation controls - only show on desktop and on hover */}
        {totalItems > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full hidden md:flex items-center justify-center text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full hidden md:flex items-center justify-center text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Next"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Media counter */}
        {totalItems > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {totalItems}
          </div>
        )}
      </div>
      
      {/* Thumbnails/dots for navigation */}
      {totalItems > 1 && (
        <div className="flex justify-center mt-2 gap-1.5">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 