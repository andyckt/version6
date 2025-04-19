"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLoader, FiCheck } from 'react-icons/fi';
import MediaUploader, { UploadedMedia } from '@/components/MediaUploader';

// Define step types
type CreateStep = 'media' | 'details' | 'publishing';
// Define post status types
type PostStatus = 'draft' | 'published';

export default function CreatePost() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CreateStep>('media');
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationFading, setNotificationFading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // User selection
  const [users, setUsers] = useState<{_id: string, username: string, displayName: string, profileImage?: string}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Form data state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [taggedAccounts, setTaggedAccounts] = useState<{username: string, accountType?: string}[]>([]);
  const [status, setStatus] = useState<PostStatus>('published');
  
  // For hashtag input
  const [hashtagInput, setHashtagInput] = useState('');
  
  // For tagged accounts input
  const [accountInput, setAccountInput] = useState('');
  const [suggestedAccounts, setSuggestedAccounts] = useState<{username: string, displayName: string, profileImage?: string, accountType?: string}[]>([]);
  const [accountSearchType, setAccountSearchType] = useState<'users' | 'merchants'>('users');
  
  // For debouncing account search
  const accountSearchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track post creation success that won't be affected by closure issues
  const postSuccessRef = useRef(false);
  
  // Update the ref when postSuccess changes
  useEffect(() => {
    postSuccessRef.current = postSuccess;
  }, [postSuccess]);
  
  // Show success notification
  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message);
    setShowNotification(true);
    setNotificationFading(false);
    
    // Set a timeout to start the fade out animation
    setTimeout(() => {
      setNotificationFading(true);
      
      // After the animation completes, hide the notification
      setTimeout(() => {
        setShowNotification(false);
        setNotificationFading(false);
      }, 500); // This should match the animation duration
    }, 4500);
  };
  
  // Handle media upload completion - this starts the background processing
  const handleMediaUpload = (media: UploadedMedia[]) => {
    setUploadedMedia(prevMedia => [...prevMedia, ...media]);
    setIsUploading(false);
    
    // Don't automatically advance to details step anymore
    // setCurrentStep('details');
    
    // Start simulated background processing 
    // In a real app, this would be where media optimization happens server-side
    simulateBackgroundProcessing();
  };
  
  // Handle when media upload starts
  const handleMediaUploadStart = () => {
    setIsUploading(true);
  };
  
  // Simulate background processing of media while user fills out form
  const simulateBackgroundProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate gradual processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const nextProgress = prev + (100 - prev) * 0.1;
        
        // Speed up processing as it gets closer to 100%
        if (nextProgress > 95) {
          clearInterval(interval);
          setIsProcessing(false);
          setProcessingProgress(100);
        }
        
        return nextProgress;
      });
    }, 500);
  };
  
  // Search for accounts to tag
  const searchAccounts = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestedAccounts([]);
      return;
    }
    
    try {
      // Search endpoint based on selected type (users or merchants)
      const endpoint = accountSearchType === 'users' 
        ? `/api/users/search?q=${encodeURIComponent(query)}` 
        : `/api/merchants/search?q=${encodeURIComponent(query)}`;
        
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        
        if (accountSearchType === 'users') {
          // Map user data to a consistent format
          setSuggestedAccounts(data.users.map((user: any) => ({
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage,
            accountType: 'user'
          })));
        } else {
          // Map merchant data to a consistent format
          setSuggestedAccounts(data.merchants.map((merchant: any) => ({
            username: merchant.username,
            displayName: merchant.displayName,
            accountType: merchant.accountType || 'merchant'
          })));
        }
      }
    } catch (error) {
      console.error('Error searching accounts:', error);
    }
  };
  
  // Handle account input with debouncing
  useEffect(() => {
    if (accountSearchTimeout.current) {
      clearTimeout(accountSearchTimeout.current);
    }
    
    accountSearchTimeout.current = setTimeout(() => {
      searchAccounts(accountInput);
    }, 300);
    
    return () => {
      if (accountSearchTimeout.current) {
        clearTimeout(accountSearchTimeout.current);
      }
    };
  }, [accountInput]);
  
  // Add a hashtag
  const addHashtag = () => {
    if (hashtagInput && !hashtags.includes(hashtagInput)) {
      setHashtags([...hashtags, hashtagInput]);
      setHashtagInput('');
    }
  };
  
  // Remove a hashtag
  const removeHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };
  
  // Add a tagged account
  const addTaggedAccount = (username: string, accountType?: string) => {
    if (username && !taggedAccounts.some(a => a.username === username)) {
      setTaggedAccounts([...taggedAccounts, { username, accountType }]);
      setAccountInput('');
      setSuggestedAccounts([]);
    }
  };
  
  // Remove a tagged account
  const removeTaggedAccount = (username: string) => {
    setTaggedAccounts(taggedAccounts.filter(a => a.username !== username));
  };
  
  // Handle hashtag input key press
  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHashtag();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    
    if (uploadedMedia.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!selectedUserId) {
      alert('Please select a user to post as');
      return;
    }
    
    // Set status based on saving as draft or publishing
    setStatus(saveAsDraft ? 'draft' : 'published');
    
    if (saveAsDraft) {
      setIsSavingDraft(true);
    } else {
      setIsPublishing(true);
    }
    
    // Extract media IDs from uploaded media
    const mediaItems = uploadedMedia.map((media, index) => ({
      mediaId: media.id,
      position: index,
      isPrimary: index === 0
    }));
    
    console.log('Creating post with media items:', JSON.stringify(mediaItems));
    console.log('First few media IDs:', mediaItems.slice(0, 3).map(item => item.mediaId));
    
    // Create post payload
    const postData = {
      userId: selectedUserId,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      hashtags: hashtags,
      taggedAccounts: taggedAccounts,
      media: mediaItems,
      status: saveAsDraft ? 'draft' : 'published'
    };
    
    try {
      console.log('Sending POST request to create post...');
      // Send POST request to create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      // Log response status
      console.log('Post creation response status:', response.status);
      
      // Get response data
      const responseData = await response.json();
      console.log('Post creation response:', responseData);
      
      if (response.ok) {
        if (saveAsDraft) {
          // Show success notification for draft
          showSuccessNotification('Draft saved successfully');
          setIsSavingDraft(false);
        } else {
          setPostSuccess(true);
          postSuccessRef.current = true;
          // Show success notification for published post
          showSuccessNotification('Post published successfully');
          
          // Redirect to homepage after a short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      } else {
        throw new Error(responseData.error || `Failed to ${saveAsDraft ? 'save draft' : 'create post'}`);
      }
    } catch (error) {
      console.error(`Error ${saveAsDraft ? 'saving draft' : 'creating post'}:`, error);
      alert(`Failed to ${saveAsDraft ? 'save draft' : 'create post'}. Please try again.`);
      
      if (!saveAsDraft) {
        setCurrentStep('details');
      }
    } finally {
      if (saveAsDraft) {
        setIsSavingDraft(false);
      } else {
        setIsPublishing(false);
      }
    }
  };

  // Handle back button/navigation
  const handleBack = () => {
    if (currentStep === 'media') {
      handleExitPostCreation();
    } else if (currentStep === 'details') {
      setCurrentStep('media');
    } else if (currentStep === 'publishing' && !postSuccess && !isPublishing) {
      setCurrentStep('details');
    }
  };

  // Handle exiting post creation - clean up uploaded media
  const handleExitPostCreation = async () => {
    // Only clean up if there are uploaded media files
    if (uploadedMedia.length > 0) {
      setIsExiting(true);
      
      try {
        // Delete uploaded media files
        const response = await fetch('/api/media/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mediaIds: uploadedMedia.map(media => media.id)
          })
        });
        
        if (!response.ok) {
          console.warn('Failed to clean up media, but proceeding with exit');
        }
      } catch (error) {
        console.error('Error cleaning up media:', error);
      } finally {
        setIsExiting(false);
        router.push('/');
      }
    } else {
      // No media to clean up, just redirect
      router.push('/');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Only run cleanup if there's media and the post wasn't successfully created
      // Use the ref instead of the state to avoid closure issues
      if (uploadedMedia.length > 0 && !postSuccessRef.current) {
        console.log('Cleaning up unused media on unmount');
        // Clean up uploaded media to prevent orphaned files
        fetch('/api/media/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mediaIds: uploadedMedia.map(media => media.id)
          })
        }).catch(err => {
          console.error('Failed to clean up media on unmount:', err);
        });
      }
    };
  }, [uploadedMedia]); // Remove postSuccess from dependencies

  // Load available users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          // Set the first user as default if available
          if (data.users.length > 0) {
            setSelectedUserId(data.users[0]._id);
          }
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if user has uploaded media or entered data
      if (uploadedMedia.length > 0 || title || description) {
        e.preventDefault();
        e.returnValue = ''; // This shows a generic browser message
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadedMedia, title, description]);
  
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-1.5">
            <button 
              onClick={handleBack}
              className="p-1.5 transition-transform hover:scale-110 active:scale-95"
              disabled={isPublishing || isExiting || isSavingDraft}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            
            <h1 className="text-lg font-semibold">
              Create Post
            </h1>
            
            {currentStep === 'details' ? (
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isProcessing || isExiting || isSavingDraft || isPublishing}
                >
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isProcessing || isExiting || isSavingDraft || isPublishing}
                >
                  {isPublishing ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            ) : (
              <div className="w-16"></div>
            )}
          </div>
        </div>
      </header>
      
      <div className="container-app py-6">
        {/* Success notification toast */}
        {showNotification && (
          <div className={`fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${notificationFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <FiCheck className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}
      
        {/* Exit confirmation - shown when the user is about to leave with uploaded content */}
        {isExiting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium mb-2">Exit post creation?</h3>
              <p className="text-gray-600 mb-4">
                Your uploaded media will be deleted. Are you sure you want to leave?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsExiting(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    setIsExiting(false);
                    router.push('/');
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {currentStep === 'media' && 'Create Post'}
              {currentStep === 'details' && 'Add Details'}
              {currentStep === 'publishing' && 'Publishing'}
            </span>
            {isProcessing && (
              <span className="text-xs text-blue-600 font-medium flex items-center">
                <FiLoader className="w-3 h-3 mr-1 animate-spin" />
                Processing {Math.round(processingProgress)}%
              </span>
            )}
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ 
                width: currentStep === 'media' ? '33%' : 
                       currentStep === 'details' ? '66%' : '100%'
              }}
            ></div>
          </div>
        </div>
        
        {/* Combined media upload and details step */}
        {currentStep === 'media' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Upload Photos or Videos</h2>
              <MediaUploader
                onMediaUpload={handleMediaUpload}
                onUploadStart={handleMediaUploadStart}
                maxFiles={10}
                acceptedTypes="image/*,video/*"
                className="mb-4"
              />
            </div>
            
            {/* Show details form even during media upload */}
            <div className={`bg-white rounded-lg`}>
              <h2 className="text-lg font-medium mb-4">Post Details</h2>
              
              {/* Show upload status when uploading */}
              {isUploading && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center">
                    <FiLoader className="w-4 h-4 text-blue-500 animate-spin mr-2" />
                    <p className="text-sm text-blue-700">
                      Uploading images... Please wait while we process your files. You can fill out the post details below while waiting.
                    </p>
                  </div>
                </div>
              )}
              
              {/* User selection */}
              <div className="mb-6">
                <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Post as *
                </label>
                <select
                  id="userSelect"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  disabled={loadingUsers || isProcessing || isPublishing || isSavingDraft}
                  required
                >
                  {loadingUsers ? (
                    <option value="">Loading users...</option>
                  ) : users.length === 0 ? (
                    <option value="">No users available</option>
                  ) : (
                    <>
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.displayName} (@{user.username})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Media preview if available */}
              {uploadedMedia.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uploaded Media
                  </label>
                  <div className="flex overflow-x-auto gap-2 py-2">
                    {uploadedMedia.map((media, index) => (
                      <div key={index} className="relative flex-shrink-0 rounded-lg overflow-hidden">
                        <img 
                          src={media.thumbnailUrl || media.url} 
                          alt={`Uploaded media ${index + 1}`}
                          className="w-24 h-24 object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-sm">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Add a title for your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isProcessing || isPublishing || isSavingDraft}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Write a description for your post"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isProcessing || isPublishing || isSavingDraft}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Use @username to tag accounts in your description
                </p>
              </div>
              
              {/* Location */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Add a location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isProcessing || isPublishing || isSavingDraft}
                />
              </div>
              
              {/* Hashtags section */}
              <div className="mb-6">
                <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags
                </label>
                
                <div className="flex">
                  <div className="flex-grow">
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                      <span className="text-gray-500 mr-1">#</span>
                      <input
                        type="text"
                        id="hashtags"
                        placeholder="Add hashtags"
                        className="flex-grow border-none focus:outline-none focus:ring-0 p-1"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value.replace(/\s+/g, ''))}
                        onKeyDown={handleHashtagKeyDown}
                        disabled={isProcessing || isPublishing || isSavingDraft}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg transition-colors hover:bg-gray-300 disabled:opacity-50"
                    onClick={addHashtag}
                    disabled={!hashtagInput.trim() || hashtags.includes(hashtagInput.trim()) || isProcessing || isPublishing || isSavingDraft}
                  >
                    Add
                  </button>
                </div>
                
                {hashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
                        #{tag}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => removeHashtag(index)}
                          disabled={isProcessing || isPublishing || isSavingDraft}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tagged Accounts section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Accounts
                </label>
                
                {/* Toggle buttons for account type */}
                <div className="flex mb-3 border border-gray-200 rounded-lg p-1 w-fit">
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      accountSearchType === 'users' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setAccountSearchType('users')}
                  >
                    Users
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      accountSearchType === 'merchants' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setAccountSearchType('merchants')}
                  >
                    Merchants
                  </button>
                </div>
                
                <div className="flex">
                  <div className="flex-grow">
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                      <span className="text-gray-500 mr-1">@</span>
                      <input
                        type="text"
                        placeholder={`Search for ${accountSearchType === 'users' ? 'users' : 'merchants'} to tag`}
                        className="flex-grow border-none focus:outline-none focus:ring-0 p-1"
                        value={accountInput}
                        onChange={(e) => setAccountInput(e.target.value)}
                        disabled={isProcessing || isPublishing || isSavingDraft}
                      />
                    </div>
                  </div>
                  
                  {/* Optional search button */}
                  {accountInput.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 px-4 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => searchAccounts(accountInput)}
                      disabled={!accountInput || isProcessing || isPublishing || isSavingDraft}
                    >
                      Search
                    </button>
                  )}
                </div>
                
                {/* Suggested accounts */}
                {suggestedAccounts.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-h-48 overflow-y-auto">
                    {suggestedAccounts.map(account => (
                      <div
                        key={account.username}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                        onClick={() => addTaggedAccount(account.username, account.accountType)}
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-2 overflow-hidden">
                          {account.profileImage ? (
                            <img 
                              src={account.profileImage} 
                              alt={account.displayName || account.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                              {account.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{account.displayName || account.username}</p>
                          <p className="text-xs text-gray-500">@{account.username}</p>
                        </div>
                        <div className="ml-auto px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {account.accountType || 'User'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Tagged accounts display */}
                {taggedAccounts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {taggedAccounts.map(account => (
                      <span key={account.username} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
                        @{account.username}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => removeTaggedAccount(account.username)}
                          disabled={isProcessing || isPublishing || isSavingDraft}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={!uploadedMedia.length || !title.trim() || !selectedUserId || isProcessing || isExiting || isSavingDraft || isPublishing}
                  className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={!uploadedMedia.length || !title.trim() || !selectedUserId || isProcessing || isExiting || isSavingDraft || isPublishing}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Publishing step */}
        {currentStep === 'publishing' && (
          <div className="flex flex-col items-center justify-center py-12">
            {isPublishing ? (
              <>
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-xl font-medium mb-2">Creating your post...</h2>
                <p className="text-gray-500">This will only take a moment</p>
              </>
            ) : postSuccess ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <FiCheck className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-medium mb-2">Post published!</h2>
                <p className="text-gray-500">Redirecting you to your new post...</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium mb-2">Something went wrong</h2>
                <p className="text-gray-500 mb-4">Please try again</p>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setCurrentStep('media')}
                >
                  Go Back
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 