import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/db/models/user';

// Function to generate a user ID
const generateUserId = () => {
  return Math.floor(100000000 + Math.random() * 900000000);
};

// Path to our "database" (JSON file) - kept for backward compatibility
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

// Email sending function
const sendConfirmationEmail = async (email: string, username: string) => {
  try {
    let transporter;
    
    // Check if we should use test email (Ethereal) or production SMTP
    if (process.env.USE_TEST_EMAIL === 'true') {
      // Create a testing account with Ethereal Email (for development)
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } else {
      // Use production SMTP configuration from environment variables
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: parseInt(process.env.EMAIL_PORT || '587') === 465, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Bobe.co" <noreply@travelapp.com>',
      to: email,
      subject: "You're on the Bobe.co Waitlist! 🌍✨",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 24px; margin: 0 0 5px 0;">You're on the list!</h1>
            <p style="color: #666; margin: 0;">Thanks for joining our waitlist</p>
          </div>
          
          <div style="background-color: #ffd10015; border-left: 3px solid #ffd100; padding: 15px; margin-bottom: 25px; border-radius: 3px;">
            <p style="color: #333; font-size: 16px; margin: 0; text-align: center;">
              We've reserved <strong style="color: #111; font-weight: bold;">@${username}</strong> for you!
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            We're working hard to build something amazing, and we're excited to have you join us on this journey. You'll be one of the first to know when we launch to public.
          </p>
          
          <div style="border-top: 1px solid #eee; margin-top: 25px; padding-top: 20px;">
            <p style="color: #555; line-height: 1.5; font-style: italic; margin: 0;">
              Have questions? Just reply to this email and we'll get back to you!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          &copy; 2025 Bobe.co. All rights reserved.
        </div>
      </div>
      `
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    // Log the Ethereal URL to view the email (only in development)
    if (process.env.USE_TEST_EMAIL === 'true') {
      console.log("Test email sent: %s", nodemailer.getTestMessageUrl(info));
    } else {
      console.log("Email sent to:", email);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
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
    
    // Validate username format (only lowercase letters, numbers, and underscores)
    if (!/^[a-z0-9_]{1,15}$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain lowercase letters, numbers, and underscores (max 15 characters)' },
        { status: 400 }
      );
    }
    
    // Check if username is already taken in MongoDB
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 400 }
      );
    }
    
    // Check if email is already in use in MongoDB
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email is already on the waiting list' },
        { status: 400 }
      );
    }
    
    // Keep the legacy JSON file updated for backward compatibility
    // Get current entries
    const entries = getEntries();
    
    // Double-check against the legacy file system
    if (entries.some((entry: any) => entry.email === email)) {
      return NextResponse.json(
        { error: 'This email is already on the waiting list' },
        { status: 400 }
      );
    }
    
    if (entries.some((entry: any) => entry.username === username)) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 400 }
      );
    }
    
    // Generate a user ID for this entry
    const userId = generateUserId();
    
    // Create a new entry for legacy storage
    const newEntry = {
      id: userId,
      email,
      username,
      timestamp: new Date().toISOString()
    };
    
    // Add to our entries and save to JSON file
    entries.push(newEntry);
    saveEntries(entries);
    
    // Create a new user in MongoDB
    const now = new Date();
    await createUser({
      username,
      email,
      displayName: username, // Default display name to username
      bio: '', // Empty bio
      profileImage: '', // Empty profile image
      coverImage: '', // Empty cover image
      verified: false,
      location: '',
      homeLocation: '',
      website: '',
      joinDate: now,
      role: 'user',
      stats: {
        posts: 0,
        followers: 0,
        following: 0
      },
      emailVerified: false
    });
    
    // Send confirmation email
    await sendConfirmationEmail(email, username);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waiting list',
      data: {
        username,
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