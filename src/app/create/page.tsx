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
  
  // User selection
  const [users, setUsers] = useState<{_id: string, username: string, displayName: string, profileImage?: string}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Form data state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [taggedAccounts, setTaggedAccounts] = useState<{username: string}[]>([]);
  const [status, setStatus] = useState<PostStatus>('published');
  
  // For hashtag input
  const [hashtagInput, setHashtagInput] = useState('');
  
  // For tagged accounts input
  const [accountInput, setAccountInput] = useState('');
  const [suggestedAccounts, setSuggestedAccounts] = useState<{username: string, displayName: string, profileImage: string}[]>([]);
  
  // For debouncing account search
  const accountSearchTimeout = useRef<NodeJS.Timeout | null>(null);
  
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
    setUploadedMedia(media);
    
    // Automatically advance to details step after media is uploaded
    setCurrentStep('details');
    
    // Start simulated background processing 
    // In a real app, this would be where media optimization happens server-side
    simulateBackgroundProcessing();
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
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestedAccounts(data.users);
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
  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };
  
  // Add a tagged account
  const addTaggedAccount = (username: string) => {
    if (username && !taggedAccounts.some(a => a.username === username)) {
      setTaggedAccounts([...taggedAccounts, { username }]);
      setAccountInput('');
      setSuggestedAccounts([]);
    }
  };
  
  // Remove a tagged account
  const removeTaggedAccount = (username: string) => {
    setTaggedAccounts(taggedAccounts.filter(a => a.username !== username));
  };
  
  // Handle hashtag input key press
  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
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
      // Send POST request to create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (saveAsDraft) {
          // Show success notification for draft
          showSuccessNotification('Draft saved successfully');
          setIsSavingDraft(false);
        } else {
          setPostSuccess(true);
          // Show success notification for published post
          showSuccessNotification('Post published successfully');
          
          // Redirect to homepage after a short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      } else {
        throw new Error(`Failed to ${saveAsDraft ? 'save draft' : 'create post'}`);
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
      if (uploadedMedia.length > 0 && !postSuccess) {
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
  }, [uploadedMedia, postSuccess]);

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
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isProcessing || isExiting || isSavingDraft || isPublishing}
                >
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isProcessing || isExiting || isSavingDraft || isPublishing}
                >
                  {isPublishing ? 'Posting...' : 'Post'}
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
              {currentStep === 'media' && 'Upload Media'}
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
        
        {/* Media upload step */}
        {currentStep === 'media' && (
          <div>
            <h2 className="text-lg font-medium mb-4">Upload Photos or Videos</h2>
            <MediaUploader
              onMediaUpload={handleMediaUpload}
              maxFiles={10}
              acceptedTypes="image/*,video/*"
              className="mb-8"
            />
          </div>
        )}
        
        {/* Details step */}
        {currentStep === 'details' && (
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            {/* User selection */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Post As</h2>
              <div className="flex items-center">
                {loadingUsers ? (
                  <div className="flex items-center space-x-2">
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading users...</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Select User
                    </label>
                    <select
                      id="userSelect"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a user to post as</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          @{user.username} - {user.displayName}
                        </option>
                      ))}
                    </select>
                    {selectedUserId && (
                      <div className="mt-2 flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                          {users.find(u => u._id === selectedUserId)?.profileImage ? (
                            <img
                              src={users.find(u => u._id === selectedUserId)?.profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {users.find(u => u._id === selectedUserId)?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{users.find(u => u._id === selectedUserId)?.displayName}</p>
                          <p className="text-gray-500">@{users.find(u => u._id === selectedUserId)?.username}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Preview of uploaded media */}
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
            
            {/* Title */}
            <div>
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Write a description for your post"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tip: Use @username to tag accounts in your description
              </p>
            </div>
            
            {/* Location */}
            <div>
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
              />
            </div>
            
            {/* Hashtags */}
            <div>
              <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                Hashtags
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="hashtags"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Add hashtags (press Enter to add)"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  onKeyDown={handleHashtagKeyPress}
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-3 bg-gray-100 text-gray-800 rounded-lg"
                  onClick={addHashtag}
                >
                  Add
                </button>
              </div>
              
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag) => (
                    <div 
                      key={tag}
                      className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeHashtag(tag)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tagged Accounts */}
            <div>
              <label htmlFor="taggedAccounts" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Accounts
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="taggedAccounts"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Search for accounts to tag"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                />
                
                {suggestedAccounts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestedAccounts.map((account) => (
                      <div
                        key={account.username}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => addTaggedAccount(account.username)}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                          <img
                            src={account.profileImage || `/placeholder-avatar.jpg`}
                            alt={account.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{account.displayName}</p>
                          <p className="text-xs text-gray-500">@{account.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {taggedAccounts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {taggedAccounts.map((account) => (
                    <div 
                      key={account.username}
                      className="flex items-center bg-gray-100 text-sm px-3 py-1 rounded-full"
                    >
                      @{account.username}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeTaggedAccount(account.username)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
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
                  onClick={() => setCurrentStep('details')}
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