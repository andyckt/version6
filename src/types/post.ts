/**
 * Post Data Structure
 * 
 * This file defines the post data structure for the travel social media application,
 * including post content, metadata, and visibility settings.
 */

import { User } from './user';

// Post visibility settings
export type PostVisibility = 'public' | 'followers' | 'private';

// Comment settings
export type CommentSetting = 'everyone' | 'followers' | 'none';

// Location information for a post
export interface PostLocation {
  name: string;
  city?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Media item in a post (photo or video)
export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // For videos
  width: number;
  height: number;
  alt?: string;
}

// Tag in a post (hashtag, user mention, etc.)
export interface PostTag {
  id: string;
  type: 'hashtag' | 'mention';
  text: string;
  userId?: number; // For mentions
}

// Comment on a post
export interface Comment {
  id: string;
  userId: number;
  text: string;
  createdAt: string;
  likesCount: number;
  parentId?: string; // For threaded replies
  isEdited: boolean;
}

// Complete Post Structure
export interface Post {
  id: string;
  userId: number;
  
  // Content
  caption: string;
  media: PostMedia[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  location?: PostLocation;
  tags: PostTag[];
  
  // Privacy & Interaction Settings
  visibility: PostVisibility;
  commentSetting: CommentSetting;
  hideStats: boolean;
  
  // Stats
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savedCount: number;
  
  // Comments
  comments: Comment[];
  
  // Optional related post references
  originalPostId?: string; // If this is a reshare
  tripId?: string; // If part of a trip collection
}

/**
 * Create a new post with default values
 * @param userId The user ID of the post creator
 * @param caption The post caption/text
 * @param media Array of media items (photos/videos)
 * @param visibility Visibility setting for the post
 * @returns A new Post object
 */
export const createPost = (
  userId: number,
  caption: string,
  media: PostMedia[],
  visibility: PostVisibility = 'public'
): Post => {
  const now = new Date().toISOString();
  
  return {
    id: `post-${Date.now()}`,
    userId,
    caption,
    media,
    createdAt: now,
    updatedAt: now,
    tags: [],
    visibility,
    commentSetting: 'everyone',
    hideStats: false,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    savedCount: 0,
    comments: []
  };
};

/**
 * Update post visibility
 * @param post The post to update
 * @param visibility The new visibility setting
 * @returns Updated post with new visibility
 */
export const updatePostVisibility = (
  post: Post,
  visibility: PostVisibility
): Post => {
  return {
    ...post,
    visibility,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Format relative time for posts
 * @param dateString ISO date string
 * @returns Formatted relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}; 