"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState, Fragment } from 'react'
import { FiArrowLeft, FiHeart, FiMessageSquare, FiBookmark, FiShare2, FiMoreHorizontal } from 'react-icons/fi'
import { travelPosts, TaggedAccount } from '@/data/posts'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import BlurImage from '@/components/BlurImage'
import MediaGallery from '@/components/MediaGallery'
import ShareDialog from '@/components/ShareDialog'

export default function PostDetail({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id)
  const post = travelPosts.find(post => post.id === postId)
  
  // State for tracking user interactions
  const [isLiked, setIsLiked] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes || 0)
  const [starCount, setStarCount] = useState(1404)
  const [commentCount, setCommentCount] = useState(557)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'JourneyLover',
      avatar: 'J',
      text: 'This looks amazing! How many days did you spend there?',
      time: '1 day ago',
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: 101,
          username: 'TravelExplorer',
          avatar: 'T',
          text: 'I spent 5 days there and it wasn\'t enough! I highly recommend at least a week.',
          time: '20 hours ago',
          likes: 1,
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      username: 'TravelBug',
      avatar: 'T',
      text: 'The colors in this photo are stunning! What camera did you use?',
      time: '12 hours ago',
      likes: 5,
      isLiked: false,
      replies: []
    }
  ])
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [pinnedMerchants, setPinnedMerchants] = useState<number[]>([])
  const [showShareDialog, setShowShareDialog] = useState(false)
  
  if (!post) {
    return <div className="container-app py-20 text-center">Post not found</div>
  }

  // Create a username from author (simulating a user ID)
  const username = post.author.toLowerCase().replace(/\s+/g, '');
  
  // Handle like button click
  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    setIsLiked(!isLiked)
  }
  
  // Handle star button click
  const handleStarClick = () => {
    if (isStarred) {
      setStarCount(prev => prev - 1)
    } else {
      setStarCount(prev => prev + 1)
    }
    setIsStarred(!isStarred)
  }

  // Handle posting a new comment
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // Add the new comment to the comments list
      setComments(prevComments => [
        ...prevComments,
        {
          id: Date.now(), // Using timestamp as a simple unique ID
          username: 'You', // Assuming the current user's username
          avatar: 'Y',
          text: commentText.trim(),
          time: 'Just now',
          likes: 0,
          isLiked: false,
          replies: []
        }
      ]);
      
      // Increment comment count
      setCommentCount(prev => prev + 1);
      
      // Clear the input field
      setCommentText('');
    }
  };
  
  // Handle key press for the comment input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  // Handle liking a comment
  const handleLikeComment = (commentId: number, isReply = false, parentId?: number) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (isReply && parentId && comment.id === parentId) {
          // Handle liking a reply
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                };
              }
              return reply;
            })
          };
        } else if (!isReply && comment.id === commentId) {
          // Handle liking a main comment
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      });
    });
  };

  // Handle starting to reply to a comment
  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  // Handle submitting a reply
  const handleReplySubmit = (commentId: number) => {
    if (replyText.trim()) {
      setComments(prevComments => {
        return prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  username: 'You',
                  avatar: 'Y',
                  text: replyText.trim(),
                  time: 'Just now',
                  likes: 0,
                  isLiked: false
                }
              ]
            };
          }
          return comment;
        });
      });
      
      // Reset the reply state
      setReplyText('');
      setReplyingTo(null);
    }
  };

  // Handle key press for the reply input
  const handleReplyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, commentId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleReplySubmit(commentId);
    }
  };

  // Handle pinning/unpinning a merchant
  const handlePinMerchant = (merchantId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to merchant page
    setPinnedMerchants(prev => 
      prev.includes(merchantId)
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  // Function to render description with highlighted @mentions - all mentions are clickable
  // regardless of whether they're in taggedAccounts
  const renderDescriptionWithMentions = (description: string) => {
    if (!description) return null;
    
    // Regular expression to find @mentions
    const mentionRegex = /@(\w+)/g;
    
    // Split the description by @mentions
    const parts = description.split(mentionRegex);
    
    // Render each part, with links for mentions
    return parts.map((part, index) => {
      // Even indices are normal text, odd indices are potential usernames
      if (index % 2 === 0) {
        return part;
      } else {
        // All @mentions are clickable
        return (
          <Link 
            key={`mention-${index}`}
            href={`/account/${part}`}
            className="font-medium text-primary hover:underline"
          >
            @{part}
          </Link>
        );
      }
    });
  };

  return (
    <main className="pb-12 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-1.5">
            {/* Left section - Back button */}
            <Link href="/" className="p-1.5 transition-transform hover:scale-110 active:scale-95">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* Center section - Profile and username */}
            <Link href={`/account/${username}`} className="flex items-center transition-transform hover:scale-105 active:scale-95">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2">
                <Image 
                  src={`https://picsum.photos/200/200?random=${post.author.charAt(0)}`}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-sm">@{username}</span>
            </Link>
            
            {/* Right section - Share button */}
            <button 
              className="p-1.5 transition-transform hover:scale-110 active:scale-95 relative group"
              onClick={() => setShowShareDialog(true)}
            >
              <FiShare2 className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </button>
          </div>
        </div>
      </header>

      <PageTransition>
        {/* Post media gallery - Full width on mobile, contained on desktop */}
        <div className="md:container-app md:mx-auto md:px-4 mb-4">
          {post.media && post.media.length > 0 ? (
            <>
              <MediaGallery 
                media={post.media}
                className="md:rounded-lg"
              />
            </>
          ) : (
            <div className="relative aspect-[4/5] md:aspect-auto md:h-[450px] overflow-hidden md:rounded-lg">
              <Image 
                src={post.image || 'https://picsum.photos/600/800?random=default'} 
                alt={post.title}
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover md:object-contain"
              />
            </div>
          )}
        </div>
          
        <div className="container-app">
          {/* Post content */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">{post.title}</h2>
            <p className="text-base leading-relaxed mb-4">
              {renderDescriptionWithMentions(post.description || `Exploring the beautiful ${post.tags.join(' and ')} areas. This trip was amazing and I'd recommend it to anyone looking for an authentic travel experience. The local culture, food, and scenery were absolutely breathtaking.`)}
            </p>
            
            {/* Tagged accounts section */}
            {post.taggedAccounts && post.taggedAccounts.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {post.taggedAccounts.map(account => (
                    <Link 
                      key={account.id}
                      href={`/account/${account.username}`} 
                      className="flex items-center bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 transition-colors relative"
                    >
                      <div className="relative w-6 h-6 rounded-md overflow-hidden bg-primary mr-2.5 flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                          {account.accountType === 'restaurant' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M11 5H5v14h6V5zm2 0v14h6V5h-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
                            </svg>
                          ) : account.accountType === 'hotel' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M12 2a8 8 0 0 1 8 8v12h-2v-2H6v2H4V10a8 8 0 0 1 8-8zm0 2a6 6 0 0 0-6 6v8h12v-8a6 6 0 0 0-6-6zm-4 5h2v3h4v-3h2v5H8V9z"/>
                            </svg>
                          ) : account.accountType === 'attraction' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M21 16v5H3v-5H1v-2h20v2h-2zm-8-8V5h-2v3H7l5 5 5-5h-4z"/>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M21 11h-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-2h1a1 1 0 0 0 1-1zM5 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{account.displayName}</span>
                        <span className="text-xs text-gray-500">
                          @{account.username}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handlePinMerchant(account.id, e)}
                        className="ml-3 p-1 focus:outline-none"
                      >
                        <svg 
                          width="18" height="18" 
                          viewBox="0 0 24 24" 
                          fill={pinnedMerchants.includes(account.id) ? "currentColor" : "none"} 
                          className={`w-4.5 h-4.5 ${pinnedMerchants.includes(account.id) ? "text-amber-400" : "text-gray-500"}`}
                        >
                          <path 
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">Posted 2 days ago</p>
          </div>

          {/* Comments section */}
          <div className="border-t border-gray-100 pt-4 mb-20">
            <h3 className="font-medium mb-4">Comments</h3>
            
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main comment */}
                  <div className="flex">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image 
                        src={`https://picsum.photos/200/200?random=${comment.avatar}`}
                        alt={comment.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex items-start justify-between">
                        <p className="text-sm">
                          <span className="font-medium">{comment.username}</span> {comment.text}
                        </p>
                      </div>
                      <div className="flex items-center text-xs mt-1.5 text-gray-500">
                        <span className="mr-3">{comment.time}</span>
                        <button 
                          onClick={() => handleLikeComment(comment.id)} 
                          className={`flex items-center mr-3 ${comment.isLiked ? 'text-red-500 font-medium' : ''}`}
                        >
                          <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill={comment.isLiked ? "currentColor" : "none"}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          {comment.likes}
                        </button>
                        <button 
                          onClick={() => handleReplyClick(comment.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="ml-11 mt-2">
                      <div className="flex items-center">
                        <div className="flex-grow">
                          <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center">
                            <input 
                              type="text" 
                              placeholder={`Reply to ${comment.username}...`} 
                              className="bg-transparent w-full text-sm focus:outline-none"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => handleReplyKeyPress(e, comment.id)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <button 
                          className="ml-2 text-xs bg-primary px-2 py-1 rounded-full text-black font-medium"
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image 
                              src={`https://picsum.photos/200/200?random=${reply.avatar}`}
                              alt={reply.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-2 flex-grow">
                            <div className="flex items-start justify-between">
                              <p className="text-xs">
                                <span className="font-medium">{reply.username}</span> {reply.text}
                              </p>
                            </div>
                            <div className="flex items-center text-xs mt-1 text-gray-500">
                              <span className="mr-3">{reply.time}</span>
                              <button 
                                onClick={() => handleLikeComment(reply.id, true, comment.id)} 
                                className={`flex items-center ${reply.isLiked ? 'text-red-500 font-medium' : ''}`}
                              >
                                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill={reply.isLiked ? "currentColor" : "none"}>
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                {reply.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
      
      {/* Post-specific sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-1.5 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {/* Different container approach for mobile vs desktop */}
        <div className="px-2 md:container-app md:px-4 flex items-center">
          {/* Comment input */}
          <div className="flex-grow mr-4">
            <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center">
              <span className="text-gray-400 mr-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Say something..." 
                className="bg-transparent w-full text-sm focus:outline-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-5">
            {/* Like button with count */}
            <button 
              className="flex items-center transition-transform hover:scale-110 active:scale-95" 
              onClick={handleLikeClick}
            >
              <svg 
                width="24" height="24" 
                viewBox="0 0 24 24" 
                fill={isLiked ? "currentColor" : "none"} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-[22px] h-[22px] ${isLiked ? "text-red-500" : "text-gray-800"}`}
              >
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  stroke={isLiked ? "none" : "currentColor"} 
                  strokeWidth="1.5" 
                />
              </svg>
              <span className={`text-sm ml-1 ${isLiked ? "text-red-500 font-medium" : "text-gray-800"}`}>
                {likeCount}
              </span>
            </button>
            
            {/* Star/Save button */}
            <button 
              className="flex items-center transition-transform hover:scale-110 active:scale-95"
              onClick={handleStarClick}
            >
              <svg 
                width="24" height="24" 
                viewBox="0 0 24 24" 
                fill={isStarred ? "currentColor" : "none"} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-[22px] h-[22px] ${isStarred ? "text-amber-400" : "text-gray-800"}`}
              >
                <path 
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" 
                  stroke={isStarred ? "none" : "currentColor"} 
                  strokeWidth="1.5"
                />
              </svg>
              <span className={`text-sm ml-1 ${isStarred ? "text-amber-400 font-medium" : "text-gray-800"}`}>
                {starCount}
              </span>
            </button>
            
            {/* Comment button */}
            <button className="flex items-center transition-transform hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm ml-1 text-gray-800">{commentCount}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Share dialog */}
      <ShareDialog 
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        postId={postId}
        postTitle={post?.title || 'Travel Post'}
      />
    </main>
  )
} 