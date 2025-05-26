import { useState, useEffect } from 'react';

// Define the type for grid posts from the API
export interface GridPost {
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
  primaryImage?: {
    url: string;
    aspectRatio: string;
    width: number;
    height: number;
  };
}

interface UsePostsResult {
  posts: GridPost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refreshPosts: () => void;
}

export function usePosts(category?: string, initialLimit = 30): UsePostsResult {
  const [posts, setPosts] = useState<GridPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(initialLimit);

  // Function to fetch posts
  const fetchPosts = async (refresh = false) => {
    try {
      setLoading(true);
      
      // Clear posts if refreshing
      if (refresh) {
        setPosts([]);
        setCursor(null);
      }
      
      // Build query string
      let url = `/api/posts/grid?limit=${limit}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (cursor && !refresh) url += `&cursor=${cursor}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error fetching posts');
      }
      
      // If refreshing, replace posts, otherwise append
      setPosts(prev => refresh ? data.posts : [...prev, ...data.posts]);
      
      // Update cursor for pagination
      setCursor(data.nextCursor);
      
      // Check if there are more posts to load
      setHasMore(!!data.nextCursor);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts(true);
  }, [category]);

  // Function to load more posts
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts();
    }
  };

  // Function to refresh posts
  const refreshPosts = () => {
    fetchPosts(true);
  };

  return { posts, loading, error, hasMore, loadMore, refreshPosts };
} 