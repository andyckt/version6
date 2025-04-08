/**
 * Direct MongoDB Migration Script
 * This script imports merchant data and migrates it to MongoDB
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Import merchant data
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

const { merchants } = merchantData;

// Function to check if shop is currently open based on opening hours
function isOpen(openingHours) {
  if (!openingHours || !Array.isArray(openingHours) || openingHours.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Convert to minutes

  // Map of day strings to day numbers
  const dayMap = {
    'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
    'friday': 5, 'saturday': 6, 'sunday': 0
  };

  for (const schedule of openingHours) {
    if (!schedule.day || !schedule.hours) continue;

    // Handle different day formats
    let applicableDays = [];
    
    if (schedule.day.toLowerCase() === 'monday-sunday') {
      applicableDays = [0, 1, 2, 3, 4, 5, 6];
    } else if (schedule.day.toLowerCase() === 'monday-friday') {
      applicableDays = [1, 2, 3, 4, 5];
    } else if (schedule.day.toLowerCase() === 'saturday-sunday') {
      applicableDays = [0, 6];
    } else if (schedule.day.toLowerCase() === 'monday-thursday') {
      applicableDays = [1, 2, 3, 4];
    } else if (schedule.day.toLowerCase() === 'friday-sunday') {
      applicableDays = [0, 5, 6];
    } else if (schedule.day.includes('-')) {
      // Parse range like "Monday-Wednesday"
      const [start, end] = schedule.day.split('-').map(d => dayMap[d.trim().toLowerCase()]);
      if (start !== undefined && end !== undefined) {
        if (start <= end) {
          for (let i = start; i <= end; i++) {
            applicableDays.push(i);
          }
        } else {
          // Handle cases like "Saturday-Monday"
          for (let i = start; i <= 6; i++) {
            applicableDays.push(i);
          }
          for (let i = 0; i <= end; i++) {
            applicableDays.push(i);
          }
        }
      }
    } else {
      // Single day
      const dayNumber = dayMap[schedule.day.trim().toLowerCase()];
      if (dayNumber !== undefined) {
        applicableDays.push(dayNumber);
      }
    }

    // Skip if current day is not in applicable days
    if (!applicableDays.includes(currentDay)) {
      continue;
    }

    // Parse hours like "11:30-14:30" or "24 hours"
    if (schedule.hours.toLowerCase() === '24 hours') {
      return true;
    }

    const hoursParts = schedule.hours.split('-');
    if (hoursParts.length !== 2) continue;

    const [openTimeStr, closeTimeStr] = hoursParts;
    
    const openParts = openTimeStr.split(':');
    const closeParts = closeTimeStr.split(':');
    
    if (openParts.length !== 2 || closeParts.length !== 2) continue;

    const openTime = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
    const closeTime = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

    if (closeTime < openTime) {
      // Handles cases like "22:00-2:00" (overnight)
      if ((currentTime >= openTime) || (currentTime <= closeTime)) {
        return true;
      }
    } else {
      // Normal case like "9:00-17:00"
      if (currentTime >= openTime && currentTime <= closeTime) {
        return true;
      }
    }
  }

  return false;
}

// Main migration function
async function migrateMerchants() {
  const client = new MongoClient(uri);
  let migrationSuccess = false;

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db('travelplatform');
    const merchantsCollection = db.collection('merchants');

    // Clear existing collection
    const deleteResult = await merchantsCollection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing merchants`);

    if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
      console.error('ERROR: No merchants data found or invalid format');
      return false;
    }

    const results = {
      total: merchants.length,
      success: 0,
      failed: 0,
      errors: []
    };

    // Process and insert merchants
    for (const merchant of merchants) {
      try {
        // Compute additional fields
        const processedMerchant = {
          ...merchant,
          createdAt: new Date(),
          updatedAt: new Date(),
          isCurrentlyOpen: merchant.businessInfo && merchant.businessInfo.openingHours ? 
            isOpen(merchant.businessInfo.openingHours) : false
        };

        await merchantsCollection.insertOne(processedMerchant);
        results.success++;
        console.log(`Migrated merchant: ${merchant.username}`);
      } catch (error) {
        results.failed++;
        const errorInfo = {
          merchant: merchant.username || merchant.id,
          error: error.message
        };
        results.errors.push(errorInfo);
        console.error(`Failed to migrate merchant ${merchant.username || merchant.id}:`, error.message);
      }
    }

    // Create indexes for better performance
    await merchantsCollection.createIndex({ username: 1 }, { unique: true });
    await merchantsCollection.createIndex({ accountType: 1 });
    await merchantsCollection.createIndex({ district: 1 });
    await merchantsCollection.createIndex({ merchantType: 1 });
    
    console.log('\nMigration completed:');
    console.log(`Total merchants: ${results.total}`);
    console.log(`Successfully migrated: ${results.success}`);
    console.log(`Failed migrations: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.merchant}: ${err.error}`);
      });
    }

    migrationSuccess = results.failed === 0;
    return migrationSuccess;
  } catch (error) {
    console.error('Failed to execute migration:', error);
    return false;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateMerchants()
  .then(success => {
    if (success) {
      console.log('Migration completed successfully');
      process.exit(0);
    } else {
      console.error('Migration completed with errors');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 