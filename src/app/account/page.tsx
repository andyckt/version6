import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import Image from 'next/image'
import { FiSettings, FiMapPin, FiHeart, FiBookmark, FiEdit3, FiGrid } from 'react-icons/fi'
import Link from 'next/link'
import { travelPosts } from '@/data/posts'
import BlurImage from '@/components/BlurImage'

export default function Account() {
  // For demo purposes, we'll show all posts as user's posts
  const userPosts = travelPosts;

  return (
    <main className="pb-16 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-lg font-medium">Profile</h1>
            <button className="p-2">
              <FiSettings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app">
          {/* Profile info */}
          <div className="py-6 flex items-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <Image 
                src="https://placehold.co/400x400/ffd100/ffffff?text=T"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">TravelEnthusiast</h2>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <FiMapPin className="w-3 h-3 mr-1" />
                Seoul, South Korea
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-sm">
              Travel blogger exploring Asia. Sharing authentic experiences and hidden gems. 
              Currently based in Seoul.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-6 border-y border-gray-100 py-3">
            <div className="text-center">
              <p className="font-bold">{userPosts.length}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold">1.2K</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">348</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 mb-4">
            <div className="flex">
              <button className="flex-1 py-3 text-center border-b-2 border-primary">
                <FiGrid className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 py-3 text-center text-gray-400">
                <FiBookmark className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 py-3 text-center text-gray-400">
                <FiHeart className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* User posts */}
          <div className="grid grid-cols-3 gap-1 mb-8">
            {userPosts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block aspect-square relative">
                <BlurImage 
                  src={post.image} 
                  alt={post.title}
                  aspectRatio="aspect-square"
                  sizes="(max-width: 768px) 33vw, 25vw"
                />
              </Link>
            ))}
          </div>

          {/* Create post button */}
          <button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
            <FiEdit3 className="w-5 h-5" />
          </button>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  )
} 