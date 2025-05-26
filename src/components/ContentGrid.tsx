"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiBookmark, FiSearch } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import BlurImage from './BlurImage';
import { usePosts, GridPost } from '@/hooks/usePosts';

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

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export default function ContentGrid() {
  const [activeCategory, setActiveCategory] = useState("");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [postBookmarks, setPostBookmarks] = useState<Record<string, number>>({});
  const [storageAvailable, setStorageAvailable] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Fetch posts using our custom hook
  const { posts, loading, error, hasMore, loadMore } = usePosts(
    activeCategory === "" ? undefined : activeCategory
  );
  
  // Check if localStorage is available
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
    console.log('localStorage available:', available);
  }, []);
  
  // Initialize like and bookmark counts from localStorage
  useEffect(() => {
    if (!storageAvailable || posts.length === 0) return;
    
    // Initialize base likes and bookmarks from posts data
    const initialLikes: Record<string, number> = {};
    const initialBookmarks: Record<string, number> = {};
    
    posts.forEach(post => {
      initialLikes[post._id] = post.likes;
      initialBookmarks[post._id] = post.bookmarks || 0;
    });
    
    // Try to load liked and bookmarked posts from localStorage
    try {
      // Load liked posts
      const savedLikedPosts = localStorage.getItem('likedPosts');
      if (savedLikedPosts) {
        const parsedLikedPosts = JSON.parse(savedLikedPosts);
        setLikedPosts(parsedLikedPosts);
        
        // Adjust like counts based on liked status
        Object.entries(parsedLikedPosts).forEach(([postId, isLiked]) => {
          if (isLiked) {
            initialLikes[postId] = (initialLikes[postId] || 0) + 1;
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
            initialBookmarks[postId] = (initialBookmarks[postId] || 0) + 1;
          }
        });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    
    // Set the final counts
    setPostLikes(initialLikes);
    setPostBookmarks(initialBookmarks);
  }, [posts, storageAvailable]);
  
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
  const handleLikePost = (e: React.MouseEvent, postId: string) => {
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
  const handleBookmarkPost = (e: React.MouseEvent, postId: string) => {
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
  const handleViewPost = async (postId: string) => {
    // Call API to increment view count
    try {
      await fetch(`/api/posts/${postId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };
  
  // Set up Intersection Observer for infinite scrolling
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);
  
  return (
    <div className="pt-2 pb-4 -mx-4 md:mx-0">
      {/* Category filters - compact 2-row grid */}
      <div className="mb-3 px-4 md:px-0">
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
      
      {/* Loading state */}
      {loading && posts.length === 0 && (
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item}
              className="rounded-lg overflow-hidden bg-gray-100 animate-pulse"
            >
              <div className="aspect-[3/4]"></div>
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 md:px-0">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-gray-700 font-medium">Error loading posts</h3>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      )}
      
      {/* Posts grid */}
      {posts.length > 0 && (
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
          {posts.map((post, index) => {
            // Helper function to get the image URL
            const getImageUrl = () => {
              if (post.primaryImage && post.primaryImage.url) {
                // Using medium variant (800px) for high quality in grid layout
                return post.primaryImage.url;
              }
              return '/placeholder-image.jpg';
            };
            
            // Get the layout class based on the post's aspect ratio
            const getLayoutClass = () => {
              if (post.primaryImage && post.primaryImage.aspectRatio) {
                // Default to 3:4 (portrait) if no valid aspect ratio
                return "aspect-[3/4]";
              }
              return "aspect-[3/4]";
            };
            
            // Reference for last post element (for infinite scrolling)
            const ref = index === posts.length - 1 ? lastPostElementRef : null;
            
            return (
              <div 
                key={post._id} 
                ref={ref}
                className="group flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease forwards'
                }}
              >
                <div className="relative overflow-hidden">
                  <Link href={`/post/${post._id}`} className="block" onClick={() => handleViewPost(post._id)}>
                    <div className={`relative ${getLayoutClass()} overflow-hidden`}>
                      <BlurImage 
                        src={getImageUrl()}
                        alt={post.title}
                        aspectRatio={getLayoutClass()}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                        quality={85}
                        className="object-cover"
                        priority={index < 4}
                      />
                      {/* Image overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Bookmark button */}
                      <button 
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                        onClick={(e) => handleBookmarkPost(e, post._id)}
                      >
                        {bookmarkedPosts[post._id] ? (
                          <FaBookmark className="w-4 h-4 text-amber-400" />
                        ) : (
                          <FiBookmark className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </Link>
                  
                  <div className="p-2.5">
                    <Link href={`/post/${post._id}`}>
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
                            src={post.userProfileImage || `/placeholder-avatar.jpg`}
                            alt={post.username}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700 group-hover/author:text-blue-600 transition-colors duration-300">{post.displayName}</span>
                      </Link>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          className="flex items-center text-[10px] transition-all duration-300 active:scale-125"
                          onClick={(e) => handleLikePost(e, post._id)}
                        >
                          {likedPosts[post._id] ? (
                            <FaHeart className="w-3 h-3 mr-1 text-red-500 transition-transform duration-300" />
                          ) : (
                            <FiHeart className="w-3 h-3 mr-1 text-gray-500 transition-transform duration-300" />
                          )}
                          <span className={likedPosts[post._id] ? "text-red-500 font-medium" : "text-gray-500"}>
                            {postLikes[post._id] || post.likes}
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
      
      {/* Loading more indicator */}
      {loading && posts.length > 0 && (
        <div className="py-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Load more trigger for Intersection Observer */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} className="h-10"></div>
      )}
      
      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 md:px-0">
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