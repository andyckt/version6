# Merchant Profile Implementation

This document outlines the implementation of merchant profiles in our application, including data models, components, and API endpoints.

## Data Structure

### Base Merchant Interface

All merchants share a common base interface with the following fields:

```typescript
export interface BaseMerchant {
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
}
```

### Structured Opening Hours

We've implemented a structured format for opening hours that allows for more detailed and flexible display:

```typescript
export interface OpeningHoursItem {
  day: string;  // Can be 'Monday', 'Monday-Friday', 'Weekends', 'Holidays', etc.
  hours: string; // Time range like '10:00-22:00'
}

export interface BusinessInfo {
  openingHours: string | OpeningHoursItem[]; // Support both legacy string and new structured format
  needBooking?: string;
  peakTime?: string;
}
```

This allows for complex opening hours like:

```typescript
openingHours: [
  { day: 'Monday-Friday', hours: '11:00-22:00' },
  { day: 'Saturday-Sunday', hours: '10:00-22:30' },
  { day: 'Public Holidays', hours: '10:00-22:00' }
]
```

### Languages Spoken

We've added a `languagesSpoken` array to merchant types that interact with customers:

```typescript
export interface SingleLocationMerchant extends BaseMerchant {
  // ...other fields
  languagesSpoken?: string[]; // Languages spoken by staff
}

export interface MultiLocationMerchant extends BaseMerchant {
  // ...other fields
  languagesSpoken?: string[]; // Languages spoken by staff across all locations
}

export interface HotelMerchant extends SingleLocationMerchant {
  // ...other fields
  languagesSpoken?: string[]; // Languages spoken by staff (inherited but explicit)
}
```

This is particularly useful for tourist-focused businesses where language support is important.

### Specialized Merchant Types

We've implemented different merchant types with specialized fields:

1. **SingleLocationMerchant**: For single-location businesses
2. **MultiLocationMerchant**: For chains with multiple branches
3. **AttractionMerchant**: For tourist attractions
4. **StreetMerchant**: For famous streets/districts
5. **BuildingMerchant**: For malls and shopping centers
6. **HotelMerchant**: For hotels and accommodations
7. **BarClubMerchant**: For bars and clubs

Each of these extends the BaseMerchant interface with specific fields:

```typescript
export interface HotelMerchant extends SingleLocationMerchant {
  pricePerNight: number;
  amenities?: string[];
  stars?: number;
}
```

### Type Guards

We've implemented type guard functions to safely access specialized properties:

```typescript
export function isHotelMerchant(merchant: BaseMerchant): merchant is HotelMerchant {
  return merchant.profileInterface === ProfileInterface.Hotel;
}
```

## Components

### MerchantHeader

A reusable component that displays the merchant's header information:
- Display name and username
- Verification badge and recommended tag
- Merchant type and district
- URL (if available)
- Stats (mentions, followers, following)
- Hashtags
- Follow/Share buttons

### LocationInfo

A component that displays location information for a merchant:
- Chinese address
- English address
- Branch district
- Nearest subway
- Telephone numbers

### BusinessInfo

A component that shows business operation details:
- Opening hours (supports both string and structured formats)
- Reservation requirements
- Peak hours

### PriceInfo

A dynamic component that shows different price information based on the merchant type:
- Hotels: Price per night
- Restaurants: Price per person
- Attractions: Ticket price
- Bars/Clubs: Entry fee (if any)

### LanguagesInfo

A component that displays the languages spoken by merchant staff:
- Renders a list of languages as tags
- Uses a globe icon for visual identification
- Only displayed for merchants that have specified languages

## Merchant Profile Pages

### Username-Based Access

The dynamic merchant profile page (`src/app/merchant/[username]/page.tsx`) adapts its display based on the merchant type:

1. Fetches merchant data using `useMerchant` hook with the username
2. Shows a loading state while data is being fetched
3. Redirects to a 404 page if the merchant is not found
4. Renders appropriate sections based on merchant type

### ID-Based Access

We've also implemented ID-based access to merchant profiles (`src/app/merchant/id/[id]/page.tsx`):

1. Fetches merchant data using `useMerchantById` hook with the numeric ID
2. Shows identical information to the username-based page
3. Provides a more stable way to link to merchants, as IDs don't change

This allows profiles to be accessed via either:
- `/merchant/shanghaitaste` (username-based)
- `/merchant/id/501` (ID-based)

Both pages use the same conditional rendering pattern for merchant-specific content:

```typescript
function renderMerchantSpecificSections(merchant: BaseMerchant) {
  if (isHotelMerchant(merchant)) {
    return (
      <>
        <PriceInfo merchant={merchant} />
        <BusinessInfo businessInfo={merchant.businessInfo} />
        <LocationInfo location={merchant.location} />
        {merchant.languagesSpoken && merchant.languagesSpoken.length > 0 && (
          <LanguagesInfo languages={merchant.languagesSpoken} />
        )}
        {/* Hotel-specific amenities */}
      </>
    );
  }
  
  // More conditional rendering for other merchant types...
}
```

## API Endpoints

### Username-Based API

The username-based API endpoint fetches merchant data by username:

```typescript
// src/app/api/merchants/[username]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const merchant = getMerchantByUsername(username);
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(merchant);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### ID-Based API

The ID-based API endpoint fetches merchant data by ID:

```typescript
// src/app/api/merchants/id/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const merchant = getMerchantById(id);
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(merchant);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Custom Hooks

### useMerchant Hook

The `useMerchant` hook fetches merchant data by username using SWR:

```typescript
export function useMerchant(username: string) {
  const { data, error, isLoading, mutate } = useSWR<BaseMerchant>(
    username ? `/api/merchants/${username}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    merchant: data,
    isLoading,
    isError: error,
    mutate,
  };
}
```

### useMerchantById Hook

The `useMerchantById` hook fetches merchant data by ID using SWR:

```typescript
export function useMerchantById(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<BaseMerchant>(
    id ? `/api/merchants/id/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    merchant: data,
    isLoading,
    isError: error,
    mutate,
  };
}
```

## Integration with Posts

Post pages link to merchant profiles when posts mention merchants or have tagged merchant accounts. The implementation includes:

1. Updated links in post details to use `/merchant/[username]` for merchant accounts
2. Tagged accounts section displays appropriate icons based on merchant type

## Industry Standard Comparison

The implementation follows industry standards seen in platforms like Yelp, TripAdvisor, and Google Business:

1. Specialized data models for different business types
2. Verification badges and recommendation indicators
3. Type-specific information display
4. Clear presentation of location and business information
5. Stats display for social engagement metrics
6. Hierarchical data structure using a base model with specialized extensions
7. Multiple access methods (username and ID) for better flexibility and stability
8. Structured opening hours to handle complex schedules
9. Language support information for international visitors

## Future Improvements

### Data Structure Enhancements

1. **Social Media Links**
   ```typescript
   socialMedia: {
     instagram?: string;
     facebook?: string;
     weibo?: string;
     wechat?: string;
     twitter?: string;
   }
   ```

2. **Certifications and Awards**
   ```typescript
   certifications: [
     { name: 'Michelin Star', year: 2023, level: '2 Stars' },
     { name: 'Best Restaurant Award', year: 2022, issuedBy: 'Shanghai Food Guide' }
   ]
   ```

3. **Menu or Product Catalog**
   ```typescript
   menuCategories: [
     { name: 'Appetizers', items: [...] },
     { name: 'Main Dishes', items: [...] }
   ]
   ```

4. **Payment Methods**
   ```typescript
   paymentMethods: ['Visa', 'Mastercard', 'Alipay', 'WeChat Pay', 'UnionPay']
   ```

5. **Accessibility Features**
   ```typescript
   accessibility: {
     wheelchairAccess: boolean;
     elevators: boolean;
     accessibleRestrooms: boolean;
     brailleMenus: boolean;
   }
   ```

### Next Features to Implement

1. **Reviews and Ratings System**
   - User-submitted reviews with star ratings
   - Photos uploaded by users
   - Moderation system for reviews
   - Response capability for merchants

2. **Merchant Search and Discovery**
   - Search page with filters for merchant type, district, price range
   - Map-based search interface
   - "Near me" functionality
   - Curated collections of merchants (Best for Families, Date Night, etc.)

3. **Merchant Dashboard**
   - Profile claiming and verification process
   - Analytics on profile views and mentions
   - Ability to respond to user posts and reviews
   - Special offer creation and management

4. **Enhanced Interactions**
   - Save/bookmark favorite merchants
   - Direct messaging between users and merchants
   - Follow merchants for updates
   - Notification system for new posts or special offers

5. **Reservations and Bookings**
   - Integrated booking system for restaurants
   - Room availability calendar for hotels
   - Ticket purchasing for attractions
   - Special event reservations

6. **Photo Gallery and Virtual Tours**
   - Official merchant photo galleries
   - User-submitted photos
   - 360° virtual tours for hotels and attractions
   - Video showcases

These improvements would align our implementation with industry leaders while providing enhanced value to both users and merchants. 