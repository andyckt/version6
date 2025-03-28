import React, { useState } from 'react';
import { Navigation, X, Phone, Copy, Car, Train } from "lucide-react";
import { motion } from "framer-motion";

interface LocationInfoProps {
  location: {
    chineseAddress: string;
    englishAddress: string;
    nearestSubway: string;
    telephone?: string[];
    branchDistrict: string;
  };
  className?: string;
}

export default function LocationInfo({ location, className = '' }: LocationInfoProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className={`${className}`}>
      <div className="flex gap-6 justify-center">
        {/* Navigation Button */}
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
                        onClick={() => copyToClipboard(location.chineseAddress)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs leading-tight">{location.chineseAddress}</p>
                  </div>

                  {/* English Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">English Address:</span>
                      <button
                        onClick={() => copyToClipboard(location.englishAddress)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs leading-tight">{location.englishAddress}</p>
                  </div>

                  {/* Nearest Subway */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Train className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-gray-500">Nearest Station:</span>
                    </div>
                    <p className="text-xs leading-tight">{location.nearestSubway}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Phone Button */}
        {location.telephone && location.telephone.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowPhoneDialog(true)}
              className="group relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-500 p-0 shadow-lg transition-all duration-300 hover:shadow-orange-500/25"
              aria-label="Contact us"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Phone className="h-5 w-5 text-white transition-all duration-500 group-hover:rotate-[100deg]" />
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
            </button>

            {/* Phone dialog */}
            {showPhoneDialog && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-lg"
              >
                <div className="flex flex-col items-center p-5">
                  {location.telephone.map((phoneNumber, index) => (
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
                    onClick={() => setShowPhoneDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 