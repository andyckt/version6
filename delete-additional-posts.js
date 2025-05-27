// Script to permanently delete additional posts from the database
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

// Connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// Check if MongoDB connection string exists
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Check if MongoDB database name exists
if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

// Additional post URLs to delete
const additionalUrls = [
  'https://www.bobe.co/post/682595bd2ef94bc1f8740b8d'
];

// Extract post IDs from URLs
const postIds = additionalUrls.map(url => {
  const parts = url.split('/');
  return parts[parts.length - 1];
});

async function deleteAdditionalPosts() {
  console.log(`Preparing to delete ${postIds.length} additional posts`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const postsCollection = db.collection('posts');
    
    let deletedCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;
    
    // Process each post ID
    for (const postId of postIds) {
      try {
        console.log(`Processing post ID: ${postId}`);
        
        // Find the post by ID to verify before deletion
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
        
        if (!post) {
          console.log(`Post not found: ${postId}`);
          notFoundCount++;
          continue;
        }
        
        console.log(`Found post with title: "${post.title}"`);
        
        // Permanently delete the post
        const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
        
        if (result.deletedCount > 0) {
          console.log(`Successfully deleted post: ${postId}`);
          deletedCount++;
        } else {
          console.log(`Failed to delete post: ${postId}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing post ${postId}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n--- Deletion Summary ---');
    console.log(`Total posts processed: ${postIds.length}`);
    console.log(`Successfully deleted: ${deletedCount}`);
    console.log(`Not found: ${notFoundCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
deleteAdditionalPosts(); 