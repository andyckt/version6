"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLoader, FiCheck, FiX } from 'react-icons/fi';
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
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userSearchTimeout = useRef<NodeJS.Timeout | null>(null);
  
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
  const [accountSearchType, setAccountSearchType] = useState<'users' | 'merchants'>('merchants');
  
  // For @mentions in description
  const [mentionMode, setMentionMode] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState<{username: string, displayName: string, profileImage?: string, accountType?: string}[]>([]);
  const [descriptionSelectionStart, setDescriptionSelectionStart] = useState<number | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  // For #hashtags in description
  const [hashtagMode, setHashtagMode] = useState(false);
  const [hashtagQuery, setHashtagQuery] = useState('');
  
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
  
  // Handle removing an uploaded media item
  const handleRemoveMedia = async (index: number) => {
    // Get the media item to be removed
    const mediaToRemove = uploadedMedia[index];
    
    // Remove from state first for immediate UI update
    const updatedMedia = [...uploadedMedia];
    updatedMedia.splice(index, 1);
    setUploadedMedia(updatedMedia);
    
    // Delete the media from the server
    try {
      const response = await fetch('/api/media/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mediaIds: [mediaToRemove.id]
        })
      });
      
      if (!response.ok) {
        console.warn('Failed to delete media from server:', mediaToRemove.id);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    }
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
  
  // Handle mention detection in description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    
    // Get cursor position
    const cursorPosition = e.target.selectionStart;
    setDescriptionSelectionStart(cursorPosition);
    
    // Check if we should be in mention mode
    if (mentionMode) {
      // Find the @ symbol position that started this mention
      const textBeforeCursor = text.substring(0, cursorPosition);
      const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtSymbol >= 0) {
        // Extract the query from the @ symbol to the cursor
        const query = textBeforeCursor.substring(lastAtSymbol + 1);
        
        // If space was pressed, exit mention mode
        if (query.includes(' ')) {
          setMentionMode(false);
          setMentionQuery('');
          setMentionSuggestions([]);
        } else {
          setMentionQuery(query);
          
          // Search for matching accounts if query is not empty
          if (query.length > 0) {
            searchMentions(query);
          } else {
            setMentionSuggestions([]);
          }
        }
      } else {
        // If we can't find the @ symbol anymore, exit mention mode
        setMentionMode(false);
        setMentionQuery('');
        setMentionSuggestions([]);
      }
    } 
    // Check if we should be in hashtag mode
    else if (hashtagMode) {
      // Find the # symbol position that started this hashtag
      const textBeforeCursor = text.substring(0, cursorPosition);
      const lastHashSymbol = textBeforeCursor.lastIndexOf('#');
      
      if (lastHashSymbol >= 0) {
        // Extract the query from the # symbol to the cursor
        const query = textBeforeCursor.substring(lastHashSymbol + 1);
        
        // If space was pressed, create a hashtag and exit hashtag mode
        if (query.includes(' ')) {
          // Extract the hashtag (text between # and space)
          const newHashtag = query.substring(0, query.indexOf(' '));
          
          // Only add if it's a valid hashtag (not empty and not already added)
          if (newHashtag && newHashtag.trim() && !hashtags.includes(newHashtag)) {
            setHashtags([...hashtags, newHashtag]);
          }
          
          // Exit hashtag mode
          setHashtagMode(false);
          setHashtagQuery('');
        } else {
          // Update the hashtag query
          setHashtagQuery(query);
        }
      } else {
        // If we can't find the # symbol anymore, exit hashtag mode
        setHashtagMode(false);
        setHashtagQuery('');
      }
    }
    else {
      // Check if an @ was just typed and it's not inside a word
      const shouldEnterMentionMode = () => {
        if (cursorPosition > 0 && text.charAt(cursorPosition - 1) === '@') {
          // Check if the @ is at the start of the text or preceded by a space
          if (cursorPosition === 1 || text.charAt(cursorPosition - 2) === ' ' || text.charAt(cursorPosition - 2) === '\n') {
            return true;
          }
        }
        return false;
      };
      
      // Check if a # was just typed and it's not inside a word
      const shouldEnterHashtagMode = () => {
        if (cursorPosition > 0 && text.charAt(cursorPosition - 1) === '#') {
          // Check if the # is at the start of the text or preceded by a space
          if (cursorPosition === 1 || text.charAt(cursorPosition - 2) === ' ' || text.charAt(cursorPosition - 2) === '\n') {
            return true;
          }
        }
        return false;
      };
      
      if (shouldEnterMentionMode()) {
        setMentionMode(true);
        setMentionQuery('');
        setMentionSuggestions([]); // Clear suggestions until user types something
      } else if (shouldEnterHashtagMode()) {
        setHashtagMode(true);
        setHashtagQuery('');
      }
    }
  };
  
  // Search for accounts that match mention query
  const searchMentions = async (query: string) => {
    if (!query || query.length < 1) {
      setMentionSuggestions([]);
      return;
    }
    
    try {
      // First check for merchants, then users (prioritize merchants)
      const merchantEndpoint = `/api/merchants/search?q=${encodeURIComponent(query)}`;
      const merchantResponse = await fetch(merchantEndpoint);
      
      if (merchantResponse.ok) {
        const data = await merchantResponse.json();
        
        // Map merchant data to a consistent format
        const merchantSuggestions = data.merchants.map((merchant: any) => ({
          username: merchant.username,
          displayName: merchant.displayName,
          accountType: merchant.accountType || 'merchant'
        }));
        
        // Only fetch users if we don't have enough merchant results
        if (merchantSuggestions.length < 5) {
          const userEndpoint = `/api/users/search?q=${encodeURIComponent(query)}`;
          const userResponse = await fetch(userEndpoint);
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            
            // Map user data to a consistent format
            const userSuggestions = userData.users.map((user: any) => ({
              username: user.username,
              displayName: user.displayName,
              profileImage: user.profileImage,
              accountType: 'user'
            }));
            
            // Combine merchants and users, but prioritize merchants
            setMentionSuggestions([...merchantSuggestions, ...userSuggestions].slice(0, 5));
          } else {
            setMentionSuggestions(merchantSuggestions);
          }
        } else {
          setMentionSuggestions(merchantSuggestions.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error searching for mentions:', error);
    }
  };
  
  // Insert mention into description
  const insertMention = (username: string) => {
    if (!descriptionRef.current || descriptionSelectionStart === null) return;
    
    const text = description;
    const cursorPosition = descriptionSelectionStart;
    
    // Find the position of the @ symbol that started this mention
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol >= 0) {
      // Replace the @query with @username
      const newText = 
        text.substring(0, lastAtSymbol) + 
        '@' + username + ' ' + 
        text.substring(cursorPosition);
      
      setDescription(newText);
      
      // Calculate new cursor position (after the inserted username and space)
      const newPosition = lastAtSymbol + username.length + 2; // +2 for @ and space
      
      // Focus and set cursor position after render
      setTimeout(() => {
        if (descriptionRef.current) {
          descriptionRef.current.focus();
          descriptionRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
    
    // Exit mention mode
    setMentionMode(false);
    setMentionQuery('');
    setMentionSuggestions([]);
  };
  
  // Handle description key events
  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    // If in mention mode and pressing escape, exit mention mode
    if (mentionMode && e.key === 'Escape') {
      e.preventDefault();
      setMentionMode(false);
      setMentionQuery('');
      setMentionSuggestions([]);
      return;
    }
    
    // If in hashtag mode and pressing escape, exit hashtag mode
    if (hashtagMode && e.key === 'Escape') {
      e.preventDefault();
      setHashtagMode(false);
      setHashtagQuery('');
      return;
    }
    
    // If in mention mode and pressing enter or tab with suggestions, select first suggestion
    if (mentionMode && (e.key === 'Enter' || e.key === 'Tab') && mentionSuggestions.length > 0) {
      e.preventDefault();
      insertMention(mentionSuggestions[0].username);
      return;
    }
    
    // If in mention mode and pressing space with a valid mention query, commit the mention
    if (mentionMode && e.key === ' ' && mentionQuery.length > 0) {
      // Only prevent default if we have suggestions to commit
      if (mentionSuggestions.length > 0) {
        e.preventDefault();
        insertMention(mentionSuggestions[0].username);
      } else {
        // If no suggestions, just exit mention mode
        setMentionMode(false);
        setMentionQuery('');
      }
    }
    
    // If in hashtag mode and pressing space, commit the hashtag if not empty
    if (hashtagMode && e.key === ' ' && hashtagQuery.length > 0) {
      // Let the handleDescriptionChange function handle this
      // We don't need to prevent default because we want the space character
    }
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
    
    // Processing description to identify mentioned accounts
    // These will be rendered as links when displayed in posts
    const processedDescription = processMentionsInDescription(description);
    
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
      description: processedDescription,
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
  
  // Process mentions in description to mark them for rendering as links
  const processMentionsInDescription = (text: string): string => {
    // No special processing is needed because the post detail page
    // already has a renderDescriptionWithMentions function that looks for @username patterns
    // and renders them as clickable links to merchant profiles
    // 
    // Similarly, hashtags (#tag) in the description are automatically detected
    // and rendered in a special way on the post detail page
    return text.trim();
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
          setFilteredUsers(data.users);
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

  // Filter users based on search query with debouncing
  useEffect(() => {
    if (userSearchTimeout.current) {
      clearTimeout(userSearchTimeout.current);
    }
    
    userSearchTimeout.current = setTimeout(async () => {
      if (!userSearchQuery.trim()) {
        // If query is empty, restore original users
        setFilteredUsers(users);
        return;
      }
      
      // If query is very short, filter locally
      if (userSearchQuery.length < 2) {
        const query = userSearchQuery.toLowerCase();
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query) || 
          user.displayName.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
        return;
      }
      
      // For longer queries, search from API
      try {
        setLoadingUsers(true);
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(userSearchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setFilteredUsers(data.users || []);
        } else {
          console.error('Error searching users');
          // Fall back to local filtering on error
          const query = userSearchQuery.toLowerCase();
          const filtered = users.filter(user => 
            user.username.toLowerCase().includes(query) || 
            user.displayName.toLowerCase().includes(query)
          );
          setFilteredUsers(filtered);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        // Fall back to local filtering on error
        const query = userSearchQuery.toLowerCase();
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query) || 
          user.displayName.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
      } finally {
        setLoadingUsers(false);
      }
    }, 300);
    
    return () => {
      if (userSearchTimeout.current) {
        clearTimeout(userSearchTimeout.current);
      }
    };
  }, [userSearchQuery, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get selected user details
  const selectedUser = users.find(user => user._id === selectedUserId);
  
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
  
  // Define predefined hashtags
  const predefinedHashtags = [
    'superpicture',
    'food',
    'attraction',
    'luxury',
    'getdrunk',
    'accommodation',
    'treasurehunt',
    'korea'
  ];

  // Handle adding or removing a predefined hashtag
  const addPredefinedHashtag = (tag: string) => {
    if (hashtags.includes(tag)) {
      // Remove hashtag if already selected
      setHashtags(hashtags.filter(t => t !== tag));
      
      // Remove hashtag from description if it exists
      const hashtagPattern = new RegExp(`\\s?#${tag}\\s?`, 'g');
      setDescription(description.replace(hashtagPattern, ' ').replace(/\s+/g, ' ').trim());
    } else {
      // Add hashtag if not already selected
      setHashtags([...hashtags, tag]);
      
      // Also append to description if not already there
      if (!description.includes(`#${tag}`)) {
        // Add a space before the hashtag if description doesn't end with space or newline
        const spacer = description.length > 0 && 
                      !description.endsWith(' ') && 
                      !description.endsWith('\n') ? ' ' : '';
        
        setDescription(description + spacer + `#${tag} `);
      }
    }
  };

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
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isExiting || isSavingDraft || isPublishing}
                >
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={!title.trim() || !selectedUserId || !uploadedMedia.length || isExiting || isSavingDraft || isPublishing}
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
              
              {/* User selection - Searchable dropdown */}
              <div className="mb-6" ref={userDropdownRef}>
                <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Post as *
                </label>
                <div className="relative">
                  {/* Display selected user or placeholder */}
                  <div 
                    className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer bg-white"
                    onClick={() => !loadingUsers && !isPublishing && !isSavingDraft && setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedUser ? (
                        <>
                          {selectedUser.profileImage && (
                            <img 
                              src={selectedUser.profileImage} 
                              alt={selectedUser.displayName} 
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span>
                            {selectedUser.displayName} (@{selectedUser.username})
                          </span>
                        </>
                      ) : loadingUsers ? (
                        <span className="text-gray-500">Loading users...</span>
                      ) : (
                        <span className="text-gray-500">Select a user</span>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {/* Search input */}
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full p-2 pl-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Search users..."
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {loadingUsers && userSearchQuery.length >= 2 && (
                            <svg className="animate-spin h-4 w-4 text-blue-500 absolute right-3 top-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* User list */}
                      <div className="py-1">
                        {loadingUsers ? (
                          <div className="px-4 py-2 text-gray-500">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No users found</div>
                        ) : (
                          filteredUsers.map((user) => (
                            <div
                              key={user._id}
                              className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${user._id === selectedUserId ? 'bg-blue-50' : ''}`}
                              onClick={() => {
                                setSelectedUserId(user._id);
                                setIsUserDropdownOpen(false);
                                setUserSearchQuery('');
                              }}
                            >
                              {user.profileImage && (
                                <img 
                                  src={user.profileImage} 
                                  alt={user.displayName} 
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{user.displayName}</div>
                                <div className="text-xs text-gray-500">@{user.username}</div>
                              </div>
                              {user.verified && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!selectedUserId && (
                  <p className="mt-1 text-sm text-red-600">Please select a user to post as</p>
                )}
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
                        {/* Add delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                          disabled={isPublishing || isSavingDraft}
                          className="absolute top-1 right-1 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-1 text-white transition-opacity"
                          aria-label="Remove media"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
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
                  placeholder="Add a title to your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPublishing || isSavingDraft}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Write a description for your post"
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    onKeyDown={handleDescriptionKeyDown}
                    disabled={isPublishing || isSavingDraft}
                    ref={descriptionRef}
                  />
                  
                  {/* Predefined Hashtags */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Select from popular hashtags:</p>
                    <div className="flex flex-wrap gap-2">
                      {/* First row - 4 hashtags */}
                      <div className="flex flex-wrap gap-2 mb-2 w-full">
                        {predefinedHashtags.slice(0, 4).map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addPredefinedHashtag(tag)}
                            disabled={isPublishing || isSavingDraft}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              hashtags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* Second row - 3 hashtags */}
                      <div className="flex flex-wrap gap-2 w-full">
                        {predefinedHashtags.slice(4).map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addPredefinedHashtag(tag)}
                            disabled={isPublishing || isSavingDraft}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              hashtags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mention suggestions */}
                  {mentionMode && mentionSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-h-48 overflow-y-auto w-64">
                      {mentionSuggestions.map(account => (
                        <div
                          key={account.username}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => insertMention(account.username)}
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
                  
                  {/* Hashtag indicator */}
                  {hashtagMode && hashtagQuery.length > 0 && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-2">
                      <div className="px-3 py-2 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-700">
                          Adding hashtag: <span className="bg-blue-100 px-2 py-0.5 rounded">#{hashtagQuery}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Press Space to add this hashtag</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Type @ to mention users or merchants. Type # to add hashtags.
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
                  disabled={isPublishing || isSavingDraft}
                />
              </div>
              
              {/* Display hashtags from description */}
              {hashtags.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hashtags from Description
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800">
                        #{tag}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => removeHashtag(index)}
                          disabled={isPublishing || isSavingDraft}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
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
                      accountSearchType === 'merchants' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setAccountSearchType('merchants')}
                  >
                    Merchants
                  </button>
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
                        disabled={isPublishing || isSavingDraft}
                      />
                    </div>
                  </div>
                  
                  {/* Optional search button */}
                  {accountInput.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 px-4 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => searchAccounts(accountInput)}
                      disabled={!accountInput || isPublishing || isSavingDraft}
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
                          disabled={isPublishing || isSavingDraft}
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