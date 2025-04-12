import { MongoClient, Db } from 'mongodb';

// Connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || '';

// Check if MongoDB connection string exists
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Check if MongoDB database name exists
if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// Cache the MongoDB connection to reuse it across requests
let cached: CachedConnection = {
  client: null,
  db: null,
  promise: null,
};

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  // If there's no cached promise, create a new one
  if (!cached.promise) {
    const opts = {
      // Connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Create a new MongoClient instance
    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }

  // Wait for the connection to be established
  try {
    const { client, db } = await cached.promise;
    cached.client = client;
    cached.db = db;
    return { client, db };
  } catch (error) {
    cached.promise = null;
    throw error;
  }
} 