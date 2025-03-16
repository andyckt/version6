"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import { travelPosts } from '@/data/posts';
import BlurImage from './BlurImage';

// Define categories with colors
const categories = [
  { id: "superpicture", name: "Superpicture", iconSrc: "/icons/icon-superpicture.svg", color: "#FF6B6B" },
  { id: "food", name: "Food", iconSrc: "/icons/icon-food.svg", color: "#4ECDC4" },
  { id: "attractions", name: "Attractions", iconSrc: "/icons/icon-attractions.svg", color: "#FFD166" },
  { id: "luxurious", name: "Luxurious", iconSrc: "/icons/icon-luxurious.svg", color: "#6A0572" },
  { id: "getdrunk", name: "Get Drunk", iconSrc: "/icons/icon-getdrunk.svg", color: "#1A535C" },
  { id: "hotel", name: "Hotel", iconSrc: "/icons/icon-hotel.svg", color: "#FF9F1C" },
  { id: "treasurehunt", name: "Treasure Hunt", iconSrc: "/icons/icon-treasurehunt.svg", color: "#7B68EE" },
  { id: "korea", name: "Korea", iconSrc: "/icons/icon-korea.svg", color: "#FF5E5B" }
];

export default function ContentGrid() {
  const [activeCategory, setActiveCategory] = useState("");
  
  // Filter posts based on selected category
  const filteredPosts = activeCategory === "" 
    ? travelPosts 
    : travelPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase()))
      );

  return (
    <div className="pt-2 pb-4">
      {/* Category filters - compact 2-row grid */}
      <div className="mb-3">
        <div className="grid grid-cols-4 gap-x-1 gap-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center transition-all duration-200"
              onClick={() => setActiveCategory(activeCategory === category.id ? "" : category.id)}
            >
              <div className="h-8 flex items-center justify-center mb-1">
                <img 
                  src={category.iconSrc}
                  alt={category.name}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPosts.map((post, index) => (
          <div 
            key={post.id} 
            className="flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-md"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards'
            }}
          >
            <Link href={`/post/${post.id}`} className="block">
              <div className="relative">
                <BlurImage 
                  src={post.image} 
                  alt={post.title}
                  aspectRatio="pb-[100%]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                <div className="flex items-center mt-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>
                  <span className="text-xs text-gray-700">{post.author}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <FiHeart className="w-3 h-3 mr-1" />
                    <span>{post.likes}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-sm">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="text-[10px] text-gray-500">+{post.tags.length - 2}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiHeart className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium">No posts found</h3>
          <p className="text-gray-500 text-sm mt-1">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate hue rotation based on color
function getHueRotation(hexColor: string): number {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  // Find the maximum and minimum values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate hue
  let h = 0;
  if (max === min) {
    h = 0; // achromatic
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  
  return h;
}