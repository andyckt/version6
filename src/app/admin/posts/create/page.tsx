"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUpload, FiSave, FiTrash2, FiArrowLeft, FiUser, FiTag, FiMapPin, FiImage, FiCheckCircle } from 'react-icons/fi';
import MediaUploader from '@/components/MediaUploader';
import BlurImage from '@/components/BlurImage';
import { PostStatus } from '@/lib/db/models/post';

// Define interface for user selection
interface User {
  _id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

// Media item interface
interface UploadedMedia {
  id: string;
  url: string;
  thumbnailUrl: string;
  aspectRatio: string;
  sortOrder?: number;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [taggedAccounts, setTaggedAccounts] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Ref to store current draft post ID if we're saving as we go
  const draftPostIdRef = useRef<string | null>(null);
  
  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.users);
          
          // If there's only one user, auto-select them
          if (data.users.length === 1) {
            setSelectedUser(data.users[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load users. Please try again later.');
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle media upload - this gets called by the MediaUploader component
  const handleMediaUpload = (media: UploadedMedia[]) => {
    // Add sortOrder to each media item based on current order
    const mediaWithSortOrder = media.map((item, index) => ({
      ...item,
      sortOrder: uploadedMedia.length + index
    }));
    
    // Update the media state
    setUploadedMedia(currentMedia => {
      // If we have at least one media item and a title, we might want to
      // auto-save as a draft in the background (for the Instagram-like experience)
      if (currentMedia.length === 0 && mediaWithSortOrder.length > 0 && title) {
        saveAsDraft();
      }
      
      return [...currentMedia, ...mediaWithSortOrder];
    });
    
    setIsUploading(false);
    setUploadProgress(100);
  };
  
  // Remove a media item
  const handleRemoveMedia = (id: string) => {
    setUploadedMedia(prev => prev.filter(item => item.id !== id));
  };
  
  // Reorder media by drag and drop (would need to be implemented)
  const handleReorderMedia = (startIndex: number, endIndex: number) => {
    // Logic to reorder media items
    const reorderedMedia = [...uploadedMedia];
    const [removed] = reorderedMedia.splice(startIndex, 1);
    reorderedMedia.splice(endIndex, 0, removed);
    
    // Update sort order
    const updatedMedia = reorderedMedia.map((item, index) => ({
      ...item,
      sortOrder: index
    }));
    
    setUploadedMedia(updatedMedia);
  };
  
  // Save post as draft in the background (for the Instagram-like experience)
  const saveAsDraft = async () => {
    // Only save if we have at least one media item
    if (uploadedMedia.length === 0) return;
    
    try {
      // If we already have a draft, update it instead of creating a new one
      if (draftPostIdRef.current) {
        const response = await fetch(`/api/posts/${draftPostIdRef.current}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': selectedUser?._id || ''
          },
          body: JSON.stringify({
            title,
            description,
            location,
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
            taggedAccounts: taggedAccounts.split(' ').filter(tag => tag.startsWith('@')).map(tag => tag.substring(1)),
            media: uploadedMedia.map(media => ({ id: media.id, sortOrder: media.sortOrder })),
            status: 'draft'
          })
        });
        
        const data = await response.json();
        if (!data.success) {
          console.error('Failed to update draft:', data.error);
        }
      } else {
        // Create a new draft post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': selectedUser?._id || ''
          },
          body: JSON.stringify({
            title,
            description,
            location,
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
            taggedAccounts: taggedAccounts.split(' ').filter(tag => tag.startsWith('@')).map(tag => tag.substring(1)),
            media: uploadedMedia.map(media => media.id),
            status: 'draft'
          })
        });
        
        const data = await response.json();
        if (data.success && data.post && data.post.id) {
          draftPostIdRef.current = data.post.id;
          console.log('Draft saved with ID:', data.post.id);
        } else {
          console.error('Failed to save draft:', data.error);
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };
  
  // Submit final post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setError('Please select a user to post as');
      return;
    }
    
    if (uploadedMedia.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // If we have a draft, update it
      if (draftPostIdRef.current) {
        const response = await fetch(`/api/posts/${draftPostIdRef.current}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': selectedUser._id
          },
          body: JSON.stringify({
            title,
            description,
            location,
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
            taggedAccounts: taggedAccounts.split(' ').filter(tag => tag.startsWith('@')).map(tag => tag.substring(1)),
            media: uploadedMedia.map(media => ({ id: media.id, sortOrder: media.sortOrder })),
            status
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccessMessage(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/admin/posts');
          }, 2000);
        } else {
          setError(data.error || 'Failed to update post');
        }
      } else {
        // Create a new post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': selectedUser._id
          },
          body: JSON.stringify({
            title,
            description,
            location,
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
            taggedAccounts: taggedAccounts.split(' ').filter(tag => tag.startsWith('@')).map(tag => tag.substring(1)),
            media: uploadedMedia.map(media => media.id),
            status
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccessMessage(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/admin/posts');
          }, 2000);
        } else {
          setError(data.error || 'Failed to create post');
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/posts" className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              document.getElementById('post-form')?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              );
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
            disabled={isSubmitting}
          >
            <FiSave className="w-4 h-4 mr-2" />
            Save as Draft
          </button>
          
          <button
            type="button"
            onClick={() => {
              setStatus('published');
              document.getElementById('post-form')?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              );
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            disabled={isSubmitting}
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Publish Post
          </button>
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
          <FiCheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}
      
      <form id="post-form" onSubmit={handleSubmit} className="space-y-8">
        {/* User Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-3">
              <FiUser className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Post As</h2>
          </div>
          
          <div className="max-w-md">
            <select
              value={selectedUser?._id || ''}
              onChange={(e) => {
                const selected = users.find(user => user._id === e.target.value);
                setSelectedUser(selected || null);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.displayName} (@{user.username})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-purple-50 text-purple-600 mr-3">
              <FiImage className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Media</h2>
          </div>
          
          <div className="space-y-4">
            {/* Upload Component */}
            <MediaUploader
              onMediaUpload={handleMediaUpload}
              maxFiles={10}
              acceptedTypes="image/*"
              className="mb-4"
            />
            
            {/* Preview of uploaded media */}
            {uploadedMedia.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Media</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedMedia.map((media, index) => (
                    <div key={media.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <div className="h-32 w-full">
                        <BlurImage
                          src={media.thumbnailUrl || media.url}
                          alt={`Uploaded media ${index + 1}`}
                          className="object-cover"
                          aspectRatio="aspect-video"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(media.id)}
                          className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white text-xs p-1 text-center">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Post Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-green-50 text-green-600 mr-3">
              <FiTag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Post Details</h2>
          </div>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use @username to tag merchants and #hashtag for topics
              </p>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Shanghai, China"
                />
              </div>
            </div>
            
            {/* Hashtags */}
            <div>
              <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                Hashtags
              </label>
              <input
                type="text"
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#travel #china #food"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate hashtags with spaces (e.g., #travel #food #adventure)
              </p>
            </div>
            
            {/* Tagged Accounts */}
            <div>
              <label htmlFor="taggedAccounts" className="block text-sm font-medium text-gray-700 mb-1">
                Tagged Accounts
              </label>
              <input
                type="text"
                id="taggedAccounts"
                value={taggedAccounts}
                onChange={(e) => setTaggedAccounts(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="@restaurant @hotel"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate usernames with spaces (e.g., @restaurant @hotel)
              </p>
            </div>
          </div>
        </div>
        
        {/* Hidden submit button for form submission */}
        <button type="submit" className="hidden" />
      </form>
    </div>
  );
} 