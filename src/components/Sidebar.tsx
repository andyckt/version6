"use client";

import { useState, useEffect } from 'react';
import { FiX, FiHeart, FiBookmark } from 'react-icons/fi';
import { travelPosts } from '@/data/posts';
import BlurImage from './BlurImage';
import Link from 'next/link';
import { FaHeart, FaBookmark } from 'react-icons/fa';

type Tab = 'liked' | 'bookmarked';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('liked');
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<number, boolean>>({});
  const [filteredPosts, setFilteredPosts] = useState<typeof travelPosts>([]);
  
  // Load liked and bookmarked posts from localStorage
  const loadDataFromLocalStorage = () => {
    try {
      const savedLikedPosts = localStorage.getItem('likedPosts');
      if (savedLikedPosts) {
        setLikedPosts(JSON.parse(savedLikedPosts));
      } else {
        setLikedPosts({});
      }
      
      const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts');
      if (savedBookmarkedPosts) {
        setBookmarkedPosts(JSON.parse(savedBookmarkedPosts));
      } else {
        setBookmarkedPosts({});
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);
  
  // Reload data when sidebar opens
  useEffect(() => {
    if (isOpen) {
      loadDataFromLocalStorage();
    }
  }, [isOpen]);
  
  // Filter posts based on active tab
  useEffect(() => {
    let posts = [];
    
    if (activeTab === 'liked') {
      posts = travelPosts.filter(post => likedPosts[post.id]);
    } else {
      posts = travelPosts.filter(post => bookmarkedPosts[post.id]);
    }
    
    setFilteredPosts(posts);
  }, [activeTab, likedPosts, bookmarkedPosts]);
  
  // Handle post interaction - update localStorage
  const handleUnlikePost = (postId: number) => {
    const newLikedPosts = { ...likedPosts };
    delete newLikedPosts[postId];
    setLikedPosts(newLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
  };
  
  const handleUnbookmarkPost = (postId: number) => {
    const newBookmarkedPosts = { ...bookmarkedPosts };
    delete newBookmarkedPosts[postId];
    setBookmarkedPosts(newBookmarkedPosts);
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarkedPosts));
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-md bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Your Collection</h2>
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex items-center justify-center flex-1 py-3 font-medium text-sm ${
                activeTab === 'liked' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('liked')}
            >
              <FiHeart className={`w-4 h-4 mr-2 ${activeTab === 'liked' ? 'text-red-500' : ''}`} />
              Liked
            </button>
            <button
              className={`flex items-center justify-center flex-1 py-3 font-medium text-sm ${
                activeTab === 'bookmarked' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('bookmarked')}
            >
              <FiBookmark className={`w-4 h-4 mr-2 ${activeTab === 'bookmarked' ? 'text-amber-400' : ''}`} />
              Bookmarked
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-113px)]">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 p-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex flex-col rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm"
                >
                  <div className="relative overflow-hidden">
                    <Link href={`/post/${post.id}`} className="block">
                      <BlurImage 
                        src={post.media && post.media.length > 0 
                          ? post.media[0].url 
                          : (post.image || 'https://picsum.photos/600/600?random=default')}
                        alt={post.title}
                        aspectRatio="pb-[100%]"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      
                      {/* Action button - unlike or unbookmark */}
                      <button 
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (activeTab === 'liked') {
                            handleUnlikePost(post.id);
                          } else {
                            handleUnbookmarkPost(post.id);
                          }
                        }}
                      >
                        {activeTab === 'liked' ? (
                          <FaHeart className="w-4 h-4 text-red-500" />
                        ) : (
                          <FaBookmark className="w-4 h-4 text-amber-400" />
                        )}
                      </button>
                    </Link>
                  </div>
                  
                  <div className="p-3">
                    <Link href={`/post/${post.id}`}>
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center mt-2">
                      <Link href={`/account/${post.author.toLowerCase().replace(/\s+/g, '')}`} className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 overflow-hidden" />
                        <span className="text-xs text-gray-700">{post.author}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {activeTab === 'liked' ? (
                  <FiHeart className="w-6 h-6 text-gray-400" />
                ) : (
                  <FiBookmark className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No {activeTab === 'liked' ? 'liked' : 'bookmarked'} posts yet
              </h3>
              <p className="text-gray-500 max-w-sm">
                {activeTab === 'liked'
                  ? "When you like posts, they'll appear here for easy access."
                  : "Save posts to your bookmarks to find them quickly later."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 