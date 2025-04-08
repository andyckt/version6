/**
 * Delete All Merchants Script
 * 
 * This script removes all merchants from the MongoDB database
 * 
 * Usage:
 * node src/scripts/delete-all-merchants.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

async function deleteAllMerchants() {
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
    
    // Count merchants before deletion
    const merchantCount = await merchantsCollection.countDocuments();
    const detailsCount = await merchantDetailsCollection.countDocuments();
    
    console.log(`Found ${merchantCount} merchants and ${detailsCount} merchant details to delete`);
    
    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question('Are you sure you want to delete ALL merchants? This action cannot be undone. (y/n): ', answer => {
        readline.close();
        resolve(answer.toLowerCase());
      });
    });
    
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Operation cancelled by user');
      return false;
    }
    
    // Delete all merchants
    console.log('Deleting all merchants...');
    const merchantsResult = await merchantsCollection.deleteMany({});
    
    // Delete all merchant details
    console.log('Deleting all merchant details...');
    const detailsResult = await merchantDetailsCollection.deleteMany({});
    
    console.log(`Deleted ${merchantsResult.deletedCount} merchants`);
    console.log(`Deleted ${detailsResult.deletedCount} merchant details`);
    
    return true;
  } catch (error) {
    console.error('Error deleting merchants:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the deletion
deleteAllMerchants()
  .then(success => {
    if (success) {
      console.log('All merchants successfully deleted from the database');
      process.exit(0);
    } else {
      console.error('Failed to delete all merchants');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  }); 