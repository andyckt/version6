// Script to update profile images for all users with odd-numbered usernames
const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload profile image using the API
async function uploadProfileImage(imagePath) {
  console.log(`Uploading image: ${imagePath}`);
  
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(imagePath);
    const formData = new FormData();
    
    // Add the file to the form data
    formData.append('file', fileBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/jpeg', // Adjust if needed based on your image type
    });
    
    // Specify that this is a profile image upload
    formData.append('type', 'profile');
    
    // Make the API request
    const response = await fetch('http://localhost:3000/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    
    // Return the URLs for both variants
    return {
      micro: data.micro,
      media: data.media,
      original: data.url
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Function to update profile images for users with odd-numbered usernames
async function updateOddUserAvatars(imagePath) {
  // Check if image file exists
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: Image file not found at ${imagePath}`);
    process.exit(1);
  }

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
    
    // Upload the image using our API endpoint
    const imageUrls = await uploadProfileImage(imagePath);
    console.log('Image variants created:');
    console.log('- Micro (40x40):', imageUrls.micro);
    console.log('- Media (300x300):', imageUrls.media);
    
    // Find users with odd-numbered usernames
    // This regex matches usernames that are numbers, then we'll filter for odd ones in JS
    const numericUsernameUsers = await usersCollection.find({
      username: /^\d+$/
    }).toArray();
    
    // Filter for odd-numbered usernames
    const oddNumberUsers = numericUsernameUsers.filter(user => {
      const usernameNumber = parseInt(user.username, 10);
      return usernameNumber % 2 !== 0; // Odd numbers have remainder when divided by 2
    });
    
    console.log(`Found ${oddNumberUsers.length} users with odd-numbered usernames`);
    
    if (oddNumberUsers.length === 0) {
      console.log('No users to update');
      return;
    }
    
    // Update all odd-numbered username users with the new profile image URLs
    const updateResult = await usersCollection.updateMany(
      { 
        _id: { 
          $in: oddNumberUsers.map(user => user._id) 
        } 
      },
      {
        $set: {
          profileImage: {
            micro: imageUrls.micro,
            media: imageUrls.media,
            original: imageUrls.original
          }
        }
      }
    );
    
    console.log(`Successfully updated ${updateResult.modifiedCount} users with odd-numbered usernames`);
    
    // List updated users
    console.log('\nUpdated users:');
    oddNumberUsers.forEach(user => {
      console.log(`@${user.username} - ${user.displayName || user.username}`);
    });
    
  } catch (error) {
    console.error('Error updating odd-numbered username avatars:', error);
  } finally {
    // Close the client connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Check if image path is provided as command line argument
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('Error: Please provide the path to the female avatar image');
  console.log('Usage: node update-odd-usernames-avatar.js <path-to-image>');
  process.exit(1);
}

// Run the function with the provided image path
updateOddUserAvatars(imagePath).catch(console.error); 