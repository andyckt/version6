"use client";

/**
 * Post Creation Form
 * 
 * This component provides a form for creating new posts with privacy settings.
 * Users can add text, upload media, and select a visibility level for each post.
 */

import React, { useState, useRef } from 'react';
import { useUser } from '@/components/UserContext';
import { PostVisibility, PostMedia } from '@/types/post';
import { createUserPost, addLocationToPost } from '@/utils/postUtils';
import { FiImage, FiMapPin, FiX } from 'react-icons/fi';
import PostPrivacySelector from './PostPrivacySelector';

// Dummy function to simulate post creation API call
const createPostAPI = async (postData: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Post created:', postData);
  return { success: true, postId: `post-${Date.now()}` };
};

const PostCreationForm: React.FC = () => {
  const { user } = useUser();
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<PostMedia[]>([]);
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle media selection
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Process each file
    const newMedia: PostMedia[] = [];
    
    Array.from(files).forEach((file, index) => {
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      
      // Determine if it's an image or video
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      // Add to the media array
      newMedia.push({
        id: `media-${Date.now()}-${index}`,
        type,
        url,
        width: 0, // Would be determined after load in a real implementation
        height: 0, // Would be determined after load in a real implementation
      });
    });
    
    setMedia([...media, ...newMedia]);
  };

  // Function to trigger the file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to remove media
  const removeMedia = (id: string) => {
    setMedia(media.filter(item => item.id !== id));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }
    
    if (caption.trim() === '' && media.length === 0) {
      setError('Please add some text or media to your post');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a basic post
      let post = createUserPost(user.id, caption, media, visibility);
      
      // Add location if provided
      if (location.trim() !== '') {
        post = addLocationToPost(post, location);
      }
      
      // Send to the API
      const result = await createPostAPI(post);
      
      if (result.success) {
        // Reset the form
        setCaption('');
        setMedia([]);
        setLocation('');
        setVisibility('public');
        setShowLocationInput(false);
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Caption textarea */}
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
          placeholder="What's on your mind?"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isSubmitting}
        />
        
        {/* Media preview */}
        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {media.map((item) => (
              <div key={item.id} className="relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt="Post media"
                    className="w-full h-24 object-cover rounded"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-24 object-cover rounded"
                    controls
                  />
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1"
                  onClick={() => removeMedia(item.id)}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Location input (conditionally shown) */}
        {showLocationInput && (
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaSelect}
          multiple
          accept="image/*,video/*"
          className="hidden"
          disabled={isSubmitting}
        />
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Actions row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-3">
            {/* Upload media button */}
            <button
              type="button"
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={triggerFileInput}
              disabled={isSubmitting}
            >
              <FiImage className="mr-1" />
              <span className="text-sm">Photo/Video</span>
            </button>
            
            {/* Location toggle button */}
            <button
              type="button"
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={() => setShowLocationInput(!showLocationInput)}
              disabled={isSubmitting}
            >
              <FiMapPin className="mr-1" />
              <span className="text-sm">Location</span>
            </button>
          </div>
          
          {/* Visibility selector */}
          <PostPrivacySelector
            value={visibility}
            onChange={setVisibility}
            disabled={isSubmitting}
            compact={true}
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default PostCreationForm; 