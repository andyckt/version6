import React, { useRef, useEffect, useState } from 'react';
import { MultiLocationMerchant } from '@/data/merchants';
import BranchCard from './BranchCard';

interface BranchListProps {
  merchant: MultiLocationMerchant;
  className?: string;
}

export default function BranchList({ merchant, className = '' }: BranchListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = Math.min((scrollLeft / (scrollWidth - clientWidth)) * 100, 100);
      setScrollProgress(progress || 0);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial progress
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={className}>
      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-3 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {merchant.branches.map((branch, index) => (
          <div 
            key={`${merchant.id}-branch-${index}`}
            className="flex-shrink-0 w-[260px] snap-start origin-top-left"
            style={{ transform: 'scale(0.85)', marginRight: '-40px' }}
          >
            <BranchCard
              branch={{
                district: branch.branchDistrict,
                location: {
                  chineseAddress: branch.chineseAddress,
                  englishAddress: branch.englishAddress,
                  nearestSubway: branch.nearestSubway,
                  telephone: branch.telephone,
                  branchDistrict: branch.branchDistrict
                },
                businessInfo: {
                  openingHours: branch.openingHours,
                  needBooking: branch.needBooking,
                  peakTime: branch.peakTime
                }
              }}
              index={index}
              merchant={merchant}
            />
          </div>
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
        <div 
          className="h-full bg-primary/60 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(10, scrollProgress)}%` }}
        />
      </div>
    </div>
  );
} 