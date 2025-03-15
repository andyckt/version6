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
        <div className="flex items-center justify-between py-2">
          <button className="p-1.5">
            <FiMenu className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
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
          
          <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
} 