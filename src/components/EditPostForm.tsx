"use client";

/**
 * Edit Post Form
 * 
 * This component provides a form for editing existing posts, including
 * the ability to update post content, location, and privacy settings.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Post, PostVisibility, PostMedia } from '@/types/post';
import PostPrivacySelector from './PostPrivacySelector';
import { FiX, FiMapPin, FiImage, FiPlus } from 'react-icons/fi';

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
  const [media, setMedia] = useState<PostMedia[]>(post.media);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (caption.trim() === '' && media.length === 0) {
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
        media,
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
  
  // Function to remove a media item
  const removeMedia = (id: string) => {
    setMedia(media.filter(item => item.id !== id));
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
                  disabled={isSaving}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
            
            {/* Add media button if under limit */}
            {media.length < 9 && (
              <button
                type="button"
                className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 transition-colors"
                onClick={triggerFileInput}
                disabled={isSaving}
              >
                <FiPlus className="text-gray-400 h-8 w-8" />
              </button>
            )}
          </div>
        )}
        
        {/* Show add media button if no media */}
        {media.length === 0 && (
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 transition-colors"
              onClick={triggerFileInput}
              disabled={isSaving}
            >
              <FiImage className="text-gray-400 mr-2" />
              <span className="text-gray-500">Add Photos/Videos</span>
            </button>
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
          disabled={isSaving}
        />
        
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
        
        {/* Media limits note */}
        <div className="mb-4 text-xs text-gray-500">
          <p>You can upload up to 9 images or videos.</p>
          <p>Maximum video length: 2 minutes</p>
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