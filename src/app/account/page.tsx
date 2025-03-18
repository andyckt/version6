"use client";

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import Image from 'next/image'
import { FiSettings, FiMapPin, FiHeart, FiBookmark, FiEdit3, FiGrid, FiArrowRight, FiCheck, FiInfo, FiAlertCircle, FiGlobe, FiUsers, FiClock } from 'react-icons/fi'
import Link from 'next/link'
import { travelPosts } from '@/data/posts'
import BlurImage from '@/components/BlurImage'
import { motion } from 'framer-motion'

export default function Account() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(0);
  const [userId, setUserId] = useState('');
  
  // Fake waiting list count - high number as requested
  const waitingCount = 12487;
  
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
    
    // Simple validation
    if (!email || !username) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    // Username validation (only English letters and numbers)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username can only contain English letters and numbers');
      setIsLoading(false);
      return;
    }
    
    try {
      // Send data to our API route
      const response = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Set the position and user ID from the response
      setPosition(data.data.position);
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
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {!isSubmitted ? (
        <div className="pt-6 pb-20 px-4">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-amber-500">
                Join the Waitlist
              </h1>
              <p className="text-gray-600 mt-2">
                Be among the first to experience our travel platform
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Stats */}
              <motion.div 
                variants={itemVariants}
                className="mb-8 grid grid-cols-3 gap-4"
              >
                <div className="bg-white rounded-xl shadow-sm p-4 text-center transform transition-transform hover:scale-105 duration-300">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{displayCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Travelers</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 text-center transform transition-transform hover:scale-105 duration-300">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <FiGlobe className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-xs text-gray-500">Cities</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 text-center transform transition-transform hover:scale-105 duration-300">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                    <FiClock className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">Soon</p>
                  <p className="text-xs text-gray-500">Launch</p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100"
              >
                <div className="flex items-start mb-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-white text-lg font-bold">@</span>
                    </div>
                    <motion.div 
                      className="absolute -right-1 -top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(255,209,0,0.5)", "0px 0px 0px rgba(0,0,0,0)"]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 2
                      }}
                    >
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                    </motion.div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <h2 className="text-lg font-semibold">Reserve Your Username</h2>
                    <p className="text-sm text-gray-600">
                      Get early access to our platform and secure your preferred @username.
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
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
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        pattern="[a-zA-Z0-9]+"
                        title="Only English letters and numbers are allowed"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Only English letters and numbers
                    </p>
                  </div>
                  
                  {error && (
                    <motion.div 
                      className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FiAlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  
                  <motion.button
                    type="submit"
                    className={`w-full py-3.5 bg-primary rounded-lg font-medium text-white flex justify-center items-center
                      ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Join Waiting List
                        <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="w-20 h-20 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiCheck className="w-10 h-10 text-primary" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-center mb-2">You're on the list!</h2>
              <p className="text-gray-600 text-center mb-8">
                We've reserved <span className="font-semibold text-black">@{username}</span> for you. 
                You'll be one of the first to know when we launch.
              </p>
              
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 mb-1">Your position</p>
                  <motion.p 
                    className="text-3xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    #{position || waitingCount + 1}
                  </motion.p>
                  
                  {userId && (
                    <motion.p 
                      className="text-xs text-gray-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      User ID: {userId}
                    </motion.p>
                  )}
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-center"
              >
                <Link 
                  href="/" 
                  className="inline-block text-primary text-sm font-medium border-b border-primary pb-0.5 transition-colors hover:text-amber-600 hover:border-amber-600"
                >
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Animated background decorations */}
            <motion.div 
              className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-primary opacity-10"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-amber-500 opacity-10"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 270, 180, 90, 0],
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "loop",
                duration: 15,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      )}
      
      <Navigation />
    </main>
  )
} 