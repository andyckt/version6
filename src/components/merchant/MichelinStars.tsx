import React from 'react';
import { FiAward } from 'react-icons/fi';

interface MichelinStarsProps {
  stars: number;
  className?: string;
}

/**
 * Displays Michelin stars for restaurants
 */
export default function MichelinStars({ stars, className = '' }: MichelinStarsProps) {
  if (!stars || stars <= 0) return null;
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(stars)].map((_, i) => (
        <FiAward 
          key={i} 
          className="text-red-600 mr-0.5 h-5 w-5 fill-red-600" 
          title={`${stars} Michelin ${stars > 1 ? 'Stars' : 'Star'}`}
        />
      ))}
      <span className="text-sm font-medium ml-1">
        {stars} Michelin {stars > 1 ? 'Stars' : 'Star'}
      </span>
    </div>
  );
} 