"use client";

import { useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface SharePreviewProps {
  postTitle: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function SharePreview({ postTitle, isVisible, onClose }: SharePreviewProps) {
  // Automatically hide the preview after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 w-[90%] max-w-sm animate-fade-in-up z-50 flex items-center">
      <div className="bg-green-500 text-white p-1.5 rounded-full mr-3">
        <FiCheck className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Link copied to clipboard!</p>
        <p className="text-xs text-gray-500 truncate">{postTitle}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
} 