import React, { useState, useRef } from 'react';
import { Navigation, Phone, X, Car, Train, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { BusinessInfo as BusinessInfoType, OpeningHoursItem } from '@/data/merchants';
import OpenStatus from './OpenStatus';
import LocationSlideUp from './LocationSlideUp';
import PhoneNumberDialog from './PhoneNumberDialog';
import { createPortal } from 'react-dom';

interface LocationInfo {
  chineseAddress: string;
  englishAddress: string;
  nearestSubway: string;
  telephone?: string[];
  branchDistrict: string;
}

interface BranchCardProps {
  branch: {
    district: string;
    location: LocationInfo;
    businessInfo: BusinessInfoType;
  };
  index: number;
  merchant: any; // BaseMerchant but avoiding circular imports
}

const BusinessHours = ({ hours }: { hours: OpeningHoursItem[] }) => {
  // Get current day in China timezone
  const now = new Date();
  const utcHours = now.getUTCHours();
  const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
  const chinaDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + dayIncrement
  ));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[chinaDay.getUTCDay()];

  return (
    <div className="space-y-1 w-full border-t border-gray-100 pt-2">
      {hours.map((item, index) => {
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
          <div key={index} className="flex justify-between text-[11px]">
            <span className={`${isTodayItem ? 'font-bold' : 'font-medium'} text-gray-600`}>
              {item.day}
            </span>
            <span className={`text-gray-500 ${isTodayItem ? 'font-bold' : ''}`}>
              {Array.isArray(item.hours) ? item.hours.join(', ') : item.hours}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const AdditionalInfo = ({ 
  peakTime, 
  bookingInfo 
}: { 
  peakTime?: string;
  bookingInfo?: string;
}) => {
  if (!peakTime && !bookingInfo) return null;
  
  return (
    <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
      {peakTime && (
        <div className="flex justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <FiUsers className="text-blue-500 flex-shrink-0" size={12} />
            <span className="font-medium text-gray-600">Peak Time</span>
          </div>
          <span className="text-gray-500">{peakTime}</span>
        </div>
      )}
      {bookingInfo && (
        <div className="flex justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <FiAlertCircle className="text-amber-500 flex-shrink-0" size={12} />
            <span className="font-medium text-gray-600">Booking</span>
          </div>
          <span className="text-gray-500">{bookingInfo}</span>
        </div>
      )}
    </div>
  );
};

const LocationButton = ({ location }: { location: LocationInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="relative">
      <button 
        className="p-1.5 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 hover:shadow-lg hover:shadow-sky-500/25 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Navigation className="w-4 h-4 text-white transition-all duration-500 group-hover:rotate-[100deg]" />
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

const PhoneButton = ({ phoneNumbers }: { phoneNumbers?: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!phoneNumbers?.length) return null;
  
  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  return (
    <div className="relative">
      <button 
        className="p-1.5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Phone className="w-4 h-4 text-white transition-all duration-500 group-hover:rotate-[100deg]" />
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

export default function BranchCard({ branch, index, merchant }: BranchCardProps) {
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  
  return (
    <motion.div 
      className="rounded-xl border border-gray-100 shadow-sm bg-white h-full hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.2,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <div className="px-3.5 pt-3.5 pb-2">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-2.5">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
              {branch.district}
            </h3>
            <span className="text-xs text-gray-500 mt-0.5">Branch {index + 1}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1.5 ml-2">
            <LocationButton location={branch.location} />
            <PhoneButton phoneNumbers={branch.location.telephone} />
          </div>
        </div>

        {/* Status and Expandable Hours */}
        <div className="w-full">
          <div 
            className="flex items-center justify-between group cursor-pointer"
            onClick={() => setIsHoursExpanded(!isHoursExpanded)}
          >
            <div className="flex-1 py-1.5">
              <OpenStatus merchant={merchant} size="small" />
            </div>
            <motion.button 
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full transition-colors"
              aria-label={isHoursExpanded ? "Hide details" : "Show details"}
              animate={{ rotate: isHoursExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-3 h-3 opacity-75 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>

          {/* Expandable Content */}
          <AnimatePresence initial={false}>
            {isHoursExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto", 
                  opacity: 1,
                  transition: {
                    height: {
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1]
                    },
                    opacity: {
                      duration: 0.15,
                      delay: 0.1
                    }
                  }
                }}
                exit={{ 
                  height: 0, 
                  opacity: 0,
                  transition: {
                    height: {
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1]
                    },
                    opacity: {
                      duration: 0.1
                    }
                  }
                }}
                className="w-full mt-1.5 overflow-hidden px-1.5"
              >
                <BusinessHours hours={branch.businessInfo.openingHours} />
                <AdditionalInfo 
                  peakTime={branch.businessInfo.peakTime}
                  bookingInfo={branch.businessInfo.needBooking}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 