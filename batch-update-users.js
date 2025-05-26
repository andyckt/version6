// Batch update users from a text file
// Format of each entry:
// @ID (current username like @17, @21)
// display name: [New Display Name]
// username: [New Username]

const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// Read and parse the user data file
function parseUserFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    const users = [];
    let currentUser = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Start of a new user entry
      if (line.startsWith('@')) {
        // Save previous user if exists
        if (Object.keys(currentUser).length > 0) {
          users.push(currentUser);
        }
        
        // Start new user object with current username (like @17, @21)
        currentUser = {
          currentUsername: line.trim() // Keep the @ symbol
        };
      } 
      // Parse display name
      else if (line.startsWith('display name:')) {
        currentUser.displayName = line.substring('display name:'.length).trim();
      }
      // Parse new username
      else if (line.startsWith('username:')) {
        currentUser.newUsername = line.substring('username:'.length).trim();
      }
    }
    
    // Add the last user if exists
    if (Object.keys(currentUser).length > 0) {
      users.push(currentUser);
    }
    
    return users;
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    return [];
  }
}

// Update users in the database
async function updateUsers(users) {
  // Check if MongoDB URI and DB name are available
  if (!uri || !dbName) {
    console.error('MongoDB URI or DB name is missing in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    console.log(`Found ${users.length} users to update`);
    
    // Track results
    const results = {
      success: 0,
      failed: 0,
      notFound: 0,
      details: []
    };
    
    // Process each user update
    for (const user of users) {
      try {
        // Extract the username without @ if needed for searching
        const currentUsernameWithoutAt = user.currentUsername.startsWith('@') 
          ? user.currentUsername.substring(1) 
          : user.currentUsername;
          
        const currentUsernameWithAt = user.currentUsername.startsWith('@') 
          ? user.currentUsername 
          : '@' + user.currentUsername;
        
        // Find user by current username (try both with and without @ symbol)
        const userToUpdate = await usersCollection.findOne({ 
          $or: [
            { username: currentUsernameWithAt },         // With @ symbol (@17)
            { username: currentUsernameWithoutAt }       // Without @ symbol (17)
          ]
        });
        
        if (!userToUpdate) {
          console.log(`User with username ${user.currentUsername} not found`);
          results.notFound++;
          results.details.push({
            username: user.currentUsername,
            status: 'not_found',
            message: 'User not found in database'
          });
          continue;
        }
        
        // Check if new username is already taken by another user
        if (user.newUsername) {
          const existingUser = await usersCollection.findOne({ 
            username: user.newUsername,
            _id: { $ne: userToUpdate._id }
          });
          
          if (existingUser) {
            console.log(`Username ${user.newUsername} is already taken by another user`);
            results.failed++;
            results.details.push({
              username: user.currentUsername,
              status: 'failed',
              message: `New username ${user.newUsername} is already taken by another user`
            });
            continue;
          }
        }
        
        // Update user
        const updateData = {};
        if (user.newUsername) updateData.username = user.newUsername;
        if (user.displayName) updateData.displayName = user.displayName;
        
        const updateResult = await usersCollection.updateOne(
          { _id: userToUpdate._id },
          { $set: updateData }
        );
        
        if (updateResult.modifiedCount === 1) {
          console.log(`Updated user ${user.currentUsername} to username: ${user.newUsername}, display name: ${user.displayName}`);
          results.success++;
          results.details.push({
            username: user.currentUsername,
            status: 'success',
            newUsername: user.newUsername,
            displayName: user.displayName
          });
        } else {
          console.log(`No changes needed for user ${user.currentUsername}`);
          results.success++; // Count as success since operation completed
          results.details.push({
            username: user.currentUsername,
            status: 'no_changes',
            message: 'No changes were needed'
          });
        }
      } catch (error) {
        console.error(`Error updating user ${user.currentUsername}:`, error);
        results.failed++;
        results.details.push({
          username: user.currentUsername,
          status: 'error',
          message: error.message
        });
      }
    }
    
    // Print summary
    console.log('\n--- UPDATE SUMMARY ---');
    console.log(`Total users: ${users.length}`);
    console.log(`Successfully updated: ${results.success}`);
    console.log(`Failed to update: ${results.failed}`);
    console.log(`Users not found: ${results.notFound}`);
    
    return results;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Main function
async function main() {
  const filePath = process.argv[2] || 'username.txt';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.log('Usage: node batch-update-users.js [path-to-file]');
    process.exit(1);
  }
  
  console.log(`Reading user data from ${filePath}`);
  const users = parseUserFile(filePath);
  
  if (users.length === 0) {
    console.log('No users found in the file or file format is incorrect');
    process.exit(1);
  }
  
  console.log(`Found ${users.length} users in the file`);
  console.log('Preview of first 3 users:');
  console.log(users.slice(0, 3));
  
  // Confirm before proceeding
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\nDo you want to proceed with the update? (yes/no): ', async (answer) => {
    readline.close();
    
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('\nUpdating users...');
      await updateUsers(users);
    } else {
      console.log('Update cancelled');
    }
  });
}

// Run the script
main().catch(console.error); 