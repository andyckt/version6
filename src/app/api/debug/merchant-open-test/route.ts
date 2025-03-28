import { NextResponse } from 'next/server';
import { 
  getMerchantByUsername, 
  getMerchantById,
  isMerchantOpen,
  merchants
} from '@/data/merchants';

export async function GET() {
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
    
    const openStatusByUsername = byUsername ? isMerchantOpen(byUsername) : null;
    const openStatusById = byId ? isMerchantOpen(byId) : null;
    
    const isCorrect = openStatusByUsername === openStatusById && 
                      byUsername?.displayName === byId?.displayName;
    
    return {
      id: test.id,
      username: test.username,
      displayName: byId?.displayName || 'Not found',
      openStatusByUsername,
      openStatusById,
      isConsistent: isCorrect,
      merchantType: byId ? byId.profileInterface : 'Unknown'
    };
  });
  
  // Calculate current China time
  const now = new Date();
  const utcHours = now.getUTCHours();
  const chinaHours = (utcHours + 8) % 24;
  const chinaMinutes = now.getUTCMinutes();
  
  // Determine if day needs to be incremented for China
  const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
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
    time: {
      current: now.toISOString(),
      china: {
        day: currentChinaDay,
        time: `${chinaHours.toString().padStart(2, '0')}:${chinaMinutes.toString().padStart(2, '0')}`
      }
    },
    results,
    allConsistent: results.every(r => r.isConsistent)
  });
} 