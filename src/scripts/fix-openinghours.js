/**
 * Database Fix Script for Opening Hours
 * This script fixes the structure of opening hours for merchants in the database
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

async function fixOpeningHours() {
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
    
    // Find all multi-location merchants
    const multiLocationMerchants = await merchantDetailsCollection.find({
      profileInterface: 2 // MultipleBranchMerchant
    }).toArray();
    
    console.log(`Found ${multiLocationMerchants.length} multi-location merchants to check`);
    
    let fixCount = 0;
    
    // Process each multi-location merchant
    for (const merchantDetail of multiLocationMerchants) {
      if (!merchantDetail.branches || !Array.isArray(merchantDetail.branches)) {
        console.log(`Merchant ${merchantDetail.merchantId}: No valid branches array found`);
        continue;
      }
      
      let needsUpdate = false;
      
      // Check and fix each branch
      for (let i = 0; i < merchantDetail.branches.length; i++) {
        const branch = merchantDetail.branches[i];
        
        // Check if openingHours property exists
        if (!branch.openingHours) {
          console.log(`Merchant ${merchantDetail.merchantId}, Branch ${i}: Missing openingHours`);
          
          // Try to extract from businessInfo if it exists
          if (branch.businessInfo && branch.businessInfo.openingHours) {
            merchantDetail.branches[i].openingHours = branch.businessInfo.openingHours;
            console.log(`Merchant ${merchantDetail.merchantId}, Branch ${i}: Moved openingHours from businessInfo`);
            needsUpdate = true;
          } else {
            // Create empty array if no opening hours data available
            merchantDetail.branches[i].openingHours = [];
            console.log(`Merchant ${merchantDetail.merchantId}, Branch ${i}: Created empty openingHours array`);
            needsUpdate = true;
          }
        } else if (!Array.isArray(branch.openingHours)) {
          // Convert to array if it's not already an array
          console.log(`Merchant ${merchantDetail.merchantId}, Branch ${i}: openingHours is not an array, converting...`);
          merchantDetail.branches[i].openingHours = branch.openingHours ? [branch.openingHours] : [];
          needsUpdate = true;
        }
        
        // Make sure each opening hours item has day and hours properties
        if (Array.isArray(merchantDetail.branches[i].openingHours)) {
          for (let j = 0; j < merchantDetail.branches[i].openingHours.length; j++) {
            const schedule = merchantDetail.branches[i].openingHours[j];
            
            if (!schedule.day || !schedule.hours) {
              console.log(`Merchant ${merchantDetail.merchantId}, Branch ${i}: Invalid schedule at index ${j}`);
              
              // Try to fix the schedule
              if (typeof schedule === 'object') {
                if (!schedule.day) schedule.day = 'Monday-Sunday';
                if (!schedule.hours) schedule.hours = '9:00-17:00';
                needsUpdate = true;
              } else {
                // Remove invalid schedule
                merchantDetail.branches[i].openingHours.splice(j, 1);
                j--;
                needsUpdate = true;
              }
            }
          }
        }
      }
      
      // Update the merchant if changes were made
      if (needsUpdate) {
        const result = await merchantDetailsCollection.updateOne(
          { _id: merchantDetail._id },
          { $set: { branches: merchantDetail.branches } }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`Merchant ${merchantDetail.merchantId}: Successfully updated`);
          fixCount++;
        } else {
          console.log(`Merchant ${merchantDetail.merchantId}: No updates made`);
        }
      } else {
        console.log(`Merchant ${merchantDetail.merchantId}: No issues found`);
      }
    }
    
    // Find all single-location merchants
    const singleLocationMerchants = await merchantDetailsCollection.find({
      profileInterface: 1 // SingleShopRestaurant
    }).toArray();
    
    console.log(`\nFound ${singleLocationMerchants.length} single-location merchants to check`);
    
    // Process each single-location merchant
    for (const merchantDetail of singleLocationMerchants) {
      let needsUpdate = false;
      
      // Check if businessInfo and openingHours exist
      if (!merchantDetail.businessInfo) {
        console.log(`Merchant ${merchantDetail.merchantId}: Missing businessInfo`);
        merchantDetail.businessInfo = { openingHours: [] };
        needsUpdate = true;
      } else if (!merchantDetail.businessInfo.openingHours) {
        console.log(`Merchant ${merchantDetail.merchantId}: Missing openingHours in businessInfo`);
        merchantDetail.businessInfo.openingHours = [];
        needsUpdate = true;
      } else if (!Array.isArray(merchantDetail.businessInfo.openingHours)) {
        // Convert to array if it's not already
        console.log(`Merchant ${merchantDetail.merchantId}: openingHours is not an array, converting...`);
        merchantDetail.businessInfo.openingHours = merchantDetail.businessInfo.openingHours ? 
          [merchantDetail.businessInfo.openingHours] : [];
        needsUpdate = true;
      }
      
      // Make sure each opening hours item has day and hours properties
      if (Array.isArray(merchantDetail.businessInfo.openingHours)) {
        for (let j = 0; j < merchantDetail.businessInfo.openingHours.length; j++) {
          const schedule = merchantDetail.businessInfo.openingHours[j];
          
          if (!schedule.day || !schedule.hours) {
            console.log(`Merchant ${merchantDetail.merchantId}: Invalid schedule at index ${j}`);
            
            // Try to fix the schedule
            if (typeof schedule === 'object') {
              if (!schedule.day) schedule.day = 'Monday-Sunday';
              if (!schedule.hours) schedule.hours = '9:00-17:00';
              needsUpdate = true;
            } else {
              // Remove invalid schedule
              merchantDetail.businessInfo.openingHours.splice(j, 1);
              j--;
              needsUpdate = true;
            }
          }
        }
      }
      
      // Update the merchant if changes were made
      if (needsUpdate) {
        const result = await merchantDetailsCollection.updateOne(
          { _id: merchantDetail._id },
          { $set: { businessInfo: merchantDetail.businessInfo } }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`Merchant ${merchantDetail.merchantId}: Successfully updated`);
          fixCount++;
        } else {
          console.log(`Merchant ${merchantDetail.merchantId}: No updates made`);
        }
      } else {
        console.log(`Merchant ${merchantDetail.merchantId}: No issues found`);
      }
    }
    
    console.log(`\nFix completed. Updated ${fixCount} merchants in total.`);
    return true;
  } catch (error) {
    console.error('Error fixing opening hours:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the fix
fixOpeningHours()
  .then(success => {
    if (success) {
      console.log('Fix script completed successfully');
      process.exit(0);
    } else {
      console.error('Fix script failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fix script failed:', error);
    process.exit(1);
  }); 