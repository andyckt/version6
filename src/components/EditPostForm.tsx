"use client";

/**
 * Edit Post Form
 * 
 * This component provides a form for editing existing posts, including
 * the ability to update post content, location, and privacy settings.
 */

import React, { useState, useEffect } from 'react';
import { Post, PostVisibility, PostMedia } from '@/types/post';
import PostPrivacySelector from './PostPrivacySelector';
import { FiX, FiMapPin } from 'react-icons/fi';

interface EditPostFormProps {
  post: Post;
  onSave: (updatedPost: Post) => Promise<boolean>;
  onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  onSave,
  onCancel
}) => {
  const [caption, setCaption] = useState(post.caption);
  const [visibility, setVisibility] = useState<PostVisibility>(post.visibility);
  const [location, setLocation] = useState(post.location?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (caption.trim() === '' && post.media.length === 0) {
      setError('Your post must have either text or media');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Create an updated post object
      const updatedPost: Post = {
        ...post,
        caption,
        visibility,
        location: location.trim() ? {
          name: location,
          ...(post.location || {})
        } : undefined,
        updatedAt: new Date().toISOString()
      };
      
      // Call the save handler from props
      const success = await onSave(updatedPost);
      
      if (!success) {
        setError('Failed to update the post. Please try again.');
        setIsSaving(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setIsSaving(false);
    }
  };
  
  // Function to remove a media item
  const removeMedia = (id: string) => {
    // Create an updated post with the media removed
    const updatedPost: Post = {
      ...post,
      media: post.media.filter(item => item.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    // Save the updated post
    onSave(updatedPost);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Caption textarea */}
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
          placeholder="What's on your mind?"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isSaving}
        />
        
        {/* Media preview */}
        {post.media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {post.media.map((item: PostMedia) => (
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
                  disabled={isSaving}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Location input */}
        <div className="mb-4 flex items-center">
          <FiMapPin className="text-gray-500 mr-2" />
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSaving}
          />
        </div>
        
        {/* Privacy selector */}
        <div className="mb-4">
          <PostPrivacySelector
            value={visibility}
            onChange={setVisibility}
            disabled={isSaving}
            showHelp={true}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm; 