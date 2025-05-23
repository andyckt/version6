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

export function useUserPosts(username: string, initialLimit: number = 12) {
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

  // Use SWR Infinite for pagination
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
  });
  
  // Flatten the paginated data
  const posts = data ? data.flatMap(page => page.posts) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  
  // Check if there are more posts to load
  const isEmpty = data?.[0]?.posts.length === 0;
  const hasMore = data ? data[data.length - 1]?.hasMore : false;
  const totalPosts = data?.[0]?.total || 0;
  
  // Function to load more posts
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

  // Function to update post engagement metrics (like, bookmark, view)
  const updatePostEngagement = useCallback((postId: string, type: 'likes' | 'bookmarks' | 'views', increment: boolean) => {
    // Update the post count optimistically
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
        revalidate: false // Don't revalidate immediately
      }
    );
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