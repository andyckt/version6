import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import BlurImage from '@/components/BlurImage'
import { FiBookmark } from 'react-icons/fi'
import Link from 'next/link'
import { travelPosts } from '@/data/posts'

export default function Booklet() {
  // For demo purposes, we'll show the first two posts as saved
  const savedPosts = travelPosts.slice(0, 2);

  return (
    <main className="pb-16 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-lg font-medium">My Booklet</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app py-4">
          <h2 className="text-xl font-bold mb-4">Saved Travel Notes</h2>
          
          {savedPosts.length > 0 ? (
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md">
                  <Link href={`/post/${post.id}`} className="flex">
                    <div className="w-1/3">
                      <BlurImage 
                        src={post.image} 
                        alt={post.title}
                        aspectRatio="aspect-square"
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {post.description?.substring(0, 80)}...
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500">{post.author}</span>
                        <FiBookmark className="w-3 h-3 ml-auto text-primary" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FiBookmark className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved notes yet</h3>
              <p className="text-sm text-gray-500">
                Save travel notes to read them later
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
            <div className="grid grid-cols-2 gap-3">
              {travelPosts.slice(2, 4).map((post) => (
                <div 
                  key={post.id} 
                  className="flex flex-col rounded-lg overflow-hidden bg-white shadow-sm transform transition-all duration-300 hover:shadow-md"
                >
                  <Link href={`/post/${post.id}`} className="block">
                    <BlurImage 
                      src={post.image} 
                      alt={post.title}
                      aspectRatio="pb-[100%]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="p-2">
                      <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{post.author}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  )
} 