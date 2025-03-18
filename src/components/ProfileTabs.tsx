"use client";

import React, { useState } from 'react';
import { FiBookmark, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import BlurImage from './BlurImage';
import { TravelPost } from '@/data/posts';

interface ProfileTabsProps {
  userPosts: TravelPost[];
  likedPosts: TravelPost[];
  savedPosts: TravelPost[];
}

type TabType = 'posts' | 'saved';

export default function ProfileTabs({ userPosts, likedPosts, savedPosts }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // Get the current posts based on active tab
  const getCurrentPosts = () => {
    switch (activeTab) {
      case 'posts':
        return userPosts;
      case 'saved':
        return savedPosts;
      default:
        return userPosts;
    }
  };

  const currentPosts = getCurrentPosts();

  return (
    <>
      {/* Tabs with icons only */}
      <div className="border-b border-gray-100 mb-3">
        <div className="flex">
          <button 
            className={`flex-1 py-3 flex justify-center ${
              activeTab === 'posts' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('posts')}
            aria-label="Posts"
          >
            <FiImage className={`w-5 h-5 ${activeTab === 'posts' ? 'text-primary' : ''}`} />
          </button>
          <button 
            className={`flex-1 py-3 flex justify-center ${
              activeTab === 'saved' 
                ? 'border-b-2 border-primary text-primary font-medium' 
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('saved')}
            aria-label="Saved posts"
          >
            <FiBookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'text-primary' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Posts Grid */}
      {currentPosts.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'posts' && <FiImage className="w-8 h-8 text-gray-400" />}
            {activeTab === 'saved' && <FiBookmark className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="font-medium text-gray-800">
            {activeTab === 'posts' && 'No posts yet'}
            {activeTab === 'saved' && 'No saved posts yet'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'posts' && 'When you share posts, they\'ll appear here.'}
            {activeTab === 'saved' && 'Save posts to view them later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 mb-8">
          {currentPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block aspect-square relative">
              <BlurImage 
                src={post.image} 
                alt={post.title}
                aspectRatio="aspect-square"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
              
              {/* Hover overlay with post info - Only visible on larger screens */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex flex-col justify-end p-2 transition-all duration-200 opacity-0 hover:opacity-100 md:block hidden">
                <h3 className="text-white text-xs font-medium truncate">{post.title}</h3>
                <div className="flex items-center text-white text-xs mt-1">
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
} 