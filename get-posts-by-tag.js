// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function getPostsByTag(merchantUsername) {
  console.log(`🔍 Fetching posts that tag @${merchantUsername}`);
  
  // Check environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI environment variable');
    process.exit(1);
  }
  if (!process.env.MONGODB_DB) {
    console.error('❌ Missing MONGODB_DB environment variable');
    process.exit(1);
  }
  
  // Validate merchant username
  if (!merchantUsername || typeof merchantUsername !== 'string') {
    console.error('❌ Invalid merchant username');
    process.exit(1);
  }
  
  let client = null;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB);
    
    // Find posts that have the merchant in taggedAccounts
    const posts = await db.collection('posts').aggregate([
      { 
        $match: { 
          taggedAccounts: { $elemMatch: { username: merchantUsername } } 
        } 
      },
      // Lookup user information
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$userId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { 
              _id: 1, 
              username: 1, 
              displayName: 1, 
              profileImage: 1, 
              verified: 1 
            }}
          ],
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
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
      // Add fields to transform the media array with sort order
      {
        $addFields: {
          mediaDetails: {
            $map: {
              input: '$media',
              as: 'mediaRef',
              in: {
                $mergeObjects: [
                  { sortOrder: '$$mediaRef.sortOrder' },
                  { $arrayElemAt: [
                    '$mediaItems',
                    { $indexOfArray: [
                      { $map: { input: '$mediaItems', as: 'item', in: { $toString: '$$item._id' } } },
                      { $toString: '$$mediaRef.mediaId' }
                    ]}
                  ]}
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          // Sort the media details by sortOrder
          mediaDetails: { $sortArray: { input: '$mediaDetails', sortBy: { sortOrder: 1 } } }
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
          user: 1,
          mediaDetails: 1,
          taggedAccounts: 1
        }
      }
    ]).toArray();
    
    if (posts.length === 0) {
      console.log(`ℹ️ No posts found that tag @${merchantUsername}`);
      return [];
    }
    
    // Format the results for better readability
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      location: post.location,
      hashtags: post.hashtags,
      created: post.created,
      updated: post.updated,
      status: post.status,
      likes: post.likes || 0,
      views: post.views || 0,
      bookmarks: post.bookmarks || 0,
      user: post.user ? {
        id: post.user._id.toString(),
        username: post.user.username,
        displayName: post.user.displayName,
        profileImage: post.user.profileImage,
        verified: post.user.verified
      } : null,
      media: post.mediaDetails.map(media => ({
        id: media._id ? media._id.toString() : null,
        type: media.type || 'image',
        sortOrder: media.sortOrder,
        variants: media.variants
      })).filter(m => m.id !== null),
      taggedAccounts: post.taggedAccounts
    }));
    
    console.log(`✅ Found ${formattedPosts.length} posts that tag @${merchantUsername}`);
    console.log(JSON.stringify(formattedPosts, null, 2));
    
    return formattedPosts;
  } catch (error) {
    console.error('❌ Error fetching posts by tag:', error);
    return [];
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Get the merchant username from command line arguments
const merchantUsername = process.argv[2]?.replace('@', '') || 'wigglewiggle';

// Execute the function
getPostsByTag(merchantUsername).catch(console.error);

// Usage examples:
// node get-posts-by-tag.js wigglewiggle
// node get-posts-by-tag.js @wigglewiggle 