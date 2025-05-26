// Script to update specific users with a default male avatar
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

// Function to update specific users with a new avatar
async function updateSpecificUsers(usernameFile, imagePath) {
  // Check if files exist
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: Image file not found at ${imagePath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(usernameFile)) {
    console.error(`Error: Username file not found at ${usernameFile}`);
    process.exit(1);
  }

  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
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
    
    // Upload the image using our API endpoint
    const imageUrls = await uploadProfileImage(imagePath);
    console.log('Image variants created:');
    console.log('- Micro (40x40):', imageUrls.micro);
    console.log('- Media (300x300):', imageUrls.media);
    
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
    
    // Update all specified users with the new avatar
    const updateResult = await usersCollection.updateMany(
      { username: { $in: usernames } },
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
    
    console.log(`Successfully updated ${updateResult.modifiedCount} users with the new avatar`);
    
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
if (process.argv.length < 4) {
  console.error('Error: Missing required arguments');
  console.log('Usage: node update-specific-users-avatar.js <username-file> <image-path>');
  process.exit(1);
}

// Get command line arguments
const usernameFile = process.argv[2];
const imagePath = process.argv[3];

// Run the function
updateSpecificUsers(usernameFile, imagePath).catch(console.error); 