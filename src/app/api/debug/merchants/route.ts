import { NextResponse } from 'next/server';
import { 
  isMerchantOpen, 
  getMerchantByUsername, 
  isBuildingMerchant, 
  isAttractionMerchant,
  isMultiLocationMerchant,
  isSingleLocationMerchant,
  BaseMerchant,
  OpeningHoursItem
} from '@/data/merchants';

export async function GET() {
  const now = new Date();
  
  // Get merchants by username
  const iapmmall = getMerchantByUsername('iapmmall');
  const shanghaimuseum = getMerchantByUsername('shanghaimuseum');
  
  // Calculate current time in China
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
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
  
  // Helper function to get opening hours
  const getOpeningHours = (merchant: BaseMerchant | undefined): OpeningHoursItem[] | null => {
    if (!merchant) return null;
    
    let openingHours: OpeningHoursItem[] = [];
    
    if (isSingleLocationMerchant(merchant) || isBuildingMerchant(merchant) || isAttractionMerchant(merchant)) {
      openingHours = merchant.businessInfo.openingHours;
    } else if (isMultiLocationMerchant(merchant)) {
      merchant.branches.forEach(branch => {
        openingHours = [...openingHours, ...branch.openingHours];
      });
    }
    
    return openingHours;
  };
  
  // Helper function to check applicable hours
  const checkApplicableHours = (openingHours: OpeningHoursItem[]) => {
    const applicableItems = openingHours.filter(item => {
      // Check if day matches
      if (item.day === currentChinaDay) {
        return true;
      }
      
      // Handle all days case
      if (item.day === 'All days' || item.day === 'Monday-Sunday') {
        return true;
      }
      
      // Handle day ranges
      if (item.day.includes('-') && item.day !== 'Monday-Sunday') {
        const [startDay, endDay] = item.day.split('-');
        const startIndex = days.indexOf(startDay);
        const endIndex = days.indexOf(endDay);
        const currentIndex = chinaDay.getUTCDay();
        
        if (startIndex <= currentIndex && currentIndex <= endIndex) {
          return true;
        }
        
        if (startIndex > endIndex && (currentIndex >= startIndex || currentIndex <= endIndex)) {
          return true;
        }
      }
      
      // Handle weekdays/weekends
      if (item.day === 'Weekends' && (currentChinaDay === 'Saturday' || currentChinaDay === 'Sunday')) {
        return true;
      }
      
      if (item.day === 'Weekdays' && !(currentChinaDay === 'Saturday' || currentChinaDay === 'Sunday')) {
        return true;
      }
      
      return false;
    });
    
    return applicableItems;
  };
  
  // Helper function to check time slots
  const isWithinTimeSlot = (timeSlot: string) => {
    if (timeSlot === '24 hours' || timeSlot === 'All day' || timeSlot === '全天') {
      return true;
    }
    
    const [startTimeStr, endTimeStr] = timeSlot.split('-');
    
    const startHour = parseInt(startTimeStr.split(':')[0]);
    const startMinute = parseInt(startTimeStr.split(':')[1] || '0');
    const startTime = startHour * 60 + startMinute;
    
    const endHour = parseInt(endTimeStr.split(':')[0]);
    const endMinute = parseInt(endTimeStr.split(':')[1] || '0');
    let endTime = endHour * 60 + endMinute;
    
    if (endTime < startTime) {
      endTime += 24 * 60;
    }
    
    return chinaTime >= startTime && chinaTime <= endTime;
  };
  
  // Check merchant open status
  const iapmmallOpen = iapmmall ? isMerchantOpen(iapmmall) : null;
  const shanghaimuseumOpen = shanghaimuseum ? isMerchantOpen(shanghaimuseum) : null;
  
  // Manual checks for debugging
  const iapmmallHours = iapmmall ? getOpeningHours(iapmmall) : null;
  const shanghaimuseumHours = shanghaimuseum ? getOpeningHours(shanghaimuseum) : null;
  
  const iapmmallApplicableHours = iapmmallHours ? checkApplicableHours(iapmmallHours) : [];
  const shanghaimuseumApplicableHours = shanghaimuseumHours ? checkApplicableHours(shanghaimuseumHours) : [];
  
  // Manual time check for IAPM mall
  let manualIapmmallOpen = false;
  if (iapmmallApplicableHours.length > 0) {
    for (const item of iapmmallApplicableHours) {
      const timeSlots = Array.isArray(item.hours) ? item.hours : [item.hours];
      for (const slot of timeSlots) {
        if (slot !== 'Closed' && isWithinTimeSlot(slot)) {
          manualIapmmallOpen = true;
          break;
        }
      }
      if (manualIapmmallOpen) break;
    }
  }
  
  // Manual time check for Shanghai Museum
  let manualShanghaimuseumOpen = false;
  if (shanghaimuseumApplicableHours.length > 0) {
    for (const item of shanghaimuseumApplicableHours) {
      const timeSlots = Array.isArray(item.hours) ? item.hours : [item.hours];
      for (const slot of timeSlots) {
        if (slot !== 'Closed' && isWithinTimeSlot(slot)) {
          manualShanghaimuseumOpen = true;
          break;
        }
      }
      if (manualShanghaimuseumOpen) break;
    }
  }
  
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
    merchants: {
      iapmmall: {
        name: iapmmall?.displayName,
        open: iapmmallOpen,
        manualOpen: manualIapmmallOpen,
        openingHours: iapmmallHours,
        applicableHours: iapmmallApplicableHours
      },
      shanghaimuseum: {
        name: shanghaimuseum?.displayName,
        open: shanghaimuseumOpen,
        manualOpen: manualShanghaimuseumOpen,
        openingHours: shanghaimuseumHours,
        applicableHours: shanghaimuseumApplicableHours
      }
    }
  });
} 