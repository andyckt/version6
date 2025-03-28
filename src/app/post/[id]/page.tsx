"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState, Fragment, useEffect } from 'react'
import { FiArrowLeft, FiHeart, FiMessageSquare, FiBookmark, FiShare2, FiMoreHorizontal } from 'react-icons/fi'
import { FaHeart, FaBookmark } from 'react-icons/fa'
import { travelPosts, TaggedAccount } from '@/data/posts'
import { getUserByUsername } from '@/data/users'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import BlurImage from '@/components/BlurImage'
import MediaGallery from '@/components/MediaGallery'
import ShareDialog from '@/components/ShareDialog'

// Define comment types for type safety
interface CommentReply {
  id: number;
  username: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies: CommentReply[];
}

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export default function PostDetail({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  // Find the post with the matching ID
  const post = travelPosts.find(p => p.id === postId);
  
  // State for tracking user interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [starCount, setStarCount] = useState(post?.bookmarks || 0);
  const [storageAvailable, setStorageAvailable] = useState(false);
  
  // Define post-specific comments for each post - moved inside component to use postId
  const [initialComments, setInitialComments] = useState<Comment[]>([]);
  
  // Set initial comments when post changes
  useEffect(() => {
    // Create different comments for each post to make them unique
    let postSpecificComments: Comment[] = [];
    
    /* 
    // Comments for Post 1: Shanghai by Emma
    if (postId === 1) {
      postSpecificComments = [
        {
          id: 101,
          username: 'ShanghaiExplorer',
          avatar: 'S',
          text: 'The Bund is absolutely stunning! What time did you visit to get these views?',
          time: '3 days ago',
          likes: 8,
          isLiked: false,
          replies: [
            {
              id: 1001,
              username: 'wanderlust_emma',
              avatar: 'E',
              text: 'I went around sunset - the lights of Pudong make for an incredible backdrop!',
              time: '2 days ago',
              likes: 3,
              isLiked: false
            }
          ]
        },
        {
          id: 102,
          username: 'ChinaTravel',
          avatar: 'C',
          text: 'Did you get to try the xiaolongbao at Din Tai Fung? Their dumplings are legendary!',
          time: '1 day ago',
          likes: 4,
          isLiked: false,
          replies: []
        },
        {
          id: 103,
          username: 'WorldTraveler',
          avatar: 'W',
          text: 'I\'m planning a trip to Shanghai next month. Any neighborhoods that are less touristy?',
          time: '10 hours ago',
          likes: 1,
          isLiked: false,
          replies: [
            {
              id: 1002,
              username: 'LocalShanghainese',
              avatar: 'L',
              text: 'Check out the French Concession! Much more authentic and the architecture is beautiful.',
              time: '5 hours ago',
              likes: 2,
              isLiked: false
            }
          ]
        }
      ];
    }
    // Comments for Post 2: Xi'an by Li
    else if (postId === 2) {
      postSpecificComments = [
        {
          id: 201,
          username: 'HistoryBuff',
          avatar: 'H',
          text: 'The Muslim Quarter is my favorite part of Xi\'an too! Did you try the persimmon donuts?',
          time: '2 days ago',
          likes: 6,
          isLiked: false,
          replies: [
            {
              id: 2001,
              username: 'backpacker_li',
              avatar: 'L',
              text: 'Yes! They were amazing. I also loved the cold noodles with sesame sauce!',
              time: '1 day ago',
              likes: 2,
              isLiked: false
            }
          ]
        },
        {
          id: 202,
          username: 'BudgetTraveler',
          avatar: 'B',
          text: 'How long did it take you to walk the entire city wall? I\'m planning to do it next month.',
          time: '12 hours ago',
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 2002,
              username: 'backpacker_li',
              avatar: 'L',
              text: 'It took about 4 hours with stops for photos. Definitely bring water and go early to avoid the heat!',
              time: '6 hours ago',
              likes: 5,
              isLiked: false
            }
          ]
        }
      ];
    }
    // Comments for Post 3: Sanya Luxury by Zhao
    else if (postId === 3) {
      postSpecificComments = [
        {
          id: 301,
          username: 'LuxurySeeker',
          avatar: 'L',
          text: 'The St. Regis Sanya has been on my bucket list forever! Was the butler service really worth it?',
          time: '4 days ago',
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: 3001,
              username: 'luxury_zhao',
              avatar: 'Z',
              text: 'Absolutely! They unpacked our luggage, arranged a private dinner on the beach, and even prepared a bath with rose petals. Unforgettable!',
              time: '3 days ago',
              likes: 8,
              isLiked: false
            }
          ]
        },
        {
          id: 302,
          username: 'TravelInfluencer',
          avatar: 'T',
          text: 'Your photos are stunning! Which restaurant would you say had the best overall experience?',
          time: '2 days ago',
          likes: 5,
          isLiked: false,
          replies: []
        },
        {
          id: 303,
          username: 'HoneymoonerSoon',
          avatar: 'H',
          text: 'Planning a honeymoon here next year. How were the prices for food and activities?',
          time: '1 day ago',
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 3002,
              username: 'luxury_zhao',
              avatar: 'Z',
              text: 'Definitely on the higher side, but the quality matches the price. Budget around ¥800-1000 per person for dinner at the nicer restaurants.',
              time: '12 hours ago',
              likes: 4,
              isLiked: false
            }
          ]
        }
      ];
    }
    // Comments for Post 4: Rock Climbing by Yan
    else if (postId === 4) {
      postSpecificComments = [
        {
          id: 401,
          username: 'ClimbingFanatic',
          avatar: 'C',
          text: 'Yangshuo is climbing paradise! Did you check out Wine Bottle Cliff? One of my favorites there.',
          time: '5 days ago',
          likes: 7,
          isLiked: false,
          replies: [
            {
              id: 4001,
              username: 'adventure_yan',
              avatar: 'Y',
              text: 'We did! It was incredible. The holds were so unique. Did you stay in town or closer to the climbing sites?',
              time: '4 days ago',
              likes: 2,
              isLiked: false
            }
          ]
        },
        {
          id: 402,
          username: 'OutdoorEnthusiast',
          avatar: 'O',
          text: 'That video of your climb is giving me serious vertigo! How difficult would you rate the routes for beginners?',
          time: '3 days ago',
          likes: 5,
          isLiked: false,
          replies: []
        },
        {
          id: 403,
          username: 'TravelingClimber',
          avatar: 'T',
          text: 'Looking to visit in October. Is that a good time for climbing there? Any recommendations for guides?',
          time: '1 day ago',
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 4002,
              username: 'LocalClimber',
              avatar: 'L',
              text: 'October is perfect! Lower humidity and cooler temps. Check out Black Rock Climbing for guides - they know all the secret spots!',
              time: '6 hours ago',
              likes: 2,
              isLiked: false
            }
          ]
        }
      ];
    }
    // Comments for Post 5: Food Tour by Zhang
    else if (postId === 5) {
      postSpecificComments = [
        {
          id: 501,
          username: 'SpiceLover',
          avatar: 'S',
          text: 'I dream about Chengdu dan dan noodles at least once a week! Did you try the rabbit head? I couldn\'t bring myself to do it.',
          time: '3 days ago',
          likes: 9,
          isLiked: false,
          replies: [
            {
              id: 5001,
              username: 'foodie_zhang',
              avatar: 'Z',
              text: 'I did! It\'s definitely not for everyone, but the flavor is incredible. The cheek meat is the best part!',
              time: '2 days ago',
              likes: 4,
              isLiked: false
            }
          ]
        },
        {
          id: 502,
          username: 'CulinaryTraveler',
          avatar: 'C',
          text: 'That mapo tofu looks incredible! Did you find the peppercorn numbing effect overwhelming at first?',
          time: '2 days ago',
          likes: 6,
          isLiked: false,
          replies: []
        },
        {
          id: 503,
          username: 'FoodieExplorer',
          avatar: 'F',
          text: 'I\'m headed to Chengdu next month and I\'m all about street food. Any specific stalls at Chunxi Road you\'d recommend?',
          time: '1 day ago',
          likes: 3,
          isLiked: false,
          replies: [
            {
              id: 5002,
              username: 'foodie_zhang',
              avatar: 'Z',
              text: 'Look for the stall with the longest line at the corner of the food street! Their chili wontons are life-changing.',
              time: '12 hours ago',
              likes: 5,
              isLiked: false
            }
          ]
        },
        {
          id: 504,
          username: 'VeganWanderer',
          avatar: 'V',
          text: 'Any recommendations for plant-based options? I\'m going in a few weeks but worried about finding vegan food.',
          time: '6 hours ago',
          likes: 2,
          isLiked: false,
          replies: []
        }
      ];
    } 
    */
    
    // Default comments if no specific post matches
    // This code will now run for all posts since the specific post conditions are commented out
    /*
    postSpecificComments = [
      {
        id: 1,
        username: `Commenter${postId}_1`,
        avatar: 'S',
        text: `This is a great post about ${post?.title || 'travel'}! What's your favorite part of this location?`,
        time: '3 days ago',
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 101,
            username: post?.username || 'TravelExplorer',
            avatar: 'T',
            text: 'Thanks for your comment! I loved the local cuisine and the amazing views!',
            time: '2 days ago',
            likes: 3,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        username: `Commenter${postId}_2`,
        avatar: 'C',
        text: `I've been wanting to visit. Is it suitable for a family trip?`,
        time: '1 day ago',
        likes: 4,
        isLiked: false,
        replies: []
      }
    ];
    */
    
    // Initialize with empty comments array
    postSpecificComments = [];
    
    setInitialComments(postSpecificComments);
    setComments(postSpecificComments);
  }, [post, postId]);
  
  // Check if localStorage is available and load liked/bookmarked status
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
    
    if (available && post) {
      try {
        // Load liked posts from localStorage
        const savedLikedPosts = localStorage.getItem('likedPosts');
        if (savedLikedPosts) {
          const parsedLikedPosts = JSON.parse(savedLikedPosts);
          
          // Check if this post is liked
          const isPostLiked = parsedLikedPosts[post.id] === true;
          setIsLiked(isPostLiked);
          
          // If liked, adjust the initial like count
          if (isPostLiked) {
            setLikeCount(post.likes + 1);
          }
        }
        
        // Load bookmarked posts from localStorage
        const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts');
        if (savedBookmarkedPosts) {
          const parsedBookmarkedPosts = JSON.parse(savedBookmarkedPosts);
          
          // Check if this post is bookmarked
          const isPostBookmarked = parsedBookmarkedPosts[post.id] === true;
          setIsStarred(isPostBookmarked);
          
          // If bookmarked, adjust the initial bookmark count
          if (isPostBookmarked) {
            setStarCount((post.bookmarks || 0) + 1);
          } else {
            setStarCount(post.bookmarks || 0);
          }
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }
  }, [post]);
  
  // Save liked status to localStorage
  const updateLocalStorageLiked = (liked: boolean) => {
    if (storageAvailable && post) {
      try {
        // Get current liked posts
        const savedLikedPosts = localStorage.getItem('likedPosts');
        let parsedLikedPosts = savedLikedPosts ? JSON.parse(savedLikedPosts) : {};
        
        // Update the liked status for this post
        parsedLikedPosts[post.id] = liked;
        
        // Save back to localStorage
        localStorage.setItem('likedPosts', JSON.stringify(parsedLikedPosts));
      } catch (error) {
        console.error('Failed to save liked status to localStorage:', error);
      }
    }
  };
  
  // Save bookmarked status to localStorage
  const updateLocalStorageBookmarked = (bookmarked: boolean) => {
    if (storageAvailable && post) {
      try {
        // Get current bookmarked posts
        const savedBookmarkedPosts = localStorage.getItem('bookmarkedPosts');
        let parsedBookmarkedPosts = savedBookmarkedPosts ? JSON.parse(savedBookmarkedPosts) : {};
        
        // Update the bookmarked status for this post
        parsedBookmarkedPosts[post.id] = bookmarked;
        
        // Save back to localStorage
        localStorage.setItem('bookmarkedPosts', JSON.stringify(parsedBookmarkedPosts));
        console.log('Saved bookmarked status:', parsedBookmarkedPosts);
      } catch (error) {
        console.error('Failed to save bookmarked status to localStorage:', error);
      }
    }
  };
  
  // Calculate initial comment count (including replies)
  const calculateCommentCount = (comments: Comment[]): number => {
    return comments.reduce((total: number, comment: Comment) => {
      // Count the main comment
      let count = 1;
      // Add replies count if any
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length;
      }
      return total + count;
    }, 0);
  };
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [pinnedMerchants, setPinnedMerchants] = useState<number[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Sync comment count when comments change
  useEffect(() => {
    setCommentCount(calculateCommentCount(comments));
  }, [comments]);
  
  // Handle scroll events to apply shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <header className="sticky top-0 bg-white z-20 border-b border-gray-100">
          <div className="container-app">
            <div className="flex items-center justify-between py-1.5">
              <Link href="/" className="p-1.5 transition-transform hover:scale-110 active:scale-95">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>
        
        <div className="container-app py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiBookmark className="w-6 h-6 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-500 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  // Handle like button click
  const handleLikeClick = () => {
    const newLikedState = !isLiked;
    
    if (isLiked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    
    setIsLiked(newLikedState);
    
    // Update localStorage
    updateLocalStorageLiked(newLikedState);
  }
  
  // Handle star button click
  const handleStarClick = () => {
    const newStarredState = !isStarred;
    
    if (isStarred) {
      setStarCount(prev => prev - 1)
    } else {
      setStarCount(prev => prev + 1)
    }
    
    setIsStarred(newStarredState);
    
    // Update localStorage
    updateLocalStorageBookmarked(newStarredState);
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
            href={`/merchant/${part}`}
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
      <header 
        className={`sticky top-0 z-20 border-b border-gray-100 transition-all duration-200 
        ${hasScrolled ? 'shadow-sm bg-white' : 'bg-white/95 backdrop-blur-sm'}`}
      >
        <div className="container-app">
          <div className="flex items-center justify-between py-1.5">
            {/* Left section - Back button */}
            <Link href="/" className="p-1.5 transition-transform hover:scale-110 active:scale-95">
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            
            {/* Center section - Profile and username */}
            <Link 
              href={`/user/${post.username}`}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img 
                  src={getUserByUsername(post.username)?.profileImage || '/placeholder-profile.jpg'} 
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium group-hover:underline">{getUserByUsername(post.username)?.displayName || post.username}</span>
                <span className="text-xs text-gray-500">@{post.username}</span>
              </div>
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
          <div className="mb-2">
            <h2 className="text-xl font-bold mb-3">{post.title}</h2>
            <p className="text-base leading-relaxed mb-4">
              {renderDescriptionWithMentions(post.description || `Exploring the beautiful ${post.hashtags.join(' and ')} areas. This trip was amazing and I'd recommend it to anyone looking for an authentic travel experience. The local culture, food, and scenery were absolutely breathtaking.`)}
            </p>
            
            {/* Tagged accounts section */}
            {post.taggedAccounts && post.taggedAccounts.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {post.taggedAccounts.map(account => (
                    <Link 
                      key={account.id}
                      href={`/merchant/${account.username}`} 
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
                          ) : account.accountType === 'barandclub' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M21 5V3H3v2l8 8v5H6v2h12v-2h-5v-5l8-8zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/>
                            </svg>
                          ) : account.accountType === 'shopping' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
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
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">Posted 2 days ago</p>
          </div>

          {/* Empty space between post content and bottom bar when no comments */}
          {comments.length === 0 && <div className="mb-4"></div>}
          
          {/* Comments section - only show when there are comments */}
          {comments.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mb-4">
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
          )}
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
              {isLiked ? (
                <FaHeart className="w-[22px] h-[22px] text-red-500" />
              ) : (
                <FiHeart className="w-[22px] h-[22px] text-gray-800" />
              )}
              <span className={`text-sm ml-1 ${isLiked ? "text-red-500 font-medium" : "text-gray-800"}`}>
                {likeCount}
              </span>
            </button>
            
            {/* Star/Save button */}
            <button 
              className="flex items-center transition-transform hover:scale-110 active:scale-95"
              onClick={handleStarClick}
            >
              {isStarred ? (
                <FaBookmark className="w-[22px] h-[22px] text-amber-400" />
              ) : (
                <FiBookmark className="w-[22px] h-[22px] text-gray-800" />
              )}
              <span className={`text-sm ml-1 ${isStarred ? "text-amber-400 font-medium" : "text-gray-800"}`}>
                {starCount}
              </span>
            </button>
            
            {/* Comment count button - hide if no comments */}
            {commentCount > 0 && (
            <button className="flex items-center transition-transform hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm ml-1 text-gray-800">{commentCount}</span>
            </button>
            )}
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