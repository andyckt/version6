"use client";

import { useState } from 'react';
import { useMerchantPostsById } from '@/hooks/useMerchantPostsById';
import MentionedGrid from '@/components/MentionedGrid';

export default function TestMerchantPostsById() {
  const [merchantId, setMerchantId] = useState<number>(508); // Default to first merchant ID
  const [inputValue, setInputValue] = useState('508');
  
  const { 
    posts, 
    error, 
    isLoading, 
    hasMore, 
    loadMore, 
    isLoadingMore,
    updatePostEngagement,
    totalPosts,
    refreshPosts
  } = useMerchantPostsById(merchantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(inputValue);
    if (!isNaN(id)) {
      setMerchantId(id);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Merchant Posts by ID API Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter merchant ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Load Posts
          </button>
        </div>
      </form>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium mb-2">API Response Info:</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">Status:</div>
          <div>{isLoading ? 'Loading...' : error ? 'Error' : 'Success'}</div>
          
          <div className="font-medium">Total Posts:</div>
          <div>{totalPosts || 0}</div>
          
          <div className="font-medium">Has More:</div>
          <div>{hasMore ? 'Yes' : 'No'}</div>
          
          <div className="font-medium">Posts Loaded:</div>
          <div>{posts?.length || 0}</div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600">
            Error: {error.message || 'Failed to load merchant posts'}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <button 
          onClick={() => refreshPosts()} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2"
          disabled={isLoading}
        >
          Refresh Posts
        </button>
        
        {hasMore && (
          <button 
            onClick={() => loadMore()} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            disabled={isLoadingMore}
          >
            Load More
          </button>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MentionedGrid 
          posts={posts} 
          isLoading={isLoading}
          isEmpty={!isLoading && posts.length === 0}
          hasMore={hasMore}
          loadMore={loadMore}
          isLoadingMore={isLoadingMore}
          updatePostEngagement={updatePostEngagement}
        />
      </div>
    </div>
  );
} 