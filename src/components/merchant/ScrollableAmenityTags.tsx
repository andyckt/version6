"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Star } from "lucide-react"

interface AmenityTagProps {
  label: string
}

const AmenityTag = ({ label }: AmenityTagProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full 
        border border-gray-400/20 bg-gray-500/5 text-gray-700
        transition-all duration-300 cursor-pointer group
        hover:bg-gray-500/10 flex-shrink-0
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div className="relative transition-transform duration-300 group-hover:scale-110">
        <Star className="h-2.5 w-2.5" />
      </div>

      {/* Label text */}
      <span className="relative text-[10px] font-medium whitespace-nowrap">{label}</span>

      {/* Subtle pulse effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full border border-gray-400/30 animate-ping-slow opacity-30" />
      )}
    </div>
  )
}

interface ScrollableAmenityTagsProps {
  amenities: string[]
}

export default function ScrollableAmenityTags({ amenities }: ScrollableAmenityTagsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Calculate scroll position and max scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setScrollPosition(scrollLeft)
      setMaxScroll(scrollWidth - clientWidth)
    }
  }

  // Initialize scroll values
  useEffect(() => {
    handleScroll()
    window.addEventListener("resize", handleScroll)
    return () => window.removeEventListener("resize", handleScroll)
  }, [])

  // Mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
  }

  if (!amenities || amenities.length === 0) return null

  return (
    <div className="relative w-full max-w-full">
      {/* Scroll container with gradient edges */}
      <div className="relative">
        {/* Left fade gradient */}
        {scrollPosition > 10 && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Right fade gradient */}
        {scrollPosition < maxScroll - 10 && maxScroll > 0 && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className={`
            flex gap-1 py-1 overflow-x-auto scrollbar-hide scroll-smooth px-0.5
            ${maxScroll > 0 ? "cursor-grab active:cursor-grabbing" : ""}
          `}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {amenities.map((amenity, index) => (
            <AmenityTag key={index} label={amenity} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  )
} 