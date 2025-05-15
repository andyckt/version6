// Script to list all usernames from the database
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to list all usernames
async function listUsernames() {
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
    
    // Get usernames from both users and merchants collections
    const usersCollection = db.collection('users');
    const merchantsCollection = db.collection('merchants');
    
    // Get all usernames from users collection
    const users = await usersCollection.find({}, { projection: { username: 1, role: 1 } }).toArray();
    
    // Get all usernames from merchants collection
    const merchants = await merchantsCollection.find({}, { projection: { username: 1 } }).toArray();
    
    console.log('\n===== User Usernames =====');
    users.forEach((user, index) => {
      console.log(`${index + 1}. @${user.username || 'N/A'} - Role: ${user.role || 'N/A'}`);
    });
    
    console.log('\n===== Merchant Usernames =====');
    merchants.forEach((merchant, index) => {
      console.log(`${index + 1}. @${merchant.username || 'N/A'}`);
    });
    
    // Summary
    console.log(`\nTotal Users: ${users.length}`);
    console.log(`Total Merchants: ${merchants.length}`);
    console.log(`Combined Total: ${users.length + merchants.length}`);

  } catch (error) {
    console.error('Error listing usernames:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
listUsernames().catch(console.error); 