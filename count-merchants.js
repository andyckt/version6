// Script to connect to MongoDB and count merchants in the collection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to connect to MongoDB and count merchants
async function countMerchants() {
  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
    process.exit(1);
  }

  // Create a new MongoDB client
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Access the database and collection
    const db = client.db(dbName);
    const merchantsCollection = db.collection('merchants');

    // Count the documents in the merchants collection
    const count = await merchantsCollection.countDocuments();
    console.log(`Total number of merchants in the collection: ${count}`);

    // List some merchants as a sample
    const merchants = await merchantsCollection.find().limit(5).toArray();
    console.log('\nSample merchants:');
    merchants.forEach((merchant, index) => {
      console.log(`${index + 1}. ${merchant.displayName || 'No display name'} (${merchant.username || 'No username'})`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
countMerchants().catch(console.error); 