import { useState, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

export interface UserPost {
  id: string;
  title: string;
  description: string;
  media: {
    id: string;
    type: 'image' | 'video';
    url: string;
    width: number;
    height: number;
    aspectRatio: string;
  }[];
  likes: number;
  views: number;
  bookmarks: number;
  hashtags: string[];
  createdAt: string;
  taggedAccounts: {
    username: string;
    accountType?: string;
  }[];
  location: string;
}

interface UserPostsResponse {
  success: boolean;
  posts: UserPost[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export function useUserPosts(username: string, initialLimit: number = 30) {
  const [limit] = useState(initialLimit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define the SWR key generator function
  const getKey = (pageIndex: number, previousPageData: UserPostsResponse | null) => {
    // If no username is provided, don't fetch
    if (!username) return null;
    
    // Reached the end
    if (previousPageData && !previousPageData.posts.length) return null;
    
    // First page, no previous data
    if (pageIndex === 0) return `/api/users/${username}/posts?limit=${limit}`;
    
    // Add cursor for next pages
    return `/api/users/${username}/posts?limit=${limit}&cursor=${previousPageData?.nextCursor}`;
  };

  // Fetch function
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  };

  // Use SWR Infinite for pagination with optimized settings
  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate
  } = useSWRInfinite<UserPostsResponse>(getKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
    persistSize: true,
    keepPreviousData: true, // Keep previous data while fetching new data
    suspense: false, // Don't use suspense to handle loading state ourselves
    revalidateIfStale: false, // Don't revalidate automatically if stale
    revalidateOnReconnect: false, // Don't revalidate automatically on reconnect
  });
  
  // Flatten the paginated data
  const posts = data ? data.flatMap(page => page.posts) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  
  // Check if there are more posts to load
  const isEmpty = data?.[0]?.posts.length === 0;
  const hasMore = data ? data[data.length - 1]?.hasMore : false;
  const totalPosts = data?.[0]?.total || 0;
  
  // Function to load more posts with throttling
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setSize(size + 1);
    }
  }, [setSize, size, isLoadingMore, hasMore]);

  // Function to refresh posts
  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  // Function to update post engagement metrics (like, bookmark, view) with optimistic updates
  const updatePostEngagement = useCallback((postId: string, type: 'likes' | 'bookmarks' | 'views', increment: boolean) => {
    // Update the post count optimistically without waiting for server response
    mutate(
      (currentData) => {
        if (!currentData) return currentData;
        
        // Map through all pages
        return currentData.map(page => ({
          ...page,
          posts: page.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                [type]: post[type] + (increment ? 1 : -1)
              };
            }
            return post;
          })
        }));
      },
      {
        revalidate: false // Don't revalidate immediately for faster UI updates
      }
    );
    
    // Optionally, you could send an API call here to update the server
    // without waiting for the response, allowing for a more responsive UI
    if (type !== 'views') { // Don't make API calls for views to reduce server load
      fetch(`/api/posts/${postId}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }),
      }).catch(err => {
        console.error(`Failed to update ${type} for post ${postId}:`, err);
        // Could potentially revert the optimistic update here if the API call fails
      });
    }
  }, [mutate]);

  return {
    posts,
    error,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    hasMore,
    loadMore,
    refreshPosts,
    isRefreshing,
    isValidating,
    totalPosts,
    updatePostEngagement
  };
} 