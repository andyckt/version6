export interface User {
  id: number;                    // Numeric user ID (each user has an unique numeric ID)
  username: string;              // Alphanumeric username (each user has an unique username, can have lowercase letters, numbers, and underscore) (15 characters max)
  displayName: string;           // User's display name, can add emojis like Travel Enthusiast ✈️
  bio: string;                   // User's short biography/description
  profileImage: string;          // URL to profile image
  coverImage: string;            // URL to cover image
  verified: boolean;             // Verification status
  location: string;              // Current travelling location
  homeLocation: string;          // Home location 
  website: string;               // Personal website URL
  joinDate: string;              // Date user joined
  role: 'user' | 'creator' | 'admin'; // User role in the platform
  // Stats
  stats: {
    posts: number;               // Number of posts
    followers: number;           // Number of followers
    following: number;           // Number of people user follows
  };
}

// Sample users data
export const users: User[] = [
  {
    id: 101,
    username: "wanderlust_emma",
    displayName: "Emma Chen ✈️",
    bio: "Travel photographer & writer exploring hidden gems in Asia. Based in Shanghai, always planning the next adventure!",
    profileImage: "https://picsum.photos/400/400?random=101",
    coverImage: "https://picsum.photos/1200/400?random=102",
    verified: true,
    location: "Currently: Chengdu, China",
    homeLocation: "Shanghai, China",
    website: "https://emmachentravels.com",
    joinDate: "January 2023",
    role: "creator",
    stats: {
      posts: 87,
      followers: 15400,
      following: 320
    }
  },
  {
    id: 106,
    username: "andyckt123",
    displayName: "Andy Cheung (the founder of Bobe) 🤔",
    bio: "Travel photographer & writer exploring hidden gems in Asia.",
    profileImage: "",
    coverImage: "",
    verified: true,
    location: "Currently: Shanghai, China",
    homeLocation: "Hong Kong, China",
    website: "",
    joinDate: "March 2025",
    role: "user",
    stats: {
      posts: 8,
      followers: 0,
      following: 0
    }
  },
  {
    id: 102,
    username: "backpacker_li",
    displayName: "Li Wei 🎒",
    bio: "Budget traveler exploring China one province at a time. Food lover & hiking enthusiast. Tips & tricks for solo travelers.",
    profileImage: "https://picsum.photos/400/400?random=103",
    coverImage: "https://picsum.photos/1200/400?random=104",
    verified: false,
    location: "Currently: Xi'an, China",
    homeLocation: "Beijing, China",
    website: "https://backpackerli.travel.blog",
    joinDate: "March 2023",
    role: "user",
    stats: {
      posts: 42,
      followers: 3200,
      following: 510
    }
  },
  {
    id: 103,
    username: "luxury_zhao",
    displayName: "Zhao Min 💎",
    bio: "Luxury travel experiences | 5-star hotel reviews | Fine dining | Private tours | Making memories in style",
    profileImage: "https://picsum.photos/400/400?random=105",
    coverImage: "https://picsum.photos/1200/400?random=106",
    verified: true,
    location: "Currently: Sanya, Hainan",
    homeLocation: "Hong Kong SAR",
    website: "https://luxurylifewithzhao.com",
    joinDate: "October 2022",
    role: "creator",
    stats: {
      posts: 68,
      followers: 22800,
      following: 175
    }
  },
  {
    id: 104,
    username: "adventure_yan",
    displayName: "Yan Jackson 🏔️",
    bio: "Outdoor adventurer | Rock climbing | Hiking | Camping | Half Chinese, half American exploring my heritage through adventure",
    profileImage: "https://picsum.photos/400/400?random=107",
    coverImage: "https://picsum.photos/1200/400?random=108",
    verified: false,
    location: "Currently: Zhangjiajie, China",
    homeLocation: "San Francisco, USA",
    website: "https://adventuresofyan.com",
    joinDate: "May 2023",
    role: "user",
    stats: {
      posts: 35,
      followers: 4700,
      following: 283
    }
  },
  {
    id: 105,
    username: "foodie_zhang",
    displayName: "Zhang Wei 🍜",
    bio: "Culinary tour guide in China | Street food explorer | Cooking class host | Ask me about the best local dishes in any Chinese city!",
    profileImage: "https://picsum.photos/400/400?random=109",
    coverImage: "https://picsum.photos/1200/400?random=110",
    verified: true,
    location: "Currently: Guangzhou, China",
    homeLocation: "Chengdu, China",
    website: "https://tastychina.co",
    joinDate: "February 2022",
    role: "creator",
    stats: {
      posts: 103,
      followers: 18600,
      following: 412
    }
  }
];

// Function to get user by username
export function getUserByUsername(username: string): User | undefined {
  return users.find(user => user.username === username);
}

// Function to get user by ID
export function getUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
} 