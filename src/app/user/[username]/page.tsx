"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShare2, FiMapPin, FiCalendar, FiLink, FiChevronLeft, FiInfo, FiX, FiHeart, FiBookmark, FiLoader } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import BlurImage from '@/components/BlurImage';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { notFound } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/hooks/useUser';
import ShareDialog from '@/components/ShareDialog';
import { useUserPosts, UserPost } from '@/hooks/useUserPosts';

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

export default function UserProfilePage() {
  const { navigate } = useNavigation();
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  
  const { user, isLoading: isUserLoading, isError: isUserError } = useUser(username);
  const { 
    posts, 
    isLoading: isPostsLoading, 
    isEmpty,
    hasMore,
    loadMore,
    isLoadingMore,
    totalPosts,
    updatePostEngagement
  } = useUserPosts(username);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  
  // States for post interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [postViews, setPostViews] = useState<Record<string, number>>({});
  const [storageAvailable, setStorageAvailable] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Random image states - these will be different on each page load
  const [randomProfileImage, setRandomProfileImage] = useState('');
  const [randomCoverImage, setRandomCoverImage] = useState('');
  
  // Generate random IDs for Picsum Photos on each page load
  useEffect(() => {
    // Generate random numbers between 1-1000 for the images
    const profileId = Math.floor(Math.random() * 1000) + 1;
    const coverId = Math.floor(Math.random() * 1000) + 1;
    
    setRandomProfileImage(`https://picsum.photos/400/400?random=${profileId}`);
    setRandomCoverImage(`https://picsum.photos/1200/400?random=${coverId}`);
  }, []);
  
  // Check if localStorage is available
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
  }, []);
  
  // Initialize like and bookmark states from localStorage
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
        
        // Load post views
        const savedPostViews = localStorage.getItem('postViews');
        if (savedPostViews) {
          setPostViews(JSON.parse(savedPostViews));
        }
      } catch (error) {
        console.error('Failed to load interaction data:', error);
      }
    }
  }, [storageAvailable]);
  
  // Set up Intersection Observer for infinite scrolling
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isPostsLoading || isLoadingMore) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: '200px', // Load more posts when user is 200px away from the bottom
      threshold: 0.1
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [isPostsLoading, isLoadingMore, hasMore, loadMore]);
  
  // Close info dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dialogElement = document.getElementById('info-dialog');
      if (dialogElement && !dialogElement.contains(event.target as Node)) {
        setShowInfoDialog(false);
      }
    };

    if (showInfoDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoDialog]);
  
  // Check if user's profile image is from Picsum
  const isUserProfileFromPicsum = user?.profileImage?.includes('picsum.photos');
  const isUserCoverFromPicsum = user?.coverImage?.includes('picsum.photos');
  
  // Get the final images to use - replace Picsum URLs with random ones
  const profileImageToUse = isUserProfileFromPicsum ? randomProfileImage : (user?.profileImage || randomProfileImage);
  const coverImageToUse = isUserCoverFromPicsum ? randomCoverImage : (user?.coverImage || randomCoverImage);
  
  const handleFollowClick = () => {
    // Use the optimized navigation
    navigate('/account');
  };

  const handleShareClick = () => {
    setShowShareDialog(true);
  };
  
  const handleInfoClick = () => {
    setShowInfoDialog(!showInfoDialog);
  };
  
  // Handle liking a post
  const handleLikePost = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyLiked = likedPosts[postId];
    
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !isCurrentlyLiked
    }));
    
    // Update engagement count in SWR cache
    updatePostEngagement(postId, 'likes', !isCurrentlyLiked);
    
    // Save to localStorage
    if (storageAvailable) {
      const updatedLikes = {
        ...likedPosts,
        [postId]: !isCurrentlyLiked
      };
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
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
    
    // Update engagement count in SWR cache
    updatePostEngagement(postId, 'bookmarks', !isCurrentlyBookmarked);
    
    // Save to localStorage
    if (storageAvailable) {
      const updatedBookmarks = {
        ...bookmarkedPosts,
        [postId]: !isCurrentlyBookmarked
      };
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
    }
  };
  
  // Handle viewing a post
  const handleViewPost = (postId: string) => {
    const newViews = {
      ...postViews,
      [postId]: (postViews[postId] || 0) + 1
    };
    setPostViews(newViews);
    
    // Update engagement count in SWR cache
    updatePostEngagement(postId, 'views', true);
    
    // Save to localStorage
    if (storageAvailable) {
      localStorage.setItem('postViews', JSON.stringify(newViews));
    }
  };

  // Helper function to get image URL with optimized loading
  const getImageUrl = (post: UserPost) => {
    if (post.media && post.media.length > 0) {
      return post.media[0].url;
    }
    return `https://picsum.photos/600/600?random=${post.id}`;
  };

  // Handle back button click
  const handleBackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Check if we can go back in history
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to homepage if there's no history
      router.push('/');
    }
  }, [router]);
  
  // Render loading state
  if (isUserLoading) {
    return (
      <main className="pb-16 min-h-screen">
        <div className="animate-pulse">
          {/* Skeleton for cover image */}
          <div className="h-36 md:h-48 w-full bg-gray-200"></div>
          
          <div className="container-app">
            {/* Skeleton for profile info */}
            <div className="pt-16 mb-4">
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
            
            {/* Skeleton for stats */}
            <div className="flex border-b border-gray-200 mb-4 pb-4">
              <div className="mr-6">
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="mr-6">
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render error state or not found
  if (isUserError || !user) {
    return notFound();
  }

  return (
    <main className="pb-16 min-h-screen">
      <PageTransition>
        {/* Cover Image with Floating Navigation */}
        <div className="relative h-36 md:h-48 w-full bg-gray-200">
          <Image 
            src={coverImageToUse}
            alt={`${user.displayName}'s cover image`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Floating Navigation Buttons - Improved Back Button */}
          <div className="absolute top-0 left-0 right-0 p-2">
            <div className="container-app">
              <button onClick={handleBackClick} className="inline-flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                <FiChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="container-app">
          {/* Profile info */}
          <div className="relative">
            {/* Profile Picture */}
            <div className="absolute -top-12 left-4 border-4 border-white rounded-full bg-white shadow-md">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <BlurImage 
                  src={profileImageToUse}
                  alt={user.displayName}
                  priority={true}
                />
              </div>
              
              {/* Verification Badge */}
              {user.verified && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Follow and Share Buttons */}
            <div className="flex justify-end items-center gap-2 pt-2">
              <button 
                onClick={handleInfoClick}
                className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="More information"
              >
                <FiInfo className="w-4 h-4" />
              </button>
              
              <button 
                onClick={handleShareClick}
                className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Share profile"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
              
              <Button 
                onClick={handleFollowClick}
                variant="primary"
                size="sm"
                className="rounded-full"
              >
                Follow
              </Button>
            </div>
          </div>
          
          {/* User Info */}
          <div className="mt-14 mb-4">
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            <p className="text-gray-600 text-sm">@{user.username}</p>
            
            {/* Bio - only show if it exists */}
            {user.bio && (
              <p className="mt-2 text-sm">{user.bio}</p>
            )}
            
            <div className="mt-2 flex flex-col gap-y-1">
              {/* Location and Home Location using grid to match post layout below */}
              <div className={`${user.homeLocation && user.location ? 'grid grid-cols-2' : 'flex'} gap-x-1 px-1 text-gray-500 text-xs`}>
                {user.homeLocation && (
                  <div className="flex items-center">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">From {user.homeLocation}</span>
                  </div>
                )}
                
                {user.location && (
                  <div className={`flex items-center ${!user.homeLocation ? 'ml-0' : ''}`}>
                    <FiMapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Info Dialog */}
          {showInfoDialog && (
            <div 
              id="info-dialog"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 z-50 w-[90%] max-w-sm animate-fade-in-up"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">About {user.displayName}</h3>
                <button 
                  onClick={() => setShowInfoDialog(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Join Date */}
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-gray-800">Joined</div>
                    <div>{user.joinDate}</div>
                  </div>
                </div>
                
                {/* Website - if available */}
                {user.website && (
                  <div className="flex items-center text-gray-600">
                    <FiLink className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-gray-800">Website</div>
                      <a
                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* User Posts Grid */}
          <div className="pt-4 pb-4 -mx-4 md:mx-0">
            {/* Loading State for Posts */}
            {isPostsLoading && (
              <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 rounded-lg overflow-hidden"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                      animation: 'fadeIn 0.3s ease forwards'
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
            )}
            
            {/* Empty State */}
            {!isPostsLoading && isEmpty && (
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
                <p className="text-sm text-gray-500 mt-1">This user hasn't posted anything yet.</p>
              </div>
            )}
            
            {/* Posts Grid */}
            {!isPostsLoading && posts.length > 0 && (
              <div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-1 px-1 md:px-0">
                {posts.map((post, index) => {
                  // Reference for last post element (for infinite scrolling)
                  const ref = index === posts.length - 1 ? lastPostElementRef : null;
                  
                  return (
                    <div 
                      key={post.id} 
                      ref={ref}
                      className="group flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        opacity: 0,
                        animation: 'fadeIn 0.3s ease forwards'
                      }}
                    >
                      <div className="relative overflow-hidden">
                        <Link href={`/post/${post.id}`} className="block" onClick={() => handleViewPost(post.id)}>
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <BlurImage 
                              src={getImageUrl(post)}
                              alt={post.title}
                              aspectRatio="aspect-[3/4]"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                              priority={index < 4} // Only prioritize the first 4 images
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
                  );
                })}
              </div>
            )}
            
            {/* Load More */}
            {hasMore && (
              <div 
                ref={loadMoreRef} 
                className="flex justify-center py-4"
              >
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
        </div>
      </PageTransition>
      
      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog 
          onClose={() => setShowShareDialog(false)} 
          title={`${user.displayName}'s profile`}
          url={`${window.location.origin}/user/${user.username}`}
          imageUrl={profileImageToUse}
        />
      )}
      
      <Navigation />
    </main>
  );
} 