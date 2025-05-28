"use client";

import { useState, useEffect } from 'react';

// Define the post type for merchant posts
export interface MerchantPost {
  _id: string;
  title: string;
  username: string;
  displayName: string;
  userProfileImage?: string;
  likes: number;
  bookmarks: number;
  views: number;
  hashtags: string[];
  createdAt: string;
  media: any[];
}

interface UseMerchantPostsResult {
  posts: MerchantPost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
}

export function useMerchantPosts(username: string, initialLimit = 20): UseMerchantPostsResult {
  const [posts, setPosts] = useState<MerchantPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(initialLimit);
  
  const fetchPosts = async (reset = false) => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Reset state if needed
      if (reset) {
        setSkip(0);
        setPosts([]);
      }
      
      // Calculate skip value
      const currentSkip = reset ? 0 : skip;
      
      const response = await fetch(`/api/merchants/${username}/posts?limit=${limit}&skip=${currentSkip}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch merchant posts');
      }
      
      const newPosts = data.posts || [];
      
      // Update posts (append or replace)
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      
      // Update pagination state
      setSkip(currentSkip + newPosts.length);
      setHasMore(newPosts.length === limit && data.total > (currentSkip + newPosts.length));
      
    } catch (err) {
      console.error('Error fetching merchant posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch merchant posts');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch posts on mount and when username changes
  useEffect(() => {
    fetchPosts(true);
  }, [username]);
  
  // Function to load more posts
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts();
    }
  };
  
  // Function to refresh posts
  const refresh = async () => {
    await fetchPosts(true);
  };
  
  return { posts, loading, error, hasMore, loadMore, refresh };
} 