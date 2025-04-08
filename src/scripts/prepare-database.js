/**
 * Database Preparation Script
 * 
 * This script prepares the MongoDB database for new merchant data:
 * - Checks existing collections
 * - Sets up necessary indexes
 * - Verifies database connection
 * 
 * Usage: 
 * node src/scripts/prepare-database.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'bobe';

// Collection names
const COLLECTIONS = {
  MERCHANTS: 'merchants',
  MERCHANT_DETAILS: 'merchantDetails'
};

// Main function to prepare database
async function prepareDatabase() {
  let client;
  
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI.split('@').pop()}...`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database
    const db = client.db(MONGODB_DB);
    
    // Get list of all collections
    console.log(`\nChecking collections in database '${MONGODB_DB}'...`);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Existing collections:');
    collectionNames.forEach(name => console.log(`- ${name}`));
    
    // Create collections if they don't exist
    for (const collectionName of [COLLECTIONS.MERCHANTS, COLLECTIONS.MERCHANT_DETAILS]) {
      if (!collectionNames.includes(collectionName)) {
        console.log(`\nCreating missing collection: ${collectionName}`);
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      }
    }
    
    // Get references to collections
    const merchantsCollection = db.collection(COLLECTIONS.MERCHANTS);
    const merchantDetailsCollection = db.collection(COLLECTIONS.MERCHANT_DETAILS);
    
    // Create necessary indexes
    console.log('\nSetting up indexes for better performance...');
    
    // Set up merchants collection indexes
    const merchantIndexes = await merchantsCollection.listIndexes().toArray();
    const merchantIndexNames = merchantIndexes.map(idx => Object.keys(idx.key).join('_'));
    
    // Create merchant indexes if they don't exist
    const merchantIndexesToCreate = [
      { name: 'username_1', fields: { username: 1 }, options: { unique: true } },
      { name: 'id_1', fields: { id: 1 }, options: { unique: true } },
      { name: 'accountType_1', fields: { accountType: 1 }, options: {} },
      { name: 'district_1', fields: { district: 1 }, options: {} },
      { name: 'recommended_1', fields: { recommended: 1 }, options: {} },
      { name: 'accountType_1_recommended_1', fields: { accountType: 1, recommended: 1 }, options: {} }
    ];
    
    for (const idx of merchantIndexesToCreate) {
      if (!merchantIndexNames.includes(idx.name)) {
        console.log(`Creating index on merchants collection: ${idx.name}`);
        await merchantsCollection.createIndex(idx.fields, idx.options);
      }
    }
    
    // Set up merchant details collection indexes
    const detailsIndexes = await merchantDetailsCollection.listIndexes().toArray();
    const detailsIndexNames = detailsIndexes.map(idx => Object.keys(idx.key).join('_'));
    
    // Create merchant details indexes if they don't exist
    const detailsIndexesToCreate = [
      { name: 'merchantId_1', fields: { merchantId: 1 }, options: { unique: true } }
    ];
    
    for (const idx of detailsIndexesToCreate) {
      if (!detailsIndexNames.includes(idx.name)) {
        console.log(`Creating index on merchantDetails collection: ${idx.name}`);
        await merchantDetailsCollection.createIndex(idx.fields, idx.options);
      }
    }
    
    // Get counts
    const merchantCount = await merchantsCollection.countDocuments();
    const detailsCount = await merchantDetailsCollection.countDocuments();
    
    console.log('\nDatabase statistics:');
    console.log(`- Merchants: ${merchantCount}`);
    console.log(`- Merchant Details: ${detailsCount}`);
    
    // Check for any orphaned merchant details
    const orphanedDetails = await merchantDetailsCollection.countDocuments({
      merchantId: { $nin: await merchantsCollection.distinct('id') }
    });
    
    if (orphanedDetails > 0) {
      console.log(`\nWARNING: Found ${orphanedDetails} orphaned merchant details without corresponding merchants`);
    }
    
    console.log('\nDatabase preparation completed successfully');
    console.log('The database is now ready for new merchant data import');
    
  } catch (error) {
    console.error('Database preparation failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the script
prepareDatabase()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 