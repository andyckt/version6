# MongoDB Implementation for Travel Platform

This document describes the MongoDB integration for the Travel Platform application, focusing on the merchant data storage and retrieval.

## Database Structure

The merchant data is stored in two collections:

1. **merchants**: Stores basic merchant information
   - Core fields like id, username, displayName, etc.
   - Reference to detailed information via `merchantDetailsId`

2. **merchantDetails**: Stores type-specific merchant details
   - Location information
   - Business hours
   - Price information
   - Amenities
   - And other specialized fields based on merchant type

## API Endpoints

### List Merchants
- **URL**: `/api/merchants`
- **Method**: GET
- **Query Parameters**:
  - `limit`: Number of merchants to return (default: 20)
  - `page`: Page number for pagination (default: 1)
  - `accountType`: Filter by account type (e.g., restaurant, hotel)
  - `district`: Filter by district
  - `recommended`: Filter for recommended merchants (true/false)
- **Response**: JSON with merchants array and pagination metadata

### Get Merchant by Username
- **URL**: `/api/merchants/:username`
- **Method**: GET
- **Response**: JSON with merchant data including details

### Create Merchant
- **URL**: `/api/merchants`
- **Method**: POST
- **Body**: Merchant data
- **Response**: Created merchant data with ID

## Data Models

### MerchantModel
```typescript
interface MerchantModel {
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
  merchantDetailsId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### MerchantDetailModel
```typescript
interface MerchantDetailModel {
  _id?: ObjectId;
  merchantId: number;
  merchantType: string;
  profileInterface: ProfileInterface;
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
```

## Caching Strategy

The API implements several caching layers:

1. **HTTP Caching**: Using Cache-Control headers with `s-maxage` and `stale-while-revalidate`
2. **Client-side Caching**: Using SWR with optimized settings
3. **Session Storage**: Caching merchant data in session storage for quick access

## Performance Optimizations

1. **Indexed Fields**: Key fields are indexed for faster queries 
   - username (unique)
   - id (unique)
   - accountType + recommended (compound)
   - district

2. **Lean Queries**: Using `.lean()` to get plain JavaScript objects instead of Mongoose documents

3. **Pagination**: Implementing skip/limit pagination to handle large datasets

## Migration

To migrate static data to MongoDB, run:

```
node src/scripts/simple-migrate.js
```

This will create and populate the collections with sample merchant data.

## Environment Variables

Required environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_DB=dbname
```

## Future Improvements

1. Implement caching with Redis for even faster responses
2. Add geospatial queries for location-based searches
3. Add real-time merchant status updates
4. Implement data validation using Zod or Joi
5. Add more sophisticated error handling and retry logic 


Next Steps Plan
Implement Redis Caching Layer
Add Redis for faster API responses and reduced MongoDB load
Cache frequent merchant queries with appropriate TTLs
Implement cache invalidation strategies for data updates
Add Geospatial Search Features
Store coordinates for merchant locations
Enable "near me" searching functionality
Implement MongoDB's geospatial indexes for efficient proximity queries
Improve User Experience
Add progressive loading patterns for merchant data
Implement skeleton screens during data fetching
Add image optimization and preloading for merchant photos
Authentication System
Implement user authentication and authorization
Create protected routes for merchant management
Add user profiles and preferences storage
Merchant Management Interface
Build a dashboard for merchants to manage their profiles
Implement image upload functionality
Add analytics for merchant profile views and interactions
The most impactful place to start would be with Redis caching and improved loading patterns, as these will directly enhance the user experience by significantly reducing perceived loading times.