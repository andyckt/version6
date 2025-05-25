// Script to get the total number of users
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// Check if MongoDB connection string exists
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Check if MongoDB database name exists
if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

async function getTotalUsers() {
  console.log('Getting total number of users in the database...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const usersCollection = db.collection('users');
    
    // Count total users
    const totalUsers = await usersCollection.countDocuments();
    console.log(`\n📊 Total users in the database: ${totalUsers}`);
    
    // Get user roles distribution
    const roleStats = await usersCollection.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();
    
    console.log('\nUser roles distribution:');
    roleStats.forEach(role => {
      console.log(`- ${role._id || 'undefined'}: ${role.count} users`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the function
getTotalUsers(); 