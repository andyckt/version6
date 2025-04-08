/**
 * JavaScript version of the merchants data
 * Used by the simple migration script
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

// Export all merchants from the data/merchants.ts file
const merchants = [
  // Add all the merchants from src/data/merchants.ts
  // Copy the merchants array contents - about 70+ objects

  // The merchants array is the same as in the src/data/merchants.ts file
  // For brevity, this is just a sample of the structure:
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
  },
  
  // Add more merchants here...
];

module.exports = {
  ProfileInterface,
  merchants
}; 