"use client";

import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiPlus, FiChevronDown, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

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

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
        <div className="flex items-center justify-between py-3">
          <button className="p-2">
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center font-medium text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
              onClick={toggleDropdown}
            >
              <FiMapPin className="w-4 h-4 mr-1.5 text-primary" />
              Shanghai
              <FiChevronDown className={`w-4 h-4 ml-1.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded-lg shadow-lg py-2 w-48 z-30 animate-scale-in">
                {cities.map((city) => (
                  <button
                    key={city.name}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                      city.name === "Shanghai" ? "text-primary font-medium" : "text-gray-700"
                    } hover:bg-gray-50 transition-colors`}
                    disabled={!city.available}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {city.name}
                    {!city.available && (
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
} 