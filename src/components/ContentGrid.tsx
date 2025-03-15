"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { travelPosts } from '@/data/posts';
import BlurImage from './BlurImage';

// Define categories for filtering
const categories = [
  "All",
  "Food",
  "Nature",
  "City",
  "Beach",
  "Mountain",
  "Culture"
];

export default function ContentGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Filter posts based on selected category
  const filteredPosts = activeCategory === "All" 
    ? travelPosts 
    : travelPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
      );

  return (
    <div className="pt-4 pb-4">
      {/* Category filters */}
      <div className="mb-4 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 pb-2 px-1">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-black font-medium'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
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