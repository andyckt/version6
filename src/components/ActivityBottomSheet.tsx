"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiClock, FiMapPin, FiX } from 'react-icons/fi';
import { TravelPost } from '@/data/posts';

interface Activity {
  type: 'like' | 'read' | 'checkin';
  content: string;
  time: string;
  image: string;
  postId?: number;
}

interface ActivityBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  likedPosts: TravelPost[];
}

type TabType = 'liked' | 'history';

export default function ActivityBottomSheet({ 
  isOpen, 
  onClose, 
  activities,
  likedPosts
}: ActivityBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('liked');
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // Filter activities by type
  const likedActivities = activities.filter(activity => activity.type === 'like');
  const readActivities = activities.filter(activity => activity.type === 'read');
  
  // Handle animation states
  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening');
      setTimeout(() => setAnimationState('open'), 10); // Trigger animation after render
    } else if (!isOpen && (animationState === 'open' || animationState === 'opening')) {
      setAnimationState('closing');
      setTimeout(() => setAnimationState('closed'), 300); // Match transition duration
    }
  }, [isOpen, animationState]);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (animationState === 'closed' && !isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 flex items-end justify-center ${
        animationState === 'open' ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
    >
      <div 
        ref={sheetRef}
        className="bg-white rounded-t-xl w-full md:w-[480px] flex flex-col transition-transform duration-300 ease-out"
        style={{ 
          transform: animationState === 'open' ? 'translateY(0)' : 'translateY(100%)',
          height: 'calc(100vh - 183px)', // Adjusted height to be 1px lower (was 182px)
          maxHeight: 'calc(100vh - 183px)'
        }}
      >
        {/* Handle for dragging */}
        <div className="w-full flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h2 className="font-bold text-lg">Recent Activity</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-100 bg-white">
          <div className="flex">
            <button 
              className={`flex-1 py-3 text-center flex items-center justify-center ${
                activeTab === 'liked' 
                  ? 'border-b-2 border-primary text-primary font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('liked')}
            >
              <FiHeart className={`w-4 h-4 mr-2 ${activeTab === 'liked' ? 'text-primary' : ''}`} />
              <span>Liked Posts</span>
            </button>
            <button 
              className={`flex-1 py-3 text-center flex items-center justify-center ${
                activeTab === 'history' 
                  ? 'border-b-2 border-primary text-primary font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <FiClock className={`w-4 h-4 mr-2 ${activeTab === 'history' ? 'text-primary' : ''}`} />
              <span>Read History</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'liked' && (
            <>
              {likedActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-800">No liked posts yet</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Posts you like will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {likedPosts.map((post, index) => (
                    <Link key={post.id} href={`/post/${post.id}`} className="flex items-start p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden relative">
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {post.description?.substring(0, 80) || `A post by ${post.author}`}...
                        </p>
                        <div className="flex items-center mt-2">
                          <FiHeart className="w-3 h-3 text-red-500 mr-1" />
                          <span className="text-xs text-gray-500">Liked {likedActivities[index]?.time || 'recently'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'history' && (
            <>
              {readActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-800">No read history yet</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Posts you've read will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {readActivities.map((activity, index) => (
                    <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden relative">
                        <Image 
                          src={activity.image} 
                          alt={activity.content}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{activity.content}</p>
                        <div className="flex items-center mt-2">
                          <FiClock className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="text-xs text-gray-500">Read {activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 