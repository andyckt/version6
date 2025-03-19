"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import { travelPosts } from '@/data/posts';
import BlurImage from './BlurImage';

// Define categories with GIF icons
const categories = [
  { id: "superpicture", name: "Superpicture", iconSrc: "/icons/gif-superpicture.gif", color: "#FF6B6B" },
  { id: "food", name: "Food", iconSrc: "/icons/gif-food.gif", color: "#4ECDC4" },
  { id: "attractions", name: "Attractions", iconSrc: "/icons/gif-attractions.gif", color: "#FFD166" },
  { id: "luxurious", name: "Luxury", iconSrc: "/icons/gif-luxurious.gif", color: "#6A0572" },
  { id: "getdrunk", name: "Get Drunk", iconSrc: "/icons/gif-getdrunk.gif", color: "#1A535C" },
  { id: "hotel", name: "Accommodation", iconSrc: "/icons/gif-hotel.gif", color: "#FF9F1C" },
  { id: "treasurehunt", name: "Treasure Hunt", iconSrc: "/icons/gif-treasurehunt.gif", color: "#7B68EE" },
  { id: "korea", name: "Korea", iconSrc: "/icons/gif-korea.gif", color: "#FF5E5B" }
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
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center group"
              onClick={() => setActiveCategory(activeCategory === category.id ? "" : category.id)}
            >
              <div className="relative h-8 flex items-center justify-center mb-0.5">
                <img 
                  src={category.iconSrc}
                  alt={category.name}
                  className="w-9 h-9 transition-all duration-300 group-hover:scale-[1.5] group-hover:z-10"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-semibold tracking-tight text-gray-800 transition-opacity duration-300 group-hover:opacity-0">
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
            className="group flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards'
            }}
          >
            <div className="relative overflow-hidden">
              <Link href={`/post/${post.id}`} className="block">
                <div className="relative">
                  <BlurImage 
                    src={post.media && post.media.length > 0 
                      ? post.media[0].url 
                      : (post.image || 'https://picsum.photos/600/600?random=default')} 
                    alt={post.title}
                    aspectRatio="pb-[100%]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Multiple media indicator */}
                  {post.media && post.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {post.media.length} {post.media.some(m => m.type === 'video') ? 'media' : 'photos'}
                    </div>
                  )}
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              
              <div className="p-3.5">
                <Link href={`/post/${post.id}`}>
                  <h3 className="font-[550] text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mt-2.5">
                  <Link 
                    href={`/account/${post.author.toLowerCase().replace(/\s+/g, '')}`} 
                    className="flex items-center group/author"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 overflow-hidden transition-transform duration-300 group-hover/author:scale-110">
                      {/* This could be a real avatar image */}
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover/author:text-blue-600 transition-colors duration-300">{post.author}</span>
                  </Link>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <FiHeart className="w-3.5 h-3.5 mr-1 group-hover:scale-110 transition-transform duration-300" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
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