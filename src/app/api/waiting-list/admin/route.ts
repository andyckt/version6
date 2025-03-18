import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to our "database" (JSON file)
const DB_PATH = path.join(process.cwd(), 'waiting-list.json');

// Helper to read the current entries
const getEntries = () => {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  
  const fileContents = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(fileContents);
};

// In a real app, this would be protected by authentication
export async function GET(request: NextRequest) {
  try {
    // Get the waiting list entries
    const entries = getEntries();
    
    // Return all entries with the count
    return NextResponse.json({
      count: entries.length,
      entries
    });
  } catch (error) {
    console.error('Error in admin API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 