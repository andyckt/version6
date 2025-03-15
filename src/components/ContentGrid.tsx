"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { 
  FiCamera, 
  FiCoffee, 
  FiMapPin, 
  FiStar, 
  FiWind, 
  FiHome, 
  FiCompass, 
  FiGlobe 
} from 'react-icons/fi';
import { travelPosts } from '@/data/posts';
import BlurImage from './BlurImage';

// Define categories with icons and colors
const categories = [
  { id: "superpicture", name: "Superpicture", icon: FiCamera, color: "#FF6B6B" },
  { id: "food", name: "Food", icon: FiCoffee, color: "#4ECDC4" },
  { id: "attractions", name: "Attractions", icon: FiMapPin, color: "#FFD166" },
  { id: "luxurious", name: "Luxurious", icon: FiStar, color: "#6A0572" },
  { id: "getdrunk", name: "Get Drunk", icon: FiWind, color: "#1A535C" },
  { id: "hotel", name: "Hotel", icon: FiHome, color: "#FF9F1C" },
  { id: "treasurehunt", name: "Treasure Hunt", icon: FiCompass, color: "#7B68EE" },
  { id: "korea", name: "Korea", icon: FiGlobe, color: "#FF5E5B" }
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
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-transform ${
                  activeCategory === category.id ? 'scale-110' : ''
                }`}
                style={{ backgroundColor: `${category.color}20` }} // 20% opacity of the color
              >
                <category.icon 
                  className="w-4 h-4" 
                  style={{ color: category.color }}
                />
              </div>
              <span 
                className={`text-xs font-medium transition-colors ${
                  activeCategory === category.id ? 'text-primary font-bold' : 'text-gray-700'
                }`}
              >
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