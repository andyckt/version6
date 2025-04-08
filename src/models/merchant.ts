import { 
  ProfileInterface, 
  AccountType, 
  type BaseMerchant, 
  type SingleLocationMerchant,
  type MultiLocationMerchant,
  type AttractionMerchant,
  type HotelMerchant,
  type BarClubMerchant,
  type BuildingMerchant,
  type StreetMerchant,
  type OpeningHoursItem,
  type LocationInfo,
  type BusinessInfo
} from '@/data/merchants';
import { IndexDirection } from 'mongodb';

// Interface for MongoDB index definition
interface MongoIndex {
  key: { [key: string]: IndexDirection };
  unique?: boolean;
}

// Using MongoDB for schema definitions for type safety and validation
// When we query, we'll convert documents to these types
// This ensures compatibility with existing code

// Get valid account types
const validAccountTypes = ['restaurant', 'hotel', 'attraction', 'barandclub', 'shopping'];

// Schema definitions here match the interfaces from merchants.ts
// We will use them to validate data during insertion and updates
export const merchantSchemaValidation = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "accountType", "username", "displayName", "verified", "joinDate", "recommended", "hashtags", "district", "merchantType", "stats", "profileInterface"],
      properties: {
        id: { bsonType: "number" },
        accountType: { enum: validAccountTypes },
        username: { bsonType: "string" },
        displayName: { bsonType: "string" },
        verified: { bsonType: "bool" },
        joinDate: { bsonType: "string" },
        recommended: { bsonType: "bool" },
        hashtags: { bsonType: "array", items: { bsonType: "string" } },
        district: { bsonType: "array", items: { bsonType: "string" } },
        merchantType: { bsonType: "string" },
        url: { bsonType: "string" },
        stats: {
          bsonType: "object",
          required: ["mentionedPosts", "followers", "following"],
          properties: {
            mentionedPosts: { bsonType: "number" },
            followers: { bsonType: "number" },
            following: { bsonType: "number" }
          }
        },
        profileInterface: { enum: Object.values(ProfileInterface).filter(v => typeof v === "number") },
        
        // SingleLocationMerchant properties
        location: {
          bsonType: "object",
          properties: {
            chineseAddress: { bsonType: "string" },
            englishAddress: { bsonType: "string" },
            nearestSubway: { bsonType: "string" },
            telephone: { bsonType: "array", items: { bsonType: "string" } },
            branchDistrict: { bsonType: "string" }
          }
        },
        
        // BusinessInfo
        businessInfo: {
          bsonType: "object",
          properties: {
            openingHours: {
              oneOf: [
                { bsonType: "string" },
                { 
                  bsonType: "array", 
                  items: { 
                    bsonType: "object", 
                    required: ["day", "hours"],
                    properties: {
                      day: { bsonType: "string" },
                      hours: {
                        oneOf: [
                          { bsonType: "string" },
                          { bsonType: "array", items: { bsonType: "string" } }
                        ]
                      }
                    }
                  } 
                }
              ]
            },
            needBooking: { bsonType: "string" },
            peakTime: { bsonType: "string" }
          }
        },
        
        // Various specific fields for different merchant types
        pricePerPerson: { bsonType: "number" },
        languagesSpoken: { bsonType: "array", items: { bsonType: "string" } },
        michelinStars: { bsonType: "number" },
        
        // MultiLocationMerchant properties
        branches: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              chineseAddress: { bsonType: "string" },
              englishAddress: { bsonType: "string" },
              nearestSubway: { bsonType: "string" },
              telephone: { bsonType: "array", items: { bsonType: "string" } },
              branchDistrict: { bsonType: "string" },
              openingHours: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["day", "hours"],
                  properties: {
                    day: { bsonType: "string" },
                    hours: {
                      oneOf: [
                        { bsonType: "string" },
                        { bsonType: "array", items: { bsonType: "string" } }
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        
        // AttractionMerchant properties
        ticketPrice: { bsonType: "number" },
        
        // HotelMerchant properties
        stars: { bsonType: "number" },
        amenities: { bsonType: "array", items: { bsonType: "string" } },
        priceRange: { bsonType: "string" },
        
        // BarClubMerchant properties
        entryFee: { bsonType: "number" },
        nearbyMidnightFood: { bsonType: "array", items: { bsonType: "string" } },
        clubCategories: { bsonType: "array", items: { bsonType: "string" } },
        
        // BuildingMerchant properties
        floors: { bsonType: "number" },
        featuredStores: { bsonType: "array", items: { bsonType: "string" } }
      }
    }
  }
};

// Index definitions for efficient querying
export const merchantIndexes: MongoIndex[] = [
  { key: { username: 1 }, unique: true },
  { key: { id: 1 }, unique: true },
  { key: { accountType: 1 } },
  { key: { district: 1 } },
  { key: { "location.branchDistrict": 1 } },
  { key: { "branches.branchDistrict": 1 } },
  { key: { merchantType: 1 } },
  { key: { recommended: 1 } },
  { key: { hashtags: 1 } },
  { key: { profileInterface: 1 } }
];

export function convertFromDocument<T extends BaseMerchant>(doc: any): T {
  // Remove MongoDB _id if present before returning to client
  if (doc._id) {
    delete doc._id;
  }
  return doc as T;
} 