"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface AnimatedStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'small' | 'custom' | 'medium' | 'large';
  interactive?: boolean;
}

export default function AnimatedStars({ 
  rating, 
  maxStars = 5,
  size = 'medium',
  interactive = true
}: AnimatedStarsProps) {
  const [hoveredStar, setHoveredStar] = useState(-1)

  const handleStarHover = (index: number) => {
    if (interactive) {
      setHoveredStar(index)
    }
  }

  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'h-4 w-4';
      case 'custom': return 'h-5 w-5'; // Custom size between small and medium
      case 'large': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  }

  return (
    <div className="flex">
      {[...Array(maxStars)].map((_, i) => (
        <div
          key={i}
          className="relative group"
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={() => setHoveredStar(-1)}
        >
          <Star
            className={`${getSizeClass()} transition-all duration-300 ${
              hoveredStar >= i
                ? "fill-yellow-400 stroke-yellow-500 scale-110 filter drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]"
                : i < rating
                  ? "fill-yellow-400 stroke-yellow-500"
                  : "fill-gray-200 stroke-gray-300"
            }`}
          />
          {hoveredStar === i && (
            <div className="absolute inset-0 animate-sparkle">
              <div className="absolute h-1 w-1 bg-yellow-300 rounded-full top-0 left-1/2 opacity-0 animate-spark-1"></div>
              <div className="absolute h-1 w-1 bg-yellow-300 rounded-full top-1/4 right-0 opacity-0 animate-spark-2"></div>
              <div className="absolute h-1 w-1 bg-yellow-300 rounded-full bottom-0 left-1/4 opacity-0 animate-spark-3"></div>
            </div>
          )}
        </div>
      ))}

      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes spark-1 {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-5px, -10px); opacity: 0; }
        }
        
        @keyframes spark-2 {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(8px, 0); opacity: 0; }
        }
        
        @keyframes spark-3 {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-3px, 8px); opacity: 0; }
        }
        
        .animate-sparkle {
          animation: sparkle 1s ease-in-out infinite;
        }
        
        .animate-spark-1 {
          animation: spark-1 1s ease-in-out infinite;
        }
        
        .animate-spark-2 {
          animation: spark-2 1s ease-in-out 0.2s infinite;
        }
        
        .animate-spark-3 {
          animation: spark-3 1s ease-in-out 0.4s infinite;
        }
      `}</style>
    </div>
  )
} 