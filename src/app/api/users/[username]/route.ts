import { NextRequest, NextResponse } from 'next/server';
import { findUserByUsername, updateUser } from '@/lib/db/models/user';

/**
 * GET /api/users/[username]
 * Retrieves a specific user by username
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    // Fetch user from database
    const user = await findUserByUsername(username);
    
    // If user not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data (excluding sensitive fields)
    return NextResponse.json({
      ...user,
      _id: user._id?.toString(), // Convert ObjectId to string
      password: undefined // Remove password from response
    });
  } catch (error) {
    console.error(`Error fetching user ${params.username}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[username]
 * Updates a specific user by username
 * Note: In a real app, this should be protected by authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    // Find user first
    const user = await findUserByUsername(username);
    
    // If user not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // In a real app, validate user has permission to update this user
    // and validate the update data more thoroughly
    
    // Validate username format if being updated
    if (data.username && data.username !== username) {
      // Simple validation: alphanumeric and underscore only
      if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, and underscores' },
          { status: 400 }
        );
      }
    }
    
    // Don't allow updating sensitive fields
    const allowedUpdates = [
      'displayName', 'bio', 'profileImage', 'coverImage', 
      'location', 'homeLocation', 'website', 'username', 'verified'
    ];
    
    const updates = Object.entries(data)
      .filter(([key]) => allowedUpdates.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    // Update user
    const updatedUser = await updateUser(user._id!.toString(), updates);
    
    // Return updated user
    return NextResponse.json({
      ...updatedUser,
      _id: updatedUser?._id?.toString(),
      password: undefined
    });
  } catch (error) {
    console.error(`Error updating user ${params.username}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 