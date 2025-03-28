"use client";

import { useState, useRef, useEffect } from 'react';
import { FiX, FiLink, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { SiKakao } from 'react-icons/si';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  postTitle: string;
  customUrl?: string;
}

export default function ShareDialog({ isOpen, onClose, postId, postTitle, customUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset states when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Copy link to clipboard
  const copyLink = () => {
    const url = customUrl 
      ? `${window.location.origin}${customUrl}` 
      : `${window.location.origin}/post/${postId}`;
      
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Share options with their handlers
  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <FiLink className="w-5 h-5" />,
      action: copyLink,
      color: 'bg-gray-500',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-5 h-5" />,
      action: () => {
        const url = customUrl 
          ? `${window.location.origin}${customUrl}` 
          : `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(url);
        alert('Link copied! Open Instagram and paste in your story or DM.');
        onClose();
      },
      color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400',
    },
    {
      name: 'Kakao',
      icon: <SiKakao className="w-5 h-5" />,
      action: () => {
        const url = customUrl 
          ? `${window.location.origin}${customUrl}` 
          : `${window.location.origin}/post/${postId}`;
        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`, '_blank');
        onClose();
      },
      color: 'bg-yellow-400',
    },
    {
      name: 'Facebook',
      icon: <FiFacebook className="w-5 h-5" />,
      action: () => {
        const url = customUrl 
          ? `${window.location.origin}${customUrl}` 
          : `${window.location.origin}/post/${postId}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        onClose();
      },
      color: 'bg-blue-600',
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="w-5 h-5" />,
      action: () => {
        const url = customUrl 
          ? `${window.location.origin}${customUrl}` 
          : `${window.location.origin}/post/${postId}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(`${postTitle} ${url}`)}`, '_blank');
        onClose();
      },
      color: 'bg-green-500',
    },
    {
      name: 'X.com',
      icon: <FaXTwitter className="w-5 h-5" />,
      action: () => {
        const url = customUrl 
          ? `${window.location.origin}${customUrl}` 
          : `${window.location.origin}/post/${postId}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${postTitle}`)}&url=${encodeURIComponent(url)}`, '_blank');
        onClose();
      },
      color: 'bg-black',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={dialogRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Share this post</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="flex flex-col items-center gap-2"
              >
                <div className={`${option.color} text-white p-3 rounded-full`}>
                  {option.icon}
                </div>
                <span className="text-xs">{option.name}</span>
              </button>
            ))}
          </div>
          
          {copied && (
            <div className="mt-4 p-2 bg-green-50 text-green-600 text-center text-sm rounded-md">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 