// Script to permanently delete a post from the database
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

// Post ID from the previous deletion
const postId = "682b09790504b374bcbcf3e8";
// Post title for verification
const postTitle = "All naked in the bathtub (boys girls seperated)";

async function hardDeletePost() {
  console.log(`Permanently deleting post with ID: ${postId}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const postsCollection = db.collection('posts');
    
    // Find the post by ID to verify before deletion
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      console.log('Post not found in database');
      return;
    }
    
    console.log(`Found post with title: "${post.title}"`);
    
    // Verify it's the correct post
    if (post.title !== postTitle) {
      console.log('Warning: Post title does not match expected title. Aborting deletion.');
      return;
    }
    
    // Permanently delete the post
    const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    
    if (result.deletedCount > 0) {
      console.log('Post permanently deleted from the database');
    } else {
      console.log('Failed to delete post');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
hardDeletePost();