"use client";

import { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { FiArrowRight, FiCheck, FiInfo, FiAlertCircle, FiClock, FiGlobe, FiMapPin, FiLock, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Account() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Invite code states
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Hamburger menu state
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  
  // Fake waiting list count - 4 figure number
  const [waitingCount, setWaitingCount] = useState(3487);
  
  // Indicate that page has loaded
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  
  // Animation variants - simplified for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Form validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!username.trim()) {
      setError('Please enter a username');
      setIsLoading(false);
      return;
    }

    // Match Twitter/Instagram username rules:
    // - Alphanumeric characters, underscores, and periods
    // - No consecutive periods
    // - Cannot start or end with a period
    // - Length between 1-15 characters
    if (!/^[a-z0-9_]{1,15}$/.test(username)) {
      setError('Username can only contain lowercase letters, numbers, and underscores (max 15 characters)');
      setIsLoading(false);
      return;
    }

    try {
      // Increment the waiting count first for immediate visual feedback
      setWaitingCount(prevCount => prevCount + 1);
      
      // Send data to our API route
      const response = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Revert the count if there was an error
        setWaitingCount(prevCount => prevCount - 1);
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Set the user ID from the response
      setUserId(data.data.userId);
      
      // Show success state
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join waiting list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized counter to avoid unnecessary rerenders
  const displayCount = useMemo(() => {
    return waitingCount;
  }, [waitingCount]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteLoading(true);
    
    // Simple validation
    if (!inviteCode.trim()) {
      setInviteError('Please enter an invite code');
      setInviteLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (inviteCode === '333888') {
        setShowInviteSuccess(true);
      } else {
        setInviteError('Invalid invite code. Please try again.');
      }
      setInviteLoading(false);
    }, 500); // Reduced from 1000ms to 500ms for faster response
  };

  // Simplified background decorations - only show when page is loaded
  const BackgroundDecorations = () => {
    if (!pageLoaded) return null;
    
    return (
      <>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/5 z-0"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-primary/5 z-0"></div>
        <div className="hidden md:block absolute top-1/4 left-10 transform -rotate-12">
          <FiMapPin className="text-primary/20 w-16 h-16" />
        </div>
        <div className="hidden md:block absolute bottom-1/4 right-10 transform rotate-12">
          <FiGlobe className="text-primary/20 w-16 h-16" />
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background decoration elements - only rendered when page is loaded */}
      <BackgroundDecorations />
      
      {/* Hamburger menu button - fixed position on both mobile and desktop */}
      <motion.button
        className="fixed top-5 right-5 z-50 bg-white p-2 rounded-full shadow-md overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowInviteMenu(!showInviteMenu)}
      >
        {showInviteMenu ? (
          <FiX className="w-6 h-6 text-gray-800" />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center">
            <img 
              src="/icons/gif-food.gif" 
              alt="Menu" 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        )}
      </motion.button>
      
      {/* Mobile fullscreen sidebar - only shown on mobile */}
      <AnimatePresence>
        {showInviteMenu && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowInviteMenu(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-8">
                {!showInviteSuccess ? (
                  <>
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                          <FiLock className="text-white text-lg" />
                        </div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <h2 className="text-lg font-semibold">Have an Invite Code?</h2>
                        <p className="text-sm text-gray-600">
                          Skip the waitlist with an exclusive invite code.
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleInviteSubmit}>
                      <div className="mb-5">
                        <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Invite Code
                        </label>
                        <input
                          type="text"
                          id="inviteCode"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your invite code"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          disabled={inviteLoading}
                        />
                      </div>
                      
                      {inviteError && (
                        <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                          <FiAlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{inviteError}</span>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        className={`w-full py-3 bg-purple-500 rounded-lg font-medium text-white flex justify-center items-center
                          ${inviteLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                        disabled={inviteLoading}
                      >
                        {inviteLoading ? (
                          <>
                            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Verifying...
                          </>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            Apply Code
                            <FiArrowRight className="ml-2" />
                          </div>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <FiCheck className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Code Accepted!</h3>
                      <p className="text-gray-600 mb-4">
                        Your invite code has been accepted. You'll get exclusive early access when we launch.
                      </p>
                      <button
                        onClick={() => setShowInviteSuccess(false)}
                        className="text-purple-500 hover:text-purple-700 text-sm font-medium"
                      >
                        Use a different code
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FiInfo className="text-gray-400 w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-500 ml-2">
                      Invite codes are distributed to early partners and testers. 
                      Don't have a code? Join our waiting list to be notified when more become available.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PageTransition>
        {!isSubmitted ? (
          <div className="max-w-5xl mx-auto px-4 pt-14 pb-16 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main waitlist form - takes full width when invite menu is hidden, 2/3 when shown on desktop */}
            <div className={`${showInviteMenu ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="max-w-md mx-auto">
                <div className="mb-6 text-center">
                  <motion.div
                    variants={containerVariants} 
                    initial="hidden"
                    animate="visible"
                  >
                    <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500">
                      Join the Waitlist
                    </h1>
                  </motion.div>
                </div>
                
                <div>
                  {/* Stats bar */}
                  <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 w-full flex items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-600">Travelers joined</p>
                          <p className="text-2xl font-bold text-gray-800 ml-3">{displayCount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                    <div className="flex items-start mb-5">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                          <span className="text-white text-lg font-bold">@</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <h2 className="text-lg font-semibold">Reserve Your Username</h2>
                        <p className="text-sm text-gray-600">
                          Get early access and secure your preferred @username.
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      
                      <div className="mb-5">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-gray-500">@</span>
                          </div>
                          <input
                            type="text"
                            id="username"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            pattern="^[a-z0-9_]{1,15}$"
                            title="Username can only contain lowercase letters, numbers, and underscores (max 15 characters)"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">
                          Lowercase letters, numbers, and underscores only (max 15 characters)
                        </p>
                      </div>
                      
                      {error && (
                        <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                          <FiAlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        className={`w-full py-3.5 bg-primary rounded-lg font-medium text-white flex justify-center items-center
                          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Processing...
                          </>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            Join Waiting List
                            <FiArrowRight className="ml-2" />
                          </div>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Invite Code Sidebar - shown/hidden by hamburger menu, only on desktop */}
            <AnimatePresence>
              {showInviteMenu && (
                <motion.div 
                  className="hidden md:block md:col-span-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-20">
                    {!showInviteSuccess ? (
                      <>
                        <div className="flex items-start mb-5">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                              <FiLock className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="ml-4 flex-grow">
                            <h2 className="text-lg font-semibold">Have an Invite Code?</h2>
                            <p className="text-sm text-gray-600">
                              Skip the waitlist with an exclusive invite code.
                            </p>
                          </div>
                        </div>
                        
                        <form onSubmit={handleInviteSubmit}>
                          <div className="mb-5">
                            <label htmlFor="inviteCodeDesktop" className="block text-sm font-medium text-gray-700 mb-1">
                              Invite Code
                            </label>
                            <input
                              type="text"
                              id="inviteCodeDesktop"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter your invite code"
                              value={inviteCode}
                              onChange={(e) => setInviteCode(e.target.value)}
                              disabled={inviteLoading}
                            />
                          </div>
                          
                          {inviteError && (
                            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                              <FiAlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{inviteError}</span>
                            </div>
                          )}
                          
                          <button
                            type="submit"
                            className={`w-full py-3 bg-purple-500 rounded-lg font-medium text-white flex justify-center items-center
                              ${inviteLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                            disabled={inviteLoading}
                          >
                            {inviteLoading ? (
                              <>
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                Verifying...
                              </>
                            ) : (
                              <div className="flex items-center justify-center w-full">
                                Apply Code
                                <FiArrowRight className="ml-2" />
                              </div>
                            )}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <FiCheck className="w-8 h-8 text-purple-500" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Code Accepted!</h3>
                          <p className="text-gray-600 mb-4">
                            Your invite code has been accepted. You'll get exclusive early access when we launch.
                          </p>
                          <button
                            onClick={() => setShowInviteSuccess(false)}
                            className="text-purple-500 hover:text-purple-700 text-sm font-medium"
                          >
                            Use a different code
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiInfo className="text-gray-400 w-5 h-5" />
                        </div>
                        <p className="text-xs text-gray-500 ml-2">
                          Invite codes are distributed to early partners and testers. 
                          Don't have a code? Join our waiting list to be notified when more become available.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="w-20 h-20 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-center mb-2">You're on the list!</h2>
                <p className="text-gray-600 text-center mb-8">
                  We've reserved <span className="font-semibold text-black">@{username}</span> for you. 
                  We've sent a confirmation email to your inbox. You'll be one of the first to know when we launch.
                </p>
                
                {userId && (
                  <div className="text-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-sm font-medium text-gray-700">{userId}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <Link 
                    href="/" 
                    className="inline-block bg-primary text-black font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 