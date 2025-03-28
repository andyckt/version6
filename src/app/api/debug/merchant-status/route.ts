import { NextResponse } from 'next/server';
import { 
  isMerchantOpen, 
  getMerchantById,
  merchants
} from '@/data/merchants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Check if a test time is provided
  const testTime = searchParams.get('time');
  const testDay = searchParams.get('day');
  
  // Create the date object - either now or the test time
  let now = new Date();
  
  if (testTime && /^\d{1,2}:\d{2}$/.test(testTime)) {
    const [hours, minutes] = testTime.split(':').map(Number);
    now = new Date();
    now.setUTCHours(hours - 8); // Convert from China time to UTC
    now.setUTCMinutes(minutes);
    now.setUTCSeconds(0);
    
    // If a day is specified (0-6), set that day
    if (testDay && /^[0-6]$/.test(testDay)) {
      const targetDay = parseInt(testDay);
      const currentDay = now.getUTCDay();
      const diff = targetDay - currentDay;
      
      if (diff !== 0) {
        now.setUTCDate(now.getUTCDate() + diff);
      }
    }
  }
  
  // Current time in China
  const utcHours = now.getUTCHours();
  const chinaHours = (utcHours + 8) % 24;
  const chinaMinutes = now.getUTCMinutes();
  const currentTime = chinaHours * 60 + chinaMinutes;
  
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
  
  // Sample merchant IDs
  const merchantIds = [501, 502, 503, 504, 505, 506, 507, 508, 509, 510];
  
  const results = merchantIds.map(id => {
    const merchant = getMerchantById(id);
    
    if (!merchant) {
      return {
        id,
        displayName: `Merchant ID ${id} not found`,
        isOpen: null
      };
    }
    
    return {
      id,
      username: merchant.username,
      displayName: merchant.displayName,
      type: merchant.profileInterface,
      isOpen: isMerchantOpen(merchant, now)
    };
  });
  
  return NextResponse.json({
    testing: testTime ? `Using test time: ${testTime} on ${currentChinaDay}` : "Using current time",
    time: {
      current: now.toISOString(),
      china: {
        day: currentChinaDay,
        time: `${chinaHours.toString().padStart(2, '0')}:${chinaMinutes.toString().padStart(2, '0')}`,
        totalMinutes: currentTime
      }
    },
    merchants: results
  });
} 