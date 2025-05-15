// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');

async function getPostDetails(postId) {
  console.log(`🔍 Fetching post details for ID: ${postId}`);
  
  // Check environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI environment variable');
    process.exit(1);
  }
  if (!process.env.MONGODB_DB) {
    console.error('❌ Missing MONGODB_DB environment variable');
    process.exit(1);
  }
  
  // Validate postId
  if (!ObjectId.isValid(postId)) {
    console.error('❌ Invalid post ID format');
    process.exit(1);
  }
  
  let client = null;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB);
    
    // Use aggregation to join collections similar to the getPostWithDetails function
    const posts = await db.collection('posts').aggregate([
      { $match: { _id: new ObjectId(postId) } },
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
      console.error(`❌ Post not found with ID: ${postId}`);
      return null;
    }
    
    const post = posts[0];
    
    // Format the result for better readability
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      location: post.location,
      hashtags: post.hashtags,
      created: post.created,
      updated: post.updated,
      status: post.status,
      likes: post.likes,
      views: post.views,
      bookmarks: post.bookmarks,
      user: post.user ? {
        id: post.user._id.toString(),
        username: post.user.username,
        displayName: post.user.displayName,
        profileImage: post.user.profileImage,
        verified: post.user.verified
      } : null,
      media: post.mediaDetails.map(media => ({
        id: media._id.toString(),
        type: media.type || 'image',
        sortOrder: media.sortOrder,
        variants: media.variants
      })),
      taggedAccounts: post.taggedAccounts
    };
    
    console.log('✅ Post details found:');
    console.log(JSON.stringify(formattedPost, null, 2));
    
    return formattedPost;
  } catch (error) {
    console.error('❌ Error fetching post details:', error);
    return null;
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Check command line arguments
if (process.argv.length < 3) {
  console.error('❌ Please provide a post ID as an argument');
  console.log('Usage: node get-post-details.js <postId>');
  process.exit(1);
}

// Get post ID from command line arguments
const postId = process.argv[2];

// Execute the function
getPostDetails(postId); 