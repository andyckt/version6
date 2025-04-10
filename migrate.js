// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// Collection name
const COLLECTION = 'users';

// Static users data (copied directly to avoid import issues)
const users = [
  {
    id: 101,
    username: "wanderlust_emma",
    displayName: "Emma Chen ✈️",
    bio: "Travel photographer & writer exploring hidden gems in Asia. Based in Shanghai, always planning the next adventure!",
    profileImage: "https://picsum.photos/400/400?random=101",
    coverImage: "https://picsum.photos/1200/400?random=102",
    verified: true,
    location: "Currently: Chengdu, China",
    homeLocation: "Shanghai, China",
    website: "https://emmachentravels.com",
    joinDate: "January 2023",
    role: "creator",
    stats: {
      posts: 87,
      followers: 15400,
      following: 320
    }
  },
  {
    id: 106,
    username: "andyckt123",
    displayName: "Andy Cheung (the founder of Bobe) 🤔",
    bio: "Travel photographer & writer exploring hidden gems in Asia.",
    profileImage: "",
    coverImage: "",
    verified: true,
    location: "Currently: Shanghai, China",
    homeLocation: "Hong Kong, China",
    website: "",
    joinDate: "March 2025",
    role: "user",
    stats: {
      posts: 8,
      followers: 0,
      following: 0
    }
  },
  {
    id: 102,
    username: "backpacker_li",
    displayName: "Li Wei 🎒",
    bio: "Budget traveler exploring China one province at a time. Food lover & hiking enthusiast. Tips & tricks for solo travelers.",
    profileImage: "https://picsum.photos/400/400?random=103",
    coverImage: "https://picsum.photos/1200/400?random=104",
    verified: false,
    location: "Currently: Xi'an, China",
    homeLocation: "Beijing, China",
    website: "https://backpackerli.travel.blog",
    joinDate: "March 2023",
    role: "user",
    stats: {
      posts: 42,
      followers: 3200,
      following: 510
    }
  },
  {
    id: 103,
    username: "luxury_zhao",
    displayName: "Zhao Min 💎",
    bio: "Luxury travel experiences | 5-star hotel reviews | Fine dining | Private tours | Making memories in style",
    profileImage: "https://picsum.photos/400/400?random=105",
    coverImage: "https://picsum.photos/1200/400?random=106",
    verified: true,
    location: "Currently: Sanya, Hainan",
    homeLocation: "Hong Kong SAR",
    website: "https://luxurylifewithzhao.com",
    joinDate: "October 2022",
    role: "creator",
    stats: {
      posts: 68,
      followers: 22800,
      following: 175
    }
  },
  {
    id: 104,
    username: "adventure_yan",
    displayName: "Yan Jackson 🏔️",
    bio: "Outdoor adventurer | Rock climbing | Hiking | Camping | Half Chinese, half American exploring my heritage through adventure",
    profileImage: "https://picsum.photos/400/400?random=107",
    coverImage: "https://picsum.photos/1200/400?random=108",
    verified: false,
    location: "Currently: Zhangjiajie, China",
    homeLocation: "San Francisco, USA",
    website: "https://adventuresofyan.com",
    joinDate: "May 2023",
    role: "user",
    stats: {
      posts: 35,
      followers: 4700,
      following: 283
    }
  },
  {
    id: 105,
    username: "foodie_zhang",
    displayName: "Zhang Wei 🍜",
    bio: "Culinary tour guide in China | Street food explorer | Cooking class host | Ask me about the best local dishes in any Chinese city!",
    profileImage: "https://picsum.photos/400/400?random=109",
    coverImage: "https://picsum.photos/1200/400?random=110",
    verified: true,
    location: "Currently: Guangzhou, China",
    homeLocation: "Chengdu, China",
    website: "https://tastychina.co",
    joinDate: "February 2022",
    role: "creator",
    stats: {
      posts: 103,
      followers: 18600,
      following: 412
    }
  }
];

/**
 * Migrate users to MongoDB
 */
async function migrateUsers() {
  console.log('🚀 Starting user migration...');
  
  // MongoDB client
  let client = null;
  
  try {
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }
    if (!process.env.MONGODB_DB) {
      throw new Error('Missing MONGODB_DB environment variable');
    }
    
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB);
    const usersCollection = db.collection(COLLECTION);
    
    // Create indexes
    await usersCollection.createIndexes([
      { key: { username: 1 }, unique: true },
      { key: { email: 1 }, unique: true }
    ]);
    console.log('✅ Created indexes');
    
    // Convert users
    const mongoUsers = users.map(user => ({
      username: user.username,
      email: `${user.username}@example.com`, // Generating placeholder email
      displayName: user.displayName,
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      verified: user.verified,
      location: user.location,
      homeLocation: user.homeLocation,
      website: user.website,
      joinDate: new Date(user.joinDate), // Convert string date to Date
      role: user.role,
      stats: user.stats,
      emailVerified: true // Mark existing users as verified
    }));
    
    console.log(`🔍 Found ${mongoUsers.length} users to migrate`);
    
    // Insert users one by one
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of mongoUsers) {
      try {
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ username: user.username });
        if (existingUser) {
          console.log(`⏩ User ${user.username} already exists, skipping`);
          continue;
        }
        
        // Insert the new user
        const result = await usersCollection.insertOne(user);
        console.log(`✅ Migrated user: ${user.username} (${result.insertedId})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.username}:`, error.message);
        errorCount++;
      }
    }
    
    // Display summary
    console.log('\n📊 Migration Summary:');
    console.log(`Total users: ${mongoUsers.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log(`Skipped: ${mongoUsers.length - successCount - errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️ Migration completed with errors.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    // Close connection
    if (client) {
      await client.close();
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Run the migration
migrateUsers().catch(console.error); 