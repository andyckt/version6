"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

// Animation variants for the transition
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 10 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  },
  exit: { 
    opacity: 0, 
    y: -10 
  }
};

// Transition settings optimized for speed and smoothness
const pageTransition = {
  type: "tween", // Linear transition instead of spring for more predictable timing
  ease: "easeInOut",
  duration: 0.2 // Faster transition (200ms instead of 300ms)
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="will-change-transform" // Hint to browser to optimize for transform changes
    >
      {children}
    </motion.div>
  );
} 