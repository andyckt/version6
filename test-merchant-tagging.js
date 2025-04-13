// Script to test merchant tagging functionality
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to test merchant search for tagging
async function testMerchantTagging() {
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

    // Access the database and collections
    const db = client.db(dbName);
    const merchantsCollection = db.collection('merchants');
    const usersCollection = db.collection('users');

    // 1. Test search functionality for merchants
    console.log('\n----- Testing Merchant Search -----');
    const searchQuery = 'restaurant'; // Example search term
    const merchants = await merchantsCollection
      .find({
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { displayName: { $regex: searchQuery, $options: 'i' } },
          { merchantType: { $regex: searchQuery, $options: 'i' } }
        ]
      })
      .project({
        _id: 1,
        username: 1,
        displayName: 1,
        verified: 1,
        accountType: 1,
        merchantType: 1
      })
      .limit(5)
      .toArray();

    console.log(`Found ${merchants.length} merchants matching "${searchQuery}"`);
    merchants.forEach((merchant, index) => {
      console.log(`${index + 1}. ${merchant.displayName} (@${merchant.username}) - ${merchant.merchantType}`);
    });

    // 2. Test search functionality for users
    console.log('\n----- Testing User Search -----');
    const userSearchQuery = 'a'; // Example search term
    const users = await usersCollection
      .find({
        $or: [
          { username: { $regex: userSearchQuery, $options: 'i' } },
          { displayName: { $regex: userSearchQuery, $options: 'i' } }
        ]
      })
      .project({
        _id: 1,
        username: 1,
        displayName: 1,
        profileImage: 1,
        verified: 1
      })
      .limit(5)
      .toArray();

    console.log(`Found ${users.length} users matching "${userSearchQuery}"`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName} (@${user.username})`);
    });

    // 3. Simulate post creation with tagged accounts
    console.log('\n----- Simulating Post Creation with Tagged Accounts -----');
    
    // Sample post data
    const samplePost = {
      title: "Test Post with Merchant Tags",
      description: "This is a test post showing how to tag both users and merchants",
      userId: users[0]?._id || "65f6ef3e2e7af125f2f9aa88", // Use first user or a default
      username: users[0]?.username || "testuser",
      createdAt: new Date(),
      
      // Content categorization
      hashtags: ["test", "merchants", "tagging"],
      location: "Shanghai",
      
      // Tagged accounts - mix of users and merchants
      taggedAccounts: [
        // A user
        { 
          username: users[0]?.username || "testuser", 
          accountType: "user"
        },
        // A merchant
        { 
          username: merchants[0]?.username || "familymart", 
          accountType: merchants[0]?.accountType || "restaurant"
        }
      ],
      
      // Media references (simplified for test)
      media: []
    };
    
    console.log("Sample post with tags:", JSON.stringify(samplePost, null, 2));

    console.log('\n----- Test Complete -----');

  } catch (error) {
    console.error('Error during merchant tagging test:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test function
testMerchantTagging().catch(console.error); 