// Migration script that loads merchants from a JSON file
// This avoids any module system issues completely
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// First try to load from .env.local, then fall back to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

// Try loading .env.local first, then fall back to .env
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath }); // This will not overwrite existing env vars

const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection logic
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local or .env');
}

console.log('MongoDB URI found in environment variables');

// First, export merchants data to a temporary JSON file
function exportMerchantsToJson() {
  console.log('Creating temporary merchants JSON file...');
  
  // This code will generate a JSON file with the merchants data
  const merchantsModule = require('../data/merchants');
  
  // Ensure the data directory exists
  const tempDir = path.resolve(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  const jsonPath = path.resolve(tempDir, 'merchants.json');
  fs.writeFileSync(jsonPath, JSON.stringify(merchantsModule.merchants, null, 2));
  
  console.log(`Exported ${merchantsModule.merchants.length} merchants to ${jsonPath}`);
  return jsonPath;
}

async function migrate() {
  // First export merchants to JSON
  const jsonPath = exportMerchantsToJson();
  
  // Now read the merchants from the JSON file
  const merchantsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${merchantsData.length} merchants from JSON file`);
  
  const uri = process.env.MONGODB_URI;
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };
  
  // Connect to MongoDB
  const client = new MongoClient(uri, options);
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');
    const db = client.db();
    
    // Drop the existing collection if it exists
    try {
      await db.collection('merchants').drop();
      console.log('Dropped existing merchants collection.');
    } catch (err) {
      console.log('Collection does not exist yet, creating new.');
    }
    
    // Create the merchants collection
    const collection = db.collection('merchants');
    
    // Create indexes
    console.log('Creating indexes...');
    await collection.createIndex({ username: 1 }, { unique: true });
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ accountType: 1 });
    await collection.createIndex({ district: 1 });
    await collection.createIndex({ "location.branchDistrict": 1 });
    await collection.createIndex({ "branches.branchDistrict": 1 });
    await collection.createIndex({ merchantType: 1 });
    await collection.createIndex({ recommended: 1 });
    await collection.createIndex({ hashtags: 1 });
    await collection.createIndex({ profileInterface: 1 });
    console.log('Indexes created successfully.');
    
    // Process merchants - ensure all usernames are lowercase
    console.log('Processing merchants data...');
    const processedMerchants = merchantsData.map(merchant => ({
      ...merchant,
      username: merchant.username.toLowerCase()
    }));
    
    // Insert all merchants
    console.log('Inserting merchants into database...');
    const result = await collection.insertMany(processedMerchants);
    console.log(`Successfully migrated ${result.insertedCount} merchants to MongoDB!`);
    
    // Clean up temporary JSON file
    fs.unlinkSync(jsonPath);
    console.log('Cleaned up temporary JSON file');
    
    return result.insertedCount;
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the migration
migrate()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error during migration:', error);
    process.exit(1);
  }); 