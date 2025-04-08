import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      status: 'connected',
      collections: collections.map(c => c.name),
      message: 'MongoDB connection successful'
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to MongoDB',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 