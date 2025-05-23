"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiBookmark, FiLoader } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import Image from 'next/image';
import { TravelPost } from '@/data/posts';
import { getUserByUsername } from '@/data/users';
import BlurImage from './BlurImage';
import { MerchantPost } from '@/hooks/useMerchantPosts';

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

interface MentionedGridProps {
  posts: MerchantPost[];
  isLoading?: boolean;
  isEmpty?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  isLoadingMore?: boolean;
  updatePostEngagement?: (postId: string, type: 'likes' | 'bookmarks' | 'views', increment: boolean) => void;
}

export default function MentionedGrid({ 
  posts, 
  isLoading = false, 
  isEmpty = false,
  hasMore = false,
  loadMore,
  isLoadingMore = false,
  updatePostEngagement
}: MentionedGridProps) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [postViews, setPostViews] = useState<Record<string, number>>({});
  const [storageAvailable, setStorageAvailable] = useState(false);
  
  // Check if localStorage is available
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
  }, []);
  
  // Initialize like, bookmark, and view counts from localStorage
  useEffect(() => {
    if (storageAvailable) {
      try {
        // Load liked posts
        const savedLikedPosts = localStorage.getItem('likedPosts');
        if (savedLikedPosts) {
          setLikedPosts(JSON.parse(savedLikedPosts));
        }
        
        // Load bookmarked posts
        const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts');
        if (savedBookmarkedPosts) {
          setBookmarkedPosts(JSON.parse(savedBookmarkedPosts));
        }
        
        // Load view counts
        const savedPostViews = localStorage.getItem('postViews');
        if (savedPostViews) {
          setPostViews(JSON.parse(savedPostViews));
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }
  }, [storageAvailable]);
  
  // Save liked posts to localStorage when changed
  useEffect(() => {
    if (storageAvailable && Object.keys(likedPosts).length > 0) {
      try {
        const dataToSave = JSON.stringify(likedPosts);
        localStorage.setItem('likedPosts', dataToSave);
      } catch (error) {
        console.error('Failed to save liked posts to localStorage:', error);
      }
    }
  }, [likedPosts, storageAvailable]);
  
  // Save bookmarked posts to localStorage when changed
  useEffect(() => {
    if (storageAvailable && Object.keys(bookmarkedPosts).length > 0) {
      try {
        const dataToSave = JSON.stringify(bookmarkedPosts);
        localStorage.setItem('bookmarkedPosts', dataToSave);
      } catch (error) {
        console.error('Failed to save bookmarked posts to localStorage:', error);
      }
    }
  }, [bookmarkedPosts, storageAvailable]);
  
  // Save view counts to localStorage when changed
  useEffect(() => {
    if (storageAvailable && Object.keys(postViews).length > 0) {
      try {
        const dataToSave = JSON.stringify(postViews);
        localStorage.setItem('postViews', dataToSave);
      } catch (error) {
        console.error('Failed to save post views to localStorage:', error);
      }
    }
  }, [postViews, storageAvailable]);
  
  // Handle liking a post
  const handleLikePost = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyLiked = likedPosts[postId];
    
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !isCurrentlyLiked
    }));
    
    // Update engagement count in SWR cache if available
    if (updatePostEngagement) {
      updatePostEngagement(postId, 'likes', !isCurrentlyLiked);
    }
  };
  
  // Handle bookmarking a post
  const handleBookmarkPost = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyBookmarked = bookmarkedPosts[postId];
    
    setBookmarkedPosts(prev => ({
      ...prev,
      [postId]: !isCurrentlyBookmarked
    }));
    
    // Update engagement count in SWR cache if available
    if (updatePostEngagement) {
      updatePostEngagement(postId, 'bookmarks', !isCurrentlyBookmarked);
    }
  };
  
  // Handle viewing a post
  const handleViewPost = (postId: string) => {
    setPostViews(prev => {
      const currentViews = prev[postId] || 0;
      return {
        ...prev,
        [postId]: currentViews + 1
      };
    });
    
    // Update engagement count in SWR cache if available
    if (updatePostEngagement) {
      updatePostEngagement(postId, 'views', true);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 rounded-lg overflow-hidden"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards'
            }}
          >
            <div className="relative aspect-[3/4] overflow-hidden animate-pulse">
              <div className="bg-gray-200 w-full h-full"></div>
            </div>
            <div className="p-2.5">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (isEmpty || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900">No posts yet</h3>
        <p className="text-sm text-gray-500 mt-1">Be the first to mention this place in a post.</p>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4 -mx-4 md:mx-0">
      {/* Content grid */}
      <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
        {posts.map((post, index) => (
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
              <Link href={`/post/${post.id}`} className="block" onClick={() => handleViewPost(post.id)}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <BlurImage 
                    src={post.media && post.media.length > 0 
                      ? post.media[0].url 
                      : 'https://picsum.photos/600/600?random=default'} 
                    alt={post.title}
                    aspectRatio="aspect-[3/4]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Bookmark button */}
                  <button 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                    onClick={(e) => handleBookmarkPost(e, post.id)}
                  >
                    {bookmarkedPosts[post.id] ? (
                      <FaBookmark className="w-4 h-4 text-amber-400" />
                    ) : (
                      <FiBookmark className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </Link>
              
              <div className="p-2.5">
                <Link href={`/post/${post.id}`}>
                  <h3 className="font-[550] text-xs line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mt-1.5">
                  <div className="text-[10px] font-medium text-gray-500">
                    {postViews[post.id] || post.views} views
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      className="flex items-center text-[10px] transition-all duration-300 active:scale-125"
                      onClick={(e) => handleLikePost(e, post.id)}
                    >
                      {likedPosts[post.id] ? (
                        <FaHeart className="w-3 h-3 mr-1 text-red-500 transition-transform duration-300" />
                      ) : (
                        <FiHeart className="w-3 h-3 mr-1 text-gray-500 transition-transform duration-300" />
                      )}
                      <span className={likedPosts[post.id] ? "text-red-500 font-medium" : "text-gray-500"}>
                        {post.likes}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2">
              <FiLoader className="w-4 h-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Loading more posts...</span>
            </div>
          ) : (
            <button 
              onClick={loadMore} 
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
} 