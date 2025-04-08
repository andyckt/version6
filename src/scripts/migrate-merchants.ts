import { merchants } from '../data/merchants';
import clientPromise from '../lib/mongodb';
import { convertToMongoDocument } from '../models/merchant';

async function migrateMerchants() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('merchants');
    
    // Check if we already have data
    const count = await collection.countDocuments();
    console.log(`Found ${count} existing merchants in MongoDB`);
    
    if (count > 0) {
      const proceed = await prompt('Merchants collection already contains data. Proceed with migration? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Migration cancelled.');
        process.exit(0);
      }
    }
    
    // Create a unique index on username
    await collection.createIndex({ username: 1 }, { unique: true });
    console.log('Created unique index on username field');
    
    // Create text search indexes
    await collection.createIndex({ displayName: 'text', hashtags: 'text' });
    console.log('Created text search indexes');
    
    // Create geospatial index for locations
    await collection.createIndex({ 'location.location': '2dsphere' });
    console.log('Created geospatial index');
    
    // Begin migration
    console.log(`Starting migration of ${merchants.length} merchants...`);
    
    // Convert all merchants to MongoDB documents
    const mongoMerchants = merchants.map(convertToMongoDocument);
    
    // Use bulk operations for better performance
    const operations = mongoMerchants.map(merchant => ({
      updateOne: {
        filter: { username: merchant.username },
        update: { $set: merchant },
        upsert: true
      }
    }));
    
    // Process in batches of 500
    const batchSize = 500;
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await collection.bulkWrite(batch);
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(operations.length / batchSize)}`);
    }
    
    // Verify the migration
    const finalCount = await collection.countDocuments();
    console.log(`Migration complete. ${finalCount} merchants now in database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Simple prompt function (for simplicity in this script)
function prompt(question: string): Promise<string> {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(question, (answer: string) => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run the migration
migrateMerchants(); 