"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MediaItem } from '@/data/posts';
import { FiChevronLeft, FiChevronRight, FiImage, FiVideo, FiZoomIn, FiMaximize2 } from 'react-icons/fi';
import BlurImage from './BlurImage';

// Extend the MediaItem interface to include variants
interface MediaVariant {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  cloudinaryId?: string;
}

interface ExtendedMediaItem extends MediaItem {
  variants?: {
    grid?: MediaVariant;
    thumbnail?: MediaVariant;
    medium?: MediaVariant;
    large?: MediaVariant;
  };
}

interface MediaGalleryProps {
  media: ExtendedMediaItem[];
  className?: string;
}

export default function MediaGallery({ media, className = '' }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaErrors, setMediaErrors] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showHighRes, setShowHighRes] = useState(false);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [isHighResOpen, setIsHighResOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const highResRef = useRef<HTMLDivElement>(null);
  
  const currentItem = media[currentIndex];
  const totalItems = media.length;
  
  // Detect if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on initial load
    checkMobile();
    
    // Re-check on window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Helper function to get the appropriate variant URL based on context
  const getVariantUrl = (item: ExtendedMediaItem, variant: 'grid' | 'thumbnail' | 'medium' | 'large' = 'medium') => {
    if (!item) return '';
    
    // For modern media objects with variants structure
    if (item.variants && item.variants[variant] && item.variants[variant]?.url) {
      return item.variants[variant]!.url;
    }
    
    // For legacy URLs that include variant pattern
    if (typeof item.url === 'string') {
      // Check for variant pattern in URL
      const variantPattern = /\/(grid|thumbnail|medium|large)\//;
      if (variantPattern.test(item.url)) {
        return item.url.replace(variantPattern, `/${variant}/`);
      }
      
      // For older URLs with /upload/ pattern (like Cloudinary)
      if (item.url.includes('/upload/')) {
        // Insert variant before the upload path
        return item.url.replace('/upload/', `/upload/${variant}/`);
      }
    }
    
    // Fallback to original URL
    return item.url;
  };
  
  // Progressive loading - Start with thumbnail, then load medium quality
  useEffect(() => {
    if (currentItem && currentItem.type === 'image') {
      // Reset loading state when changing images
      setInitialLoading(true);
      
      // Preload the medium quality version
      const img = new globalThis.Image();
      img.src = getVariantUrl(currentItem, 'medium');
      img.onload = () => {
        setInitialLoading(false);
      };
    } else {
      setInitialLoading(false);
    }
  }, [currentIndex, currentItem]);
  
  // Track high-resolution view usage for analytics
  const logHighResView = () => {
    try {
      // Get existing analytics or initialize empty object
      const analyticsData = localStorage.getItem('mediaAnalytics') 
        ? JSON.parse(localStorage.getItem('mediaAnalytics') || '{}')
        : { highResViews: 0, totalViews: 0, uploadQualityChoices: { standard: 0, high: 0 } };
      
      // Increment high-res views counter
      analyticsData.highResViews = (analyticsData.highResViews || 0) + 1;
      analyticsData.totalViews = (analyticsData.totalViews || 0) + 1;
      
      // Store analytics data
      localStorage.setItem('mediaAnalytics', JSON.stringify(analyticsData));
      
      // If in production, you could send this to your analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        // Example: sendAnalyticsEvent('media_highres_view', { mediaId: currentItem.id });
      }
    } catch (error) {
      console.error('Failed to log analytics:', error);
    }
  };
  
  // Toggle high-resolution view
  const toggleHighResolution = () => {
    if (!isHighResOpen) {
      setShowHighRes(true);
      setIsHighResOpen(true);
      logHighResView();
    } else {
      setIsHighResOpen(false);
      // Keep high-res image loaded in case user toggles back
    }
  };
  
  // Close high-res view if clicking outside the image
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isHighResOpen && highResRef.current && !highResRef.current.contains(event.target as Node)) {
        setIsHighResOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHighResOpen]);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Set up video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, media.filter(m => m.type === 'video').length);
  }, [media]);
  
  // Preload adjacent images for smoother navigation
  useEffect(() => {
    // Determine which indices to preload (current ± 1, wrapped around the array)
    const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    const nextIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    
    // Only preload images, not videos
    [prevIndex, nextIndex].forEach(index => {
      const item = media[index];
      if (item && item.type === 'image') {
        const img = new globalThis.Image();
        img.src = getVariantUrl(item, 'thumbnail'); // Start with thumbnail to be quick
        
        // After thumbnail is loaded, preload medium version
        img.onload = () => {
          const mediumImg = new globalThis.Image();
          mediumImg.src = getVariantUrl(item, 'medium');
        };
      }
    });
  }, [currentIndex, media, totalItems]);
  
  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    setShowHighRes(false);
    setIsHighResOpen(false);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    setShowHighRes(false);
    setIsHighResOpen(false);
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
      } else if (e.key === 'Escape' && isHighResOpen) {
        setIsHighResOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isHighResOpen]);
  
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
              <>
                {/* Progressive loading - show thumbnail first, then medium */}
                <Image
                  src={initialLoading 
                    ? getVariantUrl(currentItem, 'thumbnail') 
                    : getVariantUrl(currentItem, 'medium')}
                  alt="Post media"
                  fill
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className={`object-cover md:object-contain transition-opacity duration-300 ${
                    initialLoading ? 'opacity-90 scale-[1.02] blur-[2px]' : 'opacity-100 scale-100 blur-0'
                  }`}
                  onError={() => handleMediaError(currentItem.id)}
                  draggable={false}
                />
              </>
            )}
            
            {/* High resolution view button */}
            <button
              onClick={toggleHighResolution}
              className="absolute bottom-3 right-3 bg-black/70 text-white rounded-full p-2 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                hover:bg-black/90 z-10"
              aria-label="View high resolution"
              title="View high resolution"
            >
              <FiZoomIn className="w-5 h-5" />
            </button>
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
                src={getVariantUrl(currentItem, isMobile ? 'medium' : 'large')}
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
      
      {/* High-resolution modal */}
      {showHighRes && currentItem.type === 'image' && (
        <div 
          className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center
            ${isHighResOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            transition-opacity duration-300`}
          onClick={() => setIsHighResOpen(false)}
        >
          <div 
            ref={highResRef}
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading indicator */}
            {!isHighResLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            )}
            
            {/* High-res image */}
            <img
              src={getVariantUrl(currentItem, 'large')}
              alt="High resolution media"
              className={`max-w-full max-h-[90vh] object-contain ${isHighResLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setIsHighResLoaded(true)}
              onError={() => handleMediaError(currentItem.id)}
            />
            
            {/* Close button */}
            <button
              onClick={() => setIsHighResOpen(false)}
              className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2
                hover:bg-black/90 transition-colors"
              aria-label="Close high resolution view"
            >
              <FiMaximize2 className="w-5 h-5" />
            </button>
            
            {/* Resolution indicator */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
              High Resolution
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 