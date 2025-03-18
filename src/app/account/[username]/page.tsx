"use client";

/**
 * Dynamic User Account Page
 * 
 * This page displays a user's profile based on the username or user ID parameter.
 * It supports two routing patterns:
 * 1. /account/[username] - Using the alphanumeric username (e.g., /account/travelenthusiast)
 * 2. /account/[id] - Using the numeric user ID (e.g., /account/12345678)
 * 
 * This dual routing approach allows for username changes while maintaining
 * persistent links to profiles, similar to Twitter's implementation.
 * 
 * It combines elements from Twitter and Bluesky with travel-specific features.
 * Mobile-first approach with responsive design.
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileSkeleton from '@/components/ProfileSkeleton';
import ActivityBottomSheet from '@/components/ActivityBottomSheet';
import { 
  FiMapPin, 
  FiCalendar, 
  FiLink, 
  FiSettings, 
  FiChevronLeft,
  FiShare2,
  FiClock
} from 'react-icons/fi';
import { travelPosts } from '@/data/posts';
import BlurImage from '@/components/BlurImage';

// Define Activity type
interface Activity {
  type: 'like' | 'read' | 'checkin';
  content: string;
  time: string;
  image: string;
  postId?: number;
}

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    // Basic Identifiers
    id: 12345678,
    username: 'travelenthusiast',
    displayName: 'Travel Enthusiast ✈️',
    bio: 'Travel blogger exploring Asia. Sharing authentic experiences and hidden gems. Currently based in Seoul.',
    profileImage: 'https://placehold.co/400x400/ffd100/ffffff?text=T',
    coverImage: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3',
    verified: true,
    location: 'Seoul, South Korea',
    homeLocation: 'Vancouver, Canada',
    website: 'https://travelenthusiast.blog',
    joinDate: '2021-03-15',
    
    // Stats
    stats: {
      posts: 87,
      followers: 1243,
      following: 348
    },
    
    // Travel Stats
    travelStats: {
      countriesVisited: 12,
      citiesExplored: 48,
      placesCheckedIn: 156
    },
    
    // Recent Activity
    recentActivity: [
      {
        type: 'like' as const,
        content: 'Liked a post about Shanghai Tower',
        time: '2 days ago',
        image: 'https://placehold.co/600x600/ffd100/ffffff'
      },
      {
        type: 'read' as const,
        content: 'Read a post about Best Street Food in Seoul',
        time: '3 days ago',
        image: 'https://placehold.co/600x600/ff6b6b/ffffff'
      },
      {
        type: 'read' as const,
        content: 'Read a post about Ancient temples of Siem Reap',
        time: '5 days ago',
        image: 'https://placehold.co/600x600/7b68ee/ffffff'
      },
      {
        type: 'like' as const,
        content: 'Liked a post about Luxury hotel experience in Bali',
        time: '1 week ago',
        image: 'https://placehold.co/600x600/4ecdc4/ffffff'
      },
      {
        type: 'checkin' as const,
        content: 'Checked in at The Bund, Shanghai',
        time: '1 week ago',
        image: 'https://placehold.co/600x600/4ecdc4/ffffff'
      }
    ] as Activity[],
    
    // Authentication & Security (not exposed to frontend)
    auth: {
      email: 'travel.enthusiast@example.com',
      emailVerified: true,
      password: 'hashed_password_would_be_here',
      salt: 'random_salt_string',
      twoFactorEnabled: true,
      twoFactorMethod: 'app',
      lastLogin: '2023-11-15T08:42:31Z',
      loginAttempts: 0,
      accountLocked: false,
      providers: [
        {
          provider: 'google',
          providerId: 'google_user_id_123',
          lastLogin: '2023-10-20T14:22:10Z'
        }
      ]
    },
    
    // Privacy & Settings
    settings: {
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'followers',
        locationSharing: true,
        showEmail: false
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        notificationTypes: {
          newFollower: true,
          likes: true,
          comments: true,
          mentions: true,
          directMessages: true
        }
      },
      appearance: {
        theme: 'system',
        language: 'en-US'
      }
    },
    
    // Compliance & Legal
    compliance: {
      termsAccepted: true,
      termsAcceptedVersion: '2.1',
      termsAcceptedDate: '2021-03-15T10:30:00Z',
      privacyPolicyAccepted: true,
      privacyPolicyVersion: '3.0',
      privacyPolicyDate: '2021-03-15T10:30:00Z',
      marketingConsent: true,
      dataProcessingConsent: true
    },
    
    // Account Management
    accountManagement: {
      accountCreated: '2021-03-15T10:30:00Z',
      accountStatus: 'active',
      subscriptionTier: 'free',
      subscriptionStatus: 'none'
    }
  },
  {
    // Basic Identifiers
    id: 87654321,
    username: 'adventureseeker',
    displayName: 'Adventure Seeker 🏔️',
    bio: 'Outdoor enthusiast and adventure photographer. Hiking, climbing, and exploring remote destinations. Currently planning a trek in Nepal.',
    profileImage: 'https://placehold.co/400x400/4ecdc4/ffffff?text=A',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    verified: false,
    location: 'Kathmandu, Nepal',
    homeLocation: 'Colorado, USA',
    website: 'https://adventureseeker.photo',
    joinDate: '2022-06-10',
    
    // Stats
    stats: {
      posts: 42,
      followers: 876,
      following: 215
    },
    
    // Travel Stats
    travelStats: {
      countriesVisited: 8,
      citiesExplored: 23,
      placesCheckedIn: 67
    },
    
    // Recent Activity
    recentActivity: [
      {
        type: 'like' as const,
        content: 'Liked a post about Himalayan Trekking Routes',
        time: '1 day ago',
        image: 'https://placehold.co/600x600/4ecdc4/ffffff'
      },
      {
        type: 'read' as const,
        content: 'Read a post about Best Camping Gear for 2023',
        time: '3 days ago',
        image: 'https://placehold.co/600x600/ff6b6b/ffffff'
      },
      {
        type: 'checkin' as const,
        content: 'Checked in at Annapurna Base Camp',
        time: '1 week ago',
        image: 'https://placehold.co/600x600/7b68ee/ffffff'
      }
    ] as Activity[],
    
    // Authentication & Security (not exposed to frontend)
    auth: {
      email: 'adventure.seeker@example.com',
      emailVerified: true,
      password: 'hashed_password_would_be_here',
      salt: 'random_salt_string',
      twoFactorEnabled: false,
      twoFactorMethod: 'none',
      lastLogin: '2023-11-14T16:18:45Z',
      loginAttempts: 0,
      accountLocked: false,
      providers: [
        {
          provider: 'apple',
          providerId: 'apple_user_id_456',
          lastLogin: '2023-11-14T16:18:45Z'
        }
      ]
    },
    
    // Privacy & Settings
    settings: {
      privacy: {
        profileVisibility: 'public',
        activityVisibility: 'public',
        locationSharing: true,
        showEmail: false
      },
      notifications: {
        email: true,
        push: true,
        sms: true,
        notificationTypes: {
          newFollower: true,
          likes: false,
          comments: true,
          mentions: true,
          directMessages: true
        }
      },
      appearance: {
        theme: 'dark',
        language: 'en-US'
      }
    },
    
    // Compliance & Legal
    compliance: {
      termsAccepted: true,
      termsAcceptedVersion: '2.3',
      termsAcceptedDate: '2022-06-10T14:22:10Z',
      privacyPolicyAccepted: true,
      privacyPolicyVersion: '3.1',
      privacyPolicyDate: '2022-06-10T14:22:10Z',
      marketingConsent: false,
      dataProcessingConsent: true
    },
    
    // Account Management
    accountManagement: {
      accountCreated: '2022-06-10T14:22:10Z',
      accountStatus: 'active',
      subscriptionTier: 'free',
      subscriptionStatus: 'none'
    }
  }
];

// For reference to the original user
const mockUser = mockUsers[0];

// For demo purposes, we'll create mock saved posts
// In a real app, these would come from an API
const mockSavedPosts = travelPosts.slice(5, 8);

// Interface for the page props
interface AccountPageProps {
  params: {
    username: string;
  };
}

export default function AccountPage({ params }: AccountPageProps) {
  const { username } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<typeof mockUser | null>(null);
  const [isActivitySheetOpen, setIsActivitySheetOpen] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchUserData = async () => {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if the username parameter is numeric (ID) or alphanumeric (username)
      const isNumericId = /^\d+$/.test(username);
      
      // Find the user in our mock database
      let foundUser = null;
      
      if (isNumericId) {
        // If numeric, find by ID
        foundUser = mockUsers.find(user => user.id.toString() === username);
      } else {
        // If alphanumeric, find by username (case insensitive)
        foundUser = mockUsers.find(user => 
          user.username.toLowerCase() === username.toLowerCase()
        );
      }
      
      setUserData(foundUser || null);
      setIsLoading(false);
    };
    
    fetchUserData();
  }, [username]);
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <main className="pb-16 min-h-screen">
        {/* Cover Image with Floating Navigation */}
        <div className="relative h-36 md:h-48 w-full bg-gray-200 animate-pulse">
          {/* Floating Navigation Buttons */}
          <div className="absolute top-0 left-0 right-0 p-2">
            <div className="container-app">
              <div className="flex items-center justify-between">
                {/* Back Button Placeholder */}
                <div className="p-1.5 bg-black/20 backdrop-blur-sm rounded-full shadow-sm w-7 h-7 animate-pulse"></div>
                
                {/* Settings Button Placeholder */}
                <div className="w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full shadow-sm animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        <ProfileSkeleton />
        
        <Navigation />
      </main>
    );
  }
  
  // If user not found
  if (!userData) {
    return notFound();
  }
  
  // For demo purposes, we'll show all posts as user's posts
  const userPosts = travelPosts;
  
  // For demo purposes, determine if this is the user's own profile
  // Check both ID and username to support both routing methods
  const isOwnProfile = userData ? (
    userData.username.toLowerCase() === mockUser.username.toLowerCase() || 
    userData.id === mockUser.id
  ) : false;
  
  return (
    <main className="pb-16 min-h-screen">
      <PageTransition>
        {/* Cover Image with Floating Navigation */}
        <div className="relative h-36 md:h-48 w-full bg-gray-200">
          <Image 
            src={userData.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          
          {/* Floating Navigation Buttons */}
          <div className="absolute top-0 left-0 right-0 p-2">
            <div className="container-app">
              <div className="flex items-center justify-between">
                {/* Back Button */}
                <Link href="/account" className="p-1.5 bg-black/30 backdrop-blur-sm rounded-full shadow-sm hover:bg-black/40 transition-colors">
                  <FiChevronLeft className="w-4 h-4 text-white" />
                </Link>
                
                {/* Settings/Share Button */}
                {isOwnProfile ? (
                  <button className="p-1.5 bg-black/30 backdrop-blur-sm rounded-full shadow-sm hover:bg-black/40 transition-colors">
                    <FiSettings className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button className="p-1.5 bg-black/30 backdrop-blur-sm rounded-full shadow-sm hover:bg-black/40 transition-colors">
                    <FiShare2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-app">
          {/* Profile info */}
          <div className="relative">
            {/* Profile Picture */}
            <div className="absolute -top-12 left-4 border-4 border-white rounded-full bg-white shadow-md">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image 
                  src={userData.profileImage}
                  alt={userData.displayName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Verification Badge */}
              {userData.verified && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Follow/Edit Profile Button and Activity Button */}
            <div className="flex justify-end pt-2 gap-2">
              {isOwnProfile && (
                <button 
                  onClick={() => setIsActivitySheetOpen(true)}
                  className="p-2 bg-white border border-gray-200 text-primary rounded-full"
                  aria-label="View activity"
                >
                  <FiClock className="w-5 h-5" />
                </button>
              )}
              
              {isOwnProfile ? (
                <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-800 rounded-full text-sm font-medium">
                  Edit Profile
                </button>
              ) : (
                <button className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium">
                  Follow
                </button>
              )}
            </div>
          </div>
          
          {/* User Info */}
          <div className="mt-14 mb-4">
            <h1 className="text-xl font-bold">{userData.displayName}</h1>
            <p className="text-gray-600 text-sm">@{userData.username}</p>
            
            <p className="mt-2 text-sm">{userData.bio}</p>
            
            <div className="mt-2 flex flex-col gap-y-1 text-sm">
              {/* Location */}
              <div className="flex items-center text-gray-600">
                <FiMapPin className="w-3.5 h-3.5 mr-1.5" />
                <span>I am a traveller from {userData.homeLocation}</span>
              </div>
              
              {/* Join Date and Website */}
              <div className="flex items-center text-gray-600">
                <FiCalendar className="w-3.5 h-3.5 mr-1.5" />
                <span>Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                
                {userData.website && (
                  <>
                    <span className="mx-2">•</span>
                    <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                      <FiLink className="w-3.5 h-3.5 mr-1" />
                      {userData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="text-center flex-1">
              <div className="font-bold">{userData.stats.posts}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-bold">{userData.stats.followers}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-bold">{userData.stats.following}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>
          
          {/* Profile Tabs Component */}
          <ProfileTabs 
            userPosts={userPosts} 
            savedPosts={mockSavedPosts}
            likedPosts={[]}
          />
        </div>
      </PageTransition>
      
      {/* Activity Bottom Sheet */}
      <ActivityBottomSheet 
        isOpen={isActivitySheetOpen}
        onClose={() => setIsActivitySheetOpen(false)}
        activities={userData.recentActivity}
        likedPosts={userData.recentActivity.filter(a => a.type === 'like').map((a, i) => ({
          id: i,
          title: a.content,
          image: a.image,
          author: userData.displayName,
          likes: Math.floor(Math.random() * 100) + 10,
          tags: ['Travel', 'Liked']
        }))}
      />
      
      <Navigation />
    </main>
  );
} 