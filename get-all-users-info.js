// Script to get detailed information about all users
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to retrieve and display all user information
async function getAllUsersInfo() {
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

    // Get all users
    const users = await usersCollection.find().toArray();
    console.log(`\n📊 Total users: ${users.length}\n`);
    
    // Display detailed information for each user
    users.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.displayName}`);
      console.log(`-------------------------------------------`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Bio: ${user.bio}`);
      console.log(`Verified: ${user.verified ? 'Yes' : 'No'}`);
      console.log(`Location: ${user.location}`);
      console.log(`Home Location: ${user.homeLocation}`);
      console.log(`Website: ${user.website || 'N/A'}`);
      console.log(`Join Date: ${user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}`);
      
      if (user.stats) {
        console.log(`Stats:`);
        console.log(`  - Posts: ${user.stats.posts}`);
        console.log(`  - Followers: ${user.stats.followers}`);
        console.log(`  - Following: ${user.stats.following}`);
      }
      
      console.log(`\n`);
    });

  } catch (error) {
    console.error('Error retrieving users:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
getAllUsersInfo().catch(console.error);