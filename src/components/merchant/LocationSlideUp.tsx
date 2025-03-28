import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCopy } from 'react-icons/fi';
import { FaTaxi, FaSubway } from 'react-icons/fa';

interface LocationSlideUpProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    chineseAddress: string;
    englishAddress: string;
    nearestSubway: string;
    branchDistrict: string;
  };
}

export default function LocationSlideUp({ isOpen, onClose, location }: LocationSlideUpProps) {
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle animation states
  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening');
      setTimeout(() => setAnimationState('open'), 10);
    } else if (!isOpen && (animationState === 'open' || animationState === 'opening')) {
      setAnimationState('closing');
      setTimeout(() => setAnimationState('closed'), 300);
    }
  }, [isOpen, animationState]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
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

  // Prevent body scroll when sheet is open
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

  if (animationState === 'closed' && !isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-300 flex items-end justify-center ${
        animationState === 'open' ? 'bg-opacity-30' : 'bg-opacity-0'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%'
      }}
    >
      <div 
        ref={sheetRef}
        className="bg-white rounded-t-2xl w-full md:w-[480px] flex flex-col transition-transform duration-300 ease-out"
        style={{ 
          transform: animationState === 'open' ? 'translateY(0)' : 'translateY(100%)',
          position: 'absolute',
          bottom: 0,
          height: '70%',
          maxHeight: '600px'
        }}
      >
        {/* Handle for dragging */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-lg font-bold">Location Details</h3>
          <button 
            onClick={onClose}
            className="p-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 overflow-y-auto flex-1">
          <div className="py-4 space-y-6">
            {/* Chinese Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaTaxi className="text-[#FFB800]" size={16} />
                  <span className="text-sm text-gray-500">Show this to Taxi Driver:</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(location.chineseAddress)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiCopy size={16} />
                </button>
              </div>
              <p className="text-base leading-relaxed">{location.chineseAddress}</p>
            </div>

            {/* English Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">English Address:</span>
                <button 
                  onClick={() => copyToClipboard(location.englishAddress)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiCopy size={16} />
                </button>
              </div>
              <p className="text-base leading-relaxed">{location.englishAddress}</p>
            </div>

            {/* Nearest Subway */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaSubway className="text-[#FFB800]" size={16} />
                <span className="text-sm text-gray-500">Nearest Station:</span>
              </div>
              <p className="text-base leading-relaxed">{location.nearestSubway}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 