import { NextResponse } from 'next/server';
import { isMerchantOpen, SingleLocationMerchant, ProfileInterface } from '@/data/merchants';

export async function GET() {
  const now = new Date();
  
  // Current UTC time
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
  
  // Test with a dummy merchant
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
    // Required for SingleLocationMerchant
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
  
  const isOpen = isMerchantOpen(testMerchant);
  
  return NextResponse.json({
    time: {
      current: now.toISOString(),
      utc: {
        hours: utcHours,
        minutes: utcMinutes,
        formatted: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`
      },
      china: {
        hours: chinaHours,
        minutes: chinaMinutes,
        totalMinutes: chinaTime,
        day: currentChinaDay,
        dayIncrement,
        formatted: `${chinaHours.toString().padStart(2, '0')}:${chinaMinutes.toString().padStart(2, '0')}`,
        fullFormatted: `${currentChinaDay} ${chinaHours.toString().padStart(2, '0')}:${chinaMinutes.toString().padStart(2, '0')}`
      }
    },
    testMerchant: {
      ...testMerchant,
      isOpen
    }
  });
} 