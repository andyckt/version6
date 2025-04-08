/**
 * JavaScript version of merchants data for migration
 * Converted from TypeScript for easier use with Node.js scripts
 */

// Profile interface enum values
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

// Sample merchants data
const merchants = [
  // RESTAURANTS
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
    url: 'https://www.shanghaitaste.com',
    location: {
      chineseAddress: '上海市黄浦区南京东路829号',
      englishAddress: '829 East Nanjing Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 2/10 Nanjing East Road Station, Exit 2 - 200m',
      telephone: ['021-63566575'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Thursday', hours: '11:30-14:30' },
        { day: 'Monday-Thursday', hours: '17:30-22:00' },
        { day: 'Friday-Sunday', hours: '11:00-22:30' }
      ],
      needBooking: 'Recommended on weekends',
      peakTime: '12:30-13:30, 18:30-20:00'
    },
    pricePerPerson: 150,
    languagesSpoken: ['Chinese', 'English'],
    michelinStars: 0
  },
  {
    id: 504,
    accountType: 'restaurant',
    username: 'tokyosushi',
    displayName: 'Tokyo Sushi',
    verified: true,
    joinDate: 'November 2023',
    recommended: true,
    hashtags: ['#japanese', '#sushi', '#omakase', '#freshfish'],
    district: ['Jing\'an'],
    merchantType: 'Japanese Restaurant',
    stats: {
      mentionedPosts: 42,
      followers: 2300,
      following: 85
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    url: 'https://www.tokyosushi-sh.com',
    location: {
      chineseAddress: '上海市静安区南京西路1788号',
      englishAddress: '1788 West Nanjing Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2 Jing\'an Temple Station, Exit 3 - 300m',
      telephone: ['021-52281234'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '11:30-14:00' },
        { day: 'Monday-Sunday', hours: '17:30-22:30' }
      ],
      needBooking: 'Required for dinner',
      peakTime: '19:00-21:00'
    },
    pricePerPerson: 450,
    languagesSpoken: ['Chinese', 'English', 'Japanese'],
    michelinStars: 1
  },
  {
    id: 505,
    accountType: 'restaurant',
    username: 'italiancorner',
    displayName: 'Italian Corner',
    verified: true,
    joinDate: 'March 2023',
    recommended: false,
    hashtags: ['#italian', '#pasta', '#wine', '#datenight'],
    district: ['Xuhui'],
    merchantType: 'Italian Restaurant',
    stats: {
      mentionedPosts: 18,
      followers: 950,
      following: 120
    },
    profileInterface: ProfileInterface.SingleShopRestaurant,
    url: 'https://www.italiancorner.cn',
    location: {
      chineseAddress: '上海市徐汇区衡山路45号',
      englishAddress: '45 Hengshan Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 1 Hengshan Road Station, Exit 1 - 400m',
      telephone: ['021-64370176'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Sunday', hours: '11:30-14:30' },
        { day: 'Tuesday-Sunday', hours: '17:30-22:30' },
        { day: 'Monday', hours: 'Closed' }
      ],
      needBooking: 'Recommended for weekends',
      peakTime: '19:00-21:00'
    },
    pricePerPerson: 280,
    languagesSpoken: ['Chinese', 'English', 'Italian'],
    michelinStars: 0
  },
  {
    id: 506,
    accountType: 'restaurant',
    username: 'dimsum2go',
    displayName: 'Dim Sum To Go',
    verified: false,
    joinDate: 'May 2023',
    recommended: true,
    hashtags: ['#dimsum', '#takeaway', '#quicklunch'],
    district: ['Pudong'],
    merchantType: 'Chinese Fast Food',
    stats: {
      mentionedPosts: 31,
      followers: 1250,
      following: 45
    },
    profileInterface: ProfileInterface.MultipleBranchMerchant,
    url: 'https://www.dimsum2go.cn',
    branches: [
      {
        location: {
          chineseAddress: '上海市浦东新区陆家嘴西路168号',
          englishAddress: '168 West Lujiazui Road, Pudong New Area, Shanghai',
          nearestSubway: 'Line 2 Lujiazui Station, Exit B1 - 150m',
          telephone: ['021-50801234'],
          branchDistrict: 'Pudong'
        },
        businessInfo: {
          openingHours: [
            { day: 'Monday-Friday', hours: '7:00-20:30' },
            { day: 'Saturday-Sunday', hours: '8:00-20:00' }
          ],
          peakTime: '12:00-13:30'
        }
      },
      {
        location: {
          chineseAddress: '上海市浦东新区张杨路500号',
          englishAddress: '500 Zhangyang Road, Pudong New Area, Shanghai',
          nearestSubway: 'Line 4 Yangshupu Road Station, Exit 3 - 100m',
          telephone: ['021-50802345'],
          branchDistrict: 'Pudong'
        },
        businessInfo: {
          openingHours: [
            { day: 'Monday-Sunday', hours: '7:30-20:00' }
          ],
          peakTime: '12:00-13:30'
        }
      }
    ],
    pricePerPerson: 60,
    languagesSpoken: ['Chinese', 'English'],
    michelinStars: 0
  },
  
  // ATTRACTIONS
  {
    id: 502,
    accountType: 'attraction',
    username: 'shanghaipearl',
    displayName: 'Oriental Pearl Tower',
    verified: true,
    joinDate: 'December 2023',
    recommended: true,
    hashtags: ['#landmark', '#shanghaiattractions', '#cityskyline'],
    district: ['Pudong'],
    merchantType: 'Attraction',
    stats: {
      mentionedPosts: 547,
      followers: 12500,
      following: 85
    },
    profileInterface: ProfileInterface.Attraction,
    url: 'https://www.orientalpearlradio.com',
    location: {
      chineseAddress: '上海市浦东新区世纪大道1号',
      englishAddress: '1 Century Avenue, Pudong, Shanghai',
      nearestSubway: 'Line 2 Lujiazui Station, Exit 1 - 300m',
      telephone: ['021-58797888'],
      branchDistrict: 'Pudong'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '8:00-22:00' }
      ],
      needBooking: 'Recommended for observation deck',
      peakTime: '10:00-12:00, 18:00-20:00'
    },
    ticketPrice: {
      adult: 160,
      child: 80,
      senior: 80
    }
  },
  {
    id: 507,
    accountType: 'attraction',
    username: 'yuyuangarden',
    displayName: 'Yu Yuan Garden',
    verified: true,
    joinDate: 'August 2023',
    recommended: true,
    hashtags: ['#chinesegarden', '#traditional', '#history', '#yugardens'],
    district: ['Huangpu'],
    merchantType: 'Historical Site',
    stats: {
      mentionedPosts: 378,
      followers: 9200,
      following: 45
    },
    profileInterface: ProfileInterface.Attraction,
    url: 'https://www.yuyuangarden.com.cn',
    location: {
      chineseAddress: '上海市黄浦区安仁街218号',
      englishAddress: '218 Anren Street, Huangpu District, Shanghai',
      nearestSubway: 'Line 10 Yuyuan Garden Station, Exit 1 - 200m',
      telephone: ['021-63280150'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '8:30-17:30' }
      ],
      needBooking: 'Not required',
      peakTime: '10:00-15:00'
    },
    ticketPrice: {
      adult: 40,
      child: 20,
      senior: 20
    }
  },
  
  // HOTELS
  {
    id: 503,
    accountType: 'hotel',
    username: 'peacehotel',
    displayName: 'Peace Hotel Shanghai',
    verified: true,
    joinDate: 'February 2024',
    recommended: true,
    hashtags: ['#historichotel', '#bund', '#luxuryhotel'],
    district: ['Huangpu'],
    merchantType: 'Hotel',
    stats: {
      mentionedPosts: 156,
      followers: 8700,
      following: 230
    },
    profileInterface: ProfileInterface.Hotel,
    url: 'https://www.fairmont.com/peace-hotel-shanghai',
    location: {
      chineseAddress: '上海市黄浦区南京东路20号',
      englishAddress: '20 East Nanjing Road, Huangpu, Shanghai',
      nearestSubway: 'Line 2 East Nanjing Road Station, Exit 1 - 150m',
      telephone: ['021-63216888'],
      branchDistrict: 'Huangpu'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ],
      needBooking: 'Required',
      peakTime: 'Year-round'
    },
    pricePerNight: {
      standard: 1200,
      deluxe: 1800,
      suite: 3500
    },
    amenities: ['WiFi', 'Swimming Pool', 'Fitness Center', 'Spa', 'Restaurant', 'Bar', 'Meeting Rooms'],
    stars: 5
  },
  {
    id: 508,
    accountType: 'hotel',
    username: 'jinjianginn',
    displayName: 'Jinjiang Inn Shanghai',
    verified: true,
    joinDate: 'April 2023',
    recommended: false,
    hashtags: ['#budgethotel', '#businesstravel', '#convenient'],
    district: ['Jing\'an'],
    merchantType: 'Budget Hotel',
    stats: {
      mentionedPosts: 67,
      followers: 3200,
      following: 105
    },
    profileInterface: ProfileInterface.Hotel,
    url: 'https://www.jinjianginns.com',
    location: {
      chineseAddress: '上海市静安区南京西路1358号',
      englishAddress: '1358 West Nanjing Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 2/7 Jing\'an Temple Station, Exit 4 - 400m',
      telephone: ['021-62361998'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '24 hours' }
      ],
      needBooking: 'Recommended',
      peakTime: 'Weekdays'
    },
    pricePerNight: {
      standard: 350,
      deluxe: 480,
      suite: 680
    },
    amenities: ['WiFi', 'Breakfast', 'Business Center', 'Laundry Service'],
    stars: 3
  },
  
  // BARS & CLUBS
  {
    id: 509,
    accountType: 'barandclub',
    username: 'mixology',
    displayName: 'Mixology Cocktail Bar',
    verified: true,
    joinDate: 'September 2023',
    recommended: true,
    hashtags: ['#cocktails', '#mixology', '#nightlife', '#speakeasy'],
    district: ['Xuhui'],
    merchantType: 'Cocktail Bar',
    stats: {
      mentionedPosts: 89,
      followers: 5400,
      following: 210
    },
    profileInterface: ProfileInterface.BarClub,
    url: 'https://www.mixologyshanghai.com',
    location: {
      chineseAddress: '上海市徐汇区乌鲁木齐中路258号',
      englishAddress: '258 Middle Urumqi Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 10/11 Jiaotong University Station, Exit 2 - 500m',
      telephone: ['021-64376466'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Tuesday-Sunday', hours: '18:00-2:00' },
        { day: 'Monday', hours: 'Closed' }
      ],
      needBooking: 'Recommended after 9pm',
      peakTime: '21:00-00:00'
    },
    pricePerPerson: 200,
    nearbyMidnightFood: ['shanghaitaste', 'dimsum2go'],
    clubCategories: ['Cocktail Bar', 'Lounge', 'Live Music'],
    entryFee: 0
  },
  {
    id: 510,
    accountType: 'barandclub',
    username: 'magicstage',
    displayName: 'Magic Stage Club',
    verified: false,
    joinDate: 'October 2023',
    recommended: true,
    hashtags: ['#nightclub', '#electronicmusic', '#dj', '#dancing'],
    district: ['Jing\'an'],
    merchantType: 'Night Club',
    stats: {
      mentionedPosts: 112,
      followers: 7800,
      following: 95
    },
    profileInterface: ProfileInterface.BarClub,
    url: 'https://www.magicstageclub.cn',
    location: {
      chineseAddress: '上海市静安区华山路89号',
      englishAddress: '89 Huashan Road, Jing\'an District, Shanghai',
      nearestSubway: 'Line 1/7 Changshu Road Station, Exit 7 - 350m',
      telephone: ['021-62486789'],
      branchDistrict: 'Jing\'an'
    },
    businessInfo: {
      openingHours: [
        { day: 'Wednesday-Saturday', hours: '22:00-5:00' },
        { day: 'Sunday-Tuesday', hours: 'Closed' }
      ],
      needBooking: 'Required for VIP tables',
      peakTime: '23:30-3:00'
    },
    pricePerPerson: 350,
    nearbyMidnightFood: ['tokyosushi', 'dimsum2go'],
    clubCategories: ['EDM', 'Hip-Hop', 'Techno'],
    entryFee: 100
  },
  
  // BUILDINGS & SHOPPING
  {
    id: 511,
    accountType: 'shopping',
    username: 'iapmmall',
    displayName: 'IAPM Mall',
    verified: true,
    joinDate: 'July 2023',
    recommended: true,
    hashtags: ['#luxuryshopping', '#mallshanghai', '#fashion', '#lifestyle'],
    district: ['Xuhui'],
    merchantType: 'Shopping Mall',
    stats: {
      mentionedPosts: 215,
      followers: 8900,
      following: 75
    },
    profileInterface: ProfileInterface.Building,
    url: 'https://www.iapmmall.com',
    location: {
      chineseAddress: '上海市徐汇区淮海中路999号',
      englishAddress: '999 Middle Huaihai Road, Xuhui District, Shanghai',
      nearestSubway: 'Line 1/10/12 South Shaanxi Road Station, Exit 1 - 50m',
      telephone: ['021-64388888'],
      branchDistrict: 'Xuhui'
    },
    businessInfo: {
      openingHours: [
        { day: 'Monday-Sunday', hours: '10:00-22:00' }
      ],
      needBooking: 'Not required',
      peakTime: 'Weekends 13:00-18:00'
    },
    floors: 12,
    featuredStores: ['Apple', 'Gucci', 'LV', 'Nike', 'Zara']
  },
  
  // STREETS
  {
    id: 512,
    accountType: 'attraction',
    username: 'tiantianfanglt',
    displayName: 'Tianzifang Lane',
    verified: true,
    joinDate: 'June 2023',
    recommended: true,
    hashtags: ['#shoppingstreet', '#artsdistrict', '#cafes', '#souvenirs'],
    district: ['Huangpu'],
    merchantType: 'Shopping Street',
    stats: {
      mentionedPosts: 320,
      followers: 9500,
      following: 60
    },
    profileInterface: ProfileInterface.Street,
    url: 'https://www.tianzifang-shanghai.com',
    location: {
      chineseAddress: '上海市黄浦区泰康路210弄',
      englishAddress: 'Lane 210 Taikang Road, Huangpu District, Shanghai',
      nearestSubway: 'Line 9 Dapuqiao Station, Exit 1 - 300m',
      telephone: ['021-64371228'],
      branchDistrict: 'Huangpu'
    }
  }
];

// Helper functions to check merchant types
function isSingleLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.SingleShopRestaurant;
}

function isMultiLocationMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.MultipleBranchMerchant;
}

function isAttractionMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Attraction;
}

function isStreetMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Street;
}

function isBuildingMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Building;
}

function isHotelMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.Hotel;
}

function isBarClubMerchant(merchant) {
  return merchant.profileInterface === ProfileInterface.BarClub;
}

// Export everything so it can be imported in migration scripts
module.exports = {
  ProfileInterface,
  merchants,
  isSingleLocationMerchant,
  isMultiLocationMerchant,
  isAttractionMerchant,
  isStreetMerchant,
  isBuildingMerchant,
  isHotelMerchant,
  isBarClubMerchant
}; 