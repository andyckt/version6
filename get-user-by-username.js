// Script to get detailed information about a specific user by username
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to retrieve and display user information by username
async function getUserByUsername(username) {
  // Check if username is provided
  if (!username) {
    console.error('Error: Username parameter is required');
    console.log('Usage: node get-user-by-username.js <username>');
    process.exit(1);
  }

  // Remove @ prefix if present
  const cleanUsername = username.startsWith('@') ? username.substring(1) : username;

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

    // Find the user by username
    const user = await usersCollection.findOne({ username: cleanUsername });
    
    if (!user) {
      console.log(`User with username "${cleanUsername}" not found.`);
      return;
    }
    
    // Display detailed information for the user
    console.log(`\n👤 User Information for @${user.username}`);
    console.log(`==========================================`);
    console.log(`Display Name: ${user.displayName || 'N/A'}`);
    console.log(`Username: @${user.username}`);
    console.log(`Email: ${user.email || 'N/A'}`);
    console.log(`Role: ${user.role || 'N/A'}`);
    console.log(`Bio: ${user.bio || 'N/A'}`);
    console.log(`Verified: ${user.verified ? 'Yes' : 'No'}`);
    console.log(`Location: ${user.location || 'N/A'}`);
    console.log(`Home Location: ${user.homeLocation || 'N/A'}`);
    console.log(`Website: ${user.website || 'N/A'}`);
    console.log(`Join Date: ${user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}`);
    
    if (user.stats) {
      console.log(`\nStats:`);
      console.log(`  - Posts: ${user.stats.posts || 0}`);
      console.log(`  - Followers: ${user.stats.followers || 0}`);
      console.log(`  - Following: ${user.stats.following || 0}`);
    }
    
    // Check if there are any additional fields worth displaying
    const additionalFields = Object.keys(user).filter(key => 
      !['_id', 'username', 'displayName', 'email', 'role', 'bio', 'verified', 
        'location', 'homeLocation', 'website', 'joinDate', 'stats', 'password'].includes(key)
    );
    
    if (additionalFields.length > 0) {
      console.log(`\nAdditional Information:`);
      additionalFields.forEach(field => {
        console.log(`  - ${field}: ${JSON.stringify(user[field])}`);
      });
    }

  } catch (error) {
    console.error('Error retrieving user:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Get username from command line arguments
const username = process.argv[2] || '1'; // Default to '1' if no argument provided

// Run the function with the provided username
getUserByUsername(username).catch(console.error); 