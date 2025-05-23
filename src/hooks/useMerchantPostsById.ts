"use client";

import { useState, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { MerchantPost } from './useMerchantPosts';

interface MerchantPostsByIdResponse {
  success: boolean;
  posts: MerchantPost[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}

export function useMerchantPostsById(merchantId: number | null, initialLimit: number = 12) {
  const [limit, setLimit] = useState(initialLimit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to get the key for SWR
  const getKey = (pageIndex: number, previousPageData: MerchantPostsByIdResponse | null) => {
    // If no merchant ID is provided, don't fetch
    if (!merchantId) return null;

    // First page, start with initial cursor
    if (pageIndex === 0) {
      return `/api/merchants/id/${merchantId}/posts?limit=${limit}`;
    }

    // If no cursor is returned or we reached the end, return null to stop fetching
    if (previousPageData && !previousPageData.nextCursor) return null;

    // Add the cursor to the API endpoint
    return `/api/merchants/id/${merchantId}/posts?limit=${limit}&cursor=${previousPageData?.nextCursor}`;
  };

  // Fetcher function
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch merchant posts');
    }
    return response.json();
  };

  // Use SWR infinite to handle pagination
  const { 
    data, 
    error, 
    isLoading, 
    isValidating, 
    size, 
    setSize, 
    mutate 
  } = useSWRInfinite<MerchantPostsByIdResponse>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    }
  );

  // Flatten the paginated data into a single array of posts
  const posts = data ? data.flatMap(page => page.posts) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.posts.length === 0;
  const hasMore = data ? data[data.length - 1]?.hasMore || false : false;
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
    await mutate();
    setIsRefreshing(false);
  }, [mutate]);

  // Function to update post engagement metrics
  const updatePostEngagement = useCallback((
    postId: string, 
    type: 'likes' | 'bookmarks' | 'views', 
    increment: boolean
  ) => {
    mutate(
      data => {
        if (!data) return data;
        
        return data.map(page => ({
          ...page,
          posts: page.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                [type]: increment ? post[type] + 1 : post[type] - 1
              };
            }
            return post;
          })
        }));
      },
      { revalidate: false }
    );
  }, [mutate]);

  return {
    posts,
    error,
    isLoading,
    isLoadingMore,
    isEmpty,
    hasMore,
    loadMore,
    refreshPosts,
    isRefreshing,
    isValidating,
    totalPosts,
    updatePostEngagement,
  };
} 