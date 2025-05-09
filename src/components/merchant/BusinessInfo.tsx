import React, { useState } from 'react';
import { FiUsers, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BusinessInfo as BusinessInfoType, isHotelMerchant, isStreetMerchant } from '@/data/merchants';
import OpenStatus from './OpenStatus';

interface BusinessInfoProps {
  businessInfo: BusinessInfoType;
  merchant: any; // BaseMerchant but avoiding circular imports
  className?: string;
}

export default function BusinessInfo({ businessInfo, merchant, className = '' }: BusinessInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Don't render for HotelMerchant and StreetMerchant types
  if (isHotelMerchant(merchant) || isStreetMerchant(merchant)) {
    return null;
  }

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Helper function to handle different hours formats
  const renderHours = (hours: string | string[]) => {
    if (hours === 'Closed') {
      return <span className="text-gray-800">Closed</span>;
    }
    
    if (Array.isArray(hours)) {
      return (
        <div className="flex flex-col space-y-1">
          {hours.map((timeSlot, index) => (
            <span key={index} className="text-gray-800">{timeSlot}</span>
          ))}
        </div>
      );
    }
    
    return <span className="text-gray-800">{hours}</span>;
  };

  // Function to render opening hours
  const renderOpeningHours = () => {
    if (!businessInfo.openingHours || businessInfo.openingHours.length === 0) {
      return null;
    }

    return (
      <div className="py-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <OpenStatus 
              merchant={merchant} 
              clickable={true} 
              onClick={toggleExpanded}
            />
          </div>
          <button 
            onClick={toggleExpanded}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide details" : "Show details"}
          >
            {isExpanded ? 
              <FiChevronUp className="w-4 h-4" /> : 
              <FiChevronDown className="w-4 h-4" />
            }
          </button>
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t mt-3 pt-3 grid grid-cols-1 gap-y-3">
            {businessInfo.openingHours.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="font-medium text-sm text-gray-700 w-1/2">{item.day}</div>
                <div className="text-right text-sm w-1/2">
                  {renderHours(item.hours)}
                </div>
              </div>
            ))}

            {/* Additional Info Group - with spacing matching regular hours */}
            <div className="border-t pt-3 space-y-3">
              {/* Peak Hours Section */}
              {businessInfo.peakTime && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 font-medium text-xs text-gray-700 w-1/2">
                    <FiUsers className="text-blue-500 flex-shrink-0" size={14} />
                    <span>Peak Hours</span>
                  </div>
                  <div className="text-right text-xs w-1/2">
                    <span className="text-gray-800">{businessInfo.peakTime}</span>
                  </div>
                </div>
              )}
              
              {/* Need booking section */}
              {businessInfo.needBooking && !isHotelMerchant(merchant) && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 font-medium text-xs text-gray-700 w-1/2">
                    <FiAlertCircle className="text-amber-500 flex-shrink-0" size={14} />
                    <span>Need booking?</span>
                  </div>
                  <div className="text-right text-xs w-1/2">
                    <span className="text-gray-800">{businessInfo.needBooking}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-3 ${className}`}>
      {renderOpeningHours()}
    </div>
  );
} 