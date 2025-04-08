import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Re-export all merchant types from our existing type definitions
export * from '@/data/merchants';

// Define enum for profile interfaces (same as current implementation)
export enum ProfileInterface {
  SingleShopRestaurant = 1,
  MultipleBranchMerchant = 2,
  Attraction = 3,
  Street = 4,
  Building = 5,
  Hotel = 6,
  BarClub = 7
}

// Account types
export type AccountType = 'user' | 'restaurant' | 'hotel' | 'attraction' | 'barandclub' | 'shopping';

// MongoDB document interface extending the base merchant
export interface MerchantDocument {
  _id: ObjectId;
  accountType: AccountType;
  username: string;
  displayName: string;
  verified: boolean;
  joinDate: string;
  recommended: boolean;
  hashtags: string[];
  district: string[];
  merchantType: string;
  url?: string;
  stats: {
    mentionedPosts: number;
    followers: number;
    following: number;
  };
  profileInterface: ProfileInterface;
  
  // Fields that vary based on merchant type
  location?: LocationInfo;
  businessInfo?: BusinessInfo;
  pricePerPerson?: number;
  pricePerNight?: number;
  ticketPrice?: number;
  languagesSpoken?: string[];
  michelinStars?: number;
  branches?: (LocationInfo & BusinessInfo)[];
  amenities?: string[];
  stars?: number;
  clubCategories?: string[];
  entryFee?: number;
  floors?: number;
  featuredStores?: string[];
  nearbyMidnightFood?: string[];
  
  // Add fields for optimizing queries
  lastUpdated: Date;
  isActive: boolean;
}

// Helper types
export interface LocationInfo {
  chineseAddress: string;
  englishAddress: string;
  nearestSubway: string;
  telephone?: string[];
  branchDistrict: string;
  location?: { type: 'Point', coordinates: [number, number] }; // GeoJSON format
}

export interface OpeningHoursItem {
  day: string;
  hours: string[] | string;
}

export interface BusinessInfo {
  openingHours: OpeningHoursItem[];
  needBooking?: string;
  peakTime?: string;
}

// Database access functions
export async function getMerchantCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<MerchantDocument>('merchants');
}

// Merchant retrieval functions
export async function findMerchantByUsername(username: string) {
  const collection = await getMerchantCollection();
  return collection.findOne({ username });
}

export async function findMerchantById(id: ObjectId) {
  const collection = await getMerchantCollection();
  return collection.findOne({ _id: id });
}

export async function findMerchantsByUsernames(usernames: string[]) {
  const collection = await getMerchantCollection();
  return collection.find({ username: { $in: usernames } }).toArray();
}

export async function findMerchantsByType(profileInterface: ProfileInterface, limit = 20, skip = 0) {
  const collection = await getMerchantCollection();
  return collection.find({ profileInterface })
    .sort({ recommended: -1, 'stats.mentionedPosts': -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

// Search merchants
export async function searchMerchants(query: string, limit = 20) {
  const collection = await getMerchantCollection();
  return collection.find({
    $or: [
      { displayName: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { hashtags: { $regex: query, $options: 'i' } }
    ]
  })
  .limit(limit)
  .toArray();
}

// Function to convert old model to MongoDB document
export function convertToMongoDocument(merchant: any): Omit<MerchantDocument, '_id'> {
  return {
    ...merchant,
    lastUpdated: new Date(),
    isActive: true
  };
} 