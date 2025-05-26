// Script to update profile image for @katealwyn user with existing avatar from odd-numbered users
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Function to update profile image for @katealwyn using an existing avatar
async function updateKateAlwynAvatar() {
  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
    process.exit(1);
  }
  
  // Create a new MongoDB client
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    // Access the database and collection
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Find a user with an odd-numbered username to get their profile image
    // This regex matches usernames that are numbers
    const numericUsernameUsers = await usersCollection.find({
      username: /^\d+$/
    }).toArray();
    
    // Filter for odd-numbered usernames
    const oddNumberUsers = numericUsernameUsers.filter(user => {
      const usernameNumber = parseInt(user.username, 10);
      return usernameNumber % 2 !== 0; // Odd numbers have remainder when divided by 2
    });
    
    if (oddNumberUsers.length === 0) {
      console.error('No users with odd-numbered usernames found');
      process.exit(1);
    }
    
    // Get the first odd-numbered user's profile image
    const sourceUser = oddNumberUsers[0];
    
    if (!sourceUser.profileImage || typeof sourceUser.profileImage === 'string') {
      console.error('Source user does not have the expected profile image format');
      process.exit(1);
    }
    
    const profileImage = sourceUser.profileImage;
    console.log(`Using profile image from user @${sourceUser.username}:`);
    console.log('- Micro (40x40):', profileImage.micro);
    console.log('- Media (300x300):', profileImage.media);
    
    // Find the user with username katealwyn
    const kateAlwyn = await usersCollection.findOne({ username: 'katealwyn' });
    
    if (!kateAlwyn) {
      console.error('User @katealwyn not found');
      process.exit(1);
    }
    
    console.log(`Found user: @${kateAlwyn.username} - ${kateAlwyn.displayName || kateAlwyn.username}`);
    
    // Update katealwyn with the existing profile image URLs
    const updateResult = await usersCollection.updateOne(
      { _id: kateAlwyn._id },
      {
        $set: {
          profileImage: {
            micro: profileImage.micro,
            media: profileImage.media,
            original: profileImage.original
          }
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`Successfully updated avatar for @katealwyn with image from @${sourceUser.username}`);
    } else {
      console.log('No changes were made to the user record');
    }
    
  } catch (error) {
    console.error('Error updating avatar for @katealwyn:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
updateKateAlwynAvatar().catch(console.error); 