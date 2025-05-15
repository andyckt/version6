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
  
  // Z Hotel Somekh
  {
    id: 627,
    accountType: 'hotel',
    username: 'zhotelsomekh',
    displayName: 'Z Hotel Somekh',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#boutique', '#historic', '#thebund', '#design', '#luxury'],
    district: ['Huangpu'],
    merchantType: 'Boutique Hotel',
    url: 'https://www.z-shanghai.com/',
    stats: {
      mentionedPosts: 56,
      followers: 3800,
      following: 42
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市黄浦区北京东路190号',
      englishAddress: '190 East Beijing Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 2/10 East Nanjing Road Station, Exit 6 - 350m',
      telephone: ['021-63360090'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 1600,
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Room Service', 'Concierge'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Artyzen 31 Shanghai
  {
    id: 628,
    accountType: 'hotel',
    username: 'artyzen31',
    displayName: 'Artyzen 31 Shanghai Central',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#newhotel', '#chic', '#central', '#moderate', '#convenient'],
    district: ['Jing\'an'],
    merchantType: 'Business Hotel',
    url: 'https://www.artyzen.com/artyzen31-shanghaicentral',
    stats: {
      mentionedPosts: 34,
      followers: 2600,
      following: 120
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市静安区南京西路31号',
      englishAddress: '31 West Nanjing Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2/12 Nanjing West Road Station, Exit 4 - 150m',
      telephone: ['021-52996888'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 980,
    amenities: ['Free WiFi', 'Fitness Center', 'Restaurant', 'Meeting Rooms', 'Business Center'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Blossom House
  {
    id: 629,
    accountType: 'hotel',
    username: 'blossomhousesh',
    displayName: 'Blossom House Shanghai',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#boutique', '#artistic', '#cozy', '#affordable', '#frenchconcession'],
    district: ['Xuhui'],
    merchantType: 'Boutique Hotel',
    stats: {
      mentionedPosts: 42,
      followers: 3200,
      following: 88
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市徐汇区武康路168号',
      englishAddress: '168 Wukang Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 10 Shanghai Library Station, Exit 2 - 600m',
      telephone: ['021-64331234'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 780,
    amenities: ['Free WiFi', 'Cafe', 'Garden', 'Bicycle Rental', 'Library'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English', 'French']
  } as HotelMerchant,
  
  // W Shanghai - The Bund
  {
    id: 630,
    accountType: 'hotel',
    username: 'wshanghai',
    displayName: 'W Shanghai - The Bund',
    verified: true,
    joinDate: 'January 2023',
    recommended: true,
    hashtags: ['#luxury', '#modern', '#designhotel', '#riverfront', '#nightlife'],
    district: ['Hongkou'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.marriott.com/hotels/travel/shawh-w-shanghai-the-bund/',
    stats: {
      mentionedPosts: 89,
      followers: 7200,
      following: 52
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市虹口区黄浦路66号',
      englishAddress: '66 Huangpu Road, Hongkou District, Shanghai',
      nearestSubway: 'Line 12 International Cruise Terminal Station, Exit 4 - 800m',
      telephone: ['021-22868888'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2200,
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Bar', 'Club'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'French', 'Japanese', 'Korean']
  } as HotelMerchant,
  
  // Banyan Tree Shanghai
  {
    id: 631,
    accountType: 'hotel',
    username: 'banyantreesh',
    displayName: 'Banyan Tree Shanghai On The Bund',
    verified: true,
    joinDate: 'February 2023',
    recommended: true,
    hashtags: ['#spa', '#luxury', '#views', '#romantic', '#riverside'],
    district: ['Hongkou'],
    merchantType: 'Luxury Resort',
    url: 'https://www.banyantree.com/en/china/shanghai/',
    stats: {
      mentionedPosts: 78,
      followers: 5800,
      following: 26
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市虹口区公平路19号',
      englishAddress: '19 Gongping Road, Hongkou District, Shanghai',
      nearestSubway: 'Line 12 International Cruise Terminal Station, Exit 4 - 900m',
      telephone: ['021-25091188'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2400,
    amenities: ['Free WiFi', 'Swimming Pool', 'Award-winning Spa', 'Fitness Center', 'Multiple Restaurants', 'Rooftop Bar'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'Thai', 'Japanese']
  } as HotelMerchant,
  
  // The Ritz-Carlton Shanghai, Pudong
  {
    id: 632,
    accountType: 'hotel',
    username: 'ritzcarltonsh',
    displayName: 'The Ritz-Carlton Shanghai, Pudong',
    verified: true,
    joinDate: 'January 2022',
    recommended: true,
    hashtags: ['#luxury', '#financialdistrict', '#views', '#finedining', '#landmark'],
    district: ['Pudong'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.ritzcarlton.com/en/hotels/china/shanghai-pudong/',
    stats: {
      mentionedPosts: 102,
      followers: 9800,
      following: 35
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市浦东新区世纪大道8号上海国金中心',
      englishAddress: 'Shanghai IFC, 8 Century Avenue, Pudong New Area, Shanghai',
      nearestSubway: 'Line 2 Lujiazui Station, Exit 1 - 150m',
      telephone: ['021-20201888'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2800,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Bar', 'Club Lounge'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'French', 'German', 'Japanese', 'Russian', 'Spanish']
  } as HotelMerchant,
  
  // Grand Hyatt Shanghai
  {
    id: 633,
    accountType: 'hotel',
    username: 'grandhyattsh',
    displayName: 'Grand Hyatt Shanghai',
    verified: true,
    joinDate: 'March 2022',
    recommended: true,
    hashtags: ['#skyscraper', '#luxury', '#business', '#views', '#jinmao'],
    district: ['Pudong'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.hyatt.com/en-US/hotel/china/grand-hyatt-shanghai/shagh',
    stats: {
      mentionedPosts: 95,
      followers: 8500,
      following: 42
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市浦东新区世纪大道88号金茂大厦',
      englishAddress: 'Jin Mao Tower, 88 Century Avenue, Pudong New Area, Shanghai',
      nearestSubway: 'Line 2 Lujiazui Station, Exit 1 - 250m',
      telephone: ['021-50491234'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2100,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Bar'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'Japanese', 'Korean']
  } as HotelMerchant,
  
  // Bellagio Shanghai
  {
    id: 634,
    accountType: 'hotel',
    username: 'bellagiosh',
    displayName: 'Bellagio Shanghai',
    verified: true,
    joinDate: 'April 2023',
    recommended: true,
    hashtags: ['#luxury', '#river', '#artdeco', '#finedining', '#thebund'],
    district: ['Hongkou'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.bellagioshanghai.com/',
    stats: {
      mentionedPosts: 76,
      followers: 6200,
      following: 38
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市虹口区苏州河畔公平路5号',
      englishAddress: '5 Gongping Road, Hongkou District, Shanghai',
      nearestSubway: 'Line 12 International Cruise Terminal Station, Exit 5 - 800m',
      telephone: ['021-35013777'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2000,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Italian Restaurant', 'Chinese Restaurant', 'Bar'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'Italian']
  } as HotelMerchant,
  
  // Waldorf Astoria Shanghai
  {
    id: 635,
    accountType: 'hotel',
    username: 'waldorfastoriash',
    displayName: 'Waldorf Astoria Shanghai on the Bund',
    verified: true,
    joinDate: 'February 2022',
    recommended: true,
    hashtags: ['#historic', '#luxury', '#heritage', '#classic', '#thebund'],
    district: ['Huangpu'],
    merchantType: 'Luxury Heritage Hotel',
    url: 'https://www.hilton.com/en/hotels/shawtwa-waldorf-astoria-shanghai-on-the-bund/',
    stats: {
      mentionedPosts: 98,
      followers: 9100,
      following: 31
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市黄浦区中山东一路2号',
      englishAddress: '2 Zhongshan Dong Yi Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 10 Yuyuan Garden Station, Exit 3 - 800m',
      telephone: ['021-63229988'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2600,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Long Bar', 'Heritage Tour'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'French', 'German', 'Spanish']
  } as HotelMerchant,
  
  // The Shanghai EDITION
  {
    id: 636,
    accountType: 'hotel',
    username: 'editionsh',
    displayName: 'The Shanghai EDITION',
    verified: true,
    joinDate: 'May 2023',
    recommended: true,
    hashtags: ['#design', '#luxury', '#nightlife', '#trendy', '#foodie'],
    district: ['Jing\'an'],
    merchantType: 'Luxury Lifestyle Hotel',
    url: 'https://www.editionhotels.com/shanghai/',
    stats: {
      mentionedPosts: 87,
      followers: 7800,
      following: 45
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市静安区南京西路199号',
      englishAddress: '199 Nanjing Road East, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2/12 Nanjing West Road Station, Exit 2 - 300m',
      telephone: ['021-53681999'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2400,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Bars', 'Club', 'Rooftop Garden'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'French', 'Russian']
  } as HotelMerchant,
  
  // The Regent Shanghai
  {
    id: 637,
    accountType: 'hotel',
    username: 'regentsh',
    displayName: 'The Regent Shanghai Pudong',
    verified: true,
    joinDate: 'June 2023',
    recommended: true,
    hashtags: ['#luxury', '#business', '#finedining', '#financialdistrict', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Luxury Hotel',
    url: 'https://www.ihg.com/regent/hotels/cn/zh/shanghai/sharz/hoteldetail',
    stats: {
      mentionedPosts: 73,
      followers: 5600,
      following: 28
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市浦东新区陆家嘴世纪大道210号',
      englishAddress: '210 Century Avenue, Lujiazui, Pudong New Area, Shanghai',
      nearestSubway: 'Line 2 Lujiazui Station, Exit 1 - 500m',
      telephone: ['021-20201888'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 2300,
    amenities: ['Free WiFi', 'Indoor Swimming Pool', 'Spa', 'Fitness Center', 'Multiple Restaurants', 'Bar', 'Executive Lounge'],
    stars: 5,
    languagesSpoken: ['Chinese', 'English', 'Japanese', 'Korean']
  } as HotelMerchant,
  
  // Golden Tulip Bund New Asia
  {
    id: 638,
    accountType: 'hotel',
    username: 'goldentulipbund',
    displayName: 'Golden Tulip Bund New Asia',
    verified: true,
    joinDate: 'July 2023',
    recommended: true,
    hashtags: ['#affordable', '#convenient', '#business', '#bund', '#value'],
    district: ['Hongkou'],
    merchantType: 'Business Hotel',
    url: 'https://www.goldentulip.com/en-us/hotels/golden-tulip-bund-new-asia/',
    stats: {
      mentionedPosts: 42,
      followers: 3200,
      following: 65
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市虹口区提篮桥北路422号',
      englishAddress: '422 North Tilanqiao Road, Hongkou District, Shanghai',
      nearestSubway: 'Line 4 Linping Road Station, Exit 4 - 500m',
      telephone: ['021-65471133'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 650,
    amenities: ['Free WiFi', 'Restaurant', 'Business Center', 'Meeting Rooms', 'Fitness Center'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Echarm Xuhui
  {
    id: 639,
    accountType: 'hotel',
    username: 'echarmxuhui',
    displayName: 'Echarm Hotel Shanghai Xuhui',
    verified: true,
    joinDate: 'August 2023',
    recommended: false,
    hashtags: ['#budget', '#convenient', '#clean', '#valueforMoney', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Budget Hotel',
    stats: {
      mentionedPosts: 26,
      followers: 1800,
      following: 72
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市徐汇区漕溪路123号',
      englishAddress: '123 Caoxi Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 1 Shanghai Indoor Stadium Station, Exit 2 - 400m',
      telephone: ['021-64780092'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 350,
    amenities: ['Free WiFi', 'Convenience Store', '24h Front Desk'],
    stars: 3,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Hyatt Centric Urcove Shanghai
  {
    id: 640,
    accountType: 'hotel',
    username: 'urcovehyattsh',
    displayName: 'Hyatt Centric Urcove Shanghai Songjiang',
    verified: true,
    joinDate: 'September 2023',
    recommended: true,
    hashtags: ['#modern', '#business', '#suburban', '#newhotel', '#Songjiang'],
    district: ['Songjiang'],
    merchantType: 'Business Hotel',
    url: 'https://www.hyatt.com/en-US/hotel/china/hyatt-centric-urcove-shanghai-songjiang/shact',
    stats: {
      mentionedPosts: 38,
      followers: 2600,
      following: 54
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市松江区广富林路699号',
      englishAddress: '699 Guangfulin Road, Songjiang District, Shanghai',
      nearestSubway: 'Line 9 Songjiang University Town Station, Exit 3 - 800m',
      telephone: ['021-67792222'],
      branchDistrict: 'Songjiang'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 780,
    amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', 'Meeting Rooms', 'Business Center'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Ji Hotel People's Square
  {
    id: 641,
    accountType: 'hotel',
    username: 'jihotelpeoplesquare',
    displayName: 'Ji Hotel Shanghai People\'s Square',
    verified: true,
    joinDate: 'October 2023',
    recommended: false,
    hashtags: ['#budget', '#central', '#convenient', '#value', '#business'],
    district: ['Huangpu'],
    merchantType: 'Budget Hotel',
    stats: {
      mentionedPosts: 32,
      followers: 2200,
      following: 48
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市黄浦区西藏中路300号',
      englishAddress: '300 Middle Xizang Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 1/8 People\'s Square Station, Exit 4 - 250m',
      telephone: ['021-63259999'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 420,
    amenities: ['Free WiFi', 'Restaurant', 'Meeting Room', '24h Front Desk'],
    stars: 3,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Urside Hotel Shanghai
  {
    id: 642,
    accountType: 'hotel',
    username: 'ursidehotelsh',
    displayName: 'Urside Hotel Shanghai Jing\'an',
    verified: true,
    joinDate: 'November 2023',
    recommended: true,
    hashtags: ['#boutique', '#design', '#hipster', '#moderate', '#Jingan'],
    district: ['Jing\'an'],
    merchantType: 'Boutique Hotel',
    stats: {
      mentionedPosts: 48,
      followers: 3800,
      following: 76
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市静安区威海路245号',
      englishAddress: '245 Weihai Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2/7 Jing\'an Temple Station, Exit 1 - 650m',
      telephone: ['021-62170666'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 850,
    amenities: ['Free WiFi', 'Cafe', 'Bar', 'Co-working Space', 'Bicycle Rental'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English']
  } as HotelMerchant,
  
  // Neobridge Shanghai
  {
    id: 643,
    accountType: 'hotel',
    username: 'neobridgesh',
    displayName: 'Neobridge Hotel Shanghai',
    verified: true,
    joinDate: 'December 2023',
    recommended: true,
    hashtags: ['#modern', '#design', '#business', '#contemporary', '#tech'],
    district: ['Pudong'],
    merchantType: 'Smart Hotel',
    url: 'https://www.neobridgehotels.com/shanghai',
    stats: {
      mentionedPosts: 52,
      followers: 4200,
      following: 68
    },
    profileInterface: ProfileInterface.Hotel,
    location: {
      chineseAddress: '上海市浦东新区张杨路601号',
      englishAddress: '601 Zhangyang Road, Pudong New Area, Shanghai',
      nearestSubway: 'Line 4 Pudian Road Station, Exit 2 - 350m',
      telephone: ['021-58353535'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {}, // Using the predefined values from the HotelMerchant interface
    pricePerNight: 920,
    amenities: ['Free WiFi', 'Smart Room Controls', 'Co-working Spaces', 'Tech Lounge', '24h Robot Service', 'Digital Concierge'],
    stars: 4,
    languagesSpoken: ['Chinese', 'English', 'Japanese']
  } as HotelMerchant,
    
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
  } as BuildingMerchant,

  // Xin Tian Di
  {
    id: 511,
    accountType: 'attraction',
    username: 'xintiandi',
    displayName: 'Xin Tian Di',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#building', '#mall', '#place', '#free', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'CityWalk',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Building,
    location: {
      chineseAddress: '新天地 太仓路181弄2号',
      englishAddress: 'No. 2, Lane 181, Taicang Road, Xintiandi',
      nearestSubway: 'Line 10: First National Congress of the CPC Site · Xintiandi Station',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-23:00' }
      ]
    }
  } as BuildingMerchant,

  // Wukang Road
  {
    id: 512,
    accountType: 'attraction',
    username: 'wukangroad',
    displayName: 'Wukang Road',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#street', '#citywalk', '#takepicture', '#place', '#free', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'CityWalk',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Street,
    location: {
      chineseAddress: '武康路393号甲',
      englishAddress: 'Wukang Road 393A',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)',
      branchDistrict: 'Xuhui'
    }
  } as StreetMerchant,

  // Wukang Building
  {
    id: 513,
    accountType: 'attraction',
    username: 'wukangbuilding',
    displayName: 'Wukang Building',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#place', '#superpicture', '#free', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'CityWalk',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Building,
    location: {
      chineseAddress: '武康大樓 淮海中路1850号',
      englishAddress: 'Wukang Building, 1850 Huaihai Middle Road',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)',
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    }
  } as BuildingMerchant,

  // Apoli Itabakery
  {
    id: 514,
    accountType: 'restaurant',
    username: 'apoliitabakery',
    displayName: 'Apoli Itabakery',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#place', '#snack', '#coffee', '#free', '#recommend', '#affordable', '#Changning'],
    district: ['Changning'],
    merchantType: 'Bakery',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Apoli Itabakery 意大利料理面包坊 兴国路380号',
      englishAddress: '380 Xingguo Road',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)',
      telephone: ['18019262027', '13788942654'],
      branchDistrict: 'Changning'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-20:00' }
      ]
    },
    pricePerPerson: 40
  } as SingleLocationMerchant,

  // The Cottage Cafe
  {
    id: 515,
    accountType: 'restaurant',
    username: 'thecottagecafe',
    displayName: 'The Cottage Cafe',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#place', '#snack', '#coffee', '#free', '#recommend', '#affordable', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Cafe',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '老麦咖啡馆·TheCottageBar(武康大楼店) 武康路439号武康大楼底楼-1',
      englishAddress: 'Wukang Building, 439 Wukang Road, Unit B1-1, Shanghai',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)',
      telephone: ['18201817395', '15026991919'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['10:30-19:00', '19:30-24:00'] }
      ]
    },
    pricePerPerson: 40
  } as SingleLocationMerchant,

  // Gathering Cafe
  {
    id: 516,
    accountType: 'restaurant',
    username: 'gatheringcafe',
    displayName: 'Gathering Cafe',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#place', '#snack', '#coffee', '#free', '#recommend', '#affordable', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'cafe',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '集雅GATHERING咖啡(武康路店) 武康路137号底层',
      englishAddress: 'G/F, 137 Wukang Road',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 3 (walk 420m)',
      telephone: ['13818874372'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '09:00-19:00' }
      ]
    },
    pricePerPerson: 40
  } as SingleLocationMerchant,

  // Subdued
  {
    id: 517,
    accountType: 'shopping',
    username: 'subdued',
    displayName: 'Subdued',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#clothing', '#place', '#shopping', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'fashion',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Subdued(武康路店) 武康路375号',
      englishAddress: '375 Wukang Road',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 3 (walk 690m)',
      telephone: ['021-33683052'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '10:00-20:00' },
        { day: 'Friday-Sunday', hours: '10:00-21:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Anfu Road
  {
    id: 518,
    accountType: 'attraction',
    username: 'anfuroad',
    displayName: 'Anfu Road',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#street', '#citywalk', '#takepicture', '#place', '#free', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'CityWalk',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Street,
    location: {
      chineseAddress: '安福路',
      englishAddress: 'Anfu Road',
      nearestSubway: 'Lines 1 & 7: Changshu Road Station (10min walk)',
      branchDistrict: 'Xuhui'
    }
  } as StreetMerchant,

  // Wiggle Wiggle
  {
    id: 519,
    accountType: 'shopping',
    username: 'wigglewiggle',
    displayName: 'Wiggle Wiggle',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#shopping', '#place', '#superpicture', '#free', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Shopping',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Wiggle Wiggle 安福路308号',
      englishAddress: '308 Anfu Road',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 1 (1.1km walk)',
      telephone: ['13052002197', '13052005783'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '10:00-21:00' },
        { day: 'Friday-Saturday', hours: '10:00-22:00' },
        { day: 'Sunday', hours: '10:00-21:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Brandy Melville
  {
    id: 520,
    accountType: 'shopping',
    username: 'brandymelville',
    displayName: 'Brandy Melville (Shanghai)',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#clothing', '#place', '#shopping', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Shopping',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Brandy Melville 安福路308号',
      englishAddress: '308 Anfu Road',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 1 (1.1km walk)',
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '11:00-20:00' },
        { day: 'Saturday-Sunday', hours: '09:00-21:00' }
      ]
    }
  } as SingleLocationMerchant,

  // LookNow & Flow
  {
    id: 521,
    accountType: 'shopping',
    username: 'looknowandflow',
    displayName: 'LookNow & Flow',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#clothing', '#place', '#shopping', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Shopping',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'LookNow & Flow 安福路156号',
      englishAddress: '156 Anfy Road',
      nearestSubway: 'Line 7: Changshu Road Station, Exit 8 (530m walk)',
      telephone: ['16621162787'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-21:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Sunflour Bakery
  {
    id: 522,
    accountType: 'restaurant',
    username: 'sunflourbakery',
    displayName: 'Sunflour Bakery (Anfu Road Branch)',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#citywalk', '#place', '#snack', '#coffee', '#recommend', '#affordable', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Bakery',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '阳光粮品 安福路308号103-104室',
      englishAddress: '308 Anfu Road, Units 103-104',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 1 (1.2km walk)',
      telephone: ['021-64737757'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '07:00-22:00' }
      ]
    },
    pricePerPerson: 40
  } as SingleLocationMerchant,

  // 13DE MARZO Cafe
  {
    id: 523,
    accountType: 'restaurant',
    username: '13demarzocafe',
    displayName: '13DE MARZO Cafe',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#place', '#snack', '#coffee', '#recommend', '#affordable', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'cafe',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '13DE MARZO CAFÉ(上海安福路店) 安福路322号4号楼1楼',
      englishAddress: '1F, Building 4, 322 Anfu Road',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 1 (1.1km walk)',
      telephone: ['4000131330', '15801707855'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-21:30' }
      ]
    },
    pricePerPerson: 37
  } as SingleLocationMerchant,

  // Shenjing Dessert
  {
    id: 524,
    accountType: 'restaurant',
    username: 'shenjingdessert',
    displayName: 'Shenjing Dessert',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#place', '#snack', '#dessert', '#recommend', '#affordable', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'dessert',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '申井冰店·日式甜品(安福路店) 安福路31号',
      englishAddress: '31 Anfu Road',
      nearestSubway: 'Line 7: Changshu Road Station, Exit 8 (250m walk)',
      telephone: ['19512205883'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-22:00' }
      ]
    },
    pricePerPerson: 35
  } as SingleLocationMerchant,

  // East Nanjing Road
  {
    id: 525,
    accountType: 'attraction',
    username: 'eastnanjingroad',
    displayName: 'East Nanjing Road',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#street', '#citywalk', '#takepicture', '#place', '#free', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'CityWalk',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Street,
    location: {
      chineseAddress: '南京路步行街',
      englishAddress: 'Nanjing Road Pedestrian Street',
      nearestSubway: 'Lines 2/10: East Nanjing Road Station, Exit 4 (turn left) (390m walk)',
      branchDistrict: 'Huangpu'
    }
  } as StreetMerchant,

  // W Management
  {
    id: 526,  // Changed from 525 to 526
    accountType: 'shopping',
    username: 'wmanagement',
    displayName: 'W Management',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#clothing', '#takepicture', '#place', '#shopping', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Fashion',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'W·Management(第一百货南京东路店) 南京东路830号上海市第一百货商店B01层',
      englishAddress: 'B01 Floor, Shanghai No.1 Department Store, 830 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 2: People\'s Square Station (350m walk)',
      telephone: ['15021255027'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Nike001
  {
    id: 527,  // Changed from 526 to 527
    accountType: 'shopping',
    username: 'nike001',
    displayName: 'Nike001 (Asia Biggest Nike Branch)',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#clothing', '#takepicture', '#place', '#shopping', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Fashion',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'NIKE上海001店 南京东路829号上海世茂广场',
      englishAddress: 'Shanghai Shimao Plaza, 829 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station, Exit 19 (220m walk)',
      telephone: ['021-63332888'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Lai Lai Xiao Long
  {
    id: 528,  // Changed from 527 to 528
    accountType: 'restaurant',
    username: 'lailaixiaolong',
    displayName: 'Lai Lai Xiao Long',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#takepicture', '#Chinese', '#XiaoLongBao', '#goodfood', '#affordable', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'XiaoLongBao',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '莱莱小笼·乔艾 黃浦區天津路506号',
      englishAddress: '506 Tianjin Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station, Exit 19 (650m walk)',
      telephone: ['021-63520230'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['08:00-14:00', '15:00-20:00'] }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 60
  } as SingleLocationMerchant,

  // M&M's
  {
    id: 553,  // Changed from 528 to 553
    accountType: 'attraction',
    username: 'mandms',
    displayName: 'M&M\'s',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#shopping', '#snack', '#place', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: 'm豆巧克力世界(上海世茂广场店) 南京东路829号上海世茂广场G层',
      englishAddress: 'Shanghai Shimao Plaza, G Floor, 829 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station, Exit 19 (310m walk)',
      telephone: ['021-23162888'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Shen DaCheng
  {
    id: 529,
    accountType: 'restaurant',
    username: 'shendacheng',
    displayName: 'Shen DaCheng',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#place', '#snack', '#dessert', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Dessert',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '沈大成(南京东路店) 南京东路636号',
      englishAddress: '636 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station, Exit 14 (500m walk)',
      telephone: ['021-63224926', '021-63225615'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '07:00-22:00' }
      ]
    },
    pricePerPerson: 35
  } as SingleLocationMerchant,

  // MINISO LAND
  {
    id: 530,
    accountType: 'attraction',
    username: 'minisoland',
    displayName: 'MINISO LAND',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#shopping', '#place', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '名创优品全球1号店 南京东路479号',
      englishAddress: '479 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 2: East Nanjing Road Station, Exit 4 (turn left) - 240m walk',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Top Toy Shanghai
  {
    id: 531,
    accountType: 'attraction',
    username: 'toptoyshanghai',
    displayName: 'Top Toy Shanghai',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#shopping', '#place', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: 'TOPTOY(上海南京路店) 南京东路558号',
      englishAddress: '558 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 2: East Nanjing Road Station, Exit 4 (turn left) (390m walk)',
      telephone: ['18321765759'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // ZX Shanghai
  {
    id: 532,
    accountType: 'attraction',
    username: 'zxshanghai',
    displayName: 'ZX Shanghai',
    verified: true,
    joinDate: 'January 2024',
    recommended: false,
    hashtags: ['#citywalk', '#takepicture', '#anime', '#shopping', '#place', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '百联ZX创趣场(南京东路店) 南京东路340-372号',
      englishAddress: '340-372 East Nanjing Road, Shanghai',
      nearestSubway: 'Line 2: East Nanjing Road Station, Exit 1 (turn left) (70m walk)',
      telephone: ['021-63516562'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Somekh Building
  {
    id: 533,
    accountType: 'attraction',
    username: 'somekhbuilding',
    displayName: 'Somekh Building',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#citywalk', '#takepicture', '#building', '#place', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '北京东路190号',
      englishAddress: '190 East Beijing Road, Shanghai',
      nearestSubway: 'Line 10: East Nanjing Road Station, Exit 6 (turn left) - 360m walk',
      telephone: ['021-63360090'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // The Upper Room
  {
    id: 534,
    accountType: 'barandclub',
    username: 'theupperroom',
    displayName: 'The Upper Room',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#takepicture', '#superpicture', '#date', '#bar', '#alcohol', '#restaurant', '#nightview', '#rooftop', '#popular', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'THE UPPER ROOM 北京东路190号沙美大楼 顶层',
      englishAddress: 'Top Floor, Shamei Building, 190 East Beijing Road, Shanghai',
      nearestSubway: 'Line 10: East Nanjing Road Station, Exit 6 (360m walk)',
      telephone: ['19370653175'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Sunday', hours: '17:00-01:30' }
      ],
      needBooking: 'No need booking, can walk in'
    },
    pricePerPerson: 90,
    clubCategories: ['rooftop', 'bar', 'nightview']
  } as BarClubMerchant,

  // The Bund
  {
    id: 535,
    accountType: 'attraction',
    username: 'thebund',
    displayName: 'The Bund',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#street', '#takepicture', '#place', '#nightview', '#free', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '外灘',
      englishAddress: 'East Zhongshan No.1 Road, The Bund',
      nearestSubway: 'Line 2: East Nanjing Road Station, Exit 2 (600m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Shanghai Postal Museum
  {
    id: 536,
    accountType: 'attraction',
    username: 'shanghaipostal',
    displayName: 'Shanghai Postal Museum',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#citywalk', '#takepicture', '#museum', '#place', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '上海邮政博物馆 北苏州路250号',
      englishAddress: 'Shanghai Postal Museum, 250 North Suzhou Road, Shanghai',
      nearestSubway: 'Lines 10 & 12: Tiantong Road Station, Exit 3 (turn left) - 250m walk',
      telephone: ['021-63936666'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Wednesday-Thursday', hours: '09:00-17:00' },
        { day: 'Saturday-Sunday', hours: '09:00-17:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // REi·FLOWER COFFEE BAR
  {
    id: 537,
    accountType: 'restaurant',
    username: 'reiflowercoffee',
    displayName: 'REi·FLOWER COFFEE BAR',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#superpicture', '#restaurant', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '汭REi·FLOWER COFFEE BAR 北苏州路234号',
      englishAddress: 'REi·FLOWER COFFEE BAR, 234 North Suzhou Road, Shanghai',
      nearestSubway: 'Lines 10 & 12: Tiantong Road Station, Exit 3 (380m walk)',
      telephone: ['17521187929'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:30-01:00' }
      ],
      needBooking: 'Only walk in'
    },
    pricePerPerson: 56
  } as SingleLocationMerchant,

  // Zhapu Road Bridge
  {
    id: 538,
    accountType: 'attraction',
    username: 'zhapubridge',
    displayName: 'Zhapu Road Bridge',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#place', '#bridge', '#recommend', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '乍浦路橋',
      englishAddress: 'Zhapu Road Bridge',
      nearestSubway: 'Lines 10 & 12: Tiantong Road Station, Exit 3 (turn left) - 630m walk',
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // North Bund
  {
    id: 539,
    accountType: 'attraction',
    username: 'northbund',
    displayName: 'North Bund',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#street', '#citywalk', '#takepicture', '#place', '#recommend', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '北外滩滨江绿地 东大名路558-678',
      englishAddress: 'North Bund Riverside Green Space, 558-678 East Daming Road, Shanghai',
      nearestSubway: 'Line 12: International Cruise Terminal Station, Exit 3 (turn left) - 680m walk',
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // North Bund Little Egg
  {
    id: 540,
    accountType: 'attraction',
    username: 'littleegg',
    displayName: 'North Bund Little Egg',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#superpicture', '#place', '#recommend', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '北外滩小巨蛋 东大名路558-678号北外滩滨江绿地',
      englishAddress: 'North Bund Riverside Green Space, 558-678 East Daming Road, Shanghai',
      nearestSubway: 'Line 12: International Cruise Terminal Station, Exit 3 (turn left) - 640m walk',
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Manner Coffee
  {
    id: 541,
    accountType: 'restaurant',
    username: 'mannercoffee',
    displayName: 'Manner Coffee',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#superpicture', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Manner Coffee(国客滨江店) 太平路国际港务大厦南60米',
      englishAddress: 'Manner Coffee, near International Port Services Building, Taiping Road, Shanghai',
      nearestSubway: 'Line 12: International Cruise Terminal Station, Exit 3 (700m walk)',
      telephone: ['13003185954'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '07:30-22:00' },
        { day: 'Saturday-Sunday', hours: '09:00-22:00' }
      ]
    },
    pricePerPerson: 20
  } as SingleLocationMerchant,

  // J's link Coffee
  {
    id: 542,
    accountType: 'restaurant',
    username: 'jslinkcoffee',
    displayName: 'J\'s link Coffee',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#superpicture', '#restaurant', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '如意摩登滋味小馆（吉生活）(北外滩店) 北苏州河路224号',
      englishAddress: 'J\'s link Coffee, 224 North Suzhou Creek Road, Shanghai',
      nearestSubway: 'Lines 10 & 12: Tiantong Road Station, Exit 3 (380m walk)',
      telephone: ['19531936988'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-21:00' }
      ]
    },
    pricePerPerson: 60
  } as SingleLocationMerchant,

  // The People Coffee
  {
    id: 543,
    accountType: 'restaurant',
    username: 'thepeoplecoffee',
    displayName: 'The People Coffee',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#superpicture', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '看得到风景的咖啡馆(白玉兰广场店) 东大名路501号白玉兰商务楼空中大堂L层',
      englishAddress: 'Sky Lobby L Floor, Magnolia Business Tower, Shanghai',
      nearestSubway: 'Line 12: International Cruise Terminal Station, Exit 3 (470m walk)',
      telephone: ['021-55669277'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday', hours: '09:00-22:30' },
        { day: 'Tuesday-Sunday', hours: ['09:00-18:30', '19:00-24:00'] }
      ],
      needBooking: 'Can book or walk in. Recommend weekday morning if walk in'
    },
    pricePerPerson: 65
  } as SingleLocationMerchant,

  // Oriental Pearl Tower
  {
    id: 544,
    accountType: 'attraction',
    username: 'orientalpearltower',
    displayName: 'Oriental Pearl Tower',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#landmark', '#tower', '#sightseeing', '#takepicture', '#place', '#nightview', '#popular', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Skyscraper',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '東方之珠 世纪大道1号',
      englishAddress: 'Oriental Pearl Tower, 1 Century Avenue, Shanghai',
      nearestSubway: 'Line 2: Lujiazui Station, Exit 1 (turn left) - 300m walk',
      telephone: ['021-58792888', '021-58791888'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '08:30-21:30' }
      ]
    },
    ticketPrice: 199
  } as AttractionMerchant,

  // Lujiazui Three Towers
  {
    id: 545,
    accountType: 'attraction',
    username: 'threetowers',
    displayName: 'Lujiazui Three Towers',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#street', '#takepicture', '#superpicture', '#place', '#nightview', '#free', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Skyscraper',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '陆家嘴三件套, 上海环球金融中心附近',
      englishAddress: 'Near Shanghai World Financial Center, 100 Century Avenue, Shanghai',
      nearestSubway: 'Lines 2/14: Lujiazui Station, Exit 8 (570m walk)',
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Museum of Art Pudong
  {
    id: 546,
    accountType: 'attraction',
    username: 'museumofartpd',
    displayName: 'Museum of Art Pudong',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#citywalk', '#takepicture', '#museum', '#place', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Museum',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '浦东美术馆 滨江大道2777号',
      englishAddress: '2777 Binjiang Avenue, Shanghai',
      nearestSubway: 'Line 2: Lujiazui Station, Exit 1 (turn left) - 690m walk',
      telephone: ['4008208771'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-21:00' }
      ]
    },
    ticketPrice: 100
  } as AttractionMerchant,

  // Huanle Square
  {
    id: 547,
    accountType: 'attraction',
    username: 'huanlesquare',
    displayName: 'Huanle Square',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#street', '#takepicture', '#superpicture', '#place', '#nightview', '#sunset', '#free', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '浦东欢乐广场 滨江大道2967号',
      englishAddress: '2967 Binjiang Avenue, Shanghai',
      nearestSubway: 'Lines 2/14: Lujiazui Station, Exit 10 (8min walk)',
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Shanghai Disneyland
  {
    id: 548,
    accountType: 'attraction',
    username: 'shanghaidisney',
    displayName: 'Shanghai Disneyland',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#takepicture', '#place', '#kids', '#fun', '#themepark', '#disney', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Disney',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '上海迪士尼乐园 川沙镇黄赵路310号',
      englishAddress: '310 Huangzhao Road, Chuansha Town, Shanghai',
      nearestSubway: 'Line 2: Disney Resort Station, Exit 1 (600m walk)',
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '08:30-21:30' }
      ]
    },
    ticketPrice: 449
  } as AttractionMerchant,

  // Shanghai Wild Animal Park
  {
    id: 549,
    accountType: 'attraction',
    username: 'shwzoo',
    displayName: 'Shanghai Wild Animal Park',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#takepicture', '#place', '#kids', '#fun', '#zoo', '#animals', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Wild Animal',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '上海野生动物园 南六公路178号',
      englishAddress: '178 South Sixth Highway, Shanghai',
      nearestSubway: 'Line 16: Shanghai Wild Animal Park Station, Exit 2',
      telephone: ['021-58036000'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '09:00-17:00' }
      ]
    },
    ticketPrice: 165
  } as AttractionMerchant,

  // Hai Chang Ocean Park
  {
    id: 550,
    accountType: 'attraction',
    username: 'haichangoceanpark',
    displayName: 'Hai Chang Ocean Park',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#takepicture', '#place', '#kids', '#fun', '#themepark', '#oceanpark', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Wild Animal',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: '海昌海洋公园 银飞路166号',
      englishAddress: '166 Yinfei Road, Shanghai',
      nearestSubway: 'Not available - recommend take taxi instead',
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '09:30-20:30' }
      ]
    },
    ticketPrice: 339
  } as AttractionMerchant,

  // KKU Bakery Coffee
  {
    id: 551,
    accountType: 'restaurant',
    username: 'kkucoffee',
    displayName: 'KKU Bakery Coffee',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#superpicture', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '亲亲侬(南苏州路店) 南苏州路198号第一加油站2楼（便利店内楼梯上去）',
      englishAddress: '2F, No.1 Gas Station, 198 South Suzhou Road (via stairs inside convenience store)',
      nearestSubway: 'Lines 10/12: Tiantong Road Station, Exit 3 (510m walk)',
      telephone: ['15821335777'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '09:00-21:00' }
      ]
    },
    pricePerPerson: 40
  } as SingleLocationMerchant,

  // Bund 8 Coffee
  {
    id: 552,
    accountType: 'restaurant',
    username: 'bund8coffee',
    displayName: 'Bund 8 Coffee',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#superpicture', '#takepicture', '#date', '#coffee', '#place', '#nightview', '#popular', '#recommend', '#affordable', '#Hongkou'],
    district: ['Hongkou'],
    merchantType: 'Coffee',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '外滩8号Bund 8 Café(金延大厦店) 中山东二路8号',
      englishAddress: '8 East Zhongshan No.2 Road, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (550m walk)',
      telephone: ['15821335777'],
      branchDistrict: 'Hongkou'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:30-18:00' }
      ]
    },
    pricePerPerson: 57
  } as SingleLocationMerchant,

  // Basement FG
  {
    id: 554,
    accountType: 'shopping',
    username: 'basementfg',
    displayName: 'Basement FG (Shanghai)',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#clothing', '#place', '#shopping', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Fashion',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'BASEMENT FG (上海店) 新乐路82号',
      englishAddress: 'BASEMENT FG Shanghai Store, 82 Xinle Road, Shanghai',
      nearestSubway: 'Line 12: Shaanxi South Road Station, Exit 10 (500m walk)',
      telephone: ['021-60197288'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '11:00-21:30' },
        { day: 'Saturday-Sunday', hours: '11:00-22:00' }
      ]
    }
  } as SingleLocationMerchant,

  // Discus Mart
  {
    id: 555,
    accountType: 'attraction',
    username: 'discusmart',
    displayName: 'Discus Mart',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#clothing', '#place', '#shopping', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.Attraction,
    location: {
      chineseAddress: 'Discus Mart(新天地广场店) 淮海中路333号新天地广场B2-01',
      englishAddress: 'Discus Mart, B2-01, Xintiandi Plaza, 333 Huaihai Middle Road, Shanghai',
      nearestSubway: 'Line 1: First National Congress of the CPC Site - Huangpi South Road Station, Exit 2 (190m walk)',
      telephone: ['021-63866567'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ]
    },
    ticketPrice: 0
  } as AttractionMerchant,

  // Crab Noodles Lee
  {
    id: 556,
    accountType: 'restaurant',
    username: 'crabnoodleslee',
    displayName: 'Crab Noodles Lee',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#Chinese', '#CrabNoodles', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Cuisine',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '李百蟹·蟹黄面·江景餐厅(外滩·豫园店) 外滩22号中山东二路22号3楼',
      englishAddress: '3F, No.22 East Zhongshan No.2 Road, The Bund, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (500m walk)',
      telephone: ['13328012446'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 110
  } as SingleLocationMerchant,

  // Xie Zhen Xiang
  {
    id: 557,
    accountType: 'restaurant',
    username: 'xiezhenxiang',
    displayName: 'Xie Zhen Xiang',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#Chinese', '#CrabNoodles', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Cuisine',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '蟹珍香·百年蟹黄面(外滩店) 中山东一路391号',
      englishAddress: '391 East Zhongshan No.1 Road, The Bund, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (270m walk)',
      telephone: ['19301193710'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-23:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 110
  } as SingleLocationMerchant,

  // Nan Xiang Steamed Bun Restaurant
  {
    id: 558,
    accountType: 'restaurant',
    username: 'nanxiangbun',
    displayName: 'Nan Xiang Steamed Bun Restaurant',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#takepicture', '#Chinese', '#XiaoLongBao', '#goodfood', '#affordable', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Cuisine',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '南翔馒头店(豫园店) 豫园路87号',
      englishAddress: '87 Yuyuan Road, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (520m walk)',
      telephone: ['021-63554206'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '07:30-20:30' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 110
  } as SingleLocationMerchant,

  // Dong Tai Xiang
  {
    id: 559,
    accountType: 'restaurant',
    username: 'dongtaixiang',
    displayName: 'Dong Tai Xiang',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#breakfast', '#midnight', '#chinese', '#pan-fried buns', '#takepicture', '#goodfood', '#affordable', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '东泰祥生煎馆(重庆北路店) 重庆北路188号',
      englishAddress: '188 Chongqing North Road, Shanghai',
      nearestSubway: 'Line 14: Site of the First National Congress of the CPC & South Huangpi Road Station, Exit 4 (600m walk)',
      telephone: ['021-63595808'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '00:00-24:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 30
  } as SingleLocationMerchant,

  // Yang's Dumpling
  {
    id: 560,
    accountType: 'restaurant',
    username: 'yangsdumpling',
    displayName: 'Yang\'s Dumpling',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#breakfast', '#lunch', '#takepicture', '#Chinese', '#pan fried buns', '#goodfood', '#affordable', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '小杨生煎(福州路店) 南京东路街道福州路567号1楼东北侧-b',
      englishAddress: 'Unit B, Northeast Section, 1F, 567 Fuzhou Road, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station (420m walk)',
      telephone: ['021-63330520'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '00:00-24:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 30
  } as SingleLocationMerchant,

  // Chongqing Banquet
  {
    id: 561,
    accountType: 'restaurant',
    username: 'chongqingbanquet',
    displayName: 'Chongqing Banquet',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#luxury', '#Chinese', '#Hotpot', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Hotpot Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '宴山城重庆火锅(外滩江景店) 广东路20号外滩5号6楼江景',
      englishAddress: '6F, No.5 Bund, 20 Guangdong Road, Shanghai (Riverside View)',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 6 (680m walk)',
      telephone: ['021-63307725'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:00-14:00', '17:00-22:30'] }
      ],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 800
  } as SingleLocationMerchant,

  {
    id: 562,
    accountType: 'restaurant',
    username: 'qingtinghotpot',
    displayName: 'Qing Ting Cheung Du Hotpot',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#takepicture', '#Chinese', '#Hotpot', '#goodfood', '#recommend', '#Jingan'],
    district: ['Jingan'],
    merchantType: 'Hotpot Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '卿庭·成都鲜货火锅 靜安區愚园路68号CP静安购物中心7楼L7-09',
      englishAddress: 'Unit L7-09, 7F, CP Jingan Shopping Center, 68 Yuyuan Road, Shanghai',
      nearestSubway: 'Line 2: Jingan Temple Station (310m walk)',
      telephone: ['18916507067', '021-62170017'],
      branchDistrict: 'Jingan'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-02:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 150
  } as SingleLocationMerchant,

  {
    id: 563,
    accountType: 'restaurant',
    username: 'wonghotpot',
    displayName: 'Seafood Wong Hotpot',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#dinner', '#chinese', '#hotpot', '#takepicture', '#goodfood', '#affordable', '#midnight', '#recommend', '#Putuo', '#Changning', '#Yangpu'],
    district: ['Putuo', 'Changning', 'Yangpu'],
    merchantType: 'Hotpot Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 110,
    needBooking: 'Only accept walk-in',
    branches: [
      {
        chineseAddress: '王富贵火锅(中山公园店) 龙之梦黄中庭9楼',
        englishAddress: '9F, Longemont Zhongting, 1555 Changning Road, Shanghai',
        telephone: ['18916162530'],
        branchDistrict: 'Changning',
        nearestSubway: 'Line 2: Zhongshan Park Station (30m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-05:00' }
        ]
      },
      {
        chineseAddress: '王富贵火锅(长寿路店) 长寿路155号巴黎春天5楼',
        englishAddress: '5F, Paris Spring Mall, 155 Changshou Road, Shanghai',
        telephone: ['15300859052'],
        branchDistrict: 'Putuo',
        nearestSubway: 'Line 13: Jiangning Road Station, Exit 4 (340m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-05:00' }
        ]
      },
      {
        chineseAddress: '王富贵火锅(五角场店) 淞沪路151号诚品国际中环大厦3楼',
        englishAddress: '3F, Chengguo International Zhonghuan Building, 151 Songhu Road, Shanghai',
        telephone: ['18017213938'],
        branchDistrict: 'Yangpu',
        nearestSubway: 'Line 10: Jiangwan Stadium Station, Exit 6 (50m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-05:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 564,
    accountType: 'restaurant',
    username: 'twohotpot',
    displayName: 'Two Hotpot',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#dinner', '#Chinese', '#Hotpot', '#goodfood', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Hotpot Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '二火锅(上海店) 浙江中路283号2层B区2-1至2-3',
      englishAddress: 'Units 2-1 to 2-3, Area B, 2F, 283 Middle Zhejiang Road, Shanghai',
      nearestSubway: 'Line 1: People\'s Square Station, Exit 14 (370m walk)',
      telephone: ['021-63368222'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-02:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 120
  } as SingleLocationMerchant,

  {
    id: 565,
    accountType: 'restaurant',
    username: 'dingtelenoodles',
    displayName: 'Ding Te Le Noodles',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#midnight', '#Chinese', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '顶特勒粥面馆(淮海路店)\n淮海中路494弄22号工商银行旁',
      englishAddress: 'Unit 22, Lane 494, Middle Huaihai Road (Next to ICBC), Shanghai',
      nearestSubway: 'Line 14: Site of the First National Congress of the CPC - Huangpi South Road Station, Exit 7 (450m walk)',
      telephone: ['021-63391259', '13818055200'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '00:00-24:00'
      }],
      needBooking: 'No need booking, just walk in'
    },
    pricePerPerson: 40
  },
  {
    id: 566,
    accountType: 'restaurant',
    username: 'zhaozhounoodles',
    displayName: 'Zhao Zhou Noodles',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#midnight', '#Chinese', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '肇周拉面\n肇周路33号',
      englishAddress: '33 Zhaozhou Road, Shanghai',
      nearestSubway: 'Line 8: Laoximen Station, Exit 3 (300m walk)',
      telephone: ['13761502036'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '00:00-24:00'
      }],
      needBooking: 'No need booking, just walk in'
    },
    pricePerPerson: 30
  },
  {
    id: 567,
    accountType: 'restaurant',
    username: 'likesomechickenpot',
    displayName: 'LikeSome Chicken Pot',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#midnight', '#dinner', '#hotpot', '#goodfood', '#Chinese', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '禄婶鲜切鸡煲(复兴公园·INS新乐园店)\n雁荡路109号INS复兴公园2楼',
      englishAddress: '2F, INS Park, 109 Yandang Road, Shanghai',
      nearestSubway: 'Line 13: Site of the First National Congress of the CPC - Xintiandi Station, Exit 5 (720m walk)',
      telephone: ['18121332304'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '17:00-05:00'
      }],
      needBooking: 'No need booking, just walk in'
    },
    pricePerPerson: 110
  },
  {
    id: 568,
    accountType: 'restaurant',
    username: '3warehouse',
    displayName: '3 Warehouse',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#Chinese food', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '3号仓库·餐厅(新世界城店)\n南京西路2-68号新世界城4楼A29',
      englishAddress: 'Unit A29, 4F, New World City, 2-68 West Nanjing Road, Shanghai',
      nearestSubway: 'Line 2: People\'s Square Station (140m walk)',
      telephone: ['021-58888829', '18721193809'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '10:00-21:30'
      }],
      needBooking: 'Only Walk-in'
    },
    pricePerPerson: 150
  },
  {
    id: 569,
    accountType: 'restaurant',
    username: 'laojielin',
    displayName: 'Lao Jie Lin',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#dinner', '#affordable', '#birthday', '#date', '#takepicture', '#Chinese', '#goodfood', '#Putuo'],
    district: ['Putuo'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '老街邻牛大骨(上海总店) 骊山路26号-10号临',
      englishAddress: 'Unit 26-10, 26 Lishan Road, Shanghai',
      nearestSubway: 'Lines 3/4: Zhongtan Road Station, Exit 1 (970m walk)',
      telephone: ['19921168887'],
      branchDistrict: 'Putuo'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '10:00-24:00'
      }],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 110
  },
  {
    id: 570,
    accountType: 'restaurant',
    username: 'crabandpainting',
    displayName: 'Crab & Painting',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#luxury', '#birthday', '#date', '#takepicture', '#Chinese', '#goodfood', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '蟹仙画宴Crab&Painting(外滩五号店) 广东路20号外滩5号2楼',
      englishAddress: '2F, No.5 Bund, 20 Guangdong Lu, Huangpu District, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 6 (690m walk)',
      telephone: ['021-63616660'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: ['11:00-14:00', '17:00-22:30']
      }]
    },
    pricePerPerson: 1100
  },
  {
    id: 571,
    accountType: 'restaurant',
    username: 'orientalarchitecture',
    displayName: 'Oriental Architecture',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#luxury', '#birthday', '#date', '#takepicture', '#Chinese', '#goodfood', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '成因绕梁Oriental Architecture(外滩27号店) 中山东一路27号罗斯福公馆2楼202号',
      englishAddress: 'No. 202, 2nd Floor, Roosevelt Mansion, No. 27 Zhongshan East 1st Road, Shanghai',
      nearestSubway: 'Line 10: East Nanjing Road Station, Exit 6 (600m walk)',
      telephone: ['13512129077', '021-63306816'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: ['11:00-14:00', '17:00-22:30']
      }],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 820
  },
  {
    id: 572,
    accountType: 'restaurant',
    username: 'hoxabistro',
    displayName: 'Hoxa Bistro',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#superpicture', '#western', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Western Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'hoxa bistro现代新疆小酒馆(外滩沙美店) 北京东路194号沙美大楼二楼',
      englishAddress: '2F, Shamei Building, 194 Beijing East Road, Shanghai',
      nearestSubway: 'Line 10: East Nanjing Road Station, Exit 6 (360m walk)',
      telephone: ['18930939307'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [{
        day: 'Monday-Sunday',
        hours: '11:00-23:00'
      }],
      needBooking: 'can book or walk in'
    },
    pricePerPerson: 140
  },
  {
    id: 573,
    accountType: 'restaurant',
    username: 'orientalhouse',
    displayName: 'Oriental House',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#Jingan'],
    district: ['Jingan'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '醉东Oriental House(静安嘉里店) 南京西路嘉里中心北区4层N4-15号',
      englishAddress: 'Unit N4-15, 4F North Zone, Kerry Center, West Nanjing Road, Shanghai',
      nearestSubway: 'Line 7: Jing\'an Temple Station, Exit 6 (90m walk)',
      telephone: ['19521377866'],
      branchDistrict: 'Jingan'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: ['11:00-14:00', '17:00-21:00'] },
        { day: 'Friday-Sunday', hours: ['11:00-14:00', '16:30-21:00'] }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 320
  } as SingleLocationMerchant,

  {
    id: 574,
    accountType: 'restaurant',
    username: 'chenglonghangcrab',
    displayName: 'Cheng Long Hang Crab',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '成隆行·蟹王府(九江路店) 九江路216号',
      englishAddress: '216 Jiujiang Road, Shanghai',
      nearestSubway: 'Line 10: East Nanjing Road Station (230m walk)',
      telephone: ['021-63212010'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:00-15:00', '17:00-22:00'] }
      ],
      needBooking: 'Phone booking or Walk in'
    },
    pricePerPerson: 350
  } as SingleLocationMerchant,

  {
    id: 575,
    accountType: 'restaurant',
    username: 'loongdockcrabhouse',
    displayName: 'Loong Dock Crab House',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '龍码头·螃蟹王(博荟店) 中山南一路788号博荟广场L2层12号',
      englishAddress: 'Unit 12, L2, Bo Hui Plaza, 788 South Zhongshan No.1 Road, Shanghai',
      nearestSubway: 'Line 13: World Expo Museum Station (10m walk)',
      telephone: ['021-57939777'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: ['10:30-14:30', '17:00-21:30'] },
        { day: 'Saturday-Sunday', hours: '10:30-21:30' }
      ],
      needBooking: 'Phone booking or Walk in'
    },
    pricePerPerson: 500
  } as SingleLocationMerchant,

  {
    id: 576,
    accountType: 'restaurant',
    username: 'shiheyuan',
    displayName: 'Shi He Yuan',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '柿合缘新京菜(国金中心商场店) 世纪大道8号国金中心L4-402&403',
      englishAddress: 'Units 402 & 403, 4F, IFC Mall, 8 Century Avenue, Shanghai',
      nearestSubway: 'Line 14: Lujiazui Station, Exit 7 (30m walk)',
      telephone: ['021-58757773'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:00-14:00', '17:00-20:30'] }
      ],
      needBooking: '電話预订'
    },
    pricePerPerson: 300
  } as SingleLocationMerchant,

  {
    id: 577,
    accountType: 'restaurant',
    username: 'shengyongxing',
    displayName: 'Sheng Yong Xing',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '晟永興(外滩店) 外滩5号5楼',
      englishAddress: '5F, Bund 5, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 6 (800m walk)',
      telephone: ['021-63302885'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:30-15:00', '17:30-21:30'] }
      ],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 450
  } as SingleLocationMerchant,

  {
    id: 578,
    accountType: 'restaurant',
    username: 'laoxingxian',
    displayName: 'Lao Xing Xian',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#luxury', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '老兴鲜(黄浦店) 淮海中路918号百盛商场5楼',
      englishAddress: '5F, Parkson Shopping Mall, 918 Middle Huaihai Road, Shanghai',
      nearestSubway: 'Line 1: South Shaanxi Road Station, Exit 2 (60m walk)',
      telephone: ['13681653751'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:00-14:00', '17:00-21:00'] }
      ],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 240
  } as SingleLocationMerchant,

  {
    id: 579,
    accountType: 'restaurant',
    username: 'dabaokoufu',
    displayName: 'Da Bao Kou Fu',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#takepicture', '#Chinese', '#goodfood', '#recommend', '#affordable', '#Changning'],
    district: ['Changning'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '大寶口福·海鲜排档·平价海鲜(长宁来福士店) 长宁路1191号长宁来福士广场东区4层22-24号',
      englishAddress: 'Units 22-24, 4F, Raffles City Changning East Zone, 1191 Changning Road, Shanghai',
      nearestSubway: 'Lines 3/4: Zhongshan Park Station, Exit 7 (210m walk)',
      telephone: ['15026886222'],
      branchDistrict: 'Changning'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:30-22:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 130
  } as SingleLocationMerchant,

  {
    id: 580,
    accountType: 'restaurant',
    username: 'communereserve',
    displayName: 'COMMUNE RESERVE',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#girls night', '#italian', '#western', '#goodfood', '#recommend', '#affordable', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Italian Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'COMMUNE RESERVE幻师(上海环球金融中心店) 世纪大道100号上海环球金融中心B1',
      englishAddress: 'B1, Shanghai World Financial Center, 100 Century Avenue, Shanghai',
      nearestSubway: 'Line 14: Lujiazui Station, Exit 8 (690m walk)',
      telephone: ['19117256073'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '11:00-02:00' },
        { day: 'Saturday-Sunday', hours: '10:00-02:00' }
      ],
      needBooking: 'No need booking. Weekdays are good, but weekend is crowded'
    },
    pricePerPerson: 150
  } as SingleLocationMerchant,

  {
    id: 581,
    accountType: 'restaurant',
    username: 'otfsicilia',
    displayName: 'OTF Sicilia',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#birthday', '#date', '#takepicture', '#italian', '#western', '#goodfood', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Italian Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '假日餐厅 东育路500弄1-9号前滩太古里木区W-L3-04a（HUAWEI楼上）',
      englishAddress: 'Unit W-L3-04a, Wood Zone, Taikoo Li Qiantan, 500 Dongyu Road, Shanghai',
      nearestSubway: 'Lines 6/8/11: Oriental Sports Center Station, Exit 1 (130m walk)',
      telephone: ['17701671603'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-21:00' }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 150
  } as SingleLocationMerchant,

  {
    id: 582,
    accountType: 'restaurant',
    username: 'rivieraitalian',
    displayName: 'Riviera Italian Restaurant',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#birthday', '#date', '#superpicture', '#takepicture', '#italian', '#western', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Italian Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '天水恋意大利餐厅(滨江大道店) 陆家嘴街道滨江大道3082号(滨江大道富都段滨江花园内近富城路)',
      englishAddress: '3082 Binjiang Avenue, Lujiazui Subdistrict, Shanghai',
      nearestSubway: 'Line 14: Lujiazui Station, Exit 9B (620m walk)',
      telephone: ['021-58775966'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:30-23:00' }
      ],
      needBooking: 'Walk in only, recommend arrive 5:30pm to get good seats'
    },
    pricePerPerson: 188
  } as SingleLocationMerchant,

  {
    id: 583,
    accountType: 'restaurant',
    username: 'lejardinsecret',
    displayName: 'Le Jardin Secret',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#goodfood', '#recommend', '#affordable', '#Changning'],
    district: ['Changning'],
    merchantType: 'Western Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '秘密花园(法华镇路店) 新华路街道法华镇路525号创意树林入口处(香花桥路口)',
      englishAddress: 'Entrance of Creative Woods, 525 Fahua Town Road, Xinhua Road Subdistrict, Shanghai',
      nearestSubway: 'Line 10: Shanghai Jiao Tong University Station, Exit 5 (1.1km walk)',
      telephone: ['021-60821775'],
      branchDistrict: 'Changning'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-22:00' }
      ],
      needBooking: 'Phone booking or walk in'
    },
    pricePerPerson: 120
  } as SingleLocationMerchant,

  {
    id: 584,
    accountType: 'restaurant',
    username: 'DonQuixote',
    displayName: 'Don Quixote Spanish Restaurant Wine House',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#Spanish', '#goodfood', '#recommend', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Spanish Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Don Quixote堂吉诃德·西班牙餐厅酒馆(陆家嘴滨江店) 富城路14号02单元',
      englishAddress: 'Unit 02, 14 Fucheng Road, Shanghai',
      nearestSubway: 'Line 14: Lujiazui Station, Exit 10 (740m walk)',
      telephone: ['15317206957', '18602128217'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-24:00' }
      ],
      needBooking: 'Need to book, can walk in if seats are available'
    },
    pricePerPerson: 180
  } as SingleLocationMerchant,

  {
    id: 585,
    accountType: 'restaurant',
    username: 'lunettebyamanda',
    displayName: 'Lunette By Amanda',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#luxury', '#French', '#western', '#wellington', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'French Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '弦月窗(外滩店) 外滩街道四川中路133号7楼(近广东路)',
      englishAddress: '7F, 133 Middle Sichuan Road, The Bund Subdistrict, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 6 (650m walk)',
      telephone: ['021-63308831', '021-63308878'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Saturday-Sunday', hours: ['11:00-16:00', '16:30-23:30'] },
        { day: 'Monday-Friday', hours: ['11:30-14:30', '16:30-23:30'] }
      ],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 680
  } as SingleLocationMerchant,

  {
    id: 586,
    accountType: 'restaurant',
    username: 'restaurantcuivre',
    displayName: 'Restaurant Cuivre',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#French', '#western', '#goodfood', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'French Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Restaurant Cuivre古铜法式餐厅 淮海中路1502号-1临（近乌鲁木齐路）',
      englishAddress: '1502-1 Lin, Middle Huaihai Road, Shanghai (Near Urumqi Road)',
      nearestSubway: 'Line 10: Shanghai Library Station, Exit 2 (260m walk)',
      telephone: ['021-64374219'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: ['11:30-14:00', '17:30-22:00'] }
      ],
      needBooking: 'Can book or walk in'
    },
    pricePerPerson: 280
  } as SingleLocationMerchant,

  {
    id: 587,
    accountType: 'restaurant',
    username: 'jeangeorges',
    displayName: 'Jean Georges',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#French', '#western', '#goodfood', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'French Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: 'Jean Georges 外滩街道中山东一路3号外滩三号4楼(近广东路)',
      englishAddress: '4F, Bund 3, 3 East Zhongshan No.1 Road, Shanghai',
      nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (770m walk)',
      telephone: ['021-63217733'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: ['11:30-14:30', '17:30-21:30'] },
        { day: 'Saturday-Sunday', hours: ['11:30-15:00', '17:30-21:30'] }
      ],
      needBooking: 'Phone booking required'
    },
    pricePerPerson: 1000
  } as SingleLocationMerchant,

  {
    id: 588,
    accountType: 'restaurant',
    username: 'chogacrab',
    displayName: 'Choga Soy Sauce Crab',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#korean', '#goodfood', '#recommend', '#Minhang'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '草家真味酱蟹·炭火牛排专门店(天乐广场店) 银亭路68-78号天乐广场北楼2楼204',
      englishAddress: 'Unit 204, 2F North Building, Tianle Plaza, 68-78 Yinting Road, Shanghai',
      nearestSubway: 'Line 10: Longbai Xincun Station, Exit 3 (580m walk)',
      telephone: ['13564666418'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-22:30' }
      ],
      needBooking: 'Can book or walk in'
    },
    pricePerPerson: 180
  } as SingleLocationMerchant,

  {
    id: 589,
    accountType: 'restaurant',
    username: 'nabikorean',
    displayName: 'Nabi',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#date', '#birthday', '#luxury', '#korean', '#goodfood', '#recommend', '#Changning'],
    district: ['Changning'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '武夷路168号WYSH翡悦里1号楼2层201室',
      englishAddress: 'Unit 201, 2F, WYSH Feiyue Li Building 1, 168 Wuyi Road, Shanghai',
      nearestSubway: 'Line 11: Jiangsu Road Station, Exit 7 (1.0km walk)',
      branchDistrict: 'Changning'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Saturday', hours: '18:00-23:00' }
      ],
      needBooking: 'Need booking on Wechat App'
    },
    pricePerPerson: 1088
  } as SingleLocationMerchant,

  {
    id: 590,
    accountType: 'restaurant',
    username: 'grilledee',
    displayName: 'Sanchuan Grilled Ee',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#korean', '#Minhang', '#recommend'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '山川爱烤鳗鱼(金虹桥·井亭苑店) 虹莘路3811号2楼',
      englishAddress: 'Unit 3811-2, 2F, Di Bao Building, 3811 Hongxin Road, Shanghai',
      nearestSubway: 'Line 10: Ziteng Road Station (980m walk)',
      telephone: ['021-54573750'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-22:30' }
      ],
      needBooking: 'Recommend phone booking, crowded on weekends'
    },
    pricePerPerson: 200
  } as SingleLocationMerchant,

  {
    id: 591,
    accountType: 'restaurant',
    username: 'zhengsanxi',
    displayName: 'Zhengsanxi BBQ',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#korean', '#goodfood', '#recommend', '#Minhang'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '正三熙by韩国街小木屋烤肉(虹泉路1号店) 虹泉路1101弄46号一楼',
      englishAddress: 'Hongquan Road 1101 Long No.46 F1, Minhang, Shanghai',
      nearestSubway: 'Line 10: Longbai Xincun Station, Exit 3 (800m walk)',
      telephone: ['021-54337255', '13585946606'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:00-03:00' }
      ],
      needBooking: 'Can book or walk in'
    },
    pricePerPerson: 120
  } as SingleLocationMerchant,

  {
    id: 592,
    accountType: 'restaurant',
    username: 'auntietangfan',
    displayName: 'Auntie Tang Fan',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#restaurant', '#dinner', '#korean', '#Minhang', '#affordable'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '阿姨汤饭面馆(虹泉路店) 虹泉路1000号井亭大厦2楼',
      englishAddress: '2F, Jingting Building, 1000 Hongquan Road, Shanghai',
      nearestSubway: 'Line 10: Longbai Xincun Station, Exit 3 (1.0km walk)',
      telephone: ['021-34633367'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: ['11:00-15:00', '16:30-22:00'] },
        { day: 'Saturday-Sunday', hours: ['11:00-15:00', '16:00-22:00'] }
      ],
      needBooking: 'No need, can walk in'
    },
    pricePerPerson: 60
  } as SingleLocationMerchant,

  {
    id: 593,
    accountType: 'restaurant',
    username: 'qinghequ',
    displayName: 'Qing He Qu BBQ',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#korean', '#goodfood', '#recommend', '#Minhang'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '青鹤谷(虹莘路总店) 虹莘路3998号帝宝大厦2楼',
      englishAddress: '2F, Dibao Building, 3998 Hongxin Road, Shanghai',
      nearestSubway: 'Line 10: Longbai Xincun Station, Exit 3 (560m walk)',
      telephone: ['021-34322698'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Friday', hours: ['11:30-14:00', '17:00-21:00'] },
        { day: 'Saturday-Sunday', hours: ['11:30-15:00', '16:30-21:00'] }
      ],
      needBooking: 'Line up at store'
    },
    pricePerPerson: 180
  } as SingleLocationMerchant,

  {
    id: 594,
    accountType: 'restaurant',
    username: '88restaurant',
    displayName: '88 Restaurant',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#korean', '#goodfood', '#recommend', '#Minhang'],
    district: ['Minhang'],
    merchantType: 'Korean Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    location: {
      chineseAddress: '88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室',
      englishAddress: 'Unit 104, Block B, Jingting Building, Hongquan Road, Shanghai',
      nearestSubway: 'Line 10: Longbai Xincun Station, Exit 3 (800m walk)',
      telephone: ['021-54337255', '13585946606'],
      branchDistrict: 'Minhang'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: ['11:00-14:00', '16:00-21:30'] },
        { day: 'Saturday-Sunday', hours: '11:00-22:00' }
      ],
      needBooking: 'can walk in'
    },
    pricePerPerson: 120
  } as SingleLocationMerchant,

  {
    id: 595,
    accountType: 'restaurant',
    username: 'yuxingjinoodles',
    displayName: 'Yu Xing Ji Noodles',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#chinese', '#crab noodles', '#takepicture', '#goodfood', '#affordable', '#recommend', '#Huangpu', '#Xuhui', '#Jingan', '#Pudong'],
    district: ['Huangpu', 'Xuhui', 'Jingan', 'Pudong'],
    merchantType: 'Chinese Noodle Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 100,
    needBooking: 'Only accept walk-in',
    branches: [
      {
        chineseAddress: '裕兴记•蟹黄面馆(外滩店) 四川中路410号南京路步行街路口50米',
        englishAddress: '50m from Nanjing Road Pedestrian Street Intersection, 410 Sichuan Middle Road, Shanghai',
        telephone: ['021-68886981'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 10: East Nanjing Road Station (370m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-23:00' }
        ]
      },
      {
        chineseAddress: '裕兴记•蟹黄面馆(南京西路店) 威海路830号',
        englishAddress: '830 Weihai Road, Shanghai',
        telephone: ['13764519976'],
        branchDistrict: 'Jingan',
        nearestSubway: 'Line 12: West Nanjing Road Station, Exit 12 (420m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '08:00-20:00' }
        ]
      },
      {
        chineseAddress: '裕兴记·蟹黄面(徐家汇店) 南丹路169-3',
        englishAddress: '169-3 Nandan Road, Shanghai',
        telephone: ['021-66715788'],
        branchDistrict: 'Xuhui',
        nearestSubway: 'Line 1: Xujiahui Station, Exit 1 (360m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '07:00-21:00' }
        ]
      },
      {
        chineseAddress: '裕兴记·蟹黄面(世纪汇店) 世纪大道1192号LG2-A22号',
        englishAddress: 'Unit LG2-A22, 1192 Century Avenue, Shanghai',
        telephone: ['15710151531'],
        branchDistrict: 'Pudong',
        nearestSubway: 'Lines 2/4/6/9: Century Avenue Station, Exit 11 (330m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-22:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 596,
    accountType: 'restaurant',
    username: 'chansanchicrab',
    displayName: 'Chan San Chi Crab',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#chinese', '#crab noodles', '#takepicture', '#goodfood', '#affordable', '#recommend', '#Huangpu', '#Xuhui', '#Pudong', '#Minhang'],
    district: ['Huangpu', 'Xuhui', 'Pudong', 'Minhang'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 50,
    needBooking: 'Only accept walk-in',
    branches: [
      {
        chineseAddress: '馋三尺蟹粉小笼(人民广场店) 西藏中路500号思源商厦1楼102-B4、B5室',
        englishAddress: 'Units 102-B4 & B5, 1F, Siyuan Commercial Building, 500 West Xizang Road, Shanghai',
        telephone: ['021-33318789'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 2: People\'s Square Station (300m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '08:30-20:30' }
        ]
      },
      {
        chineseAddress: '馋三尺蟹粉小笼(恒基名人店) 南京东路300号地下一层B117-2室（Seven Eleven右边）',
        englishAddress: 'Unit B117-2, B1, 300 East Nanjing Road, Shanghai (Right side of Seven Eleven)',
        telephone: ['18602182385'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 10: West Nanjing Road Station, Exit 5 (70m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-21:00' }
        ]
      },
      {
        chineseAddress: '馋三尺蟹粉小笼(龙华会店) 龙华路2618号龙华万科中心北区1幢负2层01B2N19号',
        englishAddress: 'Unit 01B2N19, B2, Building 1 North, Longhua Vanke Center, 2618 Longhua Road, Shanghai',
        telephone: ['15921800736'],
        branchDistrict: 'Xuhui',
        nearestSubway: 'Line 12: Longhua Station, Exit 3 (70m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-21:00' }
        ]
      },
      {
        chineseAddress: '馋三尺蟹粉小笼(世博源店) 世博大道1368号世博源2区B层12号',
        englishAddress: 'Unit 12, B Floor, Zone 2, Expo Source Mall, 1368 Expo Avenue, Shanghai',
        telephone: ['13061657330'],
        branchDistrict: 'Pudong',
        nearestSubway: 'Line 8: China Art Museum Station, Exit 11 (760m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-21:00' }
        ]
      },
      {
        chineseAddress: '馋三尺蟹粉小笼(维璟印象城店) 七莘路1507号维璟印象城B1-030号',
        englishAddress: 'Unit B1-030, Weijing Impression City, 1507 Qixin Road, Shanghai',
        telephone: ['13061766891'],
        branchDistrict: 'Minhang',
        nearestSubway: 'Line 12: Qixin Road Station (330m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '10:00-21:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 597,
    accountType: 'restaurant',
    username: 'dahuchun',
    displayName: 'DaHu Chun',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#breakfast', '#chinese', '#pan-fried buns', '#takepicture', '#goodfood', '#affordable', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chinese Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 30,
    needBooking: 'Only accept walk-in',
    branches: [
      {
        chineseAddress: '大壶春(四川中路店) 四川中路136号',
        englishAddress: '136 Sichuan Middle Road, Shanghai',
        telephone: ['021-63130155'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 2: East Nanjing Road Station (750m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '07:00-19:30' }
        ]
      },
      {
        chineseAddress: '大壶春(云南南路店) 云南南路89号',
        englishAddress: '89 South Yunnan Road, Shanghai',
        telephone: ['021-63115177'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 14: Dashijie Station, Exit 5 (60m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '07:30-19:30' }
        ]
      },
      {
        chineseAddress: '大壶春(豫园店) 豫园老街64-3号',
        englishAddress: 'No.64-3 Yuyuan Old Street, Shanghai',
        telephone: ['021-63353560'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (450m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '09:00-22:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 598,
    accountType: 'restaurant',
    username: 'fafukoreanbbq',
    displayName: 'Fafu Korean BBQ',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#korean', '#bbq', '#goodfood', '#recommend', '#Jingan'],
    district: ['Jingan'],
    merchantType: 'Korean BBQ Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 200,
    needBooking: 'Phone booking recommended, crowded at nights',
    branches: [
      {
        chineseAddress: '发福韩家·韩国炭火烤肉(余姚店) 余姚路10号',
        englishAddress: '10 Yuyao Road, Shanghai',
        telephone: ['15021187854'],
        branchDistrict: 'Jingan',
        nearestSubway: 'Line 7: Changping Road Station, Exit 4 (490m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '17:00-01:00' }
        ]
      },
      {
        chineseAddress: '发福韩家·韩国炭火烤肉(大沽店) 大沽路411号',
        englishAddress: '411 Dagu Road, Shanghai',
        telephone: ['13062733876', '13817514640'],
        branchDistrict: 'Jingan',
        nearestSubway: 'Line 13: West Nanjing Road Station, Exit 8 (570m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '17:00-01:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 599,  // Changed from 598
    accountType: 'restaurant',
    username: 'earlymorningbbq',
    displayName: 'Early Morning BBQ',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#lunch', '#luxury', '#korean', '#bbq', '#goodfood', '#recommend', '#Huangpu', '#Xuhui', '#Jingan', '#Pudong'],
    district: ['Huangpu', 'Xuhui', 'Jingan', 'Pudong'],
    merchantType: 'Korean BBQ Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 180,
    needBooking: 'Recommend phone booking, can also walk in if there are seats',
    branches: [
      {
        chineseAddress: '清晨家烤肉(BFC外滩金融中心店) 中山东二路600号BFC外滩金融中心南区四楼清晨家',
        englishAddress: '4F South Zone, BFC Bund Financial Center, 600 East Zhongshan No.2 Road, Shanghai',
        telephone: ['18121214336'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Line 14: Yuyuan Garden Station, Exit 7 (1.1km walk)',
        openingHours: [
          { day: 'Monday-Friday', hours: ['11:00-14:00', '17:00-21:00'] },
          { day: 'Saturday-Sunday', hours: ['11:00-14:30', '17:00-21:00'] }
        ]
      },
      {
        chineseAddress: '清晨家·首尔烤肉(陆家嘴中心店) 陆家嘴中心L+MALL商场RG层RG01单元',
        englishAddress: 'RG Floor, L+MALL Shopping Center, 899 South Pudong Road, Shanghai',
        telephone: ['13482324569'],
        branchDistrict: 'Pudong',
        nearestSubway: 'Line 2: East Pudong Road Station (260m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: ['11:00-14:00', '17:00-21:00'] }
        ]
      },
      {
        chineseAddress: '清晨家·首尔烤肉(One ITC店) 华山路1901号OneITC商场负一层下沉花园128号',
        englishAddress: 'Unit 128, B1, One ITC Mall, 1901 Huashan Road, Shanghai',
        telephone: ['15221180809'],
        branchDistrict: 'Xuhui',
        nearestSubway: 'Line 9: Xujiahui Station, Exit 16 (450m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: ['11:00-14:00', '17:00-21:00'] }
        ]
      },
      {
        chineseAddress: '清晨家烤肉(静安MOHO店) 江宁路699号MOHOMall-L3-28,L3-29',
        englishAddress: 'Units L3-28 & L3-29, 3F, MOHO Mall, 699 Jiangning Road, Shanghai',
        telephone: ['18317190809'],
        branchDistrict: 'Jingan',
        nearestSubway: 'Line 7: Changping Road Station, Exit 2 (1.1km walk)',
        openingHours: [
          { day: 'Monday-Friday', hours: ['11:00-14:00', '17:00-21:00'] },
          { day: 'Saturday-Sunday', hours: ['11:00-14:30', '17:00-21:00'] }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 600,
    accountType: 'restaurant',
    username: 'grandeamoo',
    displayName: 'Grande A\'moo',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#dinner', '#birthday', '#date', '#takepicture', '#pizza', '#Italian', '#goodfood', '#recommend', '#Putuo', '#Pudong', '#Changning'],
    district: ['Putuo', 'Pudong', 'Changning'],
    merchantType: 'Italian Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 140,
    needBooking: 'No need, but need to queue up usually',
    branches: [
      {
        chineseAddress: 'Grande A\'moo(环宇城MAX店) 铜川路699弄中海环宇城1楼L1023号（2号门旁）',
        englishAddress: 'Unit L1023, 1F, Zhonghai Huanyu City MAX, 699 Tongchuan Road, Shanghai',
        telephone: ['021-60193653', '18621023489'],
        branchDistrict: 'Putuo',
        nearestSubway: 'Line 11: Zhenru Station (550m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-22:00' }
        ]
      },
      {
        chineseAddress: 'Grande A\'moo(世博天地店) 世博大道1467号世博天地L-111室（商场1号门旁,近周家渡路博成路）',
        englishAddress: 'Unit L-111, Expo World, 1467 Expo Avenue, Shanghai',
        telephone: ['13003117616'],
        branchDistrict: 'Pudong',
        nearestSubway: 'Line 8: China Art Museum Station (210m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-21:30' }
        ]
      },
      {
        chineseAddress: 'Grande A\'moo(上海荟聚店) 金钟路788号上海荟聚L01层01A01号',
        englishAddress: 'Unit 01A01, L01, Shanghai Huiju, 788 Jinzhong Road, Shanghai',
        telephone: ['021-62366656'],
        branchDistrict: 'Changning',
        nearestSubway: 'Line 2: Songhong Road Station (420m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-22:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 601,
    accountType: 'restaurant',
    username: 'banuhotpot',
    displayName: 'Banu Hotpot',
    verified: true,
    joinDate: 'March 2024',
    recommended: true,
    hashtags: ['#restaurant', '#lunch', '#dinner', '#chinese', '#hotpot', '#takepicture', '#goodfood', '#affordable', '#midnight', '#recommend', '#Huangpu', '#Pudong', '#Changning', '#Minhang'],
    district: ['Huangpu', 'Pudong', 'Changning', 'Minhang'],
    merchantType: 'Hotpot Restaurant',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    pricePerPerson: 160,
    needBooking: 'Line up at store',
    branches: [
      {
        chineseAddress: '巴奴毛肚火锅(人广来福士店) 西藏中路268号上海来福士广场6层',
        englishAddress: '6F, Raffles City Shanghai, 268 West Xizang Road, Shanghai',
        telephone: ['021-63615177', '4000232577'],
        branchDistrict: 'Huangpu',
        nearestSubway: 'Lines 1/8: People\'s Square Station, Exit 15 (50m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '24 hours' }
        ]
      },
      {
        chineseAddress: '巴奴毛肚火锅(陆家嘴中心店) 浦东南路899号陆家嘴中心L+MALL商场10楼',
        englishAddress: '10F, L+MALL, 899 South Pudong Road, Shanghai',
        telephone: ['021-58777907'],
        branchDistrict: 'Pudong',
        nearestSubway: 'Line 9: Shangcheng Road Station (150m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '24 hours' }
        ]
      },
      {
        chineseAddress: '巴奴毛肚火锅(七宝领展广场店) 漕宝路七莘路交叉口七宝领展广场5楼',
        englishAddress: '5F, Qibao Link Plaza, Intersection of Caobao Road & Qixin Road, Shanghai',
        telephone: ['021-62216758', '15093760132'],
        branchDistrict: 'Minhang',
        nearestSubway: 'Line 9: Qibao Station, Exit 2 (260m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-03:00' }
        ]
      },
      {
        chineseAddress: '巴奴毛肚火锅(上海荟聚店) 金钟路788号L03层03C16号',
        englishAddress: 'Unit 03C16, L03 Floor, 788 Jinzhong Road, Shanghai',
        telephone: ['021-62030525'],
        branchDistrict: 'Changning',
        nearestSubway: 'Line 2: Songhong Road Station, Exit 5 (390m walk)',
        openingHours: [
          { day: 'Monday-Sunday', hours: '11:00-03:00' }
        ]
      }
    ]
  } as MultiLocationMerchant,

  {
    id: 602,
    accountType: 'barandclub',
    username: 'maxclub',
    displayName: 'Max Shanghai',
    verified: true,
    joinDate: 'March 2024',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#techno', '#bounce', '#House', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Max Club 淮海中路98号2-3F',
      englishAddress: 'Max Club, 2-3F, 98 Huaihai Middle Road, Shanghai',
      nearestSubway: 'Line 8/14: Dashijie Station (175m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '20:30-06:00' }
      ],
      needBooking: 'No booking needed'
    },
    entryFee: 158,
    nearbyMidnightFood: ['zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['techno', 'bounce', 'House']
  } as BarClubMerchant,

  {
    id: 603,
    accountType: 'barandclub',
    username: 'hoodclub',
    displayName: 'Hood Shanghai',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#hiphop', '#recommened', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Hood 巨鹿路158号地下一层',
      englishAddress: 'Hood, B1, 158 Julu Road, Shanghai',
      nearestSubway: 'Line 13: Middle Huaihai Road (288m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '22:00-06:00' }
      ],
      needBooking: 'No booking needed'
    },
    entryFee: 100,
    nearbyMidnightFood: ['dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['large dance pool', 'hiphop']
  } as BarClubMerchant,

  {
    id: 604,
    accountType: 'barandclub',
    username: 'oriiclub',
    displayName: 'ORii',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#Kpop', '#HipHop', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Kpop Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'ORii 黄浦区淮海中路566号二楼',
      englishAddress: 'ORii, 2F, 566 Huaihai Middle Road, Huangpu, Shanghai',
      nearestSubway: 'Line 13: Middle Huaihai Road (350m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '22:00-06:00' }
      ],
      needBooking: 'No booking needed'
    },
    entryFee: 150,
    nearbyMidnightFood: ['zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['Diversified', 'Kpop', 'HipHop', 'EDM', 'R&B']
  } as BarClubMerchant,

  {
    id: 605,
    accountType: 'barandclub',
    username: 'kezeeliveHouse',
    displayName: 'Kezee',
    verified: true,
    joinDate: 'December 2023',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#LiveHouse', '#redflag', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'LiveHouse',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Kezee 雁荡路109号Ins復興樂園3楼',
      englishAddress: 'Kezee, 3F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '20:00-04:00' }
      ]
    },
    clubCategories: ['LiveHouse']
  } as BarClubMerchant,

  {
    id: 606,
    accountType: 'barandclub',
    username: 'dirtyhouseclub',
    displayName: 'DirtyHouse',
    verified: true,
    joinDate: 'November 2023',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#Techno', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Dirty House 雁荡路109号Ins復興樂園4楼',
      englishAddress: 'Dirty House, 4F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Friday-Sunday', hours: '23:00-05:00' }
      ]
    },
    entryFee: 158,
    clubCategories: ['Techno']
  } as BarClubMerchant,

  {
    id: 607,
    accountType: 'barandclub',
    username: 'friendsclub',
    displayName: 'Friends',
    verified: true,
    joinDate: 'October 2023',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#Pop songs', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Friends 雁荡路109号Ins復興樂園5楼',
      englishAddress: 'Friends, 5F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Wednesday-Sunday', hours: '21:30-04:30' }
      ]
    },
    entryFee: 168,
    clubCategories: ['Pop songs']
  } as BarClubMerchant,

  {
    id: 608,
    accountType: 'barandclub',
    username: 'anothersideclub',
    displayName: 'AnotherSide',
    verified: true,
    joinDate: 'September 2023',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#EDM', '#Pop songs', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'EDM Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Another Side 雁荡路109号Ins復興樂園6楼',
      englishAddress: 'Another Side, 6F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Friday-Sunday', hours: '22:00-05:00' }
      ]
    },
    entryFee: 188,
    clubCategories: ['EDM', 'Pop songs']
  } as BarClubMerchant,

  {
    id: 609,
    accountType: 'barandclub',
    username: 'freshmenclub',
    displayName: 'Freshmen',
    verified: true,
    joinDate: 'August 2023',
    recommended: false,
    hashtags: ['#club', '#alcohol', '#Pop songs', '#Big Dance Floor', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Pop Songs',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Freshmen 雁荡路109号Ins復興樂園1楼',
      englishAddress: 'Freshmen, 1F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Friday-Sunday', hours: '22:00-04:00' }
      ]
    },
    entryFee: 188,
    clubCategories: ['Pop songs', 'Big Dance Floor']
  } as BarClubMerchant,

  {
    id: 610,
    accountType: 'barandclub',
    username: 'lafinclub',
    displayName: 'Lafin',
    verified: true,
    joinDate: 'July 2023',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#HipHop', '#Pop songs', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Hip Hop Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Lafin 雁荡路109号Ins復興樂園6楼',
      englishAddress: 'Lafin, 6F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Friday-Sunday', hours: '22:00-05:00' }
      ]
    },
    entryFee: 188,
    clubCategories: ['HipHop', 'Pop songs']
  } as BarClubMerchant,

  {
    id: 611,
    accountType: 'barandclub',
    username: 'radiclub',
    displayName: 'Radi',
    verified: true,
    joinDate: 'June 2023',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#EDM', '#Pop songs', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Diversified Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Radi 雁荡路109号Ins復興樂園3楼',
      englishAddress: 'Radi, 3F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '22:00-05:00' }
      ]
    },
    entryFee: 180,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['EDM', 'Pop songs']
  } as BarClubMerchant,

  {
    id: 612,
    accountType: 'barandclub',
    username: 'hushclub',
    displayName: 'Hush',
    verified: true,
    joinDate: 'May 2023',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#Hip Hop', '#Pop songs', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'HipHop Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Hush 雁荡路109号Ins復興樂園2楼',
      englishAddress: 'Hush, 2F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Wednesday-Sunday', hours: '22:00-04:00' }
      ]
    },
    entryFee: 158,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['Hip Hop', 'Pop songs']
  } as BarClubMerchant,

  {
    id: 613,
    accountType: 'barandclub',
    username: 'cultureclub',
    displayName: 'Culture',
    verified: true,
    joinDate: 'April 2023',
    recommended: true,
    hashtags: ['#club', '#alcohol', '#LGBT', '#HipHop', '#Pop songs', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'LGBT Club',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Culture 雁荡路109号Ins復興樂園4楼',
      englishAddress: 'Culture, 4F, 109 Yandang Road, Ins Park, Shanghai',
      nearestSubway: 'Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Friday-Sunday', hours: '22:00-05:00' }
      ]
    },
    entryFee: 159,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['LGBT', 'HipHop', 'Pop songs']
  } as BarClubMerchant,

  {
    id: 614,
    accountType: 'barandclub',
    username: 'insomnibar',
    displayName: 'Insomnia',
    verified: true,
    joinDate: 'March 2023',
    recommended: false,
    hashtags: ['#takepicture', '#bar', '#alcohol', '#RedFlag', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Chill Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Insomnia 淮海中路新歌766号1-03室',
      englishAddress: 'Huaihai Road No.776 (Huawei Branch Beside Shopping Mall Inner) 1-03 Store, Huangpu, Shanghai China',
      nearestSubway: 'Line 13: Middle Huaihai Road Station (Exit 2, 110m walk)',
      telephone: ['13641755928'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '19:00-02:00' }
      ]
    },
    pricePerPerson: 110,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['nice ceiling', 'music bar']
  } as BarClubMerchant,

  {
    id: 615,
    accountType: 'barandclub',
    username: 'jollybar',
    displayName: 'Jolly Bar',
    verified: true,
    joinDate: 'February 2023',
    recommended: true,
    hashtags: ['#jingan', '#jinxianroad', '#good drink', '#bar', '#alcohol', '#recommend', '#affordable', '#Jingan'],
    district: ['Jingan'],
    merchantType: 'Street Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Jolly Bar 进贤路151号',
      englishAddress: '151 Jinxian Road, Jingan, Shanghai',
      nearestSubway: 'Line 13: Middle Huaihai Road Station (540m walk)',
      telephone: ['19301449569'],
      branchDistrict: 'Jingan'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '16:30-00:30' }
      ],
      needBooking: 'No need'
    },
    pricePerPerson: 30,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['sweet drink', 'fruit drink', 'on the street']
  } as BarClubMerchant,

  {
    id: 616,
    accountType: 'barandclub',
    username: 'sourthernCrossBar',
    displayName: 'Southern Cross',
    verified: true,
    joinDate: 'January 2023',
    recommended: true,
    hashtags: ['#date', '#quiet bar', '#good drink', '#bar', '#alcohol', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Japanese Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: '南十字星 淮海中路1276号（近华亭路）',
      englishAddress: '1276 Middle Huaihai Road (near Huating Road)',
      nearestSubway: 'Line 1: Changshu Road Station (66m walk)',
      telephone: ['021-54047211', '15900595192'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '19:00-02:00' }
      ],
      needBooking: 'No need, can walk in'
    },
    pricePerPerson: 130,
    nearbyMidnightFood: ['likesomechickenpot', 'zhaozhounoodles', 'dongtaixiang', 'dingtelenoodles'],
    clubCategories: ['date', 'martini', 'quiet']
  } as BarClubMerchant,

  {
    id: 617,
    accountType: 'barandclub',
    username: 'SpeakLowBar',
    displayName: 'SpeakLow',
    verified: true,
    joinDate: 'April 2023',
    recommended: false,
    hashtags: ['#barfood', '#good drink', '#bar', '#alcohol', '#long queue', '#Xuhui'],
    district: ['Huangpu'],
    merchantType: 'WorldTop50',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Speak Low 彼楼复兴中路579号（近瑞金二路）',
      englishAddress: '579 South Fuxing Road (near Ruijin Er Road)',
      nearestSubway: 'Line 13: Middle Huaihai Road Station (740m walk)',
      telephone: ['021-64160133'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '18:00-02:00' },
        { day: 'Friday-Saturday', hours: '18:00-03:00' },
        { day: 'Sunday', hours: '18:00-02:00' }
      ],
      needBooking: 'Not accept booking, only walk in, after 6:30pm seats are full, recommend arrive earlier (三楼需要提前预约)'
    },
    pricePerPerson: 120,
    clubCategories: ['good barfood', 'crowded', 'noisy', 'quiet']
  } as BarClubMerchant,

  {
    id: 618,
    accountType: 'barandclub',
    username: 'SuzuBar',
    displayName: 'Suzu',
    verified: true,
    joinDate: 'May 2023',
    recommended: true,
    hashtags: ['#Japanese', '#martini', '#good drink', '#bar', '#alcohol', '#recommend', '#Xuhui'],
    district: ['Xuhui'],
    merchantType: 'Martini Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Suzu 华山路301号MORE华山一楼A5',
      englishAddress: 'Unit A5, 1F, MORE·shan, 301 Huashan Road, Shanghai',
      nearestSubway: 'Line 14: Jing\'an Temple Station (Exit 12, 220m walk)',
      telephone: ['021-31029289'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '19:00-02:00' }
      ],
      needBooking: 'Very busy on weekends, phone reservation recommended'
    },
    pricePerPerson: 130,
    clubCategories: ['japanese', 'martini']
  } as BarClubMerchant,

  {
    id: 619,
    accountType: 'barandclub',
    username: 'AbaWhiskyBar',
    displayName: 'Aba Whisky Bar',
    verified: true,
    joinDate: 'June 2023',
    recommended: true,
    hashtags: ['#barfood', '#good drink', '#date', '#whisky', '#quiet', '#bar', '#alcohol', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Whisky Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Aba Whisky Bar 瑞金二路街道瑞金二路89号',
      englishAddress: '89 Ruijin Er Road, Ruijin Er Road Subdistrict',
      nearestSubway: 'Line 1: South Shaanxi Road Station (533m walk)',
      telephone: ['021-53099556'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '18:00-01:00' },
        { day: 'Friday-Saturday', hours: '18:00-02:00' },
        { day: 'Sunday', hours: '18:00-01:00' }
      ],
      needBooking: 'No need, Can walk in'
    },
    pricePerPerson: 120,
    clubCategories: ['japanese', 'martini', 'whisky', 'good for date', 'quiet']
  } as BarClubMerchant,

  {
    id: 620,
    accountType: 'barandclub',
    username: 'PaalBar',
    displayName: 'Paal',
    verified: true,
    joinDate: 'July 2023',
    recommended: true,
    hashtags: ['#good drink', '#bar', '#alcohol', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'My Top 5 Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Paal 南昌路94号',
      englishAddress: '94 Nanchang Road, Huangpu, Shanghai',
      nearestSubway: 'Line 13: Middle Huaihai Road Station (570m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '19:30-02:00' }
      ],
      needBooking: 'No need, can walk in, highly recommend arrive early'
    },
    pricePerPerson: 98,
    clubCategories: ['one of my fav', 'good drink']
  } as BarClubMerchant,

  {
    id: 621,
    accountType: 'barandclub',
    username: 'PonyUpBar',
    displayName: 'PonyUp',
    verified: true,
    joinDate: 'August 2023',
    recommended: true,
    hashtags: ['#barfood', '#good drink', '#bar', '#alcohol', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'My Top 5 Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'Pony Up 进贤路230号',
      englishAddress: '230 Jinxian Road',
      nearestSubway: 'Line 1: South Shaanxi Road Station (580m walk)',
      telephone: ['13472467476'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '13:00-01:00' },
        { day: 'Friday-Saturday', hours: '13:00-02:00' },
        { day: 'Sunday', hours: '13:00-01:00' }
      ],
      needBooking: 'No need, can walk in, recommend arrive early',
      peakTime: '21:30-00:00'
    },
    pricePerPerson: 95,
    clubCategories: ['good barfood', 'good drinks']
  } as BarClubMerchant,

  {
    id: 622,
    accountType: 'barandclub',
    username: 'SirEllys',
    displayName: 'Sir Elly\'s Terrace',
    verified: true,
    joinDate: 'September 2023',
    recommended: true,
    hashtags: ['#superpicture', '#date', '#bar', '#alcohol', '#nightview', '#rooftop', '#popular', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Nightview Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: '艾利爵士露台酒吧 中山东一路32号半岛酒店14楼',
      englishAddress: '14F, The Peninsula Hotel, 32 The Bund',
      nearestSubway: 'Line 2/10: East Nanjing Road Station (600m walk)',
      telephone: ['021-23276756', '021-23272888'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '17:00-24:00' }
      ],
      needBooking: 'Can walk in, recommend arriving earlier at 8pm',
      peakTime: '21:00-22:00'
    },
    pricePerPerson: 170,
    clubCategories: ['rooftop bar', 'nightview']
  } as BarClubMerchant,

  {
    id: 623,
    accountType: 'barandclub',
    username: 'FlairBar',
    displayName: 'Flair',
    verified: true,
    joinDate: 'October 2023',
    recommended: true,
    hashtags: ['#dinner', '#date', '#superpicture', '#bar', '#alcohol', '#nightview', '#rooftop', '#popular', '#recommend', '#affordable', '#Pudong'],
    district: ['Pudong'],
    merchantType: 'Nightview Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'FLAIR顶层餐厅酒吧世纪大道8号国金中心上海浦东丽思卡尔顿酒店58楼',
      englishAddress: '58F, The Ritz-Carlton Shanghai, Pudong, 8 Century Avenue',
      nearestSubway: 'Line 2: Lujiazui Station (300m walk)',
      telephone: ['021-20201717', '021-20201778'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '12:00-01:00' },
        { day: 'Friday-Saturday', hours: '12:00-02:00' },
        { day: 'Sunday', hours: '12:00-01:00' }
      ],
      needBooking: 'Recommend phone call booking, crowded at night. If walk in, 6:30pm is the best',
      peakTime: '19:30-22:30'
    },
    pricePerPerson: 160,
    clubCategories: ['rooftop bar', 'nightview', 'good for date']
  } as BarClubMerchant,

  {
    id: 624,
    accountType: 'barandclub',
    username: 'RooseveltSkyBar',
    displayName: '罗斯福公馆色戒 Roosevelt Sky Bar',
    verified: true,
    joinDate: 'November 2023',
    recommended: true,
    hashtags: ['#superpicture', '#bar', '#date', '#alcohol', '#nightview', '#rooftop', '#popular', '#recommend', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Nightview Bar',
    url: 'https://27bund.com/roosevelt-sky-bar/',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: '罗斯福色戒酒吧(外滩店) 中山东一路27号罗斯福公馆(近北京东路)9楼',
      englishAddress: '9F, Roosevelt Building, 27 The Bund',
      nearestSubway: 'Line 2/10: East Nanjing Road Station (555m walk)',
      telephone: ['021-23220800'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '14:00-02:00' }
      ],
      needBooking: 'Can walk in. recommend to arrive 18:30',
      peakTime: '19:00-22:00'
    },
    pricePerPerson: 160,
    clubCategories: ['rooftop bar', 'nightview', 'good for date']
  } as BarClubMerchant,

  {
    id: 625,
    accountType: 'barandclub',
    username: 'KEVBar',
    displayName: '外滩18号KEV露台',
    verified: true,
    joinDate: 'December 2023',
    recommended: true,
    hashtags: ['#superpicture', '#date', '#bar', '#alcohol', '#nightview', '#rooftop', '#popular', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Nightview Bar',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'KEV 中山东一路18号7层',
      englishAddress: '7F, 18 The Bund',
      nearestSubway: 'Line 2/10: East Nanjing Road Station (482m walk)',
      telephone: ['021-53833657'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '20:00-04:00' }
      ],
      needBooking: 'Can walk in or booking. but recommend earlier',
      peakTime: '21:00-01:00'
    },
    pricePerPerson: 140,
    clubCategories: ['rooftop bar', 'nightview', 'good for date']
  } as BarClubMerchant,

  {
    id: 626,
    accountType: 'barandclub',
    username: 'CaptainBar',
    displayName: '船长酒吧 The Captain',
    verified: true,
    joinDate: 'January 2024',
    recommended: true,
    hashtags: ['#superpicture', '#date', '#bar', '#alcohol', '#nightview', '#rooftop', '#popular', '#recommend', '#affordable', '#Huangpu'],
    district: ['Huangpu'],
    merchantType: 'Nightview Bar',
    url: 'add Wechat - thecaptain37',
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    },
    profileInterface: ProfileInterface.BarClub,
    location: {
      chineseAddress: 'The Captain Bar 福州路37号船长酒店6搂',
      englishAddress: '6F, Captain Hostel, 37 Fuzhou Road, Huangpu, Shanghai',
      nearestSubway: 'Line 2/10: East Nanjing Road Station (551m walk)',
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Friday', hours: '14:00-01:00' },
        { day: 'Saturday-Sunday', hours: '11:30-01:00' }
      ],
      needBooking: 'Can walk in or booking, recommend booking'
    },
    pricePerPerson: 160,
    clubCategories: ['rooftop bar', 'nightview', 'good for date']
  } as BarClubMerchant
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