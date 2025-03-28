import { NextResponse } from 'next/server';
import { 
  getMerchantByUsername, 
  getMerchantById,
  isMerchantOpen,
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
  
  // Test a selection of merchants by both username and ID
  const testMerchants = [
    // 24/7 Stores
    { id: 508, username: 'seveneleven' },
    { id: 509, username: 'familymart' },
    { id: 510, username: 'lawson' },
    
    // Special hours merchants
    { id: 501, username: 'shanghaitaste' },
    { id: 505, username: 'speaklow' }
  ];
  
  const results = testMerchants.map(test => {
    const byUsername = getMerchantByUsername(test.username);
    const byId = getMerchantById(test.id);
    
    const openStatusByUsername = byUsername ? isMerchantOpen(byUsername, now) : null;
    const openStatusById = byId ? isMerchantOpen(byId, now) : null;
    
    // If we have business hours, include them
    let openingHours = null;
    if (byId && 'businessInfo' in byId && 
        (byId as any).businessInfo && 
        (byId as any).businessInfo.openingHours) {
      openingHours = (byId as any).businessInfo.openingHours;
    }
    
    const isCorrect = openStatusByUsername === openStatusById && 
                      byUsername?.displayName === byId?.displayName;
    
    return {
      id: test.id,
      username: test.username,
      displayName: byId?.displayName || 'Not found',
      openStatusByUsername,
      openStatusById,
      isConsistent: isCorrect,
      merchantType: byId ? byId.profileInterface : 'Unknown',
      openingHours
    };
  });
  
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
    results,
    allConsistent: results.every(r => r.isConsistent)
  });
} 