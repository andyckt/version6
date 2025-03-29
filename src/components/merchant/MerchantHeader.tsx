import React, { useState } from 'react';
import Link from 'next/link';
import { FiMapPin, FiCheckCircle, FiShare2, FiUser, FiExternalLink, FiAward, FiStar, FiTag, FiClock, FiChevronDown, FiCoffee, FiLock, FiMusic, FiMic, FiRadio } from 'react-icons/fi';
import { BaseMerchant, isSingleLocationMerchant, isMultiLocationMerchant, isAttractionMerchant, isHotelMerchant, isBarClubMerchant, isBuildingMerchant, isStreetMerchant, isMerchantOpen, OpeningHoursItem } from '@/data/merchants';
import { Navigation, X, Phone, Copy, Car, Train } from "lucide-react";
import { motion } from "framer-motion";
import BusinessInfo from './BusinessInfo';
import OpenStatus from './OpenStatus';
import AnimatedStars from './AnimatedStars';
import ScrollableAmenityTags from './ScrollableAmenityTags';
import { createPortal } from 'react-dom';

interface MerchantHeaderProps {
  merchant: BaseMerchant;
}

const MerchantTypeIcon = ({ merchant }: { merchant: BaseMerchant }) => {
  switch (merchant.accountType) {
    case 'restaurant':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
        </svg>
      );
    case 'hotel':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
        </svg>
      );
    case 'attraction':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'barandclub':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" />
        </svg>
      );
    case 'shopping':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
        </svg>
      );
  }
};

