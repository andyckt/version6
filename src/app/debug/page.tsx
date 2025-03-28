'use client';

import { useState, useEffect } from 'react';
import { isMerchantOpen, SingleLocationMerchant, ProfileInterface } from '@/data/merchants';

export default function DebugPage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Refresh the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Create a test merchant
  const testMerchant: SingleLocationMerchant = {
    id: 9999,
    username: "testmerchant",
    displayName: "Test Merchant",
    verified: true,
    accountType: 'restaurant',
    joinDate: 'January 2024',
    recommended: false,
    hashtags: ['#test', '#debug'],
    district: ['Test District'],
    merchantType: 'Test Restaurant',
    url: '',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '测试地址',
      englishAddress: 'Test Address',
      nearestSubway: 'Test Station',
      branchDistrict: 'Test District'
    },
    businessInfo: {
      openingHours: [
        // Open Monday - Friday, 9am - 5pm China time
        { day: "Monday", hours: ["09:00-17:00"] },
        { day: "Tuesday", hours: ["09:00-17:00"] },
        { day: "Wednesday", hours: ["09:00-17:00"] },
        { day: "Thursday", hours: ["09:00-17:00"] },
        { day: "Friday", hours: ["09:00-17:00"] },
      ]
    }
  };
  
  // Calculate current time in various formats
  const now = currentTime;
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  
  // China time calculation (UTC+8)
  const chinaHours = (utcHours + 8) % 24;
  const chinaMinutes = now.getUTCMinutes();
  const chinaTime = chinaHours * 60 + chinaMinutes;
  
  // Determine if day needs to be incremented for China
  const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
  
  // Create a date object for China time
  const chinaDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + dayIncrement,
    chinaHours,
    now.getUTCMinutes()
  ));
  
  // Get day of week names
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentChinaDay = days[chinaDay.getUTCDay()];
  
  // Check if the merchant is open
  const isOpen = isMerchantOpen(testMerchant, now);
  
  const handleForceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold mb-6">Time Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Current Time Information</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Local Time:</p>
            <p className="text-xl">{now.toLocaleTimeString()}</p>
          </div>
          
          <div>
            <p className="text-gray-600">UTC Time:</p>
            <p className="text-xl">{utcHours.toString().padStart(2, '0')}:{utcMinutes.toString().padStart(2, '0')}</p>
          </div>
          
          <div>
            <p className="text-gray-600">China Time (UTC+8):</p>
            <p className="text-xl">{currentChinaDay} {chinaHours.toString().padStart(2, '0')}:{chinaMinutes.toString().padStart(2, '0')}</p>
            <p className="text-sm text-gray-500">Total minutes: {chinaTime}</p>
            <p className="text-sm text-gray-500">Day increment: {dayIncrement}</p>
          </div>
          
          <div>
            <p className="text-gray-600">ISO String:</p>
            <p className="text-sm font-mono">{now.toISOString()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Test Merchant</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Merchant Name:</p>
            <p className="text-lg font-medium">{testMerchant.displayName}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Opening Hours:</p>
            <ul className="list-disc pl-5">
              {testMerchant.businessInfo.openingHours.map((item, index) => (
                <li key={index}>
                  {item.day}: {Array.isArray(item.hours) ? item.hours.join(', ') : item.hours}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-gray-600">Current Status:</p>
            <p className={`text-xl font-bold ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleForceRefresh}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Force Refresh
      </button>
    </div>
  );
} 