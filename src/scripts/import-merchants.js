/**
 * New Merchant Data Import Script
 * 
 * This script allows you to import real merchant data into your MongoDB database.
 * IMPORTANT: First run delete-sample-merchants.js to remove sample data
 * 
 * Usage:
 * 1. Add your real merchant data to the REAL_MERCHANTS array below
 * 2. Run with: node src/scripts/import-merchants.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Profile interface types
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

// Helper functions to determine merchant types
function isSingleLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.SingleShopRestaurant;
}

function isMultiLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.MultipleBranchMerchant;
}

function isAttractionMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Attraction;
}

function isStreetMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Street;
}

function isBuildingMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Building;
}

function isHotelMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Hotel;
}

function isBarClubMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.BarClub;
}

/**
 * REPLACE THIS SECTION WITH YOUR REAL MERCHANT DATA
 * 
 * IMPORTANT: Each merchant must include the following fields:
 * - id (number): A unique ID (should not conflict with sample IDs 501-512)
 * - username (string): A unique username for the merchant
 * - displayName (string): The display name of the merchant
 * - accountType (string): One of 'restaurant', 'hotel', 'attraction', 'barandclub', 'shopping'
 * - profileInterface (number): The profile interface type (see ProfileInterface enum)
 * 
 * Other fields should match the structure of sample merchants in merchants.js
 */
const REAL_MERCHANTS = [
  // ADD YOUR REAL MERCHANT DATA HERE
  // Example of a single location restaurant:

  {
    id: 1, // Use your own ID system (avoid 501-512 which are used by samples)
    accountType: 'restaurant',
    username: 'yourrestaurant123',
    displayName: 'Your Restaurant Name',
    verified: true,
    joinDate: 'April 2024',
    recommended: true,
    hashtags: ['#yourhashtags', '#food'],
    district: ['YourDistrict'],
    merchantType: 'Your Restaurant Type',
    stats: {
      mentionedPosts: 10,
      followers: 500,
      following: 50
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    url: 'https://www.yourrestaurant.com',
    location: {
      chineseAddress: '你的中文地址',
      englishAddress: 'Your English Address',
      nearestSubway: 'Subway Information',
      telephone: ['Your-Phone-Number'],
      branchDistrict: 'District'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '09:00-22:00' },
        { day: 'Saturday-Sunday', hours: '10:00-23:00' }
      ],
      needBooking: 'Your booking info',
      peakTime: 'Your peak hours'
    },
    pricePerPerson: 100,
    languagesSpoken: ['Chinese', 'English'],
    michelinStars: 0
  },
  
  
  // Example of a multi-location merchant:

  {
    id: 2, // Use your own ID system (avoid 501-512 which are used by samples)
    accountType: 'restaurant',
    username: 'dumplinghouse',
    displayName: 'Dumpling House123',
    verified: true,
    joinDate: 'March 2023',
    recommended: true,
    hashtags: ['#dumplings', '#shanghairestaurant', '#localfavorite'],
    district: ['Jing\'an', 'Xuhui', 'Huangpu'],
    merchantType: 'Dumpling Restaurant',
    stats: {
      mentionedPosts: 56,
      followers: 3200,
      following: 85
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    url: 'https://www.dumplinghouse.com',
    pricePerPerson: 80,
    languagesSpoken: ['Chinese', 'English'],
    michelinStars: 1,
    needBooking: 'Walk-ins welcome',
    peakTime: '12:00-13:30, 18:30-20:00',
    branches: [
      {
        chineseAddress: '上海市静安区南京西路1788号',
        englishAddress: '1788 West Nanjing Road, Jing\'an District, Shanghai',
        nearestSubway: 'Line 2 Jing\'an Temple Station, Exit 3 - 300m',
        telephone: ['021-62555333'],
        branchDistrict: 'Jing\'an',
        openingHours: [
          { day: 'Monday-Friday', hours: '10:30-21:30' },
          { day: 'Weekends', hours: '10:00-22:00' }
        ],
        needBooking: 'No reservation needed',
        peakTime: '12:00-13:30'
      },
      {
        chineseAddress: '上海市徐汇区淮海中路999号',
        englishAddress: '999 Middle Huaihai Road, Xuhui District, Shanghai',
        nearestSubway: 'Line 1 South Shaanxi Road Station, Exit 5 - 150m',
        telephone: ['021-64157788'],
        branchDistrict: 'Xuhui',
        openingHours: [
          { day: 'Monday-Wednesday', hours: '8:45-16:30' },
          { day: 'Thursday-Friday', hours: '8:45-19:30' },
          { day: 'Weekends', hours: '9:30-21:45' }
        ],
        needBooking: 'Recommended on weekends',
        peakTime: '18:00-20:00'
      }
    ]
  }

];

