"use client";

import useSWR from 'swr';
import { User } from '@/data/users';
import { getUserByUsername } from '@/data/users';

// Interface for MongoDB user
interface MongoUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  location: string;
  homeLocation: string;
  website: string;
  joinDate: string;
  role: 'user' | 'creator' | 'admin';
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

// API fetcher for MongoDB
const apiFetcher = async (username: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${username}`);
    
    // If the API request fails, fall back to static data
    if (!response.ok) {
      console.warn(`API request failed, falling back to static data for user: ${username}`);
      const staticUser = getUserByUsername(username);
      if (!staticUser) throw new Error('User not found');
      return staticUser;
    }
    
    // Convert MongoDB user to our static User interface
    const mongoUser: MongoUser = await response.json();
    
    return {
      id: parseInt(mongoUser._id.substring(0, 8), 16), // Generate a numeric ID from ObjectId
      username: mongoUser.username,
      displayName: mongoUser.displayName,
      bio: mongoUser.bio,
      profileImage: mongoUser.profileImage,
      coverImage: mongoUser.coverImage,
      verified: mongoUser.verified,
      location: mongoUser.location,
      homeLocation: mongoUser.homeLocation,
      website: mongoUser.website,
      joinDate: new Date(mongoUser.joinDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      role: mongoUser.role,
      stats: mongoUser.stats
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // Final fallback to static data
    const staticUser = getUserByUsername(username);
    if (!staticUser) throw new Error('User not found');
    return staticUser;
  }
};

// Original static data fetcher (for backward compatibility)
const staticFetcher = async (username: string) => {
  const user = await getUserByUsername(username);
  if (!user) throw new Error('User not found');
  return user;
};

export function useUser(username: string) {
  // Use API fetcher but gracefully fall back to static data if needed
  const { data, error, isLoading, mutate } = useSWR<User>(
    username ? `/api/users/${username}` : null,
    () => apiFetcher(username),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
} 