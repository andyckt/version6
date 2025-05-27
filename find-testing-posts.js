// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function findTestingPosts() {
  console.log('🔍 Searching for posts with titles containing "testing"...');

  // Check environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI environment variable');
    process.exit(1);
  }
  if (!process.env.MONGODB_DB) {
    console.error('❌ Missing MONGODB_DB environment variable');
    process.exit(1);
  }

  let client = null;

  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB);

    // Find posts with titles containing "testing" (case-insensitive)
    const posts = await db.collection('posts').find({
        title: { $regex: /test(ing|er|case|bed|ng|in|ify)?/i } // Matches "test", "testing", "tester", etc.
      }).toArray();

    if (posts.length === 0) {
      console.log('✅ No posts found with titles containing "testing".');
      return;
    }

    console.log(`✅ Found ${posts.length} post(s) with titles containing "testing":`);
    posts.forEach(post => {
      console.log(`- ID: ${post._id}, Title: ${post.title}`);
    });

  } catch (error) {
    console.error('❌ Error fetching posts:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Execute the function
findTestingPosts();