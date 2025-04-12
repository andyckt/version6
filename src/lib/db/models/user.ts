import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';

// User role type
export type UserRole = 'user' | 'creator' | 'admin';

// User statistics type
export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

// MongoDB User interface
export interface IUser {
  _id?: ObjectId;         // MongoDB ObjectId
  username: string;       // Unique username (lowercase letters, numbers, underscore)
  email: string;          // User's email address
  displayName: string;    // Display name, can include emojis
  bio: string;            // User biography
  profileImage: string;   // URL to profile image
  coverImage: string;     // URL to cover image
  verified: boolean;      // Verification status
  location: string;       // Current traveling location
  homeLocation: string;   // Home location
  website: string;        // Personal website URL
  joinDate: Date;         // Date user joined
  role: UserRole;         // User role in the platform
  stats: UserStats;       // User statistics
  password?: string;      // Hashed password (for future auth implementation)
  lastActive?: Date;      // Last active timestamp
  emailVerified?: boolean; // Whether email is verified
}

// Collection name
const COLLECTION = 'users';

/**
 * Find a user by username
 */
export async function findUserByUsername(username: string): Promise<IUser | null> {
  const { db } = await connectToDatabase();
  return db.collection<IUser>(COLLECTION).findOne({ username });
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<IUser | null> {
  const { db } = await connectToDatabase();
  return db.collection<IUser>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<IUser | null> {
  const { db } = await connectToDatabase();
  return db.collection<IUser>(COLLECTION).findOne({ email });
}

/**
 * Create a new user
 */
export async function createUser(userData: Omit<IUser, '_id'>): Promise<IUser> {
  const { db } = await connectToDatabase();
  
  // Check if username is already taken
  const existingUsername = await findUserByUsername(userData.username);
  if (existingUsername) {
    throw new Error('Username already taken');
  }
  
  // Check if email is already taken
  const existingEmail = await findUserByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already in use');
  }
  
  const result = await db.collection<IUser>(COLLECTION).insertOne({
    ...userData,
    joinDate: userData.joinDate || new Date(),
    verified: userData.verified || false,
    role: userData.role || 'user',
    stats: userData.stats || { posts: 0, followers: 0, following: 0 },
    emailVerified: false
  });
  
  const newUser = await findUserById(result.insertedId.toString());
  if (!newUser) throw new Error('Failed to create user');
  
  return newUser;
}

/**
 * Update a user
 */
export async function updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
  const { db } = await connectToDatabase();
  
  // If username is being updated, check if it's already taken
  if (userData.username) {
    const existingUsername = await findUserByUsername(userData.username);
    if (existingUsername && existingUsername._id?.toString() !== id) {
      throw new Error('Username already taken');
    }
  }
  
  // If email is being updated, check if it's already taken
  if (userData.email) {
    const existingEmail = await findUserByEmail(userData.email);
    if (existingEmail && existingEmail._id?.toString() !== id) {
      throw new Error('Email already in use');
    }
  }
  
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: userData }
  );
  
  return findUserById(id);
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Get all users (with pagination)
 */
export async function getUsers(page = 1, limit = 10): Promise<{ users: IUser[]; total: number }> {
  const { db } = await connectToDatabase();
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    db.collection<IUser>(COLLECTION)
      .find()
      .sort({ joinDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTION).countDocuments()
  ]);
  
  return { users, total };
}

/**
 * Initialize Users Collection with indexes
 * Call this function during app initialization
 */
export async function initUserCollection(): Promise<void> {
  const { db } = await connectToDatabase();
  
  // Create unique indexes
  await db.collection(COLLECTION).createIndexes([
    { key: { username: 1 }, unique: true },
    { key: { email: 1 }, unique: true },
    { key: { role: 1 }, unique: false }
  ]);
}

/**
 * Get all users using skip and limit for pagination
 */
export async function getAllUsers(limit = 100, skip = 0): Promise<IUser[]> {
  const { db } = await connectToDatabase();
  
  return db.collection<IUser>(COLLECTION)
    .find()
    .sort({ username: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

// CommonJS export for migration script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    findUserByUsername, 
    findUserById, 
    findUserByEmail, 
    createUser, 
    updateUser, 
    deleteUser, 
    getUsers, 
    initUserCollection, 
    getAllUsers 
  };
} 