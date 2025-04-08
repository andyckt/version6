/**
 * Simple migration script to populate MongoDB with merchants data
 * This version uses plain JavaScript and can be run with Node.js directly
 * 
 * Usage:
 * 1. Make sure MongoDB connection details are in .env.local or set MONGODB_URI env variable
 * 2. Run with: node src/scripts/simple-migrate.js
 */

const { MongoClient } = require('mongodb');
const { merchants } = require('./merchants-data.js');

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Collection names
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Function to determine merchant types
function isSingleLocationMerchant(merchant) {
  return merchant.profileInterface === 1;
}

function isMultiLocationMerchant(merchant) {
  return merchant.profileInterface === 2;
}

function isAttractionMerchant(merchant) {
  return merchant.profileInterface === 3;
}

function isStreetMerchant(merchant) {
  return merchant.profileInterface === 4;
}

function isBuildingMerchant(merchant) {
  return merchant.profileInterface === 5;
}

function isHotelMerchant(merchant) {
  return merchant.profileInterface === 6;
}

function isBarClubMerchant(merchant) {
  return merchant.profileInterface === 7;
}

// Function to calculate if a merchant is currently open
function calculateIsOpen(merchant) {
  try {
    // Basic check for now
    return true;
  } catch (error) {
    console.error(`Error calculating open status for ${merchant.username}:`, error);
    return false;
  }
}

// Function to calculate next opening time
function calculateNextOpenTime(merchant) {
  try {
    // Placeholder for now
    return "Soon";
  } catch (error) {
    console.error(`Error calculating next open time for ${merchant.username}:`, error);
    return "Unknown";
  }
}

async function migrateMerchants() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const merchantsCollection = db.collection(MERCHANT_COLLECTION);
    const merchantDetailsCollection = db.collection(MERCHANT_DETAIL_COLLECTION);
    
    // Empty collections before migration
    await merchantsCollection.deleteMany({});
    await merchantDetailsCollection.deleteMany({});
    console.log('Collections cleared');
    
    // Process merchants
    let processed = 0;
    const total = merchants.length;
    
    console.log(`Starting migration of ${total} merchants...`);
    
    for (const merchant of merchants) {
      // Create base merchant document with essential fields
      const baseData = {
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
      
      // Insert base document
      const merchantResult = await merchantsCollection.insertOne(baseData);
      
      // Create merchant details based on merchant type
      let detailsData = {
        merchantId: merchant.id,
        merchantType: merchant.merchantType,
        profileInterface: merchant.profileInterface,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add type-specific fields
      if (isSingleLocationMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerPerson: merchant.pricePerPerson,
          languagesSpoken: merchant.languagesSpoken,
          michelinStars: merchant.michelinStars
        };
      } else if (isMultiLocationMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          pricePerPerson: merchant.pricePerPerson,
          languagesSpoken: merchant.languagesSpoken,
          michelinStars: merchant.michelinStars,
          branches: merchant.branches
        };
      } else if (isAttractionMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          ticketPrice: merchant.ticketPrice
        };
      } else if (isHotelMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerNight: merchant.pricePerNight,
          amenities: merchant.amenities,
          stars: merchant.stars
        };
      } else if (isBarClubMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          pricePerPerson: merchant.pricePerPerson,
          nearbyMidnightFood: merchant.nearbyMidnightFood,
          clubCategories: merchant.clubCategories,
          entryFee: merchant.entryFee
        };
      } else if (isBuildingMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location,
          businessInfo: merchant.businessInfo,
          floors: merchant.floors,
          featuredStores: merchant.featuredStores
        };
      } else if (isStreetMerchant(merchant)) {
        detailsData = {
          ...detailsData,
          location: merchant.location
        };
      }
      
      // Insert details document
      const detailsResult = await merchantDetailsCollection.insertOne(detailsData);
      
      // Update merchant with reference to details
      await merchantsCollection.updateOne(
        { _id: merchantResult.insertedId },
        { $set: { merchantDetailsId: detailsResult.insertedId } }
      );
      
      // Update progress
      processed++;
      if (processed % 1 === 0) {
        console.log(`Processed ${processed}/${total} merchants`);
      }
    }
    
    // Create indexes for better performance
    await merchantsCollection.createIndex({ username: 1 }, { unique: true });
    await merchantsCollection.createIndex({ id: 1 }, { unique: true });
    await merchantsCollection.createIndex({ accountType: 1, recommended: 1 });
    await merchantsCollection.createIndex({ district: 1 });
    
    await merchantDetailsCollection.createIndex({ merchantId: 1 }, { unique: true });
    
    console.log(`Migration completed successfully! Processed ${processed} merchants.`);
    console.log('Created indexes for better performance');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Execute the migration
migrateMerchants()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 