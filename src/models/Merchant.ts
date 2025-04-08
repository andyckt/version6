import { ObjectId } from 'mongodb';
import { AccountType, ProfileInterface } from '@/data/merchants';

// Base merchant interface
export interface MerchantModel {
  _id?: ObjectId;
  id: number;
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
  openStatus?: {
    isCurrentlyOpen: boolean;
    nextOpeningTime: string;
    lastUpdated: Date;
  };
  // References to detail documents
  merchantDetailsId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Merchant detail interface for type-specific data
export interface MerchantDetailModel {
  _id?: ObjectId;
  merchantId: number;
  merchantType: string;
  profileInterface: ProfileInterface;
  // Type-specific fields
  location?: any;
  businessInfo?: any;
  pricePerPerson?: number;
  languagesSpoken?: string[];
  michelinStars?: number;
  branches?: any[];
  ticketPrice?: number;
  floors?: number;
  featuredStores?: string[];
  pricePerNight?: number;
  amenities?: string[];
  stars?: number;
  nearbyMidnightFood?: string[];
  clubCategories?: string[];
  entryFee?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Collection names for MongoDB
export const MERCHANT_COLLECTION = 'merchants';
export const MERCHANT_DETAIL_COLLECTION = 'merchantDetails'; 