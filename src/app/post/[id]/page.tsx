"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft, FiHeart, FiMessageSquare, FiBookmark, FiShare2, FiEdit2, FiX, FiGlobe, FiUsers, FiLock } from 'react-icons/fi'
import { travelPosts } from '@/data/posts'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import BlurImage from '@/components/BlurImage'
import EditPostForm from '@/components/EditPostForm'
import MediaCarousel from '@/components/MediaCarousel'
import { Post, PostVisibility } from '@/types/post'
import { useUser } from '@/components/UserContext'

// Mock additional media for demonstration
const mockAdditionalMedia = [
  {
    id: 'video-1',
    type: 'video' as const,
    url: 'https://res.cloudinary.com/demo/video/upload/v1689792571/production_ID_4281280.mp4',
    thumbnail: 'https://placehold.co/600x800/333/ffffff?text=Video',
    width: 600,
    height: 800
  },
  {
    id: 'image-2',
    type: 'image' as const,
    url: 'https://placehold.co/600x800/ff9f1c/ffffff',
    width: 600,
    height: 800
  },
  {
    id: 'image-3',
    type: 'image' as const,
    url: 'https://placehold.co/600x800/4ecdc4/ffffff',
    width: 600,
    height: 800
  }
];

export default function PostDetail({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id)
  const post = travelPosts.find(post => post.id === postId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { user } = useUser()
  
  if (!post) {
    return <div className="container-app py-20 text-center">Post not found</div>
  }

  // Convert TravelPost to Post format
  const convertToPost = (): Post => {
    // For demo purposes, add mock media to posts with even IDs
    const mediaItems = post.id % 2 === 0 
      ? [
          {
            id: `image-${post.id}`,
            type: 'image' as const,
            url: post.image,
            width: 600,
            height: 800
          },
          ...mockAdditionalMedia
        ]
      : [
          {
            id: `image-${post.id}`,
            type: 'image' as const,
            url: post.image,
            width: 600,
            height: 800
          }
        ];
    
    // Assign visibility based on post id (for demo)
    let visibility: PostVisibility = 'public';
    if (post.id % 5 === 0) visibility = 'private';
    else if (post.id % 3 === 0) visibility = 'followers';
    
    return {
      id: post.id.toString(),
      userId: 1, // Assuming current user ID is 1
      caption: post.title + (post.description ? '\n\n' + post.description : ''),
      media: mediaItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: post.tags.map((tag, index) => ({
        id: `tag-${index}`,
        type: 'hashtag',
        text: tag
      })),
      visibility,
      commentSetting: 'everyone',
      hideStats: false,
      likesCount: post.likes,
      commentsCount: 2, // Hardcoded from the UI
      sharesCount: 0,
      savedCount: 0,
      comments: []
    }
  }

  const convertedPost = convertToPost();

  // Get visibility icon
  const getVisibilityIcon = (visibility: PostVisibility) => {
    switch (visibility) {
      case 'public':
        return <FiGlobe className="text-green-500" />;
      case 'followers':
        return <FiUsers className="text-blue-500" />;
      case 'private':
        return <FiLock className="text-red-500" />;
    }
  };

  // Get visibility text
  const getVisibilityText = (visibility: PostVisibility) => {
    switch (visibility) {
      case 'public':
        return 'Public';
      case 'followers':
        return 'Followers Only';
      case 'private':
        return 'Private';
    }
  };

  // Handler for saving post updates
  const handleSavePost = async (updatedPost: Post): Promise<boolean> => {
    console.log('Saving updated post:', updatedPost)
    // In a real app, this would send the updated post to an API
    // For now, we'll just close the modal and pretend it worked
    setIsEditModalOpen(false)
    return true
  }

  return (
    <main className="pb-16 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="p-2 transition-transform hover:scale-110">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-medium">Travel Note</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app">
          {/* Author info */}
          <div className="flex items-center py-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <Image 
                src={`https://placehold.co/200x200/ffd100/ffffff?text=${post.author.charAt(0)}`}
                alt={post.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-sm">{post.author}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <span>Travel Enthusiast</span>
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  {getVisibilityIcon(convertedPost.visibility)}
                  <span className="ml-1">{getVisibilityText(convertedPost.visibility)}</span>
                </span>
              </div>
            </div>
            <div className="ml-auto flex space-x-2">
              {/* Only show edit button if user is the author (using ID 1 for demo) */}
              {user && user.id === 1 && (
                <button 
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <FiEdit2 className="w-3 h-3 mr-1" />
                  Edit
                </button>
              )}
              <button className="px-4 py-1.5 text-xs font-medium bg-primary rounded-full transition-transform hover:scale-105 active:scale-95">
                Follow
              </button>
            </div>
          </div>

          {/* Post media - now using MediaCarousel */}
          <div className="mb-4">
            <MediaCarousel 
              media={convertedPost.media} 
              aspectRatio="aspect-[4/5]"
            />
          </div>

          {/* Interaction buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 transition-transform hover:scale-110 active:scale-95">
                <FiHeart className="w-6 h-6" />
              </button>
              <button className="p-2 transition-transform hover:scale-110 active:scale-95">
                <FiMessageSquare className="w-6 h-6" />
              </button>
              <button className="p-2 transition-transform hover:scale-110 active:scale-95">
                <FiShare2 className="w-6 h-6" />
              </button>
            </div>
            <button className="p-2 transition-transform hover:scale-110 active:scale-95">
              <FiBookmark className="w-6 h-6" />
            </button>
          </div>

          {/* Likes count */}
          <div className="mb-2">
            <p className="text-sm font-medium">{post.likes} likes</p>
          </div>

          {/* Post content */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">{post.title}</h2>
            <p className="text-base leading-relaxed mb-4">
              {post.description || `Exploring the beautiful ${post.tags.join(' and ')} areas. This trip was amazing and I'd recommend it to anyone looking for an authentic travel experience. The local culture, food, and scenery were absolutely breathtaking.`}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">Posted 2 days ago</p>
          </div>

          {/* Comments section */}
          <div className="border-t border-gray-100 pt-4 mb-8">
            <h3 className="font-medium mb-4">Comments</h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image 
                    src="https://placehold.co/200x200/ffd100/ffffff?text=J"
                    alt="Commenter"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm"><span className="font-medium">JourneyLover</span> This looks amazing! How many days did you spend there?</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image 
                    src="https://placehold.co/200x200/ffd100/ffffff?text=T"
                    alt="Commenter"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm"><span className="font-medium">TravelBug</span> The colors in this photo are stunning! What camera did you use?</p>
                  <p className="text-xs text-gray-500 mt-1">12 hours ago</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image 
                  src="https://placehold.co/200x200/ffd100/ffffff?text=Y"
                  alt="Your profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full text-sm py-2 focus:outline-none"
                />
              </div>
              <button className="text-primary font-medium text-sm">Post</button>
            </div>
          </div>
        </div>
      </PageTransition>
      
      {/* Edit Post Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Edit Post</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* Edit form */}
            <div className="p-4">
              <EditPostForm 
                post={convertedPost} 
                onSave={handleSavePost} 
                onCancel={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      <Navigation />
    </main>
  )
} 