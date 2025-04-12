"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage, FiSearch, FiRefreshCw } from 'react-icons/fi';
import BlurImage from '@/components/BlurImage';
import { formatDistanceToNow } from 'date-fns';

// Post interface for our UI
interface Post {
  id: string;
  title: string;
  description?: string;
  created: string;
  status: string;
  views: number;
  likes: number;
  bookmarks: number;
  user?: {
    id: string;
    username: string;
    displayName: string;
  };
  mediaCount: number;
  firstMediaUrl?: string;
}

export default function PostsListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Fetch posts from the API
  const fetchPosts = async (page = 1, status = 'all', search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare query parameters
      const params = new URLSearchParams();
      params.append('skip', ((page - 1) * 20).toString());
      params.append('limit', '20');
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          created: new Date(post.created).toISOString(),
          status: post.status,
          views: post.views,
          likes: post.likes,
          bookmarks: post.bookmarks,
          user: post.user,
          mediaCount: Array.isArray(post.media) ? post.media.length : 0,
          firstMediaUrl: Array.isArray(post.media) && post.media.length > 0 ? post.media[0].url : undefined
        })));
        
        // Calculate total pages based on metadata
        if (data.metadata && data.metadata.total) {
          setTotalPages(Math.ceil(data.metadata.total / 20));
        }
      } else {
        setError(data.error || 'Failed to load posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchPosts(currentPage, selectedStatus, searchQuery);
  }, [currentPage, selectedStatus]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPosts(1, selectedStatus, searchQuery);
  };
  
  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'admin' // In production, use actual authentication
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('An error occurred while deleting the post');
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Posts</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center"
              >
                <FiSearch className="text-gray-500" />
              </button>
            </div>
            <button 
              type="button"
              onClick={() => fetchPosts(currentPage, selectedStatus, searchQuery)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg border border-l-0 border-gray-300"
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
          </form>
          
          {/* Create new post button */}
          <Link
            href="/admin/posts/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </div>
      </div>
      
      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleStatusChange('all')}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedStatus === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusChange('published')}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedStatus === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => handleStatusChange('draft')}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedStatus === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Draft
        </button>
        <button
          onClick={() => handleStatusChange('archived')}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedStatus === 'archived'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Archived
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FiRefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Posts list */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500 mb-4">No posts found</div>
              <Link
                href="/admin/posts/create"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3 relative rounded overflow-hidden bg-gray-100">
                              {post.firstMediaUrl ? (
                                <BlurImage
                                  src={post.firstMediaUrl}
                                  alt={post.title}
                                  className="object-cover"
                                  aspectRatio="aspect-square"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full text-gray-400">
                                  <FiImage className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                              <div className="text-sm text-gray-500">{formatDate(post.created)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {post.user?.displayName || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{post.user?.username || 'unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' :
                            post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            post.status === 'archived' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {post.mediaCount} media item{post.mediaCount !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-4">
                            <div title="Views">
                              <FiEye className="inline w-4 h-4 mr-1 text-gray-400" />
                              {post.views}
                            </div>
                            <div title="Likes">
                              <svg className="inline w-4 h-4 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {post.likes}
                            </div>
                            <div title="Bookmarks">
                              <svg className="inline w-4 h-4 mr-1 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                              {post.bookmarks}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <Link
                              href={`/post/${post.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              target="_blank"
                            >
                              <FiEye className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/admin/posts/edit/${post.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FiEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        {/* Page numbers would go here */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 