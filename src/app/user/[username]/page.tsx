"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShare2, FiGrid, FiBookmark, FiTag, FiCheck } from 'react-icons/fi';
import { getUserByUsername } from '@/data/users';
import { travelPosts } from '@/data/posts';
import BlurImage from '@/components/BlurImage';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { User } from '@/data/users';

type Tab = 'posts' | 'saved' | 'tagged';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    // In a real app, this would be an API call
    try {
      const userData = getUserByUsername(username);
      
      if (!userData) {
        setError("User not found");
        setIsLoading(false);
        return;
      }
      
      setUser(userData);
      
      // Get posts by this user
      const posts = travelPosts.filter(post => post.username === username);
      setUserPosts(posts);
      
      setIsLoading(false);
    } catch (err) {
      setError("Error loading user data");
      setIsLoading(false);
    }
  }, [username]);

  // Toggle follow status
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    
    // In a real app, this would call an API to update follow status
    console.log(`${isFollowing ? 'Unfollowed' : 'Followed'} ${username}`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container-app flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-32 h-5 bg-gray-200 animate-pulse mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <Navigation />
      </main>
    );
  }

  // Render error state
  if (error || !user) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container-app flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
            <p className="text-gray-500 mb-4">We couldn't find a user with the username @{username}</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Header />
      <PageTransition>
        <div className="container-app">
          {/* Cover Image */}
          <div className="relative w-full h-40 md:h-60 bg-gray-100 overflow-hidden">
            {user.coverImage && (
              <Image 
                src={user.coverImage}
                alt={`${user.displayName}'s cover image`}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            )}
          </div>

          {/* Profile Header */}
          <div className="px-4">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20 mb-6 relative z-10">
              {/* Profile Picture */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <Image 
                  src={user.profileImage}
                  alt={user.displayName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Profile Actions */}
              <div className="flex flex-col sm:flex-row justify-between flex-grow items-start sm:items-center mt-4 sm:mt-0 sm:ml-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold mr-2">{user.displayName}</h1>
                    {user.verified && (
                      <span className="bg-blue-500 text-white rounded-full p-0.5">
                        <FiCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
                
                <div className="flex mt-4 sm:mt-0">
                  <button 
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-md font-medium text-sm mr-2 ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="p-2 rounded-md bg-gray-200">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="mb-6">
              <p className="mb-2">{user.bio}</p>
              
              <div className="flex flex-wrap text-sm text-gray-500">
                {user.location && (
                  <span className="mr-4 mb-1">
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a 
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 mr-4 mb-1"
                  >
                    {user.website.replace(/^https?:\/\//i, '')}
                  </a>
                )}
                <span className="mr-4 mb-1">Joined {user.joinDate}</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex border-b border-gray-200 mb-4 pb-4">
              <div className="mr-6">
                <span className="font-bold">{user.stats.posts}</span>
                <span className="text-gray-500 text-sm ml-1">posts</span>
              </div>
              <div className="mr-6">
                <span className="font-bold">{user.stats.followers.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">followers</span>
              </div>
              <div>
                <span className="font-bold">{user.stats.following.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">following</span>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`flex items-center justify-center px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === 'posts' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                <FiGrid className="w-4 h-4 mr-2" />
                Posts
              </button>
              <button
                className={`flex items-center justify-center px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === 'saved' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab('saved')}
              >
                <FiBookmark className="w-4 h-4 mr-2" />
                Saved
              </button>
              <button
                className={`flex items-center justify-center px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === 'tagged' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab('tagged')}
              >
                <FiTag className="w-4 h-4 mr-2" />
                Tagged
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="px-0 md:px-4">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-3 gap-1 md:gap-1">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <Link href={`/post/${post.id}`} key={post.id} className="aspect-square relative overflow-hidden bg-gray-100">
                      <BlurImage
                        src={post.image || (post.media && post.media[0]?.url) || ''}
                        alt={post.title}
                        aspectRatio="pb-[133.33%]"
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    <p className="mb-2">No posts yet</p>
                    <p className="text-sm">This user hasn't posted any content yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div className="py-12 text-center text-gray-500">
                <p className="mb-2">Saved posts are private</p>
                <p className="text-sm">Only you can see what you've saved</p>
              </div>
            )}
            
            {activeTab === 'tagged' && (
              <div className="py-12 text-center text-gray-500">
                <p className="mb-2">No tagged posts</p>
                <p className="text-sm">When people tag this user in posts, they'll appear here.</p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
      <Navigation />
    </main>
  );
} 