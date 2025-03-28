import React, { FC } from 'react';
import { BaseMerchant, isMerchantOpen } from '@/data/merchants';

interface OpenStatusProps {
  merchant: BaseMerchant;
  size?: 'small' | 'normal';
  debug?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Displays whether a merchant is currently open or closed
 */
const OpenStatus: FC<OpenStatusProps> = ({ 
  merchant, 
  size = 'normal', 
  debug = false,
  clickable = false,
  onClick
}) => {
  const isOpen = isMerchantOpen(merchant);
  
  // Calculate China time for debugging
  const now = new Date();
  const utcHours = now.getUTCHours();
  const chinaHours = (utcHours + 8) % 24;
  const chinaMinutes = now.getUTCMinutes();
  const chinaTime = chinaHours * 60 + chinaMinutes;
  
  // If UTC time + 8 crosses into next day, increment the day
  const chinaDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + (utcHours + 8 >= 24 ? 1 : 0),
    chinaHours,
    chinaMinutes
  ));
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[chinaDay.getUTCDay()];
  
  // Define the blinking animation style based on open status
  const blinkingClass = isOpen ? 'animate-pulse-green' : 'animate-pulse-red';

  return (
    <div 
      className={`
        flex items-center ${size === 'small' ? 'gap-1' : 'gap-2'}
        ${clickable ? 'group cursor-pointer hover:opacity-90 transition-opacity' : ''}
      `}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div
        className={`
          ${size === 'small' ? 'w-2 h-2' : 'w-3 h-3'} 
          rounded-full 
          ${isOpen ? 'bg-green-500' : 'bg-red-500'} 
          ${blinkingClass}
          group-hover:ring-4 group-hover:ring-current group-hover:ring-opacity-10 transition-all duration-200
        `}
      />
      <span className={`
        ${size === 'small' ? 'text-xs' : 'text-sm'} 
        font-medium 
        ${clickable ? 'group-hover:opacity-80' : ''} 
        transition-opacity duration-200
      `}>
        {isOpen ? 'OPENING' : 'CLOSED'}
      </span>
      {debug && (
        <div className="text-xs text-gray-500 ml-2">
          China time: {currentDay} {chinaHours.toString().padStart(2, '0')}:{chinaMinutes.toString().padStart(2, '0')} ({chinaTime} mins)
        </div>
      )}
    </div>
  );
};

export default OpenStatus; 