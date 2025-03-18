import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to generate a user ID
const generateUserId = () => {
  return Math.floor(100000000 + Math.random() * 900000000);
};

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

// Helper to write entries
const saveEntries = (entries: any[]) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(entries, null, 2), 'utf8');
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { email, username } = await request.json();
    
    // Validate the data
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }
    
    // Validate username format (only English letters and numbers)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain English letters and numbers' },
        { status: 400 }
      );
    }
    
    // Get current entries
    const entries = getEntries();
    
    // Check if email already exists
    if (entries.some((entry: any) => entry.email === email)) {
      return NextResponse.json(
        { error: 'This email is already on the waiting list' },
        { status: 400 }
      );
    }
    
    // Check if username is already taken
    if (entries.some((entry: any) => entry.username === username)) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 400 }
      );
    }
    
    // Generate a user ID for this entry
    const userId = generateUserId();
    
    // Create a new entry
    const newEntry = {
      id: userId,
      email,
      username,
      position: entries.length + 1,
      timestamp: new Date().toISOString()
    };
    
    // Add to our entries and save
    entries.push(newEntry);
    saveEntries(entries);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waiting list',
      data: {
        username,
        position: entries.length,
        userId
      }
    });
    
  } catch (error) {
    console.error('Error in waiting list API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This endpoint would be admin-protected in a real app
  // For now, just return the count
  const entries = getEntries();
  
  return NextResponse.json({
    count: entries.length
  });
} 