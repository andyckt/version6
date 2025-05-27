"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiBookmark } from 'react-icons/fi';
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
  posts: TravelPost[] | MerchantPost[];
}

export default function MentionedGrid({ posts }: MentionedGridProps) {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<number, number>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<number, boolean>>({});
  const [postBookmarks, setPostBookmarks] = useState<Record<number, number>>({});
  const [postViews, setPostViews] = useState<Record<number, number>>({});
  const [storageAvailable, setStorageAvailable] = useState(false);
  
  // Check if localStorage is available
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
  }, []);
  
  // Initialize like, bookmark, and view counts from localStorage
  useEffect(() => {
    // Initialize base likes, bookmarks, and views from posts data
    const initialLikes: Record<number, number> = {};
    const initialBookmarks: Record<number, number> = {};
    const initialViews: Record<number, number> = {};
    
    posts.forEach(post => {
      initialLikes[post.id] = post.likes;
      initialBookmarks[post.id] = post.bookmarks || 0;
      initialViews[post.id] = post.views;
    });
    
    // Try to load liked, bookmarked, and viewed posts from localStorage
    if (storageAvailable) {
      try {
        // Load liked posts
        const savedLikedPosts = localStorage.getItem('likedPosts');
        if (savedLikedPosts) {
          const parsedLikedPosts = JSON.parse(savedLikedPosts);
          setLikedPosts(parsedLikedPosts);
          
          // Adjust like counts based on liked status
          Object.entries(parsedLikedPosts).forEach(([postId, isLiked]) => {
            if (isLiked) {
              const numericPostId = Number(postId);
              initialLikes[numericPostId] = (initialLikes[numericPostId] || 0) + 1;
            }
          });
        }
        
        // Load bookmarked posts
        const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts');
        if (savedBookmarkedPosts) {
          const parsedBookmarkedPosts = JSON.parse(savedBookmarkedPosts);
          setBookmarkedPosts(parsedBookmarkedPosts);
          
          // Adjust bookmark counts based on bookmarked status
          Object.entries(parsedBookmarkedPosts).forEach(([postId, isBookmarked]) => {
            if (isBookmarked) {
              const numericPostId = Number(postId);
              initialBookmarks[numericPostId] = (initialBookmarks[numericPostId] || 0) + 1;
            }
          });
        }
        
        // Load view counts
        const savedPostViews = localStorage.getItem('postViews');
        if (savedPostViews) {
          const parsedPostViews = JSON.parse(savedPostViews);
          
          posts.forEach(post => {
            const postId = post.id;
            initialViews[postId] = parsedPostViews[postId] !== undefined 
              ? parsedPostViews[postId] 
              : post.views;
          });
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }
    
    // Set the final counts
    setPostLikes(initialLikes);
    setPostBookmarks(initialBookmarks);
    setPostViews(initialViews);
  }, [posts, storageAvailable]);
  
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
  
  // Handle liking a post
  const handleLikePost = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyLiked = likedPosts[postId];
    
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !isCurrentlyLiked
    }));
    
    setPostLikes(prev => {
      const currentLikes = prev[postId] || 0;
      return {
        ...prev,
        [postId]: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1
      };
    });
  };
  
  // Handle bookmarking a post
  const handleBookmarkPost = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyBookmarked = bookmarkedPosts[postId];
    
    setBookmarkedPosts(prev => ({
      ...prev,
      [postId]: !isCurrentlyBookmarked
    }));
    
    setPostBookmarks(prev => {
      const currentBookmarks = prev[postId] || 0;
      return {
        ...prev,
        [postId]: isCurrentlyBookmarked ? currentBookmarks - 1 : currentBookmarks + 1
      };
    });
  };
  
  // Handle viewing a post
  const handleViewPost = (postId: number) => {
    setPostViews(prev => {
      const currentViews = prev[postId] || 0;
      return {
        ...prev,
        [postId]: currentViews + 1
      };
    });
  };

  // Helper function to get post ID consistently between TravelPost and MerchantPost
  const getPostId = (post: TravelPost | MerchantPost): string | number => {
    return 'id' in post ? post.id : post._id;
  };
  
  // Helper function to get media URL consistently between TravelPost and MerchantPost
  const getMediaUrl = (post: TravelPost | MerchantPost): string => {
    if ('media' in post && post.media && post.media.length > 0) {
      // MerchantPost type from API
      if ('_id' in post && post.media[0]) {
        // If mediaId is an object with toString method (ObjectId), convert it
        const mediaId = typeof post.media[0].mediaId === 'object' && post.media[0].mediaId.toString 
          ? post.media[0].mediaId.toString() 
          : post.media[0].mediaId;
        
        return `/api/media/${mediaId}/thumbnail`;
      }
      
      // TravelPost type with media array
      if ('id' in post && post.media[0] && post.media[0].url) {
        return post.media[0].url;
      }
    }
    
    // Fallback to image property or default
    return ('image' in post && post.image) ? post.image : 'https://picsum.photos/600/600?random=default';
  };

  // Helper function to get profile image URL consistently
  const getProfileImageUrl = (profileImage: any): string => {
    if (!profileImage) return '/placeholder-avatar.jpg';
    
    if (typeof profileImage === 'string') {
      return profileImage; // Return directly if it's a string URL
    } else if (typeof profileImage === 'object') {
      // If it's an object, get the correct variant (prefer micro for avatars)
      return profileImage.micro || profileImage.media || profileImage.original || '/placeholder-avatar.jpg';
    }
    
    return '/placeholder-avatar.jpg';
  };

  return (
    <div className="pt-2 pb-4 -mx-4 md:mx-0">
      {posts.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7L12 13L21 7" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium">No posts yet</h3>
          <p className="text-gray-500 text-sm mt-1">Be the first to mention this place in a post</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
          {posts.map((post, index) => {
            const postId = getPostId(post);
            
            return (
              <div 
                key={postId} 
                className="group flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease forwards'
                }}
              >
                <div className="relative overflow-hidden">
                  <Link href={`/post/${postId}`} className="block" onClick={() => handleViewPost(Number(postId))}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <BlurImage 
                        src={getMediaUrl(post)} 
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
                        onClick={(e) => handleBookmarkPost(e, Number(postId))}
                      >
                        {bookmarkedPosts[Number(postId)] ? (
                          <FaBookmark className="w-4 h-4 text-amber-400" />
                        ) : (
                          <FiBookmark className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </Link>
                  
                  <div className="p-2.5">
                    <Link href={`/post/${postId}`}>
                      <h3 className="font-[550] text-xs line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mt-1.5">
                      <Link 
                        href={`/user/${post.username}`} 
                        className="flex items-center group/author"
                      >
                        <div className="w-4 h-4 rounded-full bg-gray-200 mr-1.5 overflow-hidden transition-transform duration-300 group-hover/author:scale-110">
                          <Image
                            src={getProfileImageUrl(post.userProfileImage)}
                            alt={post.username}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700 group-hover/author:text-blue-600 transition-colors duration-300">{post.displayName || post.username}</span>
                      </Link>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          className="flex items-center text-[10px] transition-all duration-300 active:scale-125"
                          onClick={(e) => handleLikePost(e, Number(postId))}
                        >
                          {likedPosts[Number(postId)] ? (
                            <FaHeart className="w-3 h-3 mr-1 text-red-500 transition-transform duration-300" />
                          ) : (
                            <FiHeart className="w-3 h-3 mr-1 text-gray-500 transition-transform duration-300" />
                          )}
                          <span className={likedPosts[Number(postId)] ? "text-red-500 font-medium" : "text-gray-500"}>
                            {postLikes[Number(postId)] || post.likes}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 