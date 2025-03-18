/**
 * Post Utility Functions
 * 
 * This file provides utility functions for creating, filtering, and managing posts,
 * with a focus on post privacy and visibility.
 */

import { Post, PostVisibility, createPost, PostMedia, PostTag } from '@/types/post';
import { User } from '@/types/user';

/**
 * Check if a post is visible to a specific user
 * @param post The post to check visibility for
 * @param currentUser The user trying to view the post (null if not logged in)
 * @param postAuthor The author of the post
 * @returns boolean indicating if the post should be visible
 */
export const isPostVisibleToUser = (
  post: Post,
  currentUser: User | null,
  postAuthor: User
): boolean => {
  // Author can always see their own posts
  if (currentUser && currentUser.id === post.userId) {
    return true;
  }

  switch (post.visibility) {
    case 'public':
      return true;
    
    case 'followers':
      // Check if the current user follows the post author
      if (!currentUser) return false;
      
      // In a real app, we would check if the current user follows the post author
      // For this simplified version, we'll return true if they're logged in
      return true;
    
    case 'private':
      // Only the author can see private posts
      return currentUser?.id === post.userId;
    
    default:
      return false;
  }
};

/**
 * Filter posts based on visibility settings
 * @param posts Array of posts to filter
 * @param currentUser The user viewing the posts (null if not logged in)
 * @param authors Map of user IDs to User objects
 * @returns Filtered array of posts visible to the current user
 */
export const filterVisiblePosts = (
  posts: Post[],
  currentUser: User | null,
  authors: Map<number, User>
): Post[] => {
  return posts.filter(post => {
    const author = authors.get(post.userId);
    if (!author) return false;
    
    return isPostVisibleToUser(post, currentUser, author);
  });
};

/**
 * Create a new post with the specified visibility
 * @param userId ID of the user creating the post
 * @param caption Post caption/text
 * @param media Array of media items (photos/videos)
 * @param visibility Visibility setting for the post
 * @returns A new Post object
 */
export const createUserPost = (
  userId: number,
  caption: string,
  media: PostMedia[],
  visibility: PostVisibility = 'public'
): Post => {
  return createPost(userId, caption, media, visibility);
};

/**
 * Add a location to a post
 * @param post The post to update
 * @param locationName Name of the location
 * @param city Optional city name
 * @param country Optional country name
 * @param lat Optional latitude coordinate
 * @param lng Optional longitude coordinate
 * @returns Updated post with location
 */
export const addLocationToPost = (
  post: Post,
  locationName: string,
  city?: string,
  country?: string,
  lat?: number,
  lng?: number
): Post => {
  return {
    ...post,
    location: {
      name: locationName,
      city,
      country,
      coordinates: lat && lng ? { latitude: lat, longitude: lng } : undefined
    },
    updatedAt: new Date().toISOString()
  };
};

/**
 * Extract hashtags from post caption
 * @param caption Post caption text
 * @returns Array of hashtag strings (without the # symbol)
 */
export const extractHashtags = (caption: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const matches = caption.match(hashtagRegex);
  
  if (!matches) return [];
  
  return matches.map(tag => tag.slice(1)); // Remove the # symbol
};

/**
 * Extract mentions from post caption
 * @param caption Post caption text
 * @returns Array of mention strings (without the @ symbol)
 */
export const extractMentions = (caption: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const matches = caption.match(mentionRegex);
  
  if (!matches) return [];
  
  return matches.map(mention => mention.slice(1)); // Remove the @ symbol
};

/**
 * Generate post tags from caption
 * @param caption Post caption
 * @param usernameToId Function to convert username to user ID (for mentions)
 * @returns Array of PostTag objects
 */
export const generatePostTags = (
  caption: string,
  usernameToId?: (username: string) => number | undefined
): PostTag[] => {
  const hashtags = extractHashtags(caption);
  const mentions = extractMentions(caption);
  
  const hashtagObjects = hashtags.map((tag, index) => ({
    id: `hashtag-${index}-${Date.now()}`,
    type: 'hashtag' as const,
    text: tag
  }));
  
  const mentionObjects = mentions.map((username, index) => ({
    id: `mention-${index}-${Date.now()}`,
    type: 'mention' as const,
    text: username,
    userId: usernameToId ? usernameToId(username) : undefined
  }));
  
  return [...hashtagObjects, ...mentionObjects];
};

/**
 * Check if user can comment on a post
 * @param post The post to check
 * @param currentUser The user trying to comment
 * @param postAuthor The author of the post
 * @returns boolean indicating if the user can comment
 */
export const canUserCommentOnPost = (
  post: Post,
  currentUser: User | null,
  postAuthor: User
): boolean => {
  // Cannot comment if not logged in
  if (!currentUser) return false;
  
  // Author can always comment on their own posts
  if (currentUser.id === post.userId) return true;
  
  switch (post.commentSetting) {
    case 'everyone':
      return true;
    
    case 'followers':
      // In a real app, check if the user follows the author
      return true;
    
    case 'none':
      return false;
    
    default:
      return false;
  }
}; 