import { MongoClient, Db } from 'mongodb';

/**
 * Global MongoDB connection objects
 */
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB
 * This function connects to MongoDB and returns both the database and client
 * It implements connection pooling by caching the database connection
 */
export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  // Check for environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }
  
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  // Connect to MongoDB
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

/**
 * Disconnect from MongoDB
 * Use this function to close the connection when needed (e.g., in tests)
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

// CommonJS export for migration script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { connectToDatabase, disconnectFromDatabase };
} 