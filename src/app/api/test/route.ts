import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    // Get MongoDB URI from environment variable
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please add your MongoDB URI to .env.local');
    }
    
    console.log('Connecting to MongoDB...');
    
    // Create a new MongoDB client
    const client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');
    
    // Get the database
    const db = client.db('bobe');
    console.log('Connected to database: bobe');
    
    // List collections to verify connection
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Count documents in merchants collection
    const count = await db.collection('merchants').countDocuments();
    console.log(`Found ${count} merchants`);
    
    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Connected to MongoDB successfully',
      collections: collections.map(c => c.name),
      merchantCount: count
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 