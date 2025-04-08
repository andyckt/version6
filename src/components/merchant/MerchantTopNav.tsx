import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiShare2, FiBookmark, FiArrowLeft } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { BaseMerchant } from '@/data/merchants';
import { MerchantDocument } from '@/models/merchant';
import Link from 'next/link';

interface MerchantTopNavProps {
  merchant: MerchantDocument;
  onShareClick: () => void;
}

export default function MerchantTopNav({ merchant, onShareClick }: MerchantTopNavProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Handle scroll events to apply shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleBackClick = () => {
    router.back();
  };
  
  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  return (
    <header 
      className={`sticky top-0 bg-white z-20 border-b border-gray-100 transition-all duration-200 
      ${hasScrolled ? 'shadow-sm bg-white' : 'bg-white/95 backdrop-blur-sm'}`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between py-1.5">
          {/* Left - Back button */}
          <Link href="/merchants" className="text-gray-800 hover:text-primary">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          
          {/* Center - Username - Made clickable */}
          <button 
            className="text-sm font-medium py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            @{merchant.username}
          </button>
          
          {/* Right - Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkClick}
              className="p-1.5 transition-transform hover:scale-110 active:scale-95 relative group"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {isBookmarked ? (
                <FaBookmark className="w-5 h-5 text-amber-400" />
              ) : (
                <FiBookmark className="w-5 h-5 group-hover:text-primary transition-colors" />
              )}
              <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </button>
            
            <button 
              className="p-1.5 transition-transform hover:scale-110 active:scale-95 relative group"
              onClick={onShareClick}
            >
              <FiShare2 className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 