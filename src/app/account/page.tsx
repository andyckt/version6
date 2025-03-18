"use client";

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { FiArrowRight, FiCheck, FiInfo, FiAlertCircle, FiClock, FiGlobe, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Account() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  
  // Fake waiting list count - 4 figure number
  const [waitingCount, setWaitingCount] = useState(3487);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
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
    // - Length between 1-30 characters
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

  // Animated number counter for waiting list
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const steps = 50; // Number of steps in the animation
    const increment = Math.ceil(waitingCount / steps);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= waitingCount) {
        setDisplayCount(waitingCount);
        clearInterval(timer);
      } else {
        setDisplayCount(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [waitingCount]);

  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/5 z-0"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-primary/5 z-0"></div>
      <div className="hidden md:block absolute top-1/4 left-10 transform -rotate-12">
        <FiMapPin className="text-primary/20 w-16 h-16" />
      </div>
      <div className="hidden md:block absolute bottom-1/4 right-10 transform rotate-12">
        <FiGlobe className="text-primary/20 w-16 h-16" />
      </div>
      
      <PageTransition>
        {!isSubmitted ? (
          <div className="max-w-4xl mx-auto px-4 pt-14 pb-16 relative z-10">
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <motion.h1 
                    className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500"
                    style={{ backgroundSize: "200%" }}
                    animate={{ 
                      backgroundPosition: ["0% center", "200% center"]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear"
                    }}
                  >
                    Join the Waitlist
                  </motion.h1>
                </motion.div>
              </div>
              
              <div>
                {/* Stats bar */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
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
                    
                    <motion.button
                      type="submit"
                      className={`w-full py-3.5 bg-primary rounded-lg font-medium text-white flex justify-center items-center
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ 
                        scale: isLoading ? 1 : 1.02,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLoading ? (
                        <>
                          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        <motion.div 
                          className="flex items-center justify-center w-full"
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Join Waiting List
                          <FiArrowRight className="ml-2" />
                        </motion.div>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
            <motion.div
              className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <FiCheck className="w-10 h-10 text-primary" />
              </motion.div>
              
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
                
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/" 
                    className="inline-block bg-primary text-black font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Back to Home
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 