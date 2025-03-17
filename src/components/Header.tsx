"use client";

import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiPlus, FiChevronDown, FiMapPin, FiBell } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BsBellFill, BsBell } from 'react-icons/bs';
import { RiNotification3Fill, RiNotification3Line } from 'react-icons/ri';
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
import { TbBellRinging } from 'react-icons/tb';
import Link from 'next/link';
import Image from 'next/image';

// List of cities in China
const cities = [
  { name: "Shanghai", available: true },
  { name: "Beijing", available: false },
  { name: "Guangzhou", available: false },
  { name: "Shenzhen", available: false },
  { name: "Chengdu", available: false },
  { name: "Hangzhou", available: false },
  { name: "Xi'an", available: false },
  { name: "Suzhou", available: false },
];

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: 'like',
    user: 'Sophie Chen',
    userAvatar: '/avatars/avatar-1.jpg',
    content: 'liked your post about Shanghai Tower',
    time: '2 minutes ago',
    isRead: false
  },
  {
    id: 2,
    type: 'comment',
    user: 'Mike Wang',
    userAvatar: '/avatars/avatar-2.jpg',
    content: 'commented on your post: "This place looks amazing!"',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: 3,
    type: 'follow',
    user: 'Lily Zhang',
    userAvatar: '/avatars/avatar-3.jpg',
    content: 'started following you',
    time: '3 hours ago',
    isRead: true
  },
  {
    id: 4,
    type: 'mention',
    user: 'David Liu',
    userAvatar: '/avatars/avatar-4.jpg',
    content: 'mentioned you in a comment',
    time: 'Yesterday',
    isRead: true
  }
];

// Notification icon options
const notificationIcons = [
  // Lighter options
  { 
    id: 'fi', 
    icon: FiBell, 
    name: 'Feather Bell (Light)',
    isLight: true
  },
  { 
    id: 'io-outline', 
    icon: IoNotificationsOutline, 
    name: 'Ionicons Outline (Light)',
    isLight: true
  },
  { 
    id: 'bs-outline', 
    icon: BsBell, 
    name: 'Bootstrap Bell (Light)',
    isLight: true
  },
  { 
    id: 'ri-outline', 
    icon: RiNotification3Line, 
    name: 'Remix Outline (Light)',
    isLight: true
  },
  { 
    id: 'md-outline', 
    icon: MdNotificationsNone, 
    name: 'Material Design Outline (Light)',
    isLight: true
  },
  { 
    id: 'tb', 
    icon: TbBellRinging, 
    name: 'Tabler Bell Ringing (Light)',
    isLight: true
  },
  
  // Bolder options
  { 
    id: 'io-filled', 
    icon: IoNotificationsOutline, 
    name: 'Ionicons Notification (Bold)',
    isLight: false
  },
  { 
    id: 'bs-filled', 
    icon: BsBellFill, 
    name: 'Bootstrap Bell (Bold)',
    isLight: false
  },
  { 
    id: 'ri-filled', 
    icon: RiNotification3Fill, 
    name: 'Remix Notification (Bold)',
    isLight: false
  },
  { 
    id: 'md-filled', 
    icon: MdNotificationsActive, 
    name: 'Material Design Notification (Bold)',
    isLight: false
  }
];

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [currentIconIndex, setCurrentIconIndex] = useState(0); // Start with Feather Bell (index 0)
  const [showLightIcons, setShowLightIcons] = useState(true); // Toggle between light and bold icons
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsScrollRef = useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  // Function to cycle through notification icons (for development/selection)
  const cycleNotificationIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Filter icons based on current preference (light or bold)
    const filteredIcons = notificationIcons.filter(icon => icon.isLight === showLightIcons);
    const currentFilteredIndex = filteredIcons.findIndex(icon => 
      icon.id === notificationIcons[currentIconIndex].id
    );
    
    // Find the next icon in the filtered list
    const nextFilteredIndex = (currentFilteredIndex + 1) % filteredIcons.length;
    const nextIconIndex = notificationIcons.findIndex(icon => 
      icon.id === filteredIcons[nextFilteredIndex].id
    );
    
    setCurrentIconIndex(nextIconIndex);
    return false;
  };

  // Toggle between light and bold icons
  const toggleIconStyle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setShowLightIcons(!showLightIcons);
    
    // Select the first icon of the new style
    const filteredIcons = notificationIcons.filter(icon => icon.isLight !== showLightIcons);
    if (filteredIcons.length > 0) {
      const newIconIndex = notificationIcons.findIndex(icon => 
        icon.id === filteredIcons[0].id
      );
      setCurrentIconIndex(newIconIndex);
    }
    
    return false;
  };

  // Get current notification icon component
  const CurrentNotificationIcon = notificationIcons[currentIconIndex].icon;

  // Prevent scroll propagation
  useEffect(() => {
    const scrollContainer = notificationsScrollRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      
      // Only prevent default if scroll has reached the top or bottom
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget as HTMLDivElement;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
      }
    };
    
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        scrollContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isNotificationsOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-white z-20 border-b border-gray-100">
      <div className="container-app">
        <div className="flex items-center justify-between py-2 relative">
          {/* Left section */}
          <div className="w-20 flex justify-start">
            <button className="p-1.5">
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
          
          {/* Center section - City dropdown */}
          <div className="absolute left-1/2 transform -translate-x-1/2" ref={dropdownRef}>
            <button 
              className={`
                flex items-center font-medium text-gray-900 
                px-3 py-1.5 rounded-full transition-all duration-300
                ${isDropdownOpen ? 'scale-105' : 'hover:scale-105'}
              `}
              onClick={toggleDropdown}
            >
              <span className="font-bold text-base leading-none">Shanghai</span>
              <FiChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1.5 bg-white rounded-xl shadow-xl py-2 w-56 z-30 border border-gray-100">
                <div className="px-4 py-1.5 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-700">Select a city</h3>
                </div>
                {cities.map((city) => (
                  <button
                    key={city.name}
                    className={`
                      w-full text-left px-4 py-2 text-xs flex items-center justify-between
                      transition-colors relative
                      ${city.name === "Shanghai" 
                        ? "text-primary font-bold bg-primary/5" 
                        : "text-gray-700 hover:bg-gray-50"}
                    `}
                    disabled={!city.available}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiMapPin className={`w-3.5 h-3.5 mr-2 ${city.name === "Shanghai" ? "text-primary" : "text-gray-400"}`} />
                      {city.name}
                    </div>
                    {city.name === "Shanghai" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    )}
                    {!city.available && (
                      <span className="text-[10px] py-0.5 px-1.5 rounded-full bg-gray-100 text-gray-400">Coming Soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right section - Notification and Plus buttons */}
          <div className="w-20 flex items-center justify-end space-x-3">
            {/* Notification Icon */}
            <div className="relative" ref={notificationsRef}>
              <div className="relative">
                <button 
                  className="relative p-1.5 transition-transform duration-300 hover:scale-110"
                  onClick={toggleNotifications}
                  onContextMenu={cycleNotificationIcon} // Right-click to cycle icons (for development)
                  onDoubleClick={toggleIconStyle} // Double-click to toggle between light and bold icons
                >
                  <CurrentNotificationIcon className="w-5 h-5 text-gray-700" />
                  {/* Notification indicator dot */}
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border-[1px] border-white"></span>
                  )}
                </button>
                
                {/* Icon selection tooltip (only visible during development) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {notificationIcons[currentIconIndex].name}
                  </div>
                )}
              </div>
              
              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-xl py-2 w-80 z-30 border border-gray-100 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <button 
                      className="text-xs text-primary font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHasNotifications(false);
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div 
                    ref={notificationsScrollRef}
                    className="max-h-[70vh] overflow-y-auto overscroll-contain"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                            {/* We'd use real images in production */}
                            {/* <Image 
                              src={notification.userAvatar} 
                              alt={notification.user} 
                              fill 
                              className="object-cover"
                            /> */}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 line-clamp-2">
                              <span className="font-medium">{notification.user}</span> {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button 
                      className="w-full py-2 text-center text-sm text-primary font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Plus Button */}
            <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 