// Calculate if merchant is currently open based on opening hours
function calculateIsOpen(merchant) {
  try {
    if (!merchant.businessInfo?.openingHours) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    for (const schedule of merchant.businessInfo.openingHours) {
      if (!schedule.day || !schedule.hours) continue;
      
      const dayLowerCase = schedule.day.toLowerCase();
      
      // 24-hour or all-day checks
      if (typeof schedule.hours === 'string') {
        const hoursLowerCase = schedule.hours.toLowerCase();
        if (hoursLowerCase === '24 hours' || 
            hoursLowerCase === 'all day') {
          return true;
        }
      }
      
      // Check if current day matches schedule day
      let isMatchingDay = false;
      
      if (dayLowerCase === 'monday-sunday' || 
          dayLowerCase === 'all days' || 
          dayLowerCase === 'everyday') {
        isMatchingDay = true;
      } else if (dayLowerCase.includes('-')) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const [startDay, endDay] = dayLowerCase.split('-').map(d => days.indexOf(d.trim()));
        const dayIndex = days.indexOf(currentDay);
        
        if (startDay <= endDay) {
          isMatchingDay = (dayIndex >= startDay && dayIndex <= endDay);
        } else {
          isMatchingDay = (dayIndex >= startDay || dayIndex <= endDay);
        }
      } else if (dayLowerCase.includes(currentDay)) {
        isMatchingDay = true;
      }
      
      if (!isMatchingDay) continue;
      
      // Check if current time is within hours
      if (typeof schedule.hours === 'string' && schedule.hours.toLowerCase() !== 'closed') {
        const [startStr, endStr] = schedule.hours.split('-');
        if (!startStr || !endStr) continue;
        
        const startParts = startStr.trim().split(':');
        const endParts = endStr.trim().split(':');
        
        if (startParts.length !== 2 || endParts.length !== 2) continue;
        
        const startHour = parseInt(startParts[0]);
        const startMinute = parseInt(startParts[1]);
        const startTime = startHour * 60 + startMinute;
        
        const endHour = parseInt(endParts[0]);
        const endMinute = parseInt(endParts[1]);
        const endTime = endHour * 60 + endMinute;
        
        if (endTime < startTime) {
          // Overnight hours (e.g., 22:00-02:00)
          if (currentTime >= startTime || currentTime <= endTime) {
            return true;
          }
        } else {
          // Same day operation
          if (currentTime >= startTime && currentTime <= endTime) {
            return true;
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error calculating open status for ${merchant?.username || 'unknown merchant'}:`, error);
    return false;
  }
}

// Calculate next opening time (simplified version)
function calculateNextOpenTime(merchant) {
  return "Soon"; // Placeholder - implement actual logic if needed
}

// Main function to import merchants
async function importMerchants() {
  // Input validation
  if (!REAL_MERCHANTS || REAL_MERCHANTS.length === 0) {
    console.error('ERROR: No merchant data provided. Please add your merchant data to the REAL_MERCHANTS array.');
    return false;
  }
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database and collections
    const db = client.db(MONGODB_DB);
    const merchantsCollection = db.collection(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Check for existing merchants first
    const existingMerchantCount = await merchantsCollection.countDocuments();
    console.log(`Found ${existingMerchantCount} existing merchants in database`);
    
    // Validate merchant data
    console.log('\nValidating merchant data...');
    const validationIssues = [];
    const usernames = new Set();
    const ids = new Set();
    
    for (let i = 0; i < REAL_MERCHANTS.length; i++) {
      const merchant = REAL_MERCHANTS[i];
      
      // Check required fields
      if (!merchant.id) {
        validationIssues.push(`Merchant at index ${i} is missing an id`);
      }
      
      if (!merchant.username) {
        validationIssues.push(`Merchant at index ${i} is missing a username`);
      }
      
      if (!merchant.displayName) {
        validationIssues.push(`Merchant at index ${i} is missing a displayName`);
      }
      
      if (!merchant.accountType) {
        validationIssues.push(`Merchant at index ${i} is missing an accountType`);
      }
      
      if (merchant.profileInterface === undefined) {
        validationIssues.push(`Merchant at index ${i} is missing a profileInterface`);
      }
      
      // Check for duplicates
      if (merchant.username && usernames.has(merchant.username)) {
        validationIssues.push(`Duplicate username: ${merchant.username}`);
      } else if (merchant.username) {
        usernames.add(merchant.username);
      }
      
      if (merchant.id && ids.has(merchant.id)) {
        validationIssues.push(`Duplicate id: ${merchant.id}`);
      } else if (merchant.id) {
        ids.add(merchant.id);
      }
    }
    
    if (validationIssues.length > 0) {
      console.error('\nValidation failed with the following issues:');
      validationIssues.forEach(issue => console.error(`- ${issue}`));
      return false;
    }
    
    console.log('All merchant data is valid');
    
    // Check for conflicts with existing data
    const existingUsernames = await merchantsCollection.distinct('username');
    const existingIds = await merchantsCollection.distinct('id');
    
    const conflictUsernames = REAL_MERCHANTS.filter(m => existingUsernames.includes(m.username)).map(m => m.username);
    const conflictIds = REAL_MERCHANTS.filter(m => existingIds.includes(m.id)).map(m => m.id);
    
    if (conflictUsernames.length > 0 || conflictIds.length > 0) {
      console.error('\nFound conflicts with existing database data:');
      
      if (conflictUsernames.length > 0) {
        console.error(`- Duplicate usernames: ${conflictUsernames.join(', ')}`);
      }
      
      if (conflictIds.length > 0) {
        console.error(`- Duplicate ids: ${conflictIds.join(', ')}`);
      }
      
      console.error('\nPlease resolve conflicts before importing.');
      return false;
    }
    
    // Import merchants
    console.log(`\nImporting ${REAL_MERCHANTS.length} merchants...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const merchant of REAL_MERCHANTS) {
      try {
        // Create base merchant document
        const merchantDoc = {
          ...merchant,
          openStatus: {
            isCurrentlyOpen: calculateIsOpen(merchant),
            nextOpeningTime: calculateNextOpenTime(merchant),
            lastUpdated: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Insert merchant
        const merchantResult = await merchantsCollection.insertOne(merchantDoc);
        
        // Create merchant details based on merchant type
        let detailsDoc = {
          merchantId: merchant.id,
          merchantType: merchant.merchantType,
          profileInterface: merchant.profileInterface,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add type-specific fields
        if (isSingleLocationMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            pricePerPerson: merchant.pricePerPerson,
            languagesSpoken: merchant.languagesSpoken,
            michelinStars: merchant.michelinStars
          });
        } else if (isMultiLocationMerchant(merchant)) {
          // For multi-location merchants, branches data is directly assigned
          Object.assign(detailsDoc, {
            branches: merchant.branches,
            pricePerPerson: merchant.pricePerPerson,
            languagesSpoken: merchant.languagesSpoken,
            michelinStars: merchant.michelinStars
          });
        } else if (isAttractionMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            ticketPrice: merchant.ticketPrice
          });
        } else if (isHotelMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            pricePerNight: merchant.pricePerNight,
            amenities: merchant.amenities,
            stars: merchant.stars
          });
        } else if (isBarClubMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            pricePerPerson: merchant.pricePerPerson,
            nearbyMidnightFood: merchant.nearbyMidnightFood,
            clubCategories: merchant.clubCategories,
            entryFee: merchant.entryFee
          });
        } else if (isBuildingMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            floors: merchant.floors,
            featuredStores: merchant.featuredStores
          });
        } else if (isStreetMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location
          });
        }
        
        // Insert details
        const detailsResult = await merchantDetailsCollection.insertOne(detailsDoc);
        
        // Update merchant with reference to details
        await merchantsCollection.updateOne(
          { _id: merchantResult.insertedId },
          { $set: { merchantDetailsId: detailsResult.insertedId } }
        );
        
        console.log(`Imported ${merchant.displayName} (${merchant.username})`);
        successCount++;
      } catch (error) {
        console.error(`Failed to import ${merchant.displayName || merchant.username || 'unknown merchant'}:`, error);
        failCount++;
      }
    }
    
    // Import summary
    console.log('\nImport completed:');
    console.log(`- Successfully imported: ${successCount} merchants`);
    console.log(`- Failed to import: ${failCount} merchants`);
    
    if (successCount > 0) {
      console.log('\nMerchant database has been updated successfully');
      
      // Additional information
      console.log('\nYou can access your merchants via these endpoints:');
      console.log('- All merchants: GET /api/merchants');
      console.log('- Single merchant: GET /api/merchants/[username]');
      console.log('- Merchant by ID: GET /api/merchants/id/[id]');
    }
    
    return successCount > 0;
  } catch (error) {
    console.error('Error importing merchants:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the import
importMerchants()
  .then(success => {
    if (success) {
      console.log('Import script completed successfully');
      process.exit(0);
    } else {
      console.error('Import script failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Import script failed:', error);
    process.exit(1);
  }); 