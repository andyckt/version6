// Script to add users from @61 to @90
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to add users from @61 to @90
async function addUsers() {
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
    
    // Array to hold all new users
    const newUsers = [];
    
    // Create users from @61 to @90
    for (let i = 61; i <= 90; i++) {
      const username = `${i}`;
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        console.log(`User @${username} already exists, skipping...`);
        continue;
      }
      
      newUsers.push({
        username,
        displayName: `Test User ${i}`,
        email: `testuser${i}@example.com`,
        role: 'user',
        verified: true,
        joinDate: new Date(),
        stats: {
          posts: 0,
          followers: 0,
          following: 0
        }
      });
    }
    
    // Insert new users
    if (newUsers.length > 0) {
      const result = await usersCollection.insertMany(newUsers);
      console.log(`Successfully added ${result.insertedCount} new users`);
      
      // List newly added users
      console.log('\nNewly added users:');
      newUsers.forEach(user => {
        console.log(`@${user.username} - ${user.displayName}`);
      });
    } else {
      console.log('No new users were added');
    }

  } catch (error) {
    console.error('Error adding users:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addUsers().catch(console.error); 