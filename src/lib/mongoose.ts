import mongoose from 'mongoose';

// Check if MongoDB URI is defined in environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Connection state tracking
let isConnected = false;

/**
 * Connects to mongoose database
 */
export async function connectToDatabase() {
  // If already connected, return
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default mongoose; 