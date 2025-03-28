// Merchant profile interface types
export enum ProfileInterface {
  SingleShopRestaurant = 1,
  MultipleBranchMerchant = 2,
  Attraction = 3,
  Street = 4,
  Building = 5,
  Hotel = 6,
  BarClub = 7
}

// Account types - matching the types in the post tag system
export type AccountType = 'user' | 'restaurant' | 'hotel' | 'attraction' | 'barandclub' | 'shopping';

// Base merchant interface with common fields
export interface BaseMerchant {
  id: number;
  accountType: AccountType;
  username: string;
  displayName: string;
  verified: boolean;
  joinDate: string;
  recommended: boolean;
  hashtags: string[];
  district: string[];  // Array for multiple districts
  merchantType: string;
  url?: string;        // (missing)
  stats: {
    mentionedPosts: number;
    followers: number;
    following: number;
  };
  profileInterface: ProfileInterface;  // To determine which interface to render
}

// Location information - reusable for addresses
export interface LocationInfo {
  chineseAddress: string;
  englishAddress: string;
  nearestSubway: string;
  telephone?: string[];  // Optional array of telephone numbers
  branchDistrict: string;
}

// Opening hours item structure
export interface OpeningHoursItem {
  day: string;  // Can be 'Monday', 'Monday-Friday', 'Weekends', 'Holidays', etc.
  hours: string[] | string; // Array of time slots (e.g., ['11:00-14:00', '17:00-21:00']) or 'Closed'
}

// Business operation information - reusable for business hours
export interface BusinessInfo {
  openingHours: OpeningHoursItem[]; // Only support the structured format for easier real-time status checks
  needBooking?: string;
  peakTime?: string;
}

// Single location merchant (restaurants, attractions, etc.)
export interface SingleLocationMerchant extends BaseMerchant {
  location: LocationInfo;
  businessInfo: BusinessInfo;
  pricePerPerson?: number;  // For restaurants
  languagesSpoken?: string[]; // Languages spoken by staff (missing)
  michelinStars?: number;   // Michelin stars (0-3) (missing)
}

// Multi-location merchant (chains, franchises)
export interface MultiLocationMerchant extends BaseMerchant {
  pricePerPerson?: number;
  needBooking?: string;
  peakTime?: string;
  languagesSpoken?: string[]; // Languages spoken by staff across all locations
  michelinStars?: number;     // Michelin stars (0-3)
  branches: (LocationInfo & BusinessInfo)[];  // Array of branches with both location and business info
}

// Attraction-specific interface
export interface AttractionMerchant extends SingleLocationMerchant {
  ticketPrice: number;
}

// Street-specific interface (famous streets, districts)
export interface StreetMerchant extends BaseMerchant {
  location: LocationInfo;
  // Streets don't have business hours or pricing
}

// Building-specific interface (malls, shopping centers)
export interface BuildingMerchant extends SingleLocationMerchant {
  pricePerPerson?: undefined; // Buildings don't have per-person pricing
  floors?: number;
  featuredStores?: string[]; // Usernames of featured stores in the building
}

// Hotel-specific interface
export interface HotelMerchant extends Omit<SingleLocationMerchant, 'businessInfo'> {
  pricePerNight: number;
  pricePerPerson?: undefined; // Explicitly nullify the inherited property
  readonly businessInfo: {
    openingHours: [{ day: 'All days', hours: '24 hours' }];
    needBooking?: undefined; // Hotels don't need to display booking info - it's assumed
    peakTime?: undefined; // Hotels don't have peak times like restaurants
  };
  amenities?: string[];  // Additional hotel amenities
  stars?: number;        // Hotel star rating (1-5)
}

// Bar/Club-specific interface
export interface BarClubMerchant extends SingleLocationMerchant {
  nearbyMidnightFood?: string[];  // Usernames of late-night food places
  clubCategories: string[];       // Types of music/atmosphere
  entryFee?: number;              // Entry fee amount
  // We keep pricePerPerson as it can represent drink/food prices
}

// Type guard functions to safely determine merchant types
export function isSingleLocationMerchant(merchant: BaseMerchant): merchant is SingleLocationMerchant {
  return merchant.profileInterface === ProfileInterface.SingleShopRestaurant;
}

export function isMultiLocationMerchant(merchant: BaseMerchant): merchant is MultiLocationMerchant {
  return merchant.profileInterface === ProfileInterface.MultipleBranchMerchant;
}

