// Script to update specific users with an existing profile image
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to parse username list from file
function parseUsernameFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract usernames (text after @ symbol)
    const usernames = lines
      .map(line => {
        const match = line.match(/@([a-zA-Z0-9_]+)/);
        return match ? match[1] : null;
      })
      .filter(username => username !== null && username !== ''); // Filter out null and empty values
    
    return usernames;
  } catch (error) {
    console.error('Error reading username file:', error);
    return [];
  }
}

// Function to update specific users with existing image URLs
async function updateUsersWithExistingImage(usernameFile, microUrl, mediaUrl, originalUrl) {
  // Check if username file exists
  if (!fs.existsSync(usernameFile)) {
    console.error(`Error: Username file not found at ${usernameFile}`);
    process.exit(1);
  }

  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
    process.exit(1);
  }
  
  // Check if we have all the necessary URLs
  if (!microUrl || !mediaUrl || !originalUrl) {
    console.error('Error: All image URLs (micro, media, original) are required');
    process.exit(1);
  }
  
  // Parse usernames
  const usernames = parseUsernameFile(usernameFile);
  if (usernames.length === 0) {
    console.error('No valid usernames found in the file');
    process.exit(1);
  }
  
  console.log(`Found ${usernames.length} usernames to update:`);
  console.log(usernames.join(', '));
  
  // Create a new MongoDB client
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    // Access the database and collection
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Find the specified users
    const usersToUpdate = await usersCollection.find({
      username: { $in: usernames }
    }).toArray();
    
    // Check if all usernames were found
    const foundUsernames = usersToUpdate.map(user => user.username);
    const missingUsernames = usernames.filter(username => !foundUsernames.includes(username));
    
    console.log(`Found ${usersToUpdate.length} of ${usernames.length} users in the database`);
    
    if (missingUsernames.length > 0) {
      console.log('Missing usernames:', missingUsernames.join(', '));
    }
    
    if (usersToUpdate.length === 0) {
      console.log('No matching users found to update');
      return;
    }
    
    // Update all specified users with the existing avatar URLs
    const updateResult = await usersCollection.updateMany(
      { username: { $in: usernames } },
      {
        $set: {
          profileImage: {
            micro: microUrl,
            media: mediaUrl,
            original: originalUrl
          }
        }
      }
    );
    
    console.log(`Successfully updated ${updateResult.modifiedCount} users with the existing avatar`);
    
    // List updated users
    console.log('\nUpdated users:');
    usersToUpdate.forEach(user => {
      console.log(`@${user.username} - ${user.displayName || user.username}`);
    });
    
  } catch (error) {
    console.error('Error updating user avatars:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Check if required arguments are provided
if (process.argv.length < 5) {
  console.error('Error: Missing required arguments');
  console.log('Usage: node update-with-existing-image.js <username-file> <micro-url> <media-url> <original-url>');
  process.exit(1);
}

// Get command line arguments
const usernameFile = process.argv[2];
const microUrl = process.argv[3];
const mediaUrl = process.argv[4];
const originalUrl = process.argv[5] || mediaUrl; // Fall back to media URL if original not provided

// Run the function
updateUsersWithExistingImage(usernameFile, microUrl, mediaUrl, originalUrl).catch(console.error); 