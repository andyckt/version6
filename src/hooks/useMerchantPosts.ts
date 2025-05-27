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
  refresh: () => Promise<void>;
}

export function useMerchantPosts(username: string): UseMerchantPostsResult {
  const [posts, setPosts] = useState<MerchantPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPosts = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/merchants/${username}/posts`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch merchant posts');
      }
      
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching merchant posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch merchant posts');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch posts on mount and when username changes
  useEffect(() => {
    fetchPosts();
  }, [username]);
  
  // Function to manually refresh posts
  const refresh = async () => {
    await fetchPosts();
  };
  
  return { posts, loading, error, refresh };
} 