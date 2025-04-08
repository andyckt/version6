/**
 * Improved MongoDB Migration Script
 * This script correctly migrates merchants to both merchants and merchantDetails collections
 * in the bobe database to maintain compatibility with existing code
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

// MongoDB settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Verify MongoDB URI
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not set');
  console.error('Set it in your .env.local file or as an environment variable');
  process.exit(1);
}

// Load merchant data
let merchantData;
try {
  const merchantsPath = path.join(__dirname, '../data/merchants.js');
  if (!fs.existsSync(merchantsPath)) {
    console.error(`ERROR: Merchants data file not found at ${merchantsPath}`);
    process.exit(1);
  }
  merchantData = require(merchantsPath);
} catch (error) {
  console.error('ERROR: Failed to load merchants data:', error);
  process.exit(1);
}

const { merchants, ProfileInterface } = merchantData;

// Helper functions to determine merchant types
const { 
  isSingleLocationMerchant,
  isMultiLocationMerchant, 
  isAttractionMerchant,
  isHotelMerchant,
  isBarClubMerchant,
  isBuildingMerchant,
  isStreetMerchant
} = merchantData;

// Calculate if merchant is currently open
function calculateIsOpen(merchant) {
  try {
    if (!merchant.businessInfo?.openingHours) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes
    
    for (const schedule of merchant.businessInfo.openingHours) {
      if (!schedule.day || !schedule.hours) continue;
      
      // Handle different day formats
      const dayLowerCase = schedule.day.toLowerCase();
      
      // All-week formats
      if (dayLowerCase === 'monday-sunday' || 
          dayLowerCase === 'all days' || 
          dayLowerCase === '全天' ||
          dayLowerCase === 'all day' ||
          dayLowerCase === 'everyday') {
        
        // Handle 24-hour operation
        if (typeof schedule.hours === 'string') {
          const hoursLowerCase = schedule.hours.toLowerCase();
          if (hoursLowerCase === '24 hours' || 
              hoursLowerCase === 'all day' || 
              hoursLowerCase === '全天') {
            return true;
          }
        }
        
        // Apply day-specific logic
        if (processHours(schedule.hours, currentTime)) {
          return true;
        }
      }
      // Day ranges (e.g., "Monday-Friday")
      else if (dayLowerCase.includes('-')) {
        const [startDay, endDay] = dayLowerCase.split('-').map(d => d.trim());
        
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDayIndex = days.indexOf(currentDay);
        const startDayIndex = days.indexOf(startDay);
        const endDayIndex = days.indexOf(endDay);
        
        if (currentDayIndex !== -1 && startDayIndex !== -1 && endDayIndex !== -1) {
          // Handle wrap-around ranges like "friday-monday"
          if (startDayIndex <= endDayIndex) {
            if (currentDayIndex >= startDayIndex && currentDayIndex <= endDayIndex) {
              if (processHours(schedule.hours, currentTime)) {
                return true;
              }
            }
          } else {
            if (currentDayIndex >= startDayIndex || currentDayIndex <= endDayIndex) {
              if (processHours(schedule.hours, currentTime)) {
                return true;
              }
            }
          }
        }
      }
      // Single day match
      else if (dayLowerCase.includes(currentDay)) {
        if (processHours(schedule.hours, currentTime)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error calculating open status for ${merchant.username}:`, error);
    return false;
  }
}

// Helper to process hours and check if currently in timeframe
function processHours(hours, currentTime) {
  // Handle array of hours
  if (Array.isArray(hours)) {
    return hours.some(timeSlot => isInTimeSlot(timeSlot, currentTime));
  } 
  // Handle single hour string
  else if (typeof hours === 'string') {
    return isInTimeSlot(hours, currentTime);
  }
  
  return false;
}

// Helper to determine if current time is in a time slot
function isInTimeSlot(timeSlot, currentTime) {
  if (timeSlot.toLowerCase() === 'closed') {
    return false;
  }
  
  if (timeSlot.toLowerCase() === '24 hours' || 
      timeSlot.toLowerCase() === 'all day') {
    return true;
  }
  
  const timeRange = timeSlot.split('-');
  if (timeRange.length !== 2) return false;
  
  const [startStr, endStr] = timeRange;
  
  // Parse times like "11:30" or "22:00"
  const startParts = startStr.trim().split(':');
  const endParts = endStr.trim().split(':');
  
  if (startParts.length !== 2 || endParts.length !== 2) return false;
  
  const startHour = parseInt(startParts[0]);
  const startMinute = parseInt(startParts[1]);
  const startTime = startHour * 60 + startMinute;
  
  const endHour = parseInt(endParts[0]);
  const endMinute = parseInt(endParts[1]);
  const endTime = endHour * 60 + endMinute;
  
  // Handle overnight hours (e.g., 22:00-02:00)
  if (endTime < startTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
}

// Calculate next opening time
function calculateNextOpenTime(merchant) {
  try {
    if (!merchant.businessInfo?.openingHours) return 'Unknown';
    
    // For simplicity, we'll return a placeholder for now
    // In a production environment, you would calculate the actual next opening time
    return "Soon";
  } catch (error) {
    console.error(`Error calculating next opening time for ${merchant.username}:`, error);
    return "Unknown";
  }
}

// Main migration function
async function migrateMerchants() {
  let client;
  
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI.split('@').pop()}`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database and collections
    const db = client.db(MONGODB_DB);
    const merchantsCollection = db.collection(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Check existing data
    const existingMerchantsCount = await merchantsCollection.countDocuments();
    const existingDetailsCount = await merchantDetailsCollection.countDocuments();
    
    console.log(`Found ${existingMerchantsCount} existing merchants and ${existingDetailsCount} merchant details in database '${MONGODB_DB}'`);
    console.log('Clearing existing data...');
    
    // Empty collections
    await merchantsCollection.deleteMany({});
    await merchantDetailsCollection.deleteMany({});
    console.log('Collections cleared successfully');
    
    if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
      console.error('ERROR: No merchants data found or invalid format');
      return false;
    }
    
    // Migration stats
    const stats = {
      total: merchants.length,
      successful: 0,
      failed: 0,
      errors: []
    };
    
    console.log(`Starting migration of ${stats.total} merchants to database '${MONGODB_DB}'...`);
    
    // Process each merchant
    for (const merchant of merchants) {
      try {
        // Prepare base merchant document
        const merchantDoc = {
          id: merchant.id,
          username: merchant.username,
          displayName: merchant.displayName,
          verified: merchant.verified,
          accountType: merchant.accountType,
          joinDate: merchant.joinDate,
          recommended: merchant.recommended,
          hashtags: merchant.hashtags,
          district: merchant.district,
          merchantType: merchant.merchantType,
          profileInterface: merchant.profileInterface,
          url: merchant.url,
          stats: merchant.stats,
          openStatus: {
            isCurrentlyOpen: calculateIsOpen(merchant),
            nextOpeningTime: calculateNextOpenTime(merchant),
            lastUpdated: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Insert merchant document
        const merchantResult = await merchantsCollection.insertOne(merchantDoc);
        
        // Prepare merchant details document based on merchant type
        let detailsDoc = {
          merchantId: merchant.id,
          merchantType: merchant.merchantType,
          profileInterface: merchant.profileInterface,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add type-specific fields based on merchant type
        if (isSingleLocationMerchant(merchant)) {
          Object.assign(detailsDoc, {
            location: merchant.location,
            businessInfo: merchant.businessInfo,
            pricePerPerson: merchant.pricePerPerson,
            languagesSpoken: merchant.languagesSpoken,
            michelinStars: merchant.michelinStars
          });
        } else if (isMultiLocationMerchant(merchant)) {
          Object.assign(detailsDoc, {
            branches: merchant.branches,
            pricePerPerson: merchant.pricePerPerson,
            languagesSpoken: merchant.languagesSpoken,
            michelinStars: merchant.michelinStars,
            needBooking: merchant.needBooking,
            peakTime: merchant.peakTime
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
        
        // Insert details document
        const detailsResult = await merchantDetailsCollection.insertOne(detailsDoc);
        
        // Update merchant with reference to details
        await merchantsCollection.updateOne(
          { _id: merchantResult.insertedId },
          { $set: { merchantDetailsId: detailsResult.insertedId } }
        );
        
        stats.successful++;
        
        if (stats.successful % 10 === 0 || stats.successful === stats.total) {
          console.log(`Processed ${stats.successful}/${stats.total} merchants (${Math.round(stats.successful/stats.total*100)}%)`);
        }
      } catch (error) {
        stats.failed++;
        stats.errors.push({
          merchant: merchant.username || merchant.id,
          error: error.message
        });
        console.error(`Error processing merchant ${merchant.username || merchant.id}: ${error.message}`);
      }
    }
    
    // Create indexes for better performance
    console.log('Creating indexes for better performance...');
    await merchantsCollection.createIndex({ username: 1 }, { unique: true });
    await merchantsCollection.createIndex({ id: 1 }, { unique: true });
    await merchantsCollection.createIndex({ accountType: 1, recommended: 1 });
    await merchantsCollection.createIndex({ district: 1 });
    await merchantsCollection.createIndex({ merchantType: 1 });
    
    await merchantDetailsCollection.createIndex({ merchantId: 1 }, { unique: true });
    
    // Log migration summary
    console.log('\n===== Migration Summary =====');
    console.log(`Total merchants: ${stats.total}`);
    console.log(`Successfully migrated: ${stats.successful}`);
    console.log(`Failed migrations: ${stats.failed}`);
    
    if (stats.errors.length > 0) {
      console.log('\nErrors:');
      stats.errors.forEach((err, i) => {
        console.log(`${i+1}. ${err.merchant}: ${err.error}`);
      });
    }
    
    return stats.failed === 0;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the migration
migrateMerchants()
  .then(success => {
    if (success) {
      console.log('Migration completed successfully with no errors');
      process.exit(0);
    } else {
      console.log('Migration completed with some errors');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 