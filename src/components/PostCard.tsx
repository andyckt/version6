"use client";

/**
 * Post Card Component
 * 
 * This component displays a single post with its content, author information,
 * visibility status, and interaction options.
 */

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext';
import { Post, PostVisibility, formatRelativeTime } from '@/types/post';
import { User } from '@/types/user';
import { canUserCommentOnPost } from '@/utils/postUtils';
import { FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiMoreHorizontal, FiGlobe, FiUsers, FiLock } from 'react-icons/fi';

interface PostCardProps {
  post: Post;
  author: User;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  author,
  onLike,
  onComment,
  onShare,
  onSave
}) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  
  // Determine if the current user can comment on this post
  const canComment = user ? canUserCommentOnPost(post, user, author) : false;
  
  // Function to handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !canComment || !onComment) return;
    
    setIsSubmittingComment(true);
    
    // Simulate API delay
    setTimeout(() => {
      onComment(post.id, comment);
      setComment('');
      setIsSubmittingComment(false);
    }, 500);
  };
  
  // Function to toggle showing full caption
  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };
  
  // Function to render the post's visibility icon
  const renderVisibilityIcon = (visibility: PostVisibility) => {
    switch (visibility) {
      case 'public':
        return <FiGlobe className="text-green-500" title="Public" />;
      case 'followers':
        return <FiUsers className="text-blue-500" title="Followers Only" />;
      case 'private':
        return <FiLock className="text-red-500" title="Private" />;
      default:
        return null;
    }
  };
  
  // Function to render the post caption with text truncation
  const renderCaption = () => {
    if (post.caption.length <= 150 || showFullCaption) {
      return <p className="mb-3">{post.caption}</p>;
    }
    
    return (
      <div className="mb-3">
        <p>{post.caption.substring(0, 150)}...</p>
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
          onClick={toggleCaption}
        >
          Read more
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post header with author info */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center">
          <img 
            src={author.profileImage} 
            alt={author.displayName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900">{author.displayName}</h3>
              {author.verified && (
                <span className="ml-1 text-blue-500">✓</span>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatRelativeTime(post.createdAt)}</span>
              <span className="mx-1">•</span>
              <span className="flex items-center">
                {renderVisibilityIcon(post.visibility)}
                <span className="ml-1">
                  {post.visibility === 'public' ? 'Public' : 
                   post.visibility === 'followers' ? 'Followers' : 'Private'}
                </span>
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <FiMoreHorizontal />
        </button>
      </div>
      
      {/* Post caption */}
      <div className="px-4">
        {renderCaption()}
      </div>
      
      {/* Post location if available */}
      {post.location && (
        <div className="px-4 mb-3 text-sm text-blue-600">
          📍 {post.location.name}
          {post.location.city && `, ${post.location.city}`}
          {post.location.country && `, ${post.location.country}`}
        </div>
      )}
      
      {/* Post media */}
      {post.media.length > 0 && (
        <div className={`${post.media.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
          {post.media.map((item, index) => (
            <div key={item.id} className={`${post.media.length === 1 ? 'w-full' : ''}`}>
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt={item.alt || `Post image ${index + 1}`}
                  className="w-full object-cover"
                  style={{ maxHeight: post.media.length === 1 ? '500px' : '250px' }}
                />
              ) : (
                <video 
                  src={item.url}
                  controls
                  className="w-full"
                  style={{ maxHeight: post.media.length === 1 ? '500px' : '250px' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Post stats */}
      {!post.hideStats && (
        <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
          {post.likesCount > 0 && (
            <span className="mr-3">{post.likesCount} likes</span>
          )}
          {post.commentsCount > 0 && (
            <span className="mr-3">{post.commentsCount} comments</span>
          )}
          {post.sharesCount > 0 && (
            <span>{post.sharesCount} shares</span>
          )}
        </div>
      )}
      
      {/* Post actions */}
      <div className="flex border-t border-b border-gray-100">
        <button 
          onClick={() => onLike && onLike(post.id)}
          className="flex-1 py-2 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50"
        >
          <FiHeart className="mr-2" />
          <span>Like</span>
        </button>
        
        <button 
          onClick={() => document.getElementById(`comment-input-${post.id}`)?.focus()}
          className={`flex-1 py-2 flex items-center justify-center ${
            canComment 
              ? 'text-gray-500 hover:text-blue-500 hover:bg-gray-50' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          disabled={!canComment}
        >
          <FiMessageSquare className="mr-2" />
          <span>Comment</span>
        </button>
        
        <button 
          onClick={() => onShare && onShare(post.id)}
          className="flex-1 py-2 flex items-center justify-center text-gray-500 hover:text-green-500 hover:bg-gray-50"
        >
          <FiShare2 className="mr-2" />
          <span>Share</span>
        </button>
        
        <button 
          onClick={() => onSave && onSave(post.id)}
          className="flex-1 py-2 flex items-center justify-center text-gray-500 hover:text-purple-500 hover:bg-gray-50"
        >
          <FiBookmark className="mr-2" />
          <span>Save</span>
        </button>
      </div>
      
      {/* Comments section */}
      <div className="p-4">
        {/* Comment form */}
        {canComment && (
          <form onSubmit={handleCommentSubmit} className="mb-4 flex">
            <input
              id={`comment-input-${post.id}`}
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              disabled={!comment.trim() || isSubmittingComment}
            >
              Post
            </button>
          </form>
        )}
        
        {/* Display a few comments */}
        {post.comments.length > 0 && (
          <div className="space-y-3">
            {post.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex">
                <div className="mr-2 flex-shrink-0">
                  {/* In a real app, we would fetch the commenter's user data and profile image */}
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                  <div className="font-medium text-sm">User {comment.userId}</div>
                  <p className="text-sm">{comment.text}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(comment.createdAt)}
                    {comment.isEdited && <span className="ml-1">(edited)</span>}
                  </div>
                </div>
              </div>
            ))}
            
            {post.comments.length > 3 && (
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}
        
        {/* If comments are disabled */}
        {post.commentSetting === 'none' && (
          <div className="text-gray-500 text-sm text-center">
            Comments are disabled for this post
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 