export function isAttractionMerchant(merchant: BaseMerchant): merchant is AttractionMerchant {
  return merchant.profileInterface === ProfileInterface.Attraction;
}

export function isStreetMerchant(merchant: BaseMerchant): merchant is StreetMerchant {
  return merchant.profileInterface === ProfileInterface.Street;
}

export function isBuildingMerchant(merchant: BaseMerchant): merchant is BuildingMerchant {
  return merchant.profileInterface === ProfileInterface.Building;
}

export function isHotelMerchant(merchant: BaseMerchant): merchant is HotelMerchant {
  return merchant.profileInterface === ProfileInterface.Hotel;
}

export function isBarClubMerchant(merchant: BaseMerchant): merchant is BarClubMerchant {
  return merchant.profileInterface === ProfileInterface.BarClub;
}

// Sample merchants data
export const merchants: BaseMerchant[] = [
  // 24/7 Convenience Store Sample
  {
    id: 508,
    accountType: 'shopping',
    username: 'seveneleven',
    displayName: '7-Eleven',
    verified: true,
    joinDate: 'October 2022',
    recommended: true,
    hashtags: ['#conveniencestore', '#247', '#quickbites', '#latenight'],
    district: ['Multiple'],
    merchantType: 'Convenience Store',
    stats: {
      mentionedPosts: 45,
      followers: 2200,
      following: 30
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '上海市静安区南京西路1601号',
      englishAddress: '1601 West Nanjing Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2 Jing\'an Temple Station, Exit 1 - 100m',
      telephone: ['021-62888777'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ],
      peakTime: 'Morning and Evening Rush'
    },
    pricePerPerson: 25,
    languagesSpoken: ['Chinese', 'English'],
  } as SingleLocationMerchant,
  
  // Another 24/7 Store with All day notation
  {
    id: 509,
    accountType: 'shopping',
    username: 'familymart',
    displayName: 'Family Mart',
    verified: true,
    joinDate: 'November 2022',
    recommended: true,
    hashtags: ['#conveniencestore', '#familymart', '#latenight', '#quickfood'],
    district: ['Multiple'],
    merchantType: 'Convenience Store',
    stats: {
      mentionedPosts: 38,
      followers: 1900,
      following: 25
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '上海市黄浦区淮海中路432号',
      englishAddress: '432 Middle Huaihai Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 1 South Huangpi Road Station, Exit 3 - 150m',
      telephone: ['021-63559988'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: 'All day' }
      ],
      peakTime: 'Lunch hours'
    },
    pricePerPerson: 20,
    languagesSpoken: ['Chinese', 'English'],
  } as SingleLocationMerchant,
  
  // Chinese notation 24/7 Store
  {
    id: 510,
    accountType: 'shopping',
    username: 'lawson',
    displayName: 'Lawson',
    verified: true,
    joinDate: 'December 2022',
    recommended: true,
    hashtags: ['#conveniencestore', '#lawson', '#latenight', '#japanesestore'],
    district: ['Multiple'],
    merchantType: 'Convenience Store',
    stats: {
      mentionedPosts: 32,
      followers: 1700,
      following: 20
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '上海市静安区威海路128号',
      englishAddress: '128 Weihai Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2 Nanjing West Road Station, Exit 1 - 300m',
      telephone: ['021-62714455'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '全天' }
      ],
      peakTime: 'Evening hours'
    },
    pricePerPerson: 18,
    languagesSpoken: ['Chinese', 'English', 'Japanese'],
  } as SingleLocationMerchant,
  
  // Restaurant sample (single location)
  {
    id: 501,
    accountType: 'restaurant',
    username: 'shanghaitaste',
    displayName: 'Shanghai Taste',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#shanghairestaurant', '#dimsum', '#localtaste', '#traditional'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 24,
      followers: 1800,
      following: 120
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '上海市黄浦区南京东路829号',
      englishAddress: '829 East Nanjing Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 2/10 Nanjing East Road Station, Exit 2 - 200m',
      telephone: ['021-63566575'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '23:00-4:00' },
        { day: 'Friday-Saturday', hours: '22:30-4:30' },
        { day: 'Sunday', hours: 'Closed' }
      ],
      needBooking: 'Recommended on weekends',
      peakTime: '00:30-2:30'
    },
    pricePerPerson: 150,
    languagesSpoken: ['Chinese', 'English', 'Japanese'],
    michelinStars: 2
  } as SingleLocationMerchant,
  
  // Multi-branch restaurant
  {
    id: 502,
    accountType: 'restaurant',
    username: 'dumplinghouse',
    displayName: 'Dumpling House',
    verified: true,
    joinDate: 'March 2023',
    recommended: true,
    hashtags: ['#dumplings', '#shanghairestaurant', '#localfavorite'],
    district: ['Jing\'an', 'Xuhui', 'Huangpu'],
    merchantType: 'Dumpling Restaurant',
    stats: {
      mentionedPosts: 56,
      followers: 3200,
      following: 85
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 80,
    needBooking: 'Walk-ins welcome',
    peakTime: '12:00-13:30, 18:30-20:00',
    languagesSpoken: ['Chinese', 'English'],
    michelinStars: 1,
    branches: [
      {
        chineseAddress: '上海市静安区南京西路1788号',
        englishAddress: '1788 West Nanjing Road, Jing\'an District, Shanghai',
        nearestSubway: 'Line 2 Jing\'an Temple Station, Exit 3 - 300m',
        telephone: ['021-62555333'],
        branchDistrict: 'Jing\'an',
        openingHours: [
          { day: 'Monday-Friday', hours: '10:30-21:30' },
          { day: 'Weekends', hours: '10:00-22:00' }
        ],
        needBooking: 'No reservation needed',
        peakTime: '12:00-13:30'
      },
      {
        chineseAddress: '上海市徐汇区淮海中路999号',
        englishAddress: '999 Middle Huaihai Road, Xuhui District, Shanghai',
        nearestSubway: 'Line 1 South Shaanxi Road Station, Exit 5 - 150m',
        telephone: ['021-64157788'],
        branchDistrict: 'Xuhui',
        openingHours: [
          { day: 'Monday-Wednesday', hours: '8:45-16:30' },
          { day: 'Thursday-Friday', hours: '8:45-19:30' },
          { day: 'Weekends', hours: '9:30-21:45' }
        ],
        needBooking: 'Recommended on weekends',
        peakTime: '18:00-20:00'
      },
      {
        chineseAddress: '上海市黄浦区复兴东路518号',
        englishAddress: '518 East Fuxing Road, Huangpu District, Shanghai',
        nearestSubway: 'Line 9 Dapuqiao Station, Exit 1 - 400m',
        telephone: ['021-63316622'],
        branchDistrict: 'Huangpu',
        openingHours: [
          { day: 'Monday-Friday', hours: '11:30-23:15' },
          { day: 'Weekends', hours: '12:00-23:00' }
        ],
        needBooking: 'Walk-ins welcome',
        peakTime: '19:00-21:00'
      }
    ]
  } as MultiLocationMerchant,
  
  // Attraction sample
  {
    id: 503,
    accountType: 'attraction',
    username: 'shanghaimuseum',
    displayName: 'Shanghai Museum',
    verified: true,
    joinDate: 'June 2022',
    recommended: true,
    hashtags: ['#shanghaimuseum', '#culture', '#history', '#art'],
    district: ['People\'s Square'],
    merchantType: 'Museum',
    url: 'https://www.shanghaimuseum.net',
    stats: {
      mentionedPosts: 87,
      followers: 5600,
      following: 45
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '上海市黄浦区人民大道201号',
      englishAddress: '201 People\'s Avenue, Huangpu District, Shanghai',
      nearestSubway: 'Line 1/2/8 People\'s Square Station, Exit 1 - 100m',
      telephone: ['021-63723500'],
      branchDistrict: 'People\'s Square'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '7:15-16:45' },
        { day: 'Saturday', hours: '9:30-17:30' },
        { day: 'Sunday', hours: 'Closed' }
      ],
      needBooking: 'Free admission, ticket required',
      peakTime: 'Weekends and holidays'
    },
    ticketPrice: 100,  // Changed from 0 to 100
    languagesSpoken: ['Chinese', 'English', 'French'],
    michelinStars: 1
  } as AttractionMerchant,
  
  // Hotel sample
  {
    id: 504,
    accountType: 'hotel',
    username: 'peacehotel',
    displayName: 'Peace Hotel Shanghai',
    verified: true,
    joinDate: 'January 2022',
    recommended: true,
    hashtags: ['#historichotel', '#luxuryhotel', '#thebund', '#shanghaihotel'],
    district: ['The Bund'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.fairmont.com/peace-hotel-shanghai/',
    stats: {
      mentionedPosts: 112,
      followers: 8900,
      following: 67
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市黄浦区南京东路20号',
      englishAddress: '20 East Nanjing Road, The Bund, Shanghai',
      nearestSubway: 'Line 2/10 Nanjing East Road Station, Exit 1 - 300m',
      telephone: ['021-63216888'],
      branchDistrict: 'The Bund'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 1800,
    amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Spa', 'Restaurant', 'Bar'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'French', 'German', 'Japanese', 'Russian'],
    michelinStars: 3
  } as HotelMerchant,
  
  // Bar/Club sample
  {
    id: 505,
    accountType: 'barandclub',
    username: 'speaklow',
    displayName: 'Speak Low',
    verified: true,
    joinDate: 'August 2023',
    recommended: true,
    hashtags: ['#speakeasy', '#cocktails', '#nightlife', '#shanghaibar'],
    district: ['Jing\'an'],
    merchantType: 'Speakeasy Bar',
    stats: {
      mentionedPosts: 78,
      followers: 6700,
      following: 120
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: '上海市静安区富民路579号',
      englishAddress: '579 Fuxing Middle Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 1 Changshu Road Station, Exit 1 - 500m',
      telephone: ['13501812015'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Thursday', hours: '19:00-03:30' },
        { day: 'Friday-Saturday', hours: '20:00-04:00' },
        { day: 'Sunday-Monday', hours: '18:30-02:00' }
      ],
      needBooking: 'Recommended on weekends',
      peakTime: '21:00-01:00'
    },
    pricePerPerson: 300,
    nearbyMidnightFood: ['seveneleven', 'familymart', 'lawson'],
    clubCategories: ['Cocktail Bar', 'Speakeasy', 'Jazz'],
    michelinStars: 2
  } as BarClubMerchant,
  
  // Street sample
  {
    id: 506,
    accountType: 'attraction',
    username: 'taikangroad',
    displayName: 'Taikang Road',
    verified: true,
    joinDate: 'April 2023',
    recommended: true,
    hashtags: ['#tianzifang', '#taikangroad', '#artdistrict', '#shoppingstreet'],
    district: ['Huangpu'],
    merchantType: 'Shopping Street',
    stats: {
      mentionedPosts: 130,
      followers: 9200,
      following: 35
    },
    profileInterface: ProfileInterface.Street,
    location: {
      chineseAddress: '上海市黄浦区泰康路210弄',
      englishAddress: 'Lane 210 Taikang Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 9 Dapuqiao Station, Exit 1 - 400m',
      branchDistrict: 'Huangpu'
    }
  } as StreetMerchant,
  
  // Building/Mall sample
  {
    id: 507,
    accountType: 'shopping',
    username: 'iapmmall',
    displayName: 'IAPM Shopping Mall',
    verified: true,
    joinDate: 'September 2022',
    recommended: true,
    hashtags: ['#iapm', '#shoppingmall', '#luxuryshopping', '#shanghaishoping'],
    district: ['Xuhui'],
    merchantType: 'Shopping Mall',
    url: 'http://www.iapmmall.com/',
    stats: {
      mentionedPosts: 92,
      followers: 7500,
      following: 120
    },
    profileInterface: ProfileInterface.Building,
    location: {
      chineseAddress: '上海市徐汇区淮海中路999号',
      englishAddress: '999 Huaihai Middle Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 1 South Shaanxi Road Station, Exit 1 - 100m',
      telephone: ['021-64566999'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '9:15-21:45' },
        { day: 'Saturday', hours: '10:00-22:30' },
        { day: 'Sunday', hours: '11:00-19:00' }
      ],
      peakTime: 'Weekends 14:00-20:00'
    },
    floors: 7,
    featuredStores: ['apple', 'zara', 'uniqlo', 'sephora'],
    michelinStars: 2
  } as BuildingMerchant
];

