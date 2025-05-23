require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function getPostsByUsername(username) {
  console.log(`🔍 Fetching posts by user @${username}`);
  
  // Get MongoDB connection string from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB;
  
  console.log(`MongoDB URI defined: ${!!MONGODB_URI}`);
  console.log(`MongoDB DB defined: ${!!MONGODB_DB}`);
  
  if (!MONGODB_URI || !MONGODB_DB) {
    console.error('❌ MongoDB connection information missing in environment variables');
    process.exit(1);
  }
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(MONGODB_DB);
    
    // First, find the user to get their ID
    const user = await db.collection('users').findOne({ username });
    
    if (!user) {
      console.log(`❌ User @${username} not found`);
      return;
    }
    
    console.log(`📌 Found user: ${user.displayName || username} (ID: ${user._id})`);
    
    // Find posts by this user's ID
    const posts = await db.collection('posts').aggregate([
      { 
        $match: { 
          userId: user._id 
        } 
      },
      // Lookup media information
      {
        $lookup: {
          from: 'media',
          let: { mediaIds: '$media.mediaId' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', { $map: { input: '$$mediaIds', as: 'mid', in: { $toObjectId: '$$mid' } } }] } } },
            { $project: { 
              _id: 1, 
              type: 1, 
              width: 1, 
              height: 1, 
              aspectRatio: 1, 
              variants: 1 
            }}
          ],
          as: 'mediaItems'
        }
      },
      // Project to shape the final result
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          hashtags: 1,
          created: 1,
          updated: 1,
          status: 1,
          likes: 1,
          views: 1,
          bookmarks: 1,
          mediaItems: 1,
          taggedAccounts: 1
        }
      }
    ]).toArray();
    
    if (posts.length === 0) {
      console.log(`ℹ️ No posts found for user @${username}`);
      return;
    }
    
    console.log(`\n📝 Found ${posts.length} posts by @${username}:`);
    console.log('='.repeat(50));
    
    posts.forEach((post, index) => {
      console.log(`Post #${index + 1}:`);
      console.log(`ID: ${post._id}`);
      console.log(`Title: ${post.title}`);
      console.log(`Description: ${post.description || 'N/A'}`);
      console.log(`Location: ${post.location || 'N/A'}`);
      console.log(`Hashtags: ${post.hashtags?.join(', ') || 'None'}`);
      console.log(`Created: ${post.created ? new Date(post.created).toLocaleString() : 'N/A'}`);
      console.log(`Status: ${post.status || 'N/A'}`);
      console.log(`Engagement: ${post.likes || 0} likes, ${post.views || 0} views, ${post.bookmarks || 0} bookmarks`);
      
      if (post.mediaItems && post.mediaItems.length > 0) {
        console.log(`Media: ${post.mediaItems.length} items`);
        post.mediaItems.forEach((media, mediaIndex) => {
          console.log(`  - Media #${mediaIndex + 1}: ${media.type}, ${media.width}x${media.height}`);
        });
      } else {
        console.log('Media: None');
      }
      
      if (post.taggedAccounts && post.taggedAccounts.length > 0) {
        console.log(`Tagged accounts: ${post.taggedAccounts.map(acc => acc.username).join(', ')}`);
      } else {
        console.log('Tagged accounts: None');
      }
      
      console.log('-'.repeat(50));
    });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the function with username "59"
getPostsByUsername('59'); 