"use client";

import { ReactNode, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Only animate after initial load
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Skip animations if reduced motion is preferred or component just mounted
  if (prefersReducedMotion || !isLoaded) {
    return <>{children}</>;
  }
  
  // Simplified animation variants for better performance
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 5 // Reduced from 10px to 5px for subtler animation
    },
    animate: { 
      opacity: 1, 
      y: 0 
    }
  };

  // Faster transition for better performance
  const pageTransition = {
    type: "tween", 
    ease: "easeOut",
    duration: 0.15 // Reduced from 0.2s to 0.15s
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
      className="will-change-transform" // Hint to browser to optimize for transform changes
    >
      {children}
    </motion.div>
  );
} 