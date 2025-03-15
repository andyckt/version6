"use client";

import Link from 'next/link'
import { FiHeart } from 'react-icons/fi'
import { travelPosts } from '@/data/posts'
import BlurImage from './BlurImage'

export default function ContentGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 py-4">
      {travelPosts.map((post, index) => (
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
            <BlurImage 
              src={post.image} 
              alt={post.title}
              aspectRatio="pb-[100%]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="p-2">
              <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{post.author}</span>
                <div className="flex items-center text-xs text-gray-500">
                  <FiHeart className="w-3 h-3 mr-1" />
                  <span>{post.likes}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
} 