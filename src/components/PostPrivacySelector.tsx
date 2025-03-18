"use client";

/**
 * Post Privacy Selector
 * 
 * This is a reusable component for selecting post privacy/visibility settings.
 * It can be used in the post creation form or post edit interfaces.
 */

import React from 'react';
import { PostVisibility } from '@/types/post';
import { FiGlobe, FiUsers, FiLock, FiInfo } from 'react-icons/fi';

interface PostPrivacySelectorProps {
  value: PostVisibility;
  onChange: (value: PostVisibility) => void;
  disabled?: boolean;
  showLabels?: boolean;
  showHelp?: boolean;
  compact?: boolean;
}

const PostPrivacySelector: React.FC<PostPrivacySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  showLabels = true,
  showHelp = false,
  compact = false
}) => {
  // Descriptions for each privacy level to show when showHelp is true
  const privacyDescriptions = {
    public: 'Anyone can see this post, even if they don\'t follow you',
    followers: 'Only people who follow you can see this post',
    private: 'Only you can see this post'
  };
  
  // Get the appropriate icon component based on the privacy level
  const getIconComponent = (visibility: PostVisibility) => {
    switch (visibility) {
      case 'public':
        return <FiGlobe className={`${value === 'public' ? 'text-green-500' : 'text-gray-400'}`} />;
      case 'followers':
        return <FiUsers className={`${value === 'followers' ? 'text-blue-500' : 'text-gray-400'}`} />;
      case 'private':
        return <FiLock className={`${value === 'private' ? 'text-red-500' : 'text-gray-400'}`} />;
      default:
        return null;
    }
  };
  
  // For standard (non-compact) layout, we'll use a select dropdown
  if (!compact) {
    return (
      <div className="flex flex-col">
        {showLabels && (
          <label className="mb-1 text-sm text-gray-700 font-medium">
            Who can see your post?
          </label>
        )}
        <div className="relative">
          <select 
            value={value}
            onChange={(e) => onChange(e.target.value as PostVisibility)}
            disabled={disabled}
            className="w-full border rounded-lg py-2 pl-9 pr-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white text-gray-700"
          >
            <option value="public">Public</option>
            <option value="followers">Followers</option>
            <option value="private">Private</option>
          </select>
          <div className="absolute left-3 top-2.5 pointer-events-none">
            {getIconComponent(value)}
          </div>
        </div>
        {showHelp && (
          <p className="mt-1 text-xs text-gray-500">
            {privacyDescriptions[value]}
          </p>
        )}
      </div>
    );
  }
  
  // For compact layout, we'll use a set of icon buttons
  return (
    <div className="flex items-center">
      {showLabels && (
        <span className="text-sm text-gray-600 mr-2">
          Visibility:
        </span>
      )}
      <div className="flex border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => onChange('public')}
          disabled={disabled}
          className={`px-2 py-1.5 flex items-center justify-center ${
            value === 'public' 
              ? 'bg-green-50 text-green-600 border-r border-gray-200' 
              : 'text-gray-500 hover:bg-gray-50 border-r border-gray-200'
          } disabled:opacity-50`}
          title="Public - Anyone can see this post"
        >
          <FiGlobe />
        </button>
        <button
          type="button"
          onClick={() => onChange('followers')}
          disabled={disabled}
          className={`px-2 py-1.5 flex items-center justify-center ${
            value === 'followers' 
              ? 'bg-blue-50 text-blue-600 border-r border-gray-200' 
              : 'text-gray-500 hover:bg-gray-50 border-r border-gray-200'
          } disabled:opacity-50`}
          title="Followers Only - Only people who follow you can see this post"
        >
          <FiUsers />
        </button>
        <button
          type="button"
          onClick={() => onChange('private')}
          disabled={disabled}
          className={`px-2 py-1.5 flex items-center justify-center ${
            value === 'private' 
              ? 'bg-red-50 text-red-600' 
              : 'text-gray-500 hover:bg-gray-50'
          } disabled:opacity-50`}
          title="Private - Only you can see this post"
        >
          <FiLock />
        </button>
      </div>
      {showHelp && (
        <button
          type="button"
          className="ml-1 text-gray-400 hover:text-gray-600"
          title={privacyDescriptions[value]}
        >
          <FiInfo />
        </button>
      )}
    </div>
  );
};

export default PostPrivacySelector; 