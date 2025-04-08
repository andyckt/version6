/**
 * Direct Import of Extracted Merchants
 * 
 * This script imports merchant data from extracted-merchants.js directly to MongoDB
 * without requiring manual copy/paste to import-merchants.js
 * 
 * Usage:
 * 1. Run this script: node src/scripts/direct-import-ts-merchants.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// Load the extracted merchants
let extractedMerchants;
try {
  extractedMerchants = require('../data/extracted-merchants');
  if (!extractedMerchants || !extractedMerchants.EXTRACTED_MERCHANTS || !Array.isArray(extractedMerchants.EXTRACTED_MERCHANTS)) {
    throw new Error('Invalid extracted merchants data structure');
  }
} catch (error) {
  console.error('ERROR: Could not load extracted merchants data.');
  console.error('Please run "node src/scripts/extract-merchants-from-ts.js" first to generate the data.');
  console.error(error);
  process.exit(1);
}

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Get merchants data
const { ProfileInterface, EXTRACTED_MERCHANTS: merchants } = extractedMerchants;

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

// Calculate if merchant is currently open based on opening hours
function calculateIsOpen(merchant) {
  try {
    if (isMultiLocationMerchant(merchant)) {
      // For multi-location merchants, check if any branch is open
      if (!merchant.branches || !Array.isArray(merchant.branches)) return false;
      
      for (const branch of merchant.branches) {
        if (isBranchOpen(branch)) return true;
      }
      return false;
    } else {
      // For single-location merchants, check the business info
      if (!merchant.businessInfo?.openingHours) return false;
      
      return isOpenNow(merchant.businessInfo.openingHours);
    }
  } catch (error) {
    console.error(`Error calculating open status for ${merchant?.username || 'unknown merchant'}:`, error);
    return false;
  }
}

function isBranchOpen(branch) {
  if (!branch.openingHours) return false;
  return isOpenNow(branch.openingHours);
}

function isOpenNow(openingHours) {
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  for (const schedule of openingHours) {
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
}

// Calculate next opening time (simplified version)
function calculateNextOpenTime(merchant) {
  return "Soon"; // Placeholder - implement actual logic if needed
}

// Main function to import merchants
async function importMerchants() {
  console.log(`Found ${merchants.length} merchants to import`);
  
  // Input validation
  if (!merchants || merchants.length === 0) {
    console.error('ERROR: No merchant data found.');
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
    
    // Check for existing merchants
    const existingMerchantCount = await merchantsCollection.countDocuments();
    console.log(`Found ${existingMerchantCount} existing merchants in database`);
    
    // Validate merchant data
    console.log('\nValidating merchant data...');
    let validationIssues = 0;
    
    // Check for unique usernames and IDs
    const usernames = new Set();
    const ids = new Set();
    
    for (const merchant of merchants) {
      if (!merchant.username || usernames.has(merchant.username)) {
        console.error(`- Validation issue: ${merchant.username ? 'Duplicate' : 'Missing'} username for merchant ID ${merchant.id}`);
        validationIssues++;
      } else {
        usernames.add(merchant.username);
      }
      
      if (!merchant.id || ids.has(merchant.id)) {
        console.error(`- Validation issue: ${merchant.id ? 'Duplicate' : 'Missing'} ID for merchant "${merchant.username || 'unknown'}"`);
        validationIssues++;
      } else {
        ids.add(merchant.id);
      }
    }
    
    if (validationIssues > 0) {
      console.error(`\nFound ${validationIssues} validation issues. Do you want to continue anyway?`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Proceed with import? (y/n): ', answer => {
          readline.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (answer !== 'y' && answer !== 'yes') {
        console.log('Import cancelled by user');
        return false;
      }
    } else {
      console.log('All merchant data is valid');
    }
    
    // Import merchants
    console.log(`\nImporting ${merchants.length} merchants...`);
    
    // Check if we should clear existing data
    if (existingMerchantCount > 0) {
      console.log('\nThere are existing merchants in the database. Do you want to clear them first?');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Clear existing merchants? (y/n): ', answer => {
          readline.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (answer === 'y' || answer === 'yes') {
        console.log('Clearing existing merchants...');
        await merchantsCollection.deleteMany({});
        await merchantDetailsCollection.deleteMany({});
        console.log('Existing merchants cleared');
      } else {
        console.log('Keeping existing merchants');
      }
    }
    
    let successCount = 0;
    let updateCount = 0;
    let failCount = 0;
    
    for (const merchant of merchants) {
      try {
        // Create base merchant document
        const merchantDoc = {
          ...merchant,
          openStatus: {
            isCurrentlyOpen: calculateIsOpen(merchant),
            nextOpeningTime: calculateNextOpenTime(merchant),
            lastUpdated: new Date()
          },
          updatedAt: new Date()
        };
        
        // Check if this merchant already exists
        const existingMerchant = await merchantsCollection.findOne({
          $or: [
            { username: merchant.username },
            { id: merchant.id }
          ]
        });
        
        let merchantResult;
        
        if (existingMerchant) {
          // Update the existing merchant
          merchantDoc.createdAt = existingMerchant.createdAt || new Date();
          
          merchantResult = await merchantsCollection.updateOne(
            { _id: existingMerchant._id },
            { $set: merchantDoc }
          );
          
          console.log(`Updated existing merchant: ${merchant.displayName} (${merchant.username})`);
          updateCount++;
        } else {
          // Insert as a new merchant
          merchantDoc.createdAt = new Date();
          
          merchantResult = await merchantsCollection.insertOne(merchantDoc);
          console.log(`Imported new merchant: ${merchant.displayName} (${merchant.username})`);
          successCount++;
        }
        
        // Create merchant details based on merchant type
        let detailsDoc = {
          merchantId: merchant.id,
          merchantType: merchant.merchantType,
          profileInterface: merchant.profileInterface,
          updatedAt: new Date()
        };
        
        // Check if details already exist
        const existingDetails = await merchantDetailsCollection.findOne({ merchantId: merchant.id });
        
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
        
        let detailsResult;
        
        if (existingDetails) {
          // Update existing details
          detailsDoc.createdAt = existingDetails.createdAt || new Date();
          
          detailsResult = await merchantDetailsCollection.updateOne(
            { _id: existingDetails._id },
            { $set: detailsDoc }
          );
        } else {
          // Insert new details
          detailsDoc.createdAt = new Date();
          
          detailsResult = await merchantDetailsCollection.insertOne(detailsDoc);
          
          // Update merchant with reference to details
          if (!existingMerchant) {
            await merchantsCollection.updateOne(
              { id: merchant.id },
              { $set: { merchantDetailsId: detailsResult.insertedId } }
            );
          }
        }
      } catch (error) {
        console.error(`Failed to import ${merchant.displayName || merchant.username || 'unknown merchant'}:`, error);
        failCount++;
      }
    }
    
    // Create indexes for better performance
    console.log('Creating indexes for better performance...');
    await merchantsCollection.createIndex({ username: 1 }, { unique: true });
    await merchantsCollection.createIndex({ id: 1 }, { unique: true });
    await merchantsCollection.createIndex({ accountType: 1 });
    await merchantsCollection.createIndex({ district: 1 });
    await merchantsCollection.createIndex({ merchantType: 1 });
    
    // Import summary
    console.log('\nImport completed:');
    console.log(`- Successfully imported new: ${successCount} merchants`);
    console.log(`- Successfully updated: ${updateCount} merchants`);
    console.log(`- Failed to import: ${failCount} merchants`);
    
    if (successCount > 0 || updateCount > 0) {
      console.log('\nMerchant database has been updated successfully');
      
      // Additional information
      console.log('\nYou can access your merchants via these endpoints:');
      console.log('- All merchants: GET /api/merchants');
      console.log('- Single merchant: GET /api/merchants/[username]');
      console.log('- Merchant by ID: GET /api/merchants/id/[id]');
    }
    
    return (successCount > 0 || updateCount > 0);
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