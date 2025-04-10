// Import using CommonJS syntax
const { users } = require('../data/users');
const { createUser, initUserCollection } = require('../lib/db/models/user');
const { connectToDatabase, disconnectFromDatabase } = require('../lib/db/mongodb');

/**
 * Migrate static users to MongoDB
 * This script will take the static user data and insert it into MongoDB
 */
async function migrateUsers() {
  console.log('🚀 Starting user migration...');
  
  try {
    // Initialize the user collection (create indexes)
    await initUserCollection();
    console.log('✅ User collection initialized');
    
    // Connect to the database
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    
    // Convert static users to MongoDB format
    const mongoUsers = users.map((user) => ({
      username: user.username,
      email: `${user.username}@example.com`, // Generating placeholder email since static data doesn't have email
      displayName: user.displayName,
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      verified: user.verified,
      location: user.location,
      homeLocation: user.homeLocation,
      website: user.website,
      joinDate: new Date(user.joinDate), // Convert string date to Date object
      role: user.role,
      stats: user.stats,
      emailVerified: true // Setting as true for existing users
    }));
    
    console.log(`🔍 Found ${mongoUsers.length} users to migrate`);
    
    // Insert users one by one to handle potential errors
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of mongoUsers) {
      try {
        const newUser = await createUser(user);
        console.log(`✅ Migrated user: ${user.username} (${newUser._id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.username}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`Total users: ${mongoUsers.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️ Migration completed with errors.');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close the database connection
    await disconnectFromDatabase();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the migration
migrateUsers().catch(console.error); 