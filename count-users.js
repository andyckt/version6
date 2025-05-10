// Script to connect to MongoDB and count users in the collection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to connect to MongoDB and count users
async function countUsers() {
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
    const usersCollection = db.collection('users');

    // Count the documents in the users collection
    const count = await usersCollection.countDocuments();
    console.log(`Total number of users in the collection: ${count}`);

    // Get user roles breakdown
    const userRoles = await usersCollection.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();
    
    console.log('\nUsers by role:');
    userRoles.forEach(role => {
      console.log(`${role._id}: ${role.count}`);
    });

    // List some users as a sample
    const users = await usersCollection.find().limit(5).toArray();
    console.log('\nSample users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName || 'No display name'} (${user.username || 'No username'}) - ${user.role || 'No role'}`);
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
countUsers().catch(console.error);