import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft, FiHeart, FiMessageSquare, FiBookmark, FiShare2, FiMoreHorizontal } from 'react-icons/fi'
import { travelPosts } from '@/data/posts'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import BlurImage from '@/components/BlurImage'

export default function PostDetail({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id)
  const post = travelPosts.find(post => post.id === postId)
  
  if (!post) {
    return <div className="container-app py-20 text-center">Post not found</div>
  }

  // Create a username from author (simulating a user ID)
  const username = post.author.toLowerCase().replace(/\s+/g, '');

  return (
    <main className="pb-12 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-1.5">
            {/* Left section - Back button */}
            <Link href="/" className="p-1.5 transition-transform hover:scale-110 active:scale-95">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* Center section - Profile and username */}
            <Link href={`/account/${username}`} className="flex items-center transition-transform hover:scale-105 active:scale-95">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2">
                <Image 
                  src={`https://placehold.co/200x200/ffd100/ffffff?text=${post.author.charAt(0)}`}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-sm">@{username}</span>
            </Link>
            
            {/* Right section - Share button */}
            <button className="p-1.5 transition-transform hover:scale-110 active:scale-95">
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <PageTransition>
        {/* Post image - Full width on mobile, contained on desktop */}
        <div className="md:container-app md:mx-auto md:px-4 mb-4">
          <BlurImage 
            src={post.image} 
            alt={post.title}
            aspectRatio="aspect-square"
            priority={true}
            sizes="(max-width: 768px) 100vw, 448px"
            className="md:rounded-lg"
          />
        </div>
          
        <div className="container-app">
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
          <div className="border-t border-gray-100 pt-4 mb-20">
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
          </div>
        </div>
      </PageTransition>
      
      {/* Post-specific sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-1.5 px-4 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="container-app flex items-center">
          {/* Comment input */}
          <div className="flex-grow mr-4">
            <div className="bg-gray-100 rounded-full px-4 py-1.5 flex items-center">
              <span className="text-gray-400 mr-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="bg-transparent w-full text-sm focus:outline-none"
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-5">
            {/* Like button with count */}
            <button className="flex items-center transition-transform hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm ml-1 text-gray-800">{post.likes}</span>
            </button>
            
            {/* Star/Save button */}
            <button className="flex items-center transition-transform hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm ml-1 text-gray-800">1404</span>
            </button>
            
            {/* Comment button */}
            <button className="flex items-center transition-transform hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm ml-1 text-gray-800">557</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 