// Helper functions
export function getMerchantByUsername(username: string): BaseMerchant | undefined {
  return merchants.find(merchant => merchant.username === username);
}

export function getMerchantById(id: number): BaseMerchant | undefined {
  return merchants.find(merchant => merchant.id === id);
}

export function getMerchantsByAccountType(accountType: AccountType): BaseMerchant[] {
  return merchants.filter(merchant => merchant.accountType === accountType);
}

export function getMerchantsByDistrict(district: string): BaseMerchant[] {
  return merchants.filter(merchant => merchant.district.includes(district));
}

/**
 * Checks if a merchant is currently open based on its opening hours
 * @param merchant The merchant to check
 * @param date Optional date object, defaults to current time in China (UTC+8)
 * @returns true if the merchant is open, false otherwise
 */
export function isMerchantOpen(merchant: BaseMerchant, date: Date = new Date()): boolean {
  console.log(`isMerchantOpen check for ${merchant.displayName}`);
  
  // Hotels are always open
  if (isHotelMerchant(merchant)) {
    console.log(`${merchant.displayName} is a hotel, returning true`);
    return true;
  }
  
  // For merchants without business info or opening hours
  if (!isSingleLocationMerchant(merchant) && !isMultiLocationMerchant(merchant) && 
      !isBuildingMerchant(merchant) && !isAttractionMerchant(merchant) && !isBarClubMerchant(merchant)) {
    console.log(`${merchant.displayName} has no business info, returning false`);
    return false;
  }
  
  let openingHours: OpeningHoursItem[] = [];
  
  // Get the opening hours based on merchant type
  if (isSingleLocationMerchant(merchant) || isBuildingMerchant(merchant) || 
      isAttractionMerchant(merchant) || isBarClubMerchant(merchant)) {
    console.log(`${merchant.displayName} is a single location merchant`);
    openingHours = merchant.businessInfo.openingHours;
  } else if (isMultiLocationMerchant(merchant)) {
    console.log(`${merchant.displayName} is a multi-location merchant with ${merchant.branches.length} branches`);
    // For multi-location merchants, combine all branch hours
    merchant.branches.forEach((branch, index) => {
      console.log(`Branch ${index} opening hours:`, branch.openingHours);
      openingHours = [...openingHours, ...branch.openingHours];
    });
  }
  
  if (!openingHours || openingHours.length === 0) {
    console.log(`No opening hours found for ${merchant.displayName}, returning false`);
    return false;
  }
  
  console.log(`Opening hours found for ${merchant.displayName}:`, openingHours);
  
  // Force China time (UTC+8) regardless of user's local time
  // This ensures consistent behavior for all users viewing merchant opening status
  const utcHours = date.getUTCHours();
  const chinaHours = (utcHours + 8) % 24; // Add 8 hours for China time (UTC+8)
  
  // Determine if day needs to be incremented for China
  const dayIncrement = utcHours + 8 >= 24 ? 1 : 0;
  
  const chinaDay = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    // If UTC time + 8 crosses into next day, increment the day
    date.getUTCDate() + dayIncrement,
    chinaHours,
    date.getUTCMinutes()
  ));
  
  // Get current day and time in China
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[chinaDay.getUTCDay()];
  const currentHour = chinaDay.getUTCHours();
  const currentMinute = chinaDay.getUTCMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

  console.log(`Debug - China Time: ${currentDay} ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')} (${currentTime} minutes)`);
  
  // Find applicable opening hours for the current day
  const applicableItems = openingHours.filter(item => {
    // Handle specific day
    if (item.day === currentDay) {
      console.log(`Found exact day match: ${item.day} = ${currentDay}`);
      return true;
    }
    
    // Handle "All days" case
    if (item.day === 'All days' || item.day === 'Monday-Sunday') {
      console.log(`Day specification '${item.day}' matches all days`);
      return true;
    }
    
    // Handle day ranges like "Monday-Friday"
    if (item.day.includes('-') && item.day !== 'Monday-Sunday') {
      const [startDay, endDay] = item.day.split('-');
      const startIndex = days.indexOf(startDay);
      const endIndex = days.indexOf(endDay);
      const currentIndex = chinaDay.getUTCDay();
      
      console.log(`Checking day range: ${startDay}(${startIndex}) - ${endDay}(${endIndex}), Current: ${currentDay}(${currentIndex})`);
      
      if (startIndex <= currentIndex && currentIndex <= endIndex) {
        console.log(`Day is within range ${item.day}, returning true`);
        return true;
      }
      
      // Handle ranges that wrap around the week (e.g., "Friday-Sunday")
      if (startIndex > endIndex && (currentIndex >= startIndex || currentIndex <= endIndex)) {
        console.log(`Day is within wrap-around range ${item.day}, returning true`);
        return true;
      }
      
      console.log(`Day is not in range ${item.day}, returning false`);
      return false;
    }
    
    // Handle special cases like "Weekends", "Weekdays"
    if (item.day === 'Weekends' && (currentDay === 'Saturday' || currentDay === 'Sunday')) {
      console.log(`Current day ${currentDay} is a weekend, matches 'Weekends'`);
      return true;
    }
    
    if (item.day === 'Weekdays' && !(currentDay === 'Saturday' || currentDay === 'Sunday')) {
      console.log(`Current day ${currentDay} is a weekday, matches 'Weekdays'`);
      return true;
    }
    
    console.log(`Day ${currentDay} does not match specification '${item.day}'`);
    return false;
  });
  
  console.log(`Found ${applicableItems.length} applicable opening hour items for ${currentDay}`);
  
  // No applicable hours found for the current day
  if (applicableItems.length === 0) {
    console.log(`No applicable hours found for today (${currentDay}), merchant is closed`);
    return false;
  }
  
  // Check if the current time falls within any of the applicable time slots
  for (const item of applicableItems) {
    console.log(`Checking opening hours for day: ${item.day}, hours: ${item.hours}`);
    
    // Handle 'Closed' case
    if (item.hours === 'Closed') {
      console.log(`Merchant is marked as 'Closed' for ${item.day}`);
      continue;
    }
    
    // Handle 24-hour operation cases
    if (item.hours === '24 hours' || item.hours === 'All day' || item.hours === '全天') {
      console.log(`Merchant is open 24 hours on ${item.day}, returning true`);
      return true;
    }
    
    const timeSlots = Array.isArray(item.hours) ? item.hours : [item.hours];
    console.log(`Processing ${timeSlots.length} time slots for ${item.day}`);
    
    for (const slot of timeSlots) {
      console.log(`Checking time slot: ${slot}`);
      
      // Handle 24-hour operation cases for array items
      if (slot === '24 hours' || slot === 'All day' || slot === '全天') {
        console.log(`Merchant has 24-hour slot, returning true`);
        return true;
      }
      
      // Parse the time slot safely
      try {
        const [startTimeStr, endTimeStr] = slot.split('-');
        
        if (!startTimeStr || !endTimeStr) {
          console.log(`Invalid time format in slot: ${slot}, skipping`);
          continue;
        }
        
        // Simple time parsing that works with both "10:00" and "10"
        const startHourMatch = startTimeStr.match(/(\d+)(?::(\d+))?/);
        const endHourMatch = endTimeStr.match(/(\d+)(?::(\d+))?/);
        
        if (!startHourMatch || !endHourMatch) {
          console.log(`Unable to parse time format in slot: ${slot}, skipping`);
          continue;
        }
        
        const startHour = parseInt(startHourMatch[1]);
        const startMinute = parseInt(startHourMatch[2] || '0');
        const startTime = startHour * 60 + startMinute;
        
        const endHour = parseInt(endHourMatch[1]);
        const endMinute = parseInt(endHourMatch[2] || '0');
        let endTime = endHour * 60 + endMinute;
        
        // Handle times past midnight (e.g., 02:00 the next day)
        if (endTime < startTime) {
          endTime += 24 * 60; // Add 24 hours
          console.log(`Time slot crosses midnight: ${startTime} - ${endTime} minutes (original: ${startTimeStr} - ${endTimeStr})`);
          
          // For times that cross midnight, we need special handling
          if (currentTime < startTime && currentTime <= (endTime - 24 * 60)) {
            // Convert current time to "next day" framework for comparison
            const adjustedCurrentTime = currentTime + 24 * 60;
            console.log(`Current time ${currentTime} converted to next day framework: ${adjustedCurrentTime}`);
            
            if (adjustedCurrentTime >= startTime && adjustedCurrentTime <= endTime) {
              console.log(`Current time (adjusted) ${adjustedCurrentTime} is within opening hours ${startTime}-${endTime}, returning true`);
              return true;
            }
          } else if (currentTime >= startTime || currentTime <= (endTime - 24 * 60)) {
            console.log(`Current time ${currentTime} is within cross-midnight hours ${startTime}-${endTime - 24 * 60}, returning true`);
            return true;
          }
        } else {
          console.log(`Time slot: ${startTime} - ${endTime} minutes (${startTimeStr} - ${endTimeStr})`);
        
          if (currentTime >= startTime && currentTime <= endTime) {
            console.log(`Current time ${currentTime} (${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}) is within opening hours ${startTime}-${endTime}, returning true`);
            return true;
          } else {
            console.log(`Current time ${currentTime} (${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}) is outside opening hours ${startTime}-${endTime}`);
          }
        }
      } catch (error) {
        console.log(`Error parsing time slot: ${slot}`, error);
        continue;
      }
    }
  }
  
  console.log(`No applicable opening hours found for current time ${currentTime} (${currentHour}:${currentMinute}) on ${currentDay}, returning false`);
  return false;
} 