/**
 * Script to delete sample merchants from the database
 * This ensures you can add real merchant data without ID conflicts
 * 
 * Usage:
 * node src/scripts/delete-sample-merchants.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const path = require('path');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';
const MERCHANT_COLLECTION = 'merchants';
const MERCHANT_DETAIL_COLLECTION = 'merchantDetails';

// Sample merchant IDs from merchants.js
const SAMPLE_MERCHANT_IDS = [
  501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512
];

// Script to delete sample merchants
async function deleteSampleMerchants() {
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
    
    console.log(`Checking for sample merchants in database '${MONGODB_DB}'...`);
    
    // Get sample merchants from database
    const sampleMerchants = await merchantsCollection.find({ id: { $in: SAMPLE_MERCHANT_IDS } }).toArray();
    
    if (sampleMerchants.length === 0) {
      console.log('No sample merchants found in database. Nothing to delete.');
      return;
    }
    
    console.log(`Found ${sampleMerchants.length} sample merchants in database:`);
    
    // List sample merchants that will be deleted
    for (const merchant of sampleMerchants) {
      console.log(`- ID: ${merchant.id}, Username: ${merchant.username}, Name: ${merchant.displayName}`);
    }
    
    // Delete merchantDetails first (to maintain referential integrity)
    console.log('\nDeleting merchant details...');
    
    // Extract merchantDetailsIds
    const merchantDetailsIds = sampleMerchants
      .filter(m => m.merchantDetailsId)
      .map(m => m.merchantDetailsId);
    
    // Delete details if there are any
    if (merchantDetailsIds.length > 0) {
      const deleteDetailsResult = await merchantDetailsCollection.deleteMany({
        _id: { $in: merchantDetailsIds }
      });
      
      console.log(`Deleted ${deleteDetailsResult.deletedCount} merchant details`);
    } else {
      console.log('No merchant details found to delete');
    }
    
    // Delete merchants by ID
    console.log('\nDeleting merchants...');
    const deleteMerchantsResult = await merchantsCollection.deleteMany({
      id: { $in: SAMPLE_MERCHANT_IDS }
    });
    
    console.log(`Deleted ${deleteMerchantsResult.deletedCount} merchants from database`);
    
    // Also delete by merchantId for merchant details
    console.log('\nCleaning up any orphaned merchant details...');
    const cleanupResult = await merchantDetailsCollection.deleteMany({
      merchantId: { $in: SAMPLE_MERCHANT_IDS }
    });
    
    if (cleanupResult.deletedCount > 0) {
      console.log(`Deleted ${cleanupResult.deletedCount} orphaned merchant details`);
    } else {
      console.log('No orphaned merchant details found');
    }
    
    console.log('\nSample merchants have been successfully deleted from the database.');
    console.log('You can now add your real merchant data without ID conflicts.');
    
  } catch (error) {
    console.error('Error deleting sample merchants:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the deletion
deleteSampleMerchants()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 