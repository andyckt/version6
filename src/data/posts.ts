export interface TravelPost {
  id: number;
  title: string;
  image?: string;
  media?: MediaItem[];
  userId: number;           // Reference to user ID
  username: string;         // Username - display with @ prefix (e.g., @username) when showing the author
  createdAt: string;        // Post creation date
  likes: number;
  bookmarks?: number;
  views: number;            // Track view count for posts
  hashtags: string[];
  description?: string;
  taggedAccounts?: TaggedAccount[];
  location?: string;        // Location where the post was created
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  aspectRatio?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface TaggedAccount {
  username: string;  // Reference to user or merchant username
  accountType?: string; // Type of account (user, restaurant, hotel, etc.)
}

export const travelPosts: TravelPost[] = [];
// Empty array - all sample posts removed 