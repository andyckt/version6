/**
 * This script tests the performance improvement from caching
 * by performing the same lookup multiple times
 */

import { getMerchantByUsername } from '../lib/merchantRepository';

async function testCachePerformance() {
  console.log('Testing cache performance...');
  console.log('Performing lookups for the same merchant multiple times.');
  console.log('First lookup will be a cache miss, subsequent lookups should be cache hits.');
  console.log('-'.repeat(80));
  
  // Test usernames
  const usernames = [
    'SpeakLowBar',  // ID 617
    'SuzuBar',      // ID 618
    'AbaWhiskyBar', // ID 619
    'PaalBar',      // ID 620
    'PonyUpBar'     // ID 621
  ];
  
  // Test each username with multiple lookups
  for (const username of usernames) {
    console.log(`\nTesting lookups for username: ${username}`);
    
    // First lookup (cache miss)
    console.time('First lookup (cache miss)');
    const merchant1 = await getMerchantByUsername(username);
    console.timeEnd('First lookup (cache miss)');
    console.log(`Found merchant: ${merchant1?.displayName} (ID: ${merchant1?.id})`);
    
    // Wait a moment to make the timing more obvious
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Second lookup (should be cache hit)
    console.time('Second lookup (cache hit)');
    const merchant2 = await getMerchantByUsername(username);
    console.timeEnd('Second lookup (cache hit)');
    
    // Wait a moment to make the timing more obvious
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Third lookup (should be cache hit)
    console.time('Third lookup (cache hit)');
    const merchant3 = await getMerchantByUsername(username);
    console.timeEnd('Third lookup (cache hit)');
    
    console.log('-'.repeat(50));
  }
  
  console.log('\nCache performance test completed.');
}

// Run the test
testCachePerformance()
  .then(() => {
    console.log('Test finished');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during test:', error);
    process.exit(1);
  }); 