// Calculate status text based on merchant opening hours
const getStatusText = (merchant: BaseMerchant): string => {
  // For merchants with no applicable business hours
  if (isHotelMerchant(merchant) || isStreetMerchant(merchant)) {
    return '';
  }
  
  // Get the opening hours
  let openingHours: OpeningHoursItem[] = [];
  if (isSingleLocationMerchant(merchant) || isBuildingMerchant(merchant) || 
      isAttractionMerchant(merchant) || isBarClubMerchant(merchant)) {
    if (!merchant.businessInfo?.openingHours) return '';
    openingHours = merchant.businessInfo.openingHours;
  } else if (isMultiLocationMerchant(merchant)) {
    merchant.branches.forEach(branch => {
      openingHours = [...openingHours, ...branch.openingHours];
    });
  } else {
    return '';
  }
  
  if (openingHours.length === 0) return '';
  
  // Get current day and time in China
  const now = new Date();
  const utcHours = now.getUTCHours();
  const chinaHours = (utcHours + 8) % 24;
  const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
  
  const chinaDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + dayIncrement,
    chinaHours,
    now.getUTCMinutes()
  ));
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[chinaDay.getUTCDay()];
  const nextDay = days[(chinaDay.getUTCDay() + 1) % 7];
  
  // Check if merchant is open
  const isOpen = isMerchantOpen(merchant);
  
  if (isOpen) {
    // Find closing time
    const applicableItems = openingHours.filter(item => {
      if (item.day === currentDay) return true;
      if (item.day === 'All days' || item.day === 'Monday-Sunday') return true;
      if (item.day === 'Weekends' && (currentDay === 'Saturday' || currentDay === 'Sunday')) return true;
      if (item.day === 'Weekdays' && !(currentDay === 'Saturday' || currentDay === 'Sunday')) return true;
      
      if (item.day.includes('-') && item.day !== 'Monday-Sunday') {
        const [startDay, endDay] = item.day.split('-');
        const startIndex = days.indexOf(startDay);
        const endIndex = days.indexOf(endDay);
        const currentIndex = chinaDay.getUTCDay();
        
        if (startIndex <= currentIndex && currentIndex <= endIndex) return true;
        if (startIndex > endIndex && (currentIndex >= startIndex || currentIndex <= endIndex)) return true;
      }
      return false;
    });
    
    // Check for 24-hour operation
    for (const item of applicableItems) {
      if (item.hours === '24 hours' || item.hours === 'All day' || item.hours === '全天') {
        return 'Open 24 hours';
      }
      
      const slots = Array.isArray(item.hours) ? item.hours : [item.hours];
      for (const slot of slots) {
        if (slot === '24 hours' || slot === 'All day' || slot === '全天') {
          return 'Open 24 hours';
        }
        
        try {
          const [_, endTimeStr] = slot.split('-');
          if (endTimeStr) {
            const timeMatch = endTimeStr.match(/(\d+)(?::(\d+))?/);
            if (timeMatch) {
              const hour = parseInt(timeMatch[1]);
              const minute = parseInt(timeMatch[2] || '0');
              const formattedHour = hour > 12 ? hour - 12 : hour;
              const period = hour >= 12 ? 'PM' : 'AM';
              return `until ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    return 'Open now';
  } else {
    // Find next opening time
    let nextOpeningText = '';
    
    // Find the upcoming opening for today or tomorrow
    const findNextOpening = (dayToCheck: string) => {
      const dayItems = openingHours.filter(item => {
        if (item.day === dayToCheck) return true;
        if (item.day === 'All days' || item.day === 'Monday-Sunday') return true;
        if (dayToCheck === 'Saturday' || dayToCheck === 'Sunday') {
          if (item.day === 'Weekends') return true;
        } else {
          if (item.day === 'Weekdays') return true;
        }
        
        if (item.day.includes('-') && item.day !== 'Monday-Sunday') {
          const [startDay, endDay] = item.day.split('-');
          const startIndex = days.indexOf(startDay);
          const endIndex = days.indexOf(endDay);
          const dayIndex = days.indexOf(dayToCheck);
          
          if (startIndex <= dayIndex && dayIndex <= endIndex) return true;
          if (startIndex > endIndex && (dayIndex >= startIndex || dayIndex <= endIndex)) return true;
        }
        return false;
      });
      
      if (dayItems.length === 0) return null;
      
      for (const item of dayItems) {
        if (item.hours === 'Closed') continue;
        if (item.hours === '24 hours' || item.hours === 'All day' || item.hours === '全天') {
          return dayToCheck === currentDay ? 'Opens later today' : `Opens tomorrow`;
        }
        
        const slots = Array.isArray(item.hours) ? item.hours : [item.hours];
        for (const slot of slots) {
          if (slot === '24 hours' || slot === 'All day' || slot === '全天') {
            return dayToCheck === currentDay ? 'Opens later today' : `Opens tomorrow`;
          }
          
          try {
            const [startTimeStr, _] = slot.split('-');
            if (startTimeStr) {
              const timeMatch = startTimeStr.match(/(\d+)(?::(\d+))?/);
              if (timeMatch) {
                const hour = parseInt(timeMatch[1]);
                const minute = parseInt(timeMatch[2] || '0');
                const formattedHour = hour > 12 ? hour - 12 : hour;
                const period = hour >= 12 ? 'PM' : 'AM';
                
                if (dayToCheck === currentDay) {
                  const currentHour = chinaDay.getUTCHours();
                  const currentMinute = chinaDay.getUTCMinutes();
                  const currentTime = currentHour * 60 + currentMinute;
                  const openingTime = hour * 60 + minute;
                  
                  if (openingTime > currentTime) {
                    return `opens today at ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
                  }
                } else {
                  return `opens tomorrow at ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
                }
              }
            }
          } catch (error) {
            continue;
          }
        }
      }
      
      return null;
    };
    
    // Check today first, then tomorrow
    nextOpeningText = findNextOpening(currentDay) || findNextOpening(nextDay) || 'Closed';
    return nextOpeningText;
  }
};

const LocationButton = ({ location, size = "default" }: { location: any, size?: "default" | "small" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const buttonSize = size === "small" ? "p-1.5" : "h-10 w-10";
  const iconSize = size === "small" ? "w-4 h-4" : "h-5 w-5";
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative ${buttonSize} overflow-hidden rounded-full bg-gradient-to-r from-sky-400 to-blue-500 p-0 shadow-lg transition-all duration-300 hover:shadow-sky-500/25`}
        aria-label="Toggle navigation"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Navigation className={`${iconSize} text-white transition-all duration-500 group-hover:rotate-[100deg]`} />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
      </button>
      
      {/* Location dialog */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-black/20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-lg"
          >
            <div className="flex flex-col p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1">
                <h3 className="text-lg font-medium">Location Details</h3>
              </div>

              {/* Chinese Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-amber-500" />
                    <span className="text-sm text-gray-700">Show this to Taxi Driver:</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(location.chineseAddress)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  {location.chineseAddress}
                </p>
              </div>

              {/* English Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">English Address:</span>
                  <button
                    onClick={() => copyToClipboard(location.englishAddress)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  {location.englishAddress}
                </p>
              </div>

              {/* Nearest Subway */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Nearest Subway:</span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  {location.nearestSubway}
                </p>
              </div>

              {/* Cancel Button */}
              <button
                className="w-full rounded-xl border-2 border-gray-200 py-5 text-base font-normal text-blue-500 mt-4"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

const PhoneButton = ({ phoneNumbers, size = "default" }: { phoneNumbers: string[], size?: "default" | "small" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!phoneNumbers?.length) return null;
  
  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const buttonSize = size === "small" ? "p-1.5" : "h-10 w-10";
  const iconSize = size === "small" ? "w-4 h-4" : "h-5 w-5";
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={`group relative ${buttonSize} overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-0 shadow-lg transition-all duration-300 hover:shadow-orange-500/25`}
        aria-label="Contact us"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Phone className={`${iconSize} text-white transition-all duration-500 group-hover:rotate-[100deg]`} />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
      </button>
      
      {/* Phone dialog */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-black/20"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-lg"
          >
            <div className="flex flex-col items-center p-5">
              {phoneNumbers.map((phoneNumber, index) => (
                <div 
                  key={index} 
                  onClick={() => handlePhoneClick(phoneNumber)}
                  className="mb-3 text-center text-xl font-medium text-blue-500 cursor-pointer"
                >
                  {phoneNumber}
                </div>
              ))}

              <button
                className="w-full rounded-xl border-2 border-gray-200 py-5 text-base font-normal text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default function MerchantHeader({ merchant }: MerchantHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container-app px-4 sm:px-6">
        {/* Main header section - changed py-5 to pt-5 pb-3 to reduce bottom padding */}
        <div className="pt-5 pb-3 border-b border-gray-100">
          {/* Merchant name, verification, and recommended badge */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold">{merchant.displayName}</h1>
            {merchant.verified && (
              <div className="bg-primary text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {merchant.recommended && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-300 text-white px-2 py-1 rounded-md flex items-center shadow-sm">
                <FiAward className="w-3.5 h-3.5 mr-1 fill-current" />
                <span className="text-xs font-medium">Recommended</span>
              </div>
            )}
          </div>

          {/* Type and location */}
          <div className={`flex items-center ${isStreetMerchant(merchant) ? 'justify-between' : ''} flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-3`}>
            {/* Left side with merchant info */}
            <div className="flex items-center gap-x-3">
              <span className="flex items-center">
                <MerchantTypeIcon merchant={merchant} />
                <span className="ml-1.5">{merchant.merchantType}</span>
              </span>
              {/* Only show district if NOT a MultipleBranch merchant */}
              {!isMultiLocationMerchant(merchant) && (
                <span className="flex items-center">
                  <FiMapPin className="mr-1.5" size={12} />
                  {merchant.district.join(', ')}
                </span>
              )}
            
              {/* Price displays for different merchant types */}
              {isAttractionMerchant(merchant) && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  {merchant.ticketPrice > 0 ? `¥${merchant.ticketPrice}/person` : 'Free Entry'}
                </span>
              )}
              
              {/* Single location merchant price */}
              {isSingleLocationMerchant(merchant) && merchant.pricePerPerson && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  ¥{merchant.pricePerPerson}/person
                </span>
              )}
              
              {/* Multi location merchant price */}
              {isMultiLocationMerchant(merchant) && merchant.pricePerPerson && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  ¥{merchant.pricePerPerson}/person
                </span>
              )}
              
              {/* Hotel price per night */}
              {isHotelMerchant(merchant) && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  ¥{merchant.pricePerNight}/night
                </span>
              )}
              
              {/* Bar/Club entry fee */}
              {isBarClubMerchant(merchant) && merchant.entryFee !== undefined && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  {merchant.entryFee > 0 ? `¥${merchant.entryFee} entry fee` : 'Free Entry'}
                </span>
              )}

              {/* Bar/Club price per person */}
              {isBarClubMerchant(merchant) && merchant.pricePerPerson && (
                <span className="flex items-center">
                  <FiTag className="mr-1.5" size={12} />
                  ¥{merchant.pricePerPerson}/person
                </span>
              )}
            </div>

            {/* Right side: Navigation button for StreetMerchant */}
            {isStreetMerchant(merchant) && (
              <div className="relative">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="group relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 to-blue-500 p-0 shadow-lg transition-all duration-300 hover:shadow-sky-500/25"
                  aria-label="Toggle navigation"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLocationOpen ? (
                      <X className="h-5 w-5 text-white transition-all duration-300 group-hover:rotate-90" />
                    ) : (
                      <Navigation className="h-5 w-5 text-white transition-all duration-300 group-hover:rotate-90" />
                    )}
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
                </button>
                
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: -10, scale: 1 }}
                    className="absolute right-full top-1/2 w-[320px] -translate-y-1/2 transform pr-4 z-10"
                  >
                    <div className="relative rounded-[20px] bg-white p-4 shadow-md">
                      <div className="absolute right-[-8px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 transform bg-white"></div>

                      {/* Location Card */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1">
                          <h3 className="text-sm font-medium">Location Details</h3>
                        </div>

                        {/* Chinese Address */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <Car className="h-3.5 w-3.5 text-amber-500" />
                              <span className="text-xs text-gray-500">Show this to Taxi Driver:</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(merchant.location.chineseAddress)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs leading-tight">
                            {merchant.location.chineseAddress}
                          </p>
                        </div>

                        {/* English Address */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">English Address:</span>
                            <button
                              onClick={() => copyToClipboard(merchant.location.englishAddress)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs leading-tight">
                            {merchant.location.englishAddress}
                          </p>
                        </div>

                        {/* Nearest Subway */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Train className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs text-gray-500">Nearest Station:</span>
                          </div>
                          <p className="text-xs leading-tight">
                            {merchant.location.nearestSubway}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
          
          {/* Hotel Amenities - Display only for hotel merchants with amenities */}
          {isHotelMerchant(merchant) && merchant.amenities && merchant.amenities.length > 0 && (
            <div className="mb-3">
              <ScrollableAmenityTags amenities={merchant.amenities} />
            </div>
          )}
          
          {/* Hotel Star Rating - Display only for hotel merchants */}
          {isHotelMerchant(merchant) && merchant.stars && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <AnimatedStars rating={merchant.stars} maxStars={merchant.stars} size="custom" />
              </div>
              
              {/* Location buttons for hotel merchants */}
              <div className="flex gap-3">
                <LocationButton location={merchant.location} />
                {merchant.location.telephone && merchant.location.telephone.length > 0 && (
                  <PhoneButton phoneNumbers={merchant.location.telephone} />
                )}
              </div>
            </div>
          )}
          
          {/* Club Categories - Only for BarClubMerchant */}
          {isBarClubMerchant(merchant) && merchant.clubCategories && (
            <div className="mt-2 mb-3">
              <div className="flex flex-wrap gap-3">
                {merchant.clubCategories.map((category, index) => {
                  // Define category-specific styles and icons
                  const categoryStyles = {
                    'Cocktail Bar': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
                    'Speakeasy': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
                    'Jazz': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                    'Hip Hop': 'bg-red-100 text-red-800 hover:bg-red-200',
                    'Electronic': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
                    'Live Music': 'bg-green-100 text-green-800 hover:bg-green-200',
                    'Dance': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
                    'Karaoke': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
                    'default': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  };

                  const categoryIcons = {
                    'Cocktail Bar': <FiCoffee className="mr-1" size={12} />,
                    'Speakeasy': <FiLock className="mr-1" size={12} />,
                    'Jazz': <FiMusic className="mr-1" size={12} />,
                    'Hip Hop': <FiMic className="mr-1" size={12} />,
                    'Electronic': <FiRadio className="mr-1" size={12} />,
                    'Live Music': <FiMic className="mr-1" size={12} />,
                    'Dance': <FiMusic className="mr-1" size={12} />,
                    'Karaoke': <FiMic className="mr-1" size={12} />,
                    'default': <FiAward className="mr-1 text-amber-400 animate-pulse" size={12} />
                  };

                  const style = categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.default;
                  const icon = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;

                  return (
                    <span 
                      key={index} 
                      className={`
                        ${style}
                        px-1.5 py-0.5 rounded-full 
                        text-[10px] font-medium 
                        flex items-center
                        transition-colors duration-200
                        cursor-default
                      `}
                    >
                      {icon}
                      {category}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Opening Status Badge */}
          {(isSingleLocationMerchant(merchant) || 
            isBarClubMerchant(merchant) || 
            isBuildingMerchant(merchant) || 
            isAttractionMerchant(merchant)) && 
            'businessInfo' in merchant && merchant.businessInfo && !isHotelMerchant(merchant) && (
            <div className="mt-3">
              {/* Combine business info and location buttons in one row */}
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setIsBusinessInfoOpen(!isBusinessInfoOpen)}
                >
                  <OpenStatus merchant={merchant} />
                  <div className="ml-2 flex items-center">
                    <span className="text-xs text-gray-600">
                      {getStatusText(merchant)}
                    </span>
                    <FiChevronDown 
                      className={`ml-1 w-3.5 h-3.5 text-gray-400 transition-transform ${isBusinessInfoOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </div>
                
                {/* Location buttons moved here from bottom section */}
                <div className="flex gap-3">
                  <LocationButton location={merchant.location} />
                  {merchant.location.telephone && merchant.location.telephone.length > 0 && (
                    <PhoneButton phoneNumbers={merchant.location.telephone} />
                  )}
                </div>
              </div>
              
              {/* Collapsible Business Hours - remains unchanged */}
              <div 
                className={`overflow-hidden transition-all duration-300 mb-4 ${
                  isBusinessInfoOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-gray-100 pt-2">
                  {merchant.businessInfo.openingHours.map((item, index) => {
                    // Check if this item corresponds to today
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const now = new Date();
                    const utcHours = now.getUTCHours();
                    const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
                    const chinaDay = new Date(Date.UTC(
                      now.getUTCFullYear(),
                      now.getUTCMonth(),
                      now.getUTCDate() + dayIncrement
                    ));
                    const currentDay = days[chinaDay.getUTCDay()];
                    
                    // Check if this item applies to today
                    const isToday = 
                      item.day === currentDay || 
                      item.day === 'All days' || 
                      item.day === 'Monday-Sunday' ||
                      (item.day === 'Weekends' && (currentDay === 'Saturday' || currentDay === 'Sunday')) ||
                      (item.day === 'Weekdays' && !(currentDay === 'Saturday' || currentDay === 'Sunday'));
                      
                    // Handle day ranges
                    let isDayInRange = false;
                    if (item.day.includes('-') && item.day !== 'Monday-Sunday') {
                      const [startDay, endDay] = item.day.split('-');
                      const startIndex = days.indexOf(startDay);
                      const endIndex = days.indexOf(endDay);
                      const currentIndex = chinaDay.getUTCDay();
                      
                      if (startIndex <= currentIndex && currentIndex <= endIndex) {
                        isDayInRange = true;
                      }
                      // Handle ranges that wrap around the week (e.g., "Friday-Sunday")
                      if (startIndex > endIndex && (currentIndex >= startIndex || currentIndex <= endIndex)) {
                        isDayInRange = true;
                      }
                    }
                    
                    const isTodayItem = isToday || isDayInRange;
                    
                    return (
                      <div key={index} className="flex justify-between py-1">
                        <div className={`${isTodayItem ? 'font-bold' : 'font-medium'} text-xs text-gray-700 w-1/3`}>
                          {item.day}
                        </div>
                        <div className={`text-right text-xs text-gray-700 w-2/3 ${isTodayItem ? 'font-bold' : ''}`}>
                          {Array.isArray(item.hours) 
                            ? item.hours.map((timeSlot, i) => (
                                <div key={i}>{timeSlot}</div>
                              ))
                            : item.hours}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Additional Business Info */}
                  {merchant.businessInfo.peakTime && (
                    <div className="flex justify-between py-1 mt-2 border-t border-gray-100">
                      <div className="font-medium text-xs text-gray-700 w-1/3 flex items-center">
                        <FiStar className="mr-1.5 text-blue-500" size={12} />
                        Peak Hours
                      </div>
                      <div className="text-right text-xs text-gray-700 w-2/3">{merchant.businessInfo.peakTime}</div>
                    </div>
                  )}
                  
                  {merchant.businessInfo.needBooking && (
                    <div className="flex justify-between py-1">
                      <div className="font-medium text-xs text-gray-700 w-1/3 flex items-center">
                        <FiCheckCircle className="mr-1.5 text-green-500" size={12} />
                        Booking
                      </div>
                      <div className="text-right text-xs text-gray-700 w-2/3">{merchant.businessInfo.needBooking}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Michelin stars - Removed for redesign */}
          
        </div>
        
        {/* Username and URL - Removed for redesign */}
        
        {/* Business Info Section - Replaced with the new status badge above */}
      </div>
    </div>
  );
} 