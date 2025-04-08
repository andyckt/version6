/**
 * Extracted Merchants from TypeScript
 * Generated on 2025/4/8 下午4:53:19
 * 
 * To use these merchants:
 * 1. Copy the EXTRACTED_MERCHANTS array
 * 2. Replace the REAL_MERCHANTS array in import-merchants.js with this data
 * 3. Run import-merchants.js to import to database
 */

// Profile interface types
const ProfileInterface = {
  SingleShopRestaurant: 1,
  MultipleBranchMerchant: 2,
  Attraction: 3,
  Street: 4,
  Building: 5,
  Hotel: 6,
  BarClub: 7
};

// Extracted merchants from TypeScript file
const EXTRACTED_MERCHANTS = [
  {
    "id": 1,
    "accountType": "shopping",
    "username": "familymart",
    "displayName": "Family Mart",
    "verified": true,
    "joinDate": "November 2022",
    "recommended": true,
    "hashtags": [
      "#conveniencestore",
      "#familymart",
      "#latenight",
      "#quickfood"
    ],
    "district": [
      "Multiple"
    ],
    "merchantType": "Convenience Store",
    "stats": {
      "mentionedPosts": 38,
      "followers": 1900,
      "following": 25
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "上海市黄浦区淮海中路432号",
      "englishAddress": "432 Middle Huaihai Road, Huangpu District, Shanghai",
      "nearestSubway": "Line 1 South Huangpi Road Station, Exit 3 - 150m",
      "telephone": [
        "021-63559988"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "All day"
        }
      ],
      "peakTime": "Lunch hours"
    },
    "pricePerPerson": 20,
    "languagesSpoken": [
      "Chinese",
      "English"
    ]
  },
  {
    "id": 2,
    "accountType": "shopping",
    "username": "lawson",
    "displayName": "Lawson",
    "verified": true,
    "joinDate": "December 2022",
    "recommended": true,
    "hashtags": [
      "#conveniencestore",
      "#lawson",
      "#latenight",
      "#japanesestore"
    ],
    "district": [
      "Multiple"
    ],
    "merchantType": "Convenience Store",
    "stats": {
      "mentionedPosts": 32,
      "followers": 1700,
      "following": 20
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "上海市静安区威海路128号",
      "englishAddress": "128 Weihai Road, Jing'an District, Shanghai",
      "nearestSubway": "Line 2 Nanjing West Road Station, Exit 1 - 300m",
      "telephone": [
        "021-62714455"
      ],
      "branchDistrict": "Jing'an"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "全天"
        }
      ],
      "peakTime": "Evening hours"
    },
    "pricePerPerson": 18,
    "languagesSpoken": [
      "Chinese",
      "English",
      "Japanese"
    ]
  },
  {
    "id": 3,
    "accountType": "restaurant",
    "username": "shanghaitaste",
    "displayName": "Shanghai Taste",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#shanghairestaurant",
      "#dimsum",
      "#localtaste",
      "#traditional"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 24,
      "followers": 1800,
      "following": 120
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "上海市黄浦区南京东路829号",
      "englishAddress": "829 East Nanjing Road, Huangpu District, Shanghai",
      "nearestSubway": "Line 2/10 Nanjing East Road Station, Exit 2 - 200m",
      "telephone": [
        "021-63566575"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "23:00-4:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "22:30-4:30"
        },
        {
          "day": "Sunday",
          "hours": "Closed"
        }
      ],
      "needBooking": "Recommended on weekends",
      "peakTime": "00:30-2:30"
    },
    "pricePerPerson": 150,
    "languagesSpoken": [
      "Chinese",
      "English",
      "Japanese"
    ],
    "michelinStars": 2
  },
  {
    "id": 4,
    "accountType": "restaurant",
    "username": "dumplinghouse",
    "displayName": "Dumpling House",
    "verified": true,
    "joinDate": "March 2023",
    "recommended": true,
    "hashtags": [
      "#dumplings",
      "#shanghairestaurant",
      "#localfavorite"
    ],
    "district": [
      "Jing'an",
      "Xuhui",
      "Huangpu"
    ],
    "merchantType": "Dumpling Restaurant",
    "stats": {
      "mentionedPosts": 56,
      "followers": 3200,
      "following": 85
    },
    "profileInterface": 2,
    "pricePerPerson": 80,
    "needBooking": "Walk-ins welcome",
    "peakTime": "12:00-13:30, 18:30-20:00",
    "languagesSpoken": [
      "Chinese",
      "English"
    ],
    "michelinStars": 1,
    "branches": [
      {
        "chineseAddress": "上海市静安区南京西路1788号",
        "englishAddress": "1788 West Nanjing Road, Jing'an District, Shanghai",
        "nearestSubway": "Line 2 Jing'an Temple Station, Exit 3 - 300m",
        "telephone": [
          "021-62555333"
        ],
        "branchDistrict": "Jing'an",
        "openingHours": [
          {
            "day": "Monday-Friday",
            "hours": "10:30-21:30"
          },
          {
            "day": "Weekends",
            "hours": "10:00-22:00"
          }
        ],
        "needBooking": "No reservation needed",
        "peakTime": "12:00-13:30"
      },
      {
        "chineseAddress": "上海市徐汇区淮海中路999号",
        "englishAddress": "999 Middle Huaihai Road, Xuhui District, Shanghai",
        "nearestSubway": "Line 1 South Shaanxi Road Station, Exit 5 - 150m",
        "telephone": [
          "021-64157788"
        ],
        "branchDistrict": "Xuhui",
        "openingHours": [
          {
            "day": "Monday-Wednesday",
            "hours": "8:45-16:30"
          },
          {
            "day": "Thursday-Friday",
            "hours": "8:45-19:30"
          },
          {
            "day": "Weekends",
            "hours": "9:30-21:45"
          }
        ],
        "needBooking": "Recommended on weekends",
        "peakTime": "18:00-20:00"
      },
      {
        "chineseAddress": "上海市黄浦区复兴东路518号",
        "englishAddress": "518 East Fuxing Road, Huangpu District, Shanghai",
        "nearestSubway": "Line 9 Dapuqiao Station, Exit 1 - 400m",
        "telephone": [
          "021-63316622"
        ],
        "branchDistrict": "Huangpu",
        "openingHours": [
          {
            "day": "Monday-Friday",
            "hours": "11:30-23:15"
          },
          {
            "day": "Weekends",
            "hours": "12:00-23:00"
          }
        ],
        "needBooking": "Walk-ins welcome",
        "peakTime": "19:00-21:00"
      }
    ]
  },
  {
    "id": 5,
    "accountType": "attraction",
    "username": "shanghaimuseum",
    "displayName": "Shanghai Museum",
    "verified": true,
    "joinDate": "June 2022",
    "recommended": true,
    "hashtags": [
      "#shanghaimuseum",
      "#culture",
      "#history",
      "#art"
    ],
    "district": [
      "People's Square"
    ],
    "merchantType": "Museum",
    "url": "https://www.shanghaimuseum.net",
    "stats": {
      "mentionedPosts": 87,
      "followers": 5600,
      "following": 45
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "上海市黄浦区人民大道201号",
      "englishAddress": "201 People's Avenue, Huangpu District, Shanghai",
      "nearestSubway": "Line 1/2/8 People's Square Station, Exit 1 - 100m",
      "telephone": [
        "021-63723500"
      ],
      "branchDistrict": "People's Square"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "7:15-16:45"
        },
        {
          "day": "Saturday",
          "hours": "9:30-17:30"
        },
        {
          "day": "Sunday",
          "hours": "Closed"
        }
      ],
      "needBooking": "Free admission, ticket required",
      "peakTime": "Weekends and holidays"
    },
    "ticketPrice": 100,
    "languagesSpoken": [
      "Chinese",
      "English",
      "French"
    ],
    "michelinStars": 1
  },
  {
    "id": 6,
    "accountType": "hotel",
    "username": "peacehotel",
    "displayName": "Peace Hotel Shanghai",
    "verified": true,
    "joinDate": "January 2022",
    "recommended": true,
    "hashtags": [
      "#historichotel",
      "#luxuryhotel",
      "#thebund",
      "#shanghaihotel"
    ],
    "district": [
      "The Bund"
    ],
    "merchantType": "Luxury Hotel",
    "url": "https://www.fairmont.com/peace-hotel-shanghai/",
    "stats": {
      "mentionedPosts": 112,
      "followers": 8900,
      "following": 67
    },
    "profileInterface": 6,
    "location": {
      "chineseAddress": "上海市黄浦区南京东路20号",
      "englishAddress": "20 East Nanjing Road, The Bund, Shanghai",
      "nearestSubway": "Line 2/10 Nanjing East Road Station, Exit 1 - 300m",
      "telephone": [
        "021-63216888"
      ],
      "branchDistrict": "The Bund"
    },
    "businessInfo": {},
    "pricePerNight": 1800,
    "amenities": [
      "Free WiFi",
      "Swimming Pool",
      "Fitness Center",
      "Spa",
      "Restaurant",
      "Bar"
    ],
    "stars": 5,
    "languagesSpoken": [
      "Chinese",
      "English",
      "French",
      "German",
      "Japanese",
      "Russian"
    ],
    "michelinStars": 3
  },
  {
    "id": 7,
    "accountType": "attraction",
    "username": "taikangroad",
    "displayName": "Taikang Road",
    "verified": true,
    "joinDate": "April 2023",
    "recommended": true,
    "hashtags": [
      "#tianzifang",
      "#taikangroad",
      "#artdistrict",
      "#shoppingstreet"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Shopping Street",
    "stats": {
      "mentionedPosts": 130,
      "followers": 9200,
      "following": 35
    },
    "profileInterface": 4,
    "location": {
      "chineseAddress": "上海市黄浦区泰康路210弄",
      "englishAddress": "Lane 210 Taikang Road, Huangpu District, Shanghai",
      "nearestSubway": "Line 9 Dapuqiao Station, Exit 1 - 400m",
      "branchDistrict": "Huangpu"
    }
  },
  {
    "id": 8,
    "accountType": "shopping",
    "username": "iapmmall",
    "displayName": "IAPM Shopping Mall",
    "verified": true,
    "joinDate": "September 2022",
    "recommended": true,
    "hashtags": [
      "#iapm",
      "#shoppingmall",
      "#luxuryshopping",
      "#shanghaishoping"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Shopping Mall",
    "url": "http://www.iapmmall.com/",
    "stats": {
      "mentionedPosts": 92,
      "followers": 7500,
      "following": 120
    },
    "profileInterface": 5,
    "location": {
      "chineseAddress": "上海市徐汇区淮海中路999号",
      "englishAddress": "999 Huaihai Middle Road, Xuhui District, Shanghai",
      "nearestSubway": "Line 1 South Shaanxi Road Station, Exit 1 - 100m",
      "telephone": [
        "021-64566999"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "9:15-21:45"
        },
        {
          "day": "Saturday",
          "hours": "10:00-22:30"
        },
        {
          "day": "Sunday",
          "hours": "11:00-19:00"
        }
      ],
      "peakTime": "Weekends 14:00-20:00"
    },
    "floors": 7,
    "featuredStores": [
      "apple",
      "zara",
      "uniqlo",
      "sephora"
    ],
    "michelinStars": 2
  },
  {
    "id": 9,
    "accountType": "attraction",
    "username": "xintiandi",
    "displayName": "Xin Tian Di",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#building",
      "#mall",
      "#place",
      "#free",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "CityWalk",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 5,
    "location": {
      "chineseAddress": "新天地 太仓路181弄2号",
      "englishAddress": "No. 2, Lane 181, Taicang Road, Xintiandi",
      "nearestSubway": "Line 10: First National Congress of the CPC Site · Xintiandi Station",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-23:00"
        }
      ]
    }
  },
  {
    "id": 10,
    "accountType": "attraction",
    "username": "wukangroad",
    "displayName": "Wukang Road",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#citywalk",
      "#takepicture",
      "#place",
      "#free",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "CityWalk",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 4,
    "location": {
      "chineseAddress": "武康路393号甲",
      "englishAddress": "Wukang Road 393A",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)",
      "branchDistrict": "Xuhui"
    }
  },
  {
    "id": 11,
    "accountType": "attraction",
    "username": "wukangbuilding",
    "displayName": "Wukang Building",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#place",
      "#superpicture",
      "#free",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "CityWalk",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 5,
    "location": {
      "chineseAddress": "武康大樓 淮海中路1850号",
      "englishAddress": "Wukang Building, 1850 Huaihai Middle Road",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)",
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    }
  },
  {
    "id": 12,
    "accountType": "restaurant",
    "username": "apoliitabakery",
    "displayName": "Apoli Itabakery",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#place",
      "#snack",
      "#coffee",
      "#free",
      "#recommend",
      "#affordable",
      "#Changning"
    ],
    "district": [
      "Changning"
    ],
    "merchantType": "Bakery",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Apoli Itabakery 意大利料理面包坊 兴国路380号",
      "englishAddress": "380 Xingguo Road",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)",
      "telephone": [
        "18019262027",
        "13788942654"
      ],
      "branchDistrict": "Changning"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-20:00"
        }
      ]
    },
    "pricePerPerson": 40
  },
  {
    "id": 13,
    "accountType": "restaurant",
    "username": "thecottagecafe",
    "displayName": "The Cottage Cafe",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#place",
      "#snack",
      "#coffee",
      "#free",
      "#recommend",
      "#affordable",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Cafe",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "老麦咖啡馆·TheCottageBar(武康大楼店) 武康路439号武康大楼底楼-1",
      "englishAddress": "Wukang Building, 439 Wukang Road, Unit B1-1, Shanghai",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 7 (walk 300m)",
      "telephone": [
        "18201817395",
        "15026991919"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "10:30-19:00",
            "19:30-24:00"
          ]
        }
      ]
    },
    "pricePerPerson": 40
  },
  {
    "id": 14,
    "accountType": "restaurant",
    "username": "gatheringcafe",
    "displayName": "Gathering Cafe",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#place",
      "#snack",
      "#coffee",
      "#free",
      "#recommend",
      "#affordable",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "cafe",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "集雅GATHERING咖啡(武康路店) 武康路137号底层",
      "englishAddress": "G/F, 137 Wukang Road",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 3 (walk 420m)",
      "telephone": [
        "13818874372"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "09:00-19:00"
        }
      ]
    },
    "pricePerPerson": 40
  },
  {
    "id": 15,
    "accountType": "shopping",
    "username": "subdued",
    "displayName": "Subdued",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#clothing",
      "#place",
      "#shopping",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "fashion",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Subdued(武康路店) 武康路375号",
      "englishAddress": "375 Wukang Road",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 3 (walk 690m)",
      "telephone": [
        "021-33683052"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "10:00-20:00"
        },
        {
          "day": "Friday-Sunday",
          "hours": "10:00-21:00"
        }
      ]
    }
  },
  {
    "id": 16,
    "accountType": "attraction",
    "username": "anfuroad",
    "displayName": "Anfu Road",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#citywalk",
      "#takepicture",
      "#place",
      "#free",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "CityWalk",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 4,
    "location": {
      "chineseAddress": "安福路",
      "englishAddress": "Anfu Road",
      "nearestSubway": "Lines 1 & 7: Changshu Road Station (10min walk)",
      "branchDistrict": "Xuhui"
    }
  },
  {
    "id": 17,
    "accountType": "shopping",
    "username": "wigglewiggle",
    "displayName": "Wiggle Wiggle",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#shopping",
      "#place",
      "#superpicture",
      "#free",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Shopping",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Wiggle Wiggle 安福路308号",
      "englishAddress": "308 Anfu Road",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 1 (1.1km walk)",
      "telephone": [
        "13052002197",
        "13052005783"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "10:00-21:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "10:00-22:00"
        },
        {
          "day": "Sunday",
          "hours": "10:00-21:00"
        }
      ]
    }
  },
  {
    "id": 18,
    "accountType": "shopping",
    "username": "brandymelville",
    "displayName": "Brandy Melville (Shanghai)",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#clothing",
      "#place",
      "#shopping",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Shopping",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Brandy Melville 安福路308号",
      "englishAddress": "308 Anfu Road",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 1 (1.1km walk)",
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "11:00-20:00"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "09:00-21:00"
        }
      ]
    }
  },
  {
    "id": 19,
    "accountType": "shopping",
    "username": "looknowandflow",
    "displayName": "LookNow & Flow",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#clothing",
      "#place",
      "#shopping",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Shopping",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "LookNow & Flow 安福路156号",
      "englishAddress": "156 Anfy Road",
      "nearestSubway": "Line 7: Changshu Road Station, Exit 8 (530m walk)",
      "telephone": [
        "16621162787"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-21:00"
        }
      ]
    }
  },
  {
    "id": 20,
    "accountType": "restaurant",
    "username": "sunflourbakery",
    "displayName": "Sunflour Bakery (Anfu Road Branch)",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#place",
      "#snack",
      "#coffee",
      "#recommend",
      "#affordable",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Bakery",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "阳光粮品 安福路308号103-104室",
      "englishAddress": "308 Anfu Road, Units 103-104",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 1 (1.2km walk)",
      "telephone": [
        "021-64737757"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "07:00-22:00"
        }
      ]
    },
    "pricePerPerson": 40
  },
  {
    "id": 21,
    "accountType": "restaurant",
    "username": "13demarzocafe",
    "displayName": "13DE MARZO Cafe",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#place",
      "#snack",
      "#coffee",
      "#recommend",
      "#affordable",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "cafe",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "13DE MARZO CAFÉ(上海安福路店) 安福路322号4号楼1楼",
      "englishAddress": "1F, Building 4, 322 Anfu Road",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 1 (1.1km walk)",
      "telephone": [
        "4000131330",
        "15801707855"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-21:30"
        }
      ]
    },
    "pricePerPerson": 37
  },
  {
    "id": 22,
    "accountType": "restaurant",
    "username": "shenjingdessert",
    "displayName": "Shenjing Dessert",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#place",
      "#snack",
      "#dessert",
      "#recommend",
      "#affordable",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "dessert",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "申井冰店·日式甜品(安福路店) 安福路31号",
      "englishAddress": "31 Anfu Road",
      "nearestSubway": "Line 7: Changshu Road Station, Exit 8 (250m walk)",
      "telephone": [
        "19512205883"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-22:00"
        }
      ]
    },
    "pricePerPerson": 35
  },
  {
    "id": 23,
    "accountType": "attraction",
    "username": "eastnanjingroad",
    "displayName": "East Nanjing Road",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#citywalk",
      "#takepicture",
      "#place",
      "#free",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "CityWalk",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 4,
    "location": {
      "chineseAddress": "南京路步行街",
      "englishAddress": "Nanjing Road Pedestrian Street",
      "nearestSubway": "Lines 2/10: East Nanjing Road Station, Exit 4 (turn left) (390m walk)",
      "branchDistrict": "Huangpu"
    }
  },
  {
    "id": 24,
    "accountType": "shopping",
    "username": "wmanagement",
    "displayName": "W Management",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#clothing",
      "#takepicture",
      "#place",
      "#shopping",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Fashion",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "W·Management(第一百货南京东路店) 南京东路830号上海市第一百货商店B01层",
      "englishAddress": "B01 Floor, Shanghai No.1 Department Store, 830 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 2: People's Square Station (350m walk)",
      "telephone": [
        "15021255027"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    }
  },
  {
    "id": 25,
    "accountType": "shopping",
    "username": "nike001",
    "displayName": "Nike001 (Asia Biggest Nike Branch)",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#clothing",
      "#takepicture",
      "#place",
      "#shopping",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Fashion",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "NIKE上海001店 南京东路829号上海世茂广场",
      "englishAddress": "Shanghai Shimao Plaza, 829 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 1: People's Square Station, Exit 19 (220m walk)",
      "telephone": [
        "021-63332888"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    }
  },
  {
    "id": 26,
    "accountType": "restaurant",
    "username": "lailaixiaolong",
    "displayName": "Lai Lai Xiao Long",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#takepicture",
      "#Chinese",
      "#XiaoLongBao",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "XiaoLongBao",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "莱莱小笼·乔艾 黃浦區天津路506号",
      "englishAddress": "506 Tianjin Road, Huangpu District, Shanghai",
      "nearestSubway": "Line 1: People's Square Station, Exit 19 (650m walk)",
      "telephone": [
        "021-63520230"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "08:00-14:00",
            "15:00-20:00"
          ]
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 60
  },
  {
    "id": 27,
    "accountType": "attraction",
    "username": "mandms",
    "displayName": "M&M's",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#shopping",
      "#snack",
      "#place",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "m豆巧克力世界(上海世茂广场店) 南京东路829号上海世茂广场G层",
      "englishAddress": "Shanghai Shimao Plaza, G Floor, 829 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 1: People's Square Station, Exit 19 (310m walk)",
      "telephone": [
        "021-23162888"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 28,
    "accountType": "restaurant",
    "username": "shendacheng",
    "displayName": "Shen DaCheng",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#place",
      "#snack",
      "#dessert",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Dessert",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "沈大成(南京东路店) 南京东路636号",
      "englishAddress": "636 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 1: People's Square Station, Exit 14 (500m walk)",
      "telephone": [
        "021-63224926",
        "021-63225615"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "07:00-22:00"
        }
      ]
    },
    "pricePerPerson": 35
  },
  {
    "id": 29,
    "accountType": "attraction",
    "username": "minisoland",
    "displayName": "MINISO LAND",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#shopping",
      "#place",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "名创优品全球1号店 南京东路479号",
      "englishAddress": "479 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 2: East Nanjing Road Station, Exit 4 (turn left) - 240m walk",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 30,
    "accountType": "attraction",
    "username": "toptoyshanghai",
    "displayName": "Top Toy Shanghai",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#shopping",
      "#place",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "TOPTOY(上海南京路店) 南京东路558号",
      "englishAddress": "558 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 2: East Nanjing Road Station, Exit 4 (turn left) (390m walk)",
      "telephone": [
        "18321765759"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 31,
    "accountType": "attraction",
    "username": "zxshanghai",
    "displayName": "ZX Shanghai",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": false,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#anime",
      "#shopping",
      "#place",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "百联ZX创趣场(南京东路店) 南京东路340-372号",
      "englishAddress": "340-372 East Nanjing Road, Shanghai",
      "nearestSubway": "Line 2: East Nanjing Road Station, Exit 1 (turn left) (70m walk)",
      "telephone": [
        "021-63516562"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 32,
    "accountType": "attraction",
    "username": "somekhbuilding",
    "displayName": "Somekh Building",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#building",
      "#place",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "北京东路190号",
      "englishAddress": "190 East Beijing Road, Shanghai",
      "nearestSubway": "Line 10: East Nanjing Road Station, Exit 6 (turn left) - 360m walk",
      "telephone": [
        "021-63360090"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 33,
    "accountType": "barandclub",
    "username": "theupperroom",
    "displayName": "The Upper Room",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#takepicture",
      "#superpicture",
      "#date",
      "#bar",
      "#alcohol",
      "#restaurant",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "THE UPPER ROOM 北京东路190号沙美大楼 顶层",
      "englishAddress": "Top Floor, Shamei Building, 190 East Beijing Road, Shanghai",
      "nearestSubway": "Line 10: East Nanjing Road Station, Exit 6 (360m walk)",
      "telephone": [
        "19370653175"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Tuesday-Sunday",
          "hours": "17:00-01:30"
        }
      ],
      "needBooking": "No need booking, can walk in"
    },
    "pricePerPerson": 90,
    "clubCategories": [
      "rooftop",
      "bar",
      "nightview"
    ]
  },
  {
    "id": 34,
    "accountType": "attraction",
    "username": "thebund",
    "displayName": "The Bund",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#takepicture",
      "#place",
      "#nightview",
      "#free",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "外灘",
      "englishAddress": "East Zhongshan No.1 Road, The Bund",
      "nearestSubway": "Line 2: East Nanjing Road Station, Exit 2 (600m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 35,
    "accountType": "attraction",
    "username": "shanghaipostal",
    "displayName": "Shanghai Postal Museum",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#museum",
      "#place",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "上海邮政博物馆 北苏州路250号",
      "englishAddress": "Shanghai Postal Museum, 250 North Suzhou Road, Shanghai",
      "nearestSubway": "Lines 10 & 12: Tiantong Road Station, Exit 3 (turn left) - 250m walk",
      "telephone": [
        "021-63936666"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Wednesday-Thursday",
          "hours": "09:00-17:00"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "09:00-17:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 36,
    "accountType": "restaurant",
    "username": "reiflowercoffee",
    "displayName": "REi·FLOWER COFFEE BAR",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#restaurant",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "汭REi·FLOWER COFFEE BAR 北苏州路234号",
      "englishAddress": "REi·FLOWER COFFEE BAR, 234 North Suzhou Road, Shanghai",
      "nearestSubway": "Lines 10 & 12: Tiantong Road Station, Exit 3 (380m walk)",
      "telephone": [
        "17521187929"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:30-01:00"
        }
      ],
      "needBooking": "Only walk in"
    },
    "pricePerPerson": 56
  },
  {
    "id": 37,
    "accountType": "attraction",
    "username": "zhapubridge",
    "displayName": "Zhapu Road Bridge",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#place",
      "#bridge",
      "#recommend",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "乍浦路橋",
      "englishAddress": "Zhapu Road Bridge",
      "nearestSubway": "Lines 10 & 12: Tiantong Road Station, Exit 3 (turn left) - 630m walk",
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 38,
    "accountType": "attraction",
    "username": "northbund",
    "displayName": "North Bund",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#citywalk",
      "#takepicture",
      "#place",
      "#recommend",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "北外滩滨江绿地 东大名路558-678",
      "englishAddress": "North Bund Riverside Green Space, 558-678 East Daming Road, Shanghai",
      "nearestSubway": "Line 12: International Cruise Terminal Station, Exit 3 (turn left) - 680m walk",
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 39,
    "accountType": "attraction",
    "username": "littleegg",
    "displayName": "North Bund Little Egg",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#superpicture",
      "#place",
      "#recommend",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "北外滩小巨蛋 东大名路558-678号北外滩滨江绿地",
      "englishAddress": "North Bund Riverside Green Space, 558-678 East Daming Road, Shanghai",
      "nearestSubway": "Line 12: International Cruise Terminal Station, Exit 3 (turn left) - 640m walk",
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 40,
    "accountType": "restaurant",
    "username": "mannercoffee",
    "displayName": "Manner Coffee",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Manner Coffee(国客滨江店) 太平路国际港务大厦南60米",
      "englishAddress": "Manner Coffee, near International Port Services Building, Taiping Road, Shanghai",
      "nearestSubway": "Line 12: International Cruise Terminal Station, Exit 3 (700m walk)",
      "telephone": [
        "13003185954"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "07:30-22:00"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "09:00-22:00"
        }
      ]
    },
    "pricePerPerson": 20
  },
  {
    "id": 41,
    "accountType": "restaurant",
    "username": "jslinkcoffee",
    "displayName": "J's link Coffee",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#restaurant",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "如意摩登滋味小馆（吉生活）(北外滩店) 北苏州河路224号",
      "englishAddress": "J's link Coffee, 224 North Suzhou Creek Road, Shanghai",
      "nearestSubway": "Lines 10 & 12: Tiantong Road Station, Exit 3 (380m walk)",
      "telephone": [
        "19531936988"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-21:00"
        }
      ]
    },
    "pricePerPerson": 60
  },
  {
    "id": 42,
    "accountType": "restaurant",
    "username": "thepeoplecoffee",
    "displayName": "The People Coffee",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "看得到风景的咖啡馆(白玉兰广场店) 东大名路501号白玉兰商务楼空中大堂L层",
      "englishAddress": "Sky Lobby L Floor, Magnolia Business Tower, Shanghai",
      "nearestSubway": "Line 12: International Cruise Terminal Station, Exit 3 (470m walk)",
      "telephone": [
        "021-55669277"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday",
          "hours": "09:00-22:30"
        },
        {
          "day": "Tuesday-Sunday",
          "hours": [
            "09:00-18:30",
            "19:00-24:00"
          ]
        }
      ],
      "needBooking": "Can book or walk in. Recommend weekday morning if walk in"
    },
    "pricePerPerson": 65
  },
  {
    "id": 43,
    "accountType": "attraction",
    "username": "orientalpearltower",
    "displayName": "Oriental Pearl Tower",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#landmark",
      "#tower",
      "#sightseeing",
      "#takepicture",
      "#place",
      "#nightview",
      "#popular",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Skyscraper",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "東方之珠 世纪大道1号",
      "englishAddress": "Oriental Pearl Tower, 1 Century Avenue, Shanghai",
      "nearestSubway": "Line 2: Lujiazui Station, Exit 1 (turn left) - 300m walk",
      "telephone": [
        "021-58792888",
        "021-58791888"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "08:30-21:30"
        }
      ]
    },
    "ticketPrice": 199
  },
  {
    "id": 44,
    "accountType": "attraction",
    "username": "threetowers",
    "displayName": "Lujiazui Three Towers",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#takepicture",
      "#superpicture",
      "#place",
      "#nightview",
      "#free",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Skyscraper",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "陆家嘴三件套, 上海环球金融中心附近",
      "englishAddress": "Near Shanghai World Financial Center, 100 Century Avenue, Shanghai",
      "nearestSubway": "Lines 2/14: Lujiazui Station, Exit 8 (570m walk)",
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 45,
    "accountType": "attraction",
    "username": "museumofartpd",
    "displayName": "Museum of Art Pudong",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#citywalk",
      "#takepicture",
      "#museum",
      "#place",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Museum",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "浦东美术馆 滨江大道2777号",
      "englishAddress": "2777 Binjiang Avenue, Shanghai",
      "nearestSubway": "Line 2: Lujiazui Station, Exit 1 (turn left) - 690m walk",
      "telephone": [
        "4008208771"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-21:00"
        }
      ]
    },
    "ticketPrice": 100
  },
  {
    "id": 46,
    "accountType": "attraction",
    "username": "huanlesquare",
    "displayName": "Huanle Square",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#street",
      "#takepicture",
      "#superpicture",
      "#place",
      "#nightview",
      "#sunset",
      "#free",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "浦东欢乐广场 滨江大道2967号",
      "englishAddress": "2967 Binjiang Avenue, Shanghai",
      "nearestSubway": "Lines 2/14: Lujiazui Station, Exit 10 (8min walk)",
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "24 hours"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 47,
    "accountType": "attraction",
    "username": "shanghaidisney",
    "displayName": "Shanghai Disneyland",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#takepicture",
      "#place",
      "#kids",
      "#fun",
      "#themepark",
      "#disney",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Disney",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "上海迪士尼乐园 川沙镇黄赵路310号",
      "englishAddress": "310 Huangzhao Road, Chuansha Town, Shanghai",
      "nearestSubway": "Line 2: Disney Resort Station, Exit 1 (600m walk)",
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "08:30-21:30"
        }
      ]
    },
    "ticketPrice": 449
  },
  {
    "id": 48,
    "accountType": "attraction",
    "username": "shwzoo",
    "displayName": "Shanghai Wild Animal Park",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#takepicture",
      "#place",
      "#kids",
      "#fun",
      "#zoo",
      "#animals",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Wild Animal",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "上海野生动物园 南六公路178号",
      "englishAddress": "178 South Sixth Highway, Shanghai",
      "nearestSubway": "Line 16: Shanghai Wild Animal Park Station, Exit 2",
      "telephone": [
        "021-58036000"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "09:00-17:00"
        }
      ]
    },
    "ticketPrice": 165
  },
  {
    "id": 49,
    "accountType": "attraction",
    "username": "haichangoceanpark",
    "displayName": "Hai Chang Ocean Park",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#takepicture",
      "#place",
      "#kids",
      "#fun",
      "#themepark",
      "#oceanpark",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Wild Animal",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "海昌海洋公园 银飞路166号",
      "englishAddress": "166 Yinfei Road, Shanghai",
      "nearestSubway": "Not available - recommend take taxi instead",
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "09:30-20:30"
        }
      ]
    },
    "ticketPrice": 339
  },
  {
    "id": 50,
    "accountType": "restaurant",
    "username": "kkucoffee",
    "displayName": "KKU Bakery Coffee",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "亲亲侬(南苏州路店) 南苏州路198号第一加油站2楼（便利店内楼梯上去）",
      "englishAddress": "2F, No.1 Gas Station, 198 South Suzhou Road (via stairs inside convenience store)",
      "nearestSubway": "Lines 10/12: Tiantong Road Station, Exit 3 (510m walk)",
      "telephone": [
        "15821335777"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "09:00-21:00"
        }
      ]
    },
    "pricePerPerson": 40
  },
  {
    "id": 51,
    "accountType": "restaurant",
    "username": "bund8coffee",
    "displayName": "Bund 8 Coffee",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#takepicture",
      "#date",
      "#coffee",
      "#place",
      "#nightview",
      "#popular",
      "#recommend",
      "#affordable",
      "#Hongkou"
    ],
    "district": [
      "Hongkou"
    ],
    "merchantType": "Coffee",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "外滩8号Bund 8 Café(金延大厦店) 中山东二路8号",
      "englishAddress": "8 East Zhongshan No.2 Road, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (550m walk)",
      "telephone": [
        "15821335777"
      ],
      "branchDistrict": "Hongkou"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:30-18:00"
        }
      ]
    },
    "pricePerPerson": 57
  },
  {
    "id": 52,
    "accountType": "shopping",
    "username": "basementfg",
    "displayName": "Basement FG (Shanghai)",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#clothing",
      "#place",
      "#shopping",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Fashion",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "BASEMENT FG (上海店) 新乐路82号",
      "englishAddress": "BASEMENT FG Shanghai Store, 82 Xinle Road, Shanghai",
      "nearestSubway": "Line 12: Shaanxi South Road Station, Exit 10 (500m walk)",
      "telephone": [
        "021-60197288"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "11:00-21:30"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "11:00-22:00"
        }
      ]
    }
  },
  {
    "id": 53,
    "accountType": "attraction",
    "username": "discusmart",
    "displayName": "Discus Mart",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#clothing",
      "#place",
      "#shopping",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Attraction",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 3,
    "location": {
      "chineseAddress": "Discus Mart(新天地广场店) 淮海中路333号新天地广场B2-01",
      "englishAddress": "Discus Mart, B2-01, Xintiandi Plaza, 333 Huaihai Middle Road, Shanghai",
      "nearestSubway": "Line 1: First National Congress of the CPC Site - Huangpi South Road Station, Exit 2 (190m walk)",
      "telephone": [
        "021-63866567"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ]
    },
    "ticketPrice": 0
  },
  {
    "id": 54,
    "accountType": "restaurant",
    "username": "crabnoodleslee",
    "displayName": "Crab Noodles Lee",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#Chinese",
      "#CrabNoodles",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Cuisine",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "李百蟹·蟹黄面·江景餐厅(外滩·豫园店) 外滩22号中山东二路22号3楼",
      "englishAddress": "3F, No.22 East Zhongshan No.2 Road, The Bund, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (500m walk)",
      "telephone": [
        "13328012446"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-22:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 110
  },
  {
    "id": 55,
    "accountType": "restaurant",
    "username": "xiezhenxiang",
    "displayName": "Xie Zhen Xiang",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#Chinese",
      "#CrabNoodles",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Cuisine",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "蟹珍香·百年蟹黄面(外滩店) 中山东一路391号",
      "englishAddress": "391 East Zhongshan No.1 Road, The Bund, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (270m walk)",
      "telephone": [
        "19301193710"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:00-23:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 110
  },
  {
    "id": 56,
    "accountType": "restaurant",
    "username": "nanxiangbun",
    "displayName": "Nan Xiang Steamed Bun Restaurant",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#takepicture",
      "#Chinese",
      "#XiaoLongBao",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Cuisine",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "南翔馒头店(豫园店) 豫园路87号",
      "englishAddress": "87 Yuyuan Road, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (520m walk)",
      "telephone": [
        "021-63554206"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "07:30-20:30"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 110
  },
  {
    "id": 57,
    "accountType": "restaurant",
    "username": "dongtaixiang",
    "displayName": "Dong Tai Xiang",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#breakfast",
      "#midnight",
      "#chinese",
      "#pan-fried buns",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "东泰祥生煎馆(重庆北路店) 重庆北路188号",
      "englishAddress": "188 Chongqing North Road, Shanghai",
      "nearestSubway": "Line 14: Site of the First National Congress of the CPC & South Huangpi Road Station, Exit 4 (600m walk)",
      "telephone": [
        "021-63595808"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "00:00-24:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 30
  },
  {
    "id": 58,
    "accountType": "restaurant",
    "username": "yangsdumpling",
    "displayName": "Yang's Dumpling",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#breakfast",
      "#lunch",
      "#takepicture",
      "#Chinese",
      "#pan fried buns",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "小杨生煎(福州路店) 南京东路街道福州路567号1楼东北侧-b",
      "englishAddress": "Unit B, Northeast Section, 1F, 567 Fuzhou Road, Shanghai",
      "nearestSubway": "Line 1: People's Square Station (420m walk)",
      "telephone": [
        "021-63330520"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "00:00-24:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 30
  },
  {
    "id": 59,
    "accountType": "restaurant",
    "username": "chongqingbanquet",
    "displayName": "Chongqing Banquet",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#luxury",
      "#Chinese",
      "#Hotpot",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Hotpot Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "宴山城重庆火锅(外滩江景店) 广东路20号外滩5号6楼江景",
      "englishAddress": "6F, No.5 Bund, 20 Guangdong Road, Shanghai (Riverside View)",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 6 (680m walk)",
      "telephone": [
        "021-63307725"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:00-14:00",
            "17:00-22:30"
          ]
        }
      ],
      "needBooking": "Phone booking required"
    },
    "pricePerPerson": 800
  },
  {
    "id": 60,
    "accountType": "restaurant",
    "username": "qingtinghotpot",
    "displayName": "Qing Ting Cheung Du Hotpot",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#takepicture",
      "#Chinese",
      "#Hotpot",
      "#goodfood",
      "#recommend",
      "#Jingan"
    ],
    "district": [
      "Jingan"
    ],
    "merchantType": "Hotpot Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "卿庭·成都鲜货火锅 靜安區愚园路68号CP静安购物中心7楼L7-09",
      "englishAddress": "Unit L7-09, 7F, CP Jingan Shopping Center, 68 Yuyuan Road, Shanghai",
      "nearestSubway": "Line 2: Jingan Temple Station (310m walk)",
      "telephone": [
        "18916507067",
        "021-62170017"
      ],
      "branchDistrict": "Jingan"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-02:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 150
  },
  {
    "id": 61,
    "accountType": "restaurant",
    "username": "wonghotpot",
    "displayName": "Seafood Wong Hotpot",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#dinner",
      "#chinese",
      "#hotpot",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#midnight",
      "#recommend",
      "#Putuo",
      "#Changning",
      "#Yangpu"
    ],
    "district": [
      "Putuo",
      "Changning",
      "Yangpu"
    ],
    "merchantType": "Hotpot Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 110,
    "needBooking": "Only accept walk-in",
    "branches": [
      {
        "chineseAddress": "王富贵火锅(中山公园店) 龙之梦黄中庭9楼",
        "englishAddress": "9F, Longemont Zhongting, 1555 Changning Road, Shanghai",
        "telephone": [
          "18916162530"
        ],
        "branchDistrict": "Changning",
        "nearestSubway": "Line 2: Zhongshan Park Station (30m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-05:00"
          }
        ]
      },
      {
        "chineseAddress": "王富贵火锅(长寿路店) 长寿路155号巴黎春天5楼",
        "englishAddress": "5F, Paris Spring Mall, 155 Changshou Road, Shanghai",
        "telephone": [
          "15300859052"
        ],
        "branchDistrict": "Putuo",
        "nearestSubway": "Line 13: Jiangning Road Station, Exit 4 (340m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-05:00"
          }
        ]
      },
      {
        "chineseAddress": "王富贵火锅(五角场店) 淞沪路151号诚品国际中环大厦3楼",
        "englishAddress": "3F, Chengguo International Zhonghuan Building, 151 Songhu Road, Shanghai",
        "telephone": [
          "18017213938"
        ],
        "branchDistrict": "Yangpu",
        "nearestSubway": "Line 10: Jiangwan Stadium Station, Exit 6 (50m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-05:00"
          }
        ]
      }
    ]
  },
  {
    "id": 62,
    "accountType": "restaurant",
    "username": "twohotpot",
    "displayName": "Two Hotpot",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#dinner",
      "#Chinese",
      "#Hotpot",
      "#goodfood",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Hotpot Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "二火锅(上海店) 浙江中路283号2层B区2-1至2-3",
      "englishAddress": "Units 2-1 to 2-3, Area B, 2F, 283 Middle Zhejiang Road, Shanghai",
      "nearestSubway": "Line 1: People's Square Station, Exit 14 (370m walk)",
      "telephone": [
        "021-63368222"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-02:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 120
  },
  {
    "id": 63,
    "accountType": "restaurant",
    "username": "orientalhouse",
    "displayName": "Oriental House",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#Jingan"
    ],
    "district": [
      "Jingan"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "醉东Oriental House(静安嘉里店) 南京西路嘉里中心北区4层N4-15号",
      "englishAddress": "Unit N4-15, 4F North Zone, Kerry Center, West Nanjing Road, Shanghai",
      "nearestSubway": "Line 7: Jing'an Temple Station, Exit 6 (90m walk)",
      "telephone": [
        "19521377866"
      ],
      "branchDistrict": "Jingan"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": [
            "11:00-14:00",
            "17:00-21:00"
          ]
        },
        {
          "day": "Friday-Sunday",
          "hours": [
            "11:00-14:00",
            "16:30-21:00"
          ]
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 320
  },
  {
    "id": 64,
    "accountType": "restaurant",
    "username": "chenglonghangcrab",
    "displayName": "Cheng Long Hang Crab",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "成隆行·蟹王府(九江路店) 九江路216号",
      "englishAddress": "216 Jiujiang Road, Shanghai",
      "nearestSubway": "Line 10: East Nanjing Road Station (230m walk)",
      "telephone": [
        "021-63212010"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:00-15:00",
            "17:00-22:00"
          ]
        }
      ],
      "needBooking": "Phone booking or Walk in"
    },
    "pricePerPerson": 350
  },
  {
    "id": 65,
    "accountType": "restaurant",
    "username": "loongdockcrabhouse",
    "displayName": "Loong Dock Crab House",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "龍码头·螃蟹王(博荟店) 中山南一路788号博荟广场L2层12号",
      "englishAddress": "Unit 12, L2, Bo Hui Plaza, 788 South Zhongshan No.1 Road, Shanghai",
      "nearestSubway": "Line 13: World Expo Museum Station (10m walk)",
      "telephone": [
        "021-57939777"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": [
            "10:30-14:30",
            "17:00-21:30"
          ]
        },
        {
          "day": "Saturday-Sunday",
          "hours": "10:30-21:30"
        }
      ],
      "needBooking": "Phone booking or Walk in"
    },
    "pricePerPerson": 500
  },
  {
    "id": 66,
    "accountType": "restaurant",
    "username": "shiheyuan",
    "displayName": "Shi He Yuan",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "柿合缘新京菜(国金中心商场店) 世纪大道8号国金中心L4-402&403",
      "englishAddress": "Units 402 & 403, 4F, IFC Mall, 8 Century Avenue, Shanghai",
      "nearestSubway": "Line 14: Lujiazui Station, Exit 7 (30m walk)",
      "telephone": [
        "021-58757773"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:00-14:00",
            "17:00-20:30"
          ]
        }
      ],
      "needBooking": "電話预订"
    },
    "pricePerPerson": 300
  },
  {
    "id": 67,
    "accountType": "restaurant",
    "username": "shengyongxing",
    "displayName": "Sheng Yong Xing",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "晟永興(外滩店) 外滩5号5楼",
      "englishAddress": "5F, Bund 5, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 6 (800m walk)",
      "telephone": [
        "021-63302885"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:30-15:00",
            "17:30-21:30"
          ]
        }
      ],
      "needBooking": "Phone booking required"
    },
    "pricePerPerson": 450
  },
  {
    "id": 68,
    "accountType": "restaurant",
    "username": "laoxingxian",
    "displayName": "Lao Xing Xian",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#luxury",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "老兴鲜(黄浦店) 淮海中路918号百盛商场5楼",
      "englishAddress": "5F, Parkson Shopping Mall, 918 Middle Huaihai Road, Shanghai",
      "nearestSubway": "Line 1: South Shaanxi Road Station, Exit 2 (60m walk)",
      "telephone": [
        "13681653751"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:00-14:00",
            "17:00-21:00"
          ]
        }
      ],
      "needBooking": "Phone booking required"
    },
    "pricePerPerson": 240
  },
  {
    "id": 69,
    "accountType": "restaurant",
    "username": "dabaokoufu",
    "displayName": "Da Bao Kou Fu",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#takepicture",
      "#Chinese",
      "#goodfood",
      "#recommend",
      "#affordable",
      "#Changning"
    ],
    "district": [
      "Changning"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "大寶口福·海鲜排档·平价海鲜(长宁来福士店) 长宁路1191号长宁来福士广场东区4层22-24号",
      "englishAddress": "Units 22-24, 4F, Raffles City Changning East Zone, 1191 Changning Road, Shanghai",
      "nearestSubway": "Lines 3/4: Zhongshan Park Station, Exit 7 (210m walk)",
      "telephone": [
        "15026886222"
      ],
      "branchDistrict": "Changning"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "10:30-22:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 130
  },
  {
    "id": 70,
    "accountType": "restaurant",
    "username": "communereserve",
    "displayName": "COMMUNE RESERVE",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#girls night",
      "#italian",
      "#western",
      "#goodfood",
      "#recommend",
      "#affordable",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Italian Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "COMMUNE RESERVE幻师(上海环球金融中心店) 世纪大道100号上海环球金融中心B1",
      "englishAddress": "B1, Shanghai World Financial Center, 100 Century Avenue, Shanghai",
      "nearestSubway": "Line 14: Lujiazui Station, Exit 8 (690m walk)",
      "telephone": [
        "19117256073"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "11:00-02:00"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "10:00-02:00"
        }
      ],
      "needBooking": "No need booking. Weekdays are good, but weekend is crowded"
    },
    "pricePerPerson": 150
  },
  {
    "id": 71,
    "accountType": "restaurant",
    "username": "otfsicilia",
    "displayName": "OTF Sicilia",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#birthday",
      "#date",
      "#takepicture",
      "#italian",
      "#western",
      "#goodfood",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Italian Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "假日餐厅 东育路500弄1-9号前滩太古里木区W-L3-04a（HUAWEI楼上）",
      "englishAddress": "Unit W-L3-04a, Wood Zone, Taikoo Li Qiantan, 500 Dongyu Road, Shanghai",
      "nearestSubway": "Lines 6/8/11: Oriental Sports Center Station, Exit 1 (130m walk)",
      "telephone": [
        "17701671603"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-21:00"
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 150
  },
  {
    "id": 72,
    "accountType": "restaurant",
    "username": "rivieraitalian",
    "displayName": "Riviera Italian Restaurant",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#birthday",
      "#date",
      "#superpicture",
      "#takepicture",
      "#italian",
      "#western",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Italian Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "天水恋意大利餐厅(滨江大道店) 陆家嘴街道滨江大道3082号(滨江大道富都段滨江花园内近富城路)",
      "englishAddress": "3082 Binjiang Avenue, Lujiazui Subdistrict, Shanghai",
      "nearestSubway": "Line 14: Lujiazui Station, Exit 9B (620m walk)",
      "telephone": [
        "021-58775966"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:30-23:00"
        }
      ],
      "needBooking": "Walk in only, recommend arrive 5:30pm to get good seats"
    },
    "pricePerPerson": 188
  },
  {
    "id": 73,
    "accountType": "restaurant",
    "username": "lejardinsecret",
    "displayName": "Le Jardin Secret",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#goodfood",
      "#recommend",
      "#affordable",
      "#Changning"
    ],
    "district": [
      "Changning"
    ],
    "merchantType": "Western Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "秘密花园(法华镇路店) 新华路街道法华镇路525号创意树林入口处(香花桥路口)",
      "englishAddress": "Entrance of Creative Woods, 525 Fahua Town Road, Xinhua Road Subdistrict, Shanghai",
      "nearestSubway": "Line 10: Shanghai Jiao Tong University Station, Exit 5 (1.1km walk)",
      "telephone": [
        "021-60821775"
      ],
      "branchDistrict": "Changning"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-22:00"
        }
      ],
      "needBooking": "Phone booking or walk in"
    },
    "pricePerPerson": 120
  },
  {
    "id": 74,
    "accountType": "restaurant",
    "username": "DonQuixote",
    "displayName": "Don Quixote Spanish Restaurant Wine House",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#Spanish",
      "#goodfood",
      "#recommend",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Spanish Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Don Quixote堂吉诃德·西班牙餐厅酒馆(陆家嘴滨江店) 富城路14号02单元",
      "englishAddress": "Unit 02, 14 Fucheng Road, Shanghai",
      "nearestSubway": "Line 14: Lujiazui Station, Exit 10 (740m walk)",
      "telephone": [
        "15317206957",
        "18602128217"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-24:00"
        }
      ],
      "needBooking": "Need to book, can walk in if seats are available"
    },
    "pricePerPerson": 180
  },
  {
    "id": 75,
    "accountType": "restaurant",
    "username": "lunettebyamanda",
    "displayName": "Lunette By Amanda",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#luxury",
      "#French",
      "#western",
      "#wellington",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "French Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "弦月窗(外滩店) 外滩街道四川中路133号7楼(近广东路)",
      "englishAddress": "7F, 133 Middle Sichuan Road, The Bund Subdistrict, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 6 (650m walk)",
      "telephone": [
        "021-63308831",
        "021-63308878"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Saturday-Sunday",
          "hours": [
            "11:00-16:00",
            "16:30-23:30"
          ]
        },
        {
          "day": "Monday-Friday",
          "hours": [
            "11:30-14:30",
            "16:30-23:30"
          ]
        }
      ],
      "needBooking": "Phone booking required"
    },
    "pricePerPerson": 680
  },
  {
    "id": 76,
    "accountType": "restaurant",
    "username": "restaurantcuivre",
    "displayName": "Restaurant Cuivre",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#French",
      "#western",
      "#goodfood",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "French Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Restaurant Cuivre古铜法式餐厅 淮海中路1502号-1临（近乌鲁木齐路）",
      "englishAddress": "1502-1 Lin, Middle Huaihai Road, Shanghai (Near Urumqi Road)",
      "nearestSubway": "Line 10: Shanghai Library Station, Exit 2 (260m walk)",
      "telephone": [
        "021-64374219"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": [
            "11:30-14:00",
            "17:30-22:00"
          ]
        }
      ],
      "needBooking": "Can book or walk in"
    },
    "pricePerPerson": 280
  },
  {
    "id": 77,
    "accountType": "restaurant",
    "username": "jeangeorges",
    "displayName": "Jean Georges",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#French",
      "#western",
      "#goodfood",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "French Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "Jean Georges 外滩街道中山东一路3号外滩三号4楼(近广东路)",
      "englishAddress": "4F, Bund 3, 3 East Zhongshan No.1 Road, Shanghai",
      "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (770m walk)",
      "telephone": [
        "021-63217733"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": [
            "11:30-14:30",
            "17:30-21:30"
          ]
        },
        {
          "day": "Saturday-Sunday",
          "hours": [
            "11:30-15:00",
            "17:30-21:30"
          ]
        }
      ],
      "needBooking": "Phone booking required"
    },
    "pricePerPerson": 1000
  },
  {
    "id": 78,
    "accountType": "restaurant",
    "username": "chogacrab",
    "displayName": "Choga Soy Sauce Crab",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#korean",
      "#goodfood",
      "#recommend",
      "#Minhang"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "草家真味酱蟹·炭火牛排专门店(天乐广场店) 银亭路68-78号天乐广场北楼2楼204",
      "englishAddress": "Unit 204, 2F North Building, Tianle Plaza, 68-78 Yinting Road, Shanghai",
      "nearestSubway": "Line 10: Longbai Xincun Station, Exit 3 (580m walk)",
      "telephone": [
        "13564666418"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-22:30"
        }
      ],
      "needBooking": "Can book or walk in"
    },
    "pricePerPerson": 180
  },
  {
    "id": 79,
    "accountType": "restaurant",
    "username": "nabikorean",
    "displayName": "Nabi",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#date",
      "#birthday",
      "#luxury",
      "#korean",
      "#goodfood",
      "#recommend",
      "#Changning"
    ],
    "district": [
      "Changning"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "武夷路168号WYSH翡悦里1号楼2层201室",
      "englishAddress": "Unit 201, 2F, WYSH Feiyue Li Building 1, 168 Wuyi Road, Shanghai",
      "nearestSubway": "Line 11: Jiangsu Road Station, Exit 7 (1.0km walk)",
      "branchDistrict": "Changning"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Tuesday-Saturday",
          "hours": "18:00-23:00"
        }
      ],
      "needBooking": "Need booking on Wechat App"
    },
    "pricePerPerson": 1088
  },
  {
    "id": 80,
    "accountType": "restaurant",
    "username": "grilledee",
    "displayName": "Sanchuan Grilled Ee",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#korean",
      "#Minhang",
      "#recommend"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "山川爱烤鳗鱼(金虹桥·井亭苑店) 虹莘路3811号2楼",
      "englishAddress": "Unit 3811-2, 2F, Di Bao Building, 3811 Hongxin Road, Shanghai",
      "nearestSubway": "Line 10: Ziteng Road Station (980m walk)",
      "telephone": [
        "021-54573750"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-22:30"
        }
      ],
      "needBooking": "Recommend phone booking, crowded on weekends"
    },
    "pricePerPerson": 200
  },
  {
    "id": 81,
    "accountType": "restaurant",
    "username": "zhengsanxi",
    "displayName": "Zhengsanxi BBQ",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#korean",
      "#goodfood",
      "#recommend",
      "#Minhang"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "正三熙by韩国街小木屋烤肉(虹泉路1号店) 虹泉路1101弄46号一楼",
      "englishAddress": "Hongquan Road 1101 Long No.46 F1, Minhang, Shanghai",
      "nearestSubway": "Line 10: Longbai Xincun Station, Exit 3 (800m walk)",
      "telephone": [
        "021-54337255",
        "13585946606"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "11:00-03:00"
        }
      ],
      "needBooking": "Can book or walk in"
    },
    "pricePerPerson": 120
  },
  {
    "id": 82,
    "accountType": "restaurant",
    "username": "auntietangfan",
    "displayName": "Auntie Tang Fan",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#korean",
      "#Minhang",
      "#affordable"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "阿姨汤饭面馆(虹泉路店) 虹泉路1000号井亭大厦2楼",
      "englishAddress": "2F, Jingting Building, 1000 Hongquan Road, Shanghai",
      "nearestSubway": "Line 10: Longbai Xincun Station, Exit 3 (1.0km walk)",
      "telephone": [
        "021-34633367"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": [
            "11:00-15:00",
            "16:30-22:00"
          ]
        },
        {
          "day": "Saturday-Sunday",
          "hours": [
            "11:00-15:00",
            "16:00-22:00"
          ]
        }
      ],
      "needBooking": "No need, can walk in"
    },
    "pricePerPerson": 60
  },
  {
    "id": 83,
    "accountType": "restaurant",
    "username": "qinghequ",
    "displayName": "Qing He Qu BBQ",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#korean",
      "#goodfood",
      "#recommend",
      "#Minhang"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "青鹤谷(虹莘路总店) 虹莘路3998号帝宝大厦2楼",
      "englishAddress": "2F, Dibao Building, 3998 Hongxin Road, Shanghai",
      "nearestSubway": "Line 10: Longbai Xincun Station, Exit 3 (560m walk)",
      "telephone": [
        "021-34322698"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Tuesday-Friday",
          "hours": [
            "11:30-14:00",
            "17:00-21:00"
          ]
        },
        {
          "day": "Saturday-Sunday",
          "hours": [
            "11:30-15:00",
            "16:30-21:00"
          ]
        }
      ],
      "needBooking": "Line up at store"
    },
    "pricePerPerson": 180
  },
  {
    "id": 84,
    "accountType": "restaurant",
    "username": "88restaurant",
    "displayName": "88 Restaurant",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#korean",
      "#goodfood",
      "#recommend",
      "#Minhang"
    ],
    "district": [
      "Minhang"
    ],
    "merchantType": "Korean Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 1,
    "location": {
      "chineseAddress": "88食堂·烤肉酱蟹(韩国街店) 井亭大厦b座104室",
      "englishAddress": "Unit 104, Block B, Jingting Building, Hongquan Road, Shanghai",
      "nearestSubway": "Line 10: Longbai Xincun Station, Exit 3 (800m walk)",
      "telephone": [
        "021-54337255",
        "13585946606"
      ],
      "branchDistrict": "Minhang"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": [
            "11:00-14:00",
            "16:00-21:30"
          ]
        },
        {
          "day": "Saturday-Sunday",
          "hours": "11:00-22:00"
        }
      ],
      "needBooking": "can walk in"
    },
    "pricePerPerson": 120
  },
  {
    "id": 85,
    "accountType": "restaurant",
    "username": "yuxingjinoodles",
    "displayName": "Yu Xing Ji Noodles",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#chinese",
      "#crab noodles",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu",
      "#Xuhui",
      "#Jingan",
      "#Pudong"
    ],
    "district": [
      "Huangpu",
      "Xuhui",
      "Jingan",
      "Pudong"
    ],
    "merchantType": "Chinese Noodle Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 100,
    "needBooking": "Only accept walk-in",
    "branches": [
      {
        "chineseAddress": "裕兴记•蟹黄面馆(外滩店) 四川中路410号南京路步行街路口50米",
        "englishAddress": "50m from Nanjing Road Pedestrian Street Intersection, 410 Sichuan Middle Road, Shanghai",
        "telephone": [
          "021-68886981"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 10: East Nanjing Road Station (370m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-23:00"
          }
        ]
      },
      {
        "chineseAddress": "裕兴记•蟹黄面馆(南京西路店) 威海路830号",
        "englishAddress": "830 Weihai Road, Shanghai",
        "telephone": [
          "13764519976"
        ],
        "branchDistrict": "Jingan",
        "nearestSubway": "Line 12: West Nanjing Road Station, Exit 12 (420m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "08:00-20:00"
          }
        ]
      },
      {
        "chineseAddress": "裕兴记·蟹黄面(徐家汇店) 南丹路169-3",
        "englishAddress": "169-3 Nandan Road, Shanghai",
        "telephone": [
          "021-66715788"
        ],
        "branchDistrict": "Xuhui",
        "nearestSubway": "Line 1: Xujiahui Station, Exit 1 (360m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "07:00-21:00"
          }
        ]
      },
      {
        "chineseAddress": "裕兴记·蟹黄面(世纪汇店) 世纪大道1192号LG2-A22号",
        "englishAddress": "Unit LG2-A22, 1192 Century Avenue, Shanghai",
        "telephone": [
          "15710151531"
        ],
        "branchDistrict": "Pudong",
        "nearestSubway": "Lines 2/4/6/9: Century Avenue Station, Exit 11 (330m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-22:00"
          }
        ]
      }
    ]
  },
  {
    "id": 86,
    "accountType": "restaurant",
    "username": "chansanchicrab",
    "displayName": "Chan San Chi Crab",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#chinese",
      "#crab noodles",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu",
      "#Xuhui",
      "#Pudong",
      "#Minhang"
    ],
    "district": [
      "Huangpu",
      "Xuhui",
      "Pudong",
      "Minhang"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 50,
    "needBooking": "Only accept walk-in",
    "branches": [
      {
        "chineseAddress": "馋三尺蟹粉小笼(人民广场店) 西藏中路500号思源商厦1楼102-B4、B5室",
        "englishAddress": "Units 102-B4 & B5, 1F, Siyuan Commercial Building, 500 West Xizang Road, Shanghai",
        "telephone": [
          "021-33318789"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 2: People's Square Station (300m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "08:30-20:30"
          }
        ]
      },
      {
        "chineseAddress": "馋三尺蟹粉小笼(恒基名人店) 南京东路300号地下一层B117-2室（Seven Eleven右边）",
        "englishAddress": "Unit B117-2, B1, 300 East Nanjing Road, Shanghai (Right side of Seven Eleven)",
        "telephone": [
          "18602182385"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 10: West Nanjing Road Station, Exit 5 (70m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-21:00"
          }
        ]
      },
      {
        "chineseAddress": "馋三尺蟹粉小笼(龙华会店) 龙华路2618号龙华万科中心北区1幢负2层01B2N19号",
        "englishAddress": "Unit 01B2N19, B2, Building 1 North, Longhua Vanke Center, 2618 Longhua Road, Shanghai",
        "telephone": [
          "15921800736"
        ],
        "branchDistrict": "Xuhui",
        "nearestSubway": "Line 12: Longhua Station, Exit 3 (70m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-21:00"
          }
        ]
      },
      {
        "chineseAddress": "馋三尺蟹粉小笼(世博源店) 世博大道1368号世博源2区B层12号",
        "englishAddress": "Unit 12, B Floor, Zone 2, Expo Source Mall, 1368 Expo Avenue, Shanghai",
        "telephone": [
          "13061657330"
        ],
        "branchDistrict": "Pudong",
        "nearestSubway": "Line 8: China Art Museum Station, Exit 11 (760m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-21:00"
          }
        ]
      },
      {
        "chineseAddress": "馋三尺蟹粉小笼(维璟印象城店) 七莘路1507号维璟印象城B1-030号",
        "englishAddress": "Unit B1-030, Weijing Impression City, 1507 Qixin Road, Shanghai",
        "telephone": [
          "13061766891"
        ],
        "branchDistrict": "Minhang",
        "nearestSubway": "Line 12: Qixin Road Station (330m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "10:00-21:00"
          }
        ]
      }
    ]
  },
  {
    "id": 87,
    "accountType": "restaurant",
    "username": "dahuchun",
    "displayName": "DaHu Chun",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#breakfast",
      "#chinese",
      "#pan-fried buns",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chinese Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 30,
    "needBooking": "Only accept walk-in",
    "branches": [
      {
        "chineseAddress": "大壶春(四川中路店) 四川中路136号",
        "englishAddress": "136 Sichuan Middle Road, Shanghai",
        "telephone": [
          "021-63130155"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 2: East Nanjing Road Station (750m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "07:00-19:30"
          }
        ]
      },
      {
        "chineseAddress": "大壶春(云南南路店) 云南南路89号",
        "englishAddress": "89 South Yunnan Road, Shanghai",
        "telephone": [
          "021-63115177"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 14: Dashijie Station, Exit 5 (60m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "07:30-19:30"
          }
        ]
      },
      {
        "chineseAddress": "大壶春(豫园店) 豫园老街64-3号",
        "englishAddress": "No.64-3 Yuyuan Old Street, Shanghai",
        "telephone": [
          "021-63353560"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (450m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "09:00-22:00"
          }
        ]
      }
    ]
  },
  {
    "id": 88,
    "accountType": "restaurant",
    "username": "fafukoreanbbq",
    "displayName": "Fafu Korean BBQ",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#korean",
      "#bbq",
      "#goodfood",
      "#recommend",
      "#Jingan"
    ],
    "district": [
      "Jingan"
    ],
    "merchantType": "Korean BBQ Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 200,
    "needBooking": "Phone booking recommended, crowded at nights",
    "branches": [
      {
        "chineseAddress": "发福韩家·韩国炭火烤肉(余姚店) 余姚路10号",
        "englishAddress": "10 Yuyao Road, Shanghai",
        "telephone": [
          "15021187854"
        ],
        "branchDistrict": "Jingan",
        "nearestSubway": "Line 7: Changping Road Station, Exit 4 (490m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "17:00-01:00"
          }
        ]
      },
      {
        "chineseAddress": "发福韩家·韩国炭火烤肉(大沽店) 大沽路411号",
        "englishAddress": "411 Dagu Road, Shanghai",
        "telephone": [
          "13062733876",
          "13817514640"
        ],
        "branchDistrict": "Jingan",
        "nearestSubway": "Line 13: West Nanjing Road Station, Exit 8 (570m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "17:00-01:00"
          }
        ]
      }
    ]
  },
  {
    "id": 89,
    "accountType": "restaurant",
    "username": "earlymorningbbq",
    "displayName": "Early Morning BBQ",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#lunch",
      "#luxury",
      "#korean",
      "#bbq",
      "#goodfood",
      "#recommend",
      "#Huangpu",
      "#Xuhui",
      "#Jingan",
      "#Pudong"
    ],
    "district": [
      "Huangpu",
      "Xuhui",
      "Jingan",
      "Pudong"
    ],
    "merchantType": "Korean BBQ Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 180,
    "needBooking": "Recommend phone booking, can also walk in if there are seats",
    "branches": [
      {
        "chineseAddress": "清晨家烤肉(BFC外滩金融中心店) 中山东二路600号BFC外滩金融中心南区四楼清晨家",
        "englishAddress": "4F South Zone, BFC Bund Financial Center, 600 East Zhongshan No.2 Road, Shanghai",
        "telephone": [
          "18121214336"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Line 14: Yuyuan Garden Station, Exit 7 (1.1km walk)",
        "openingHours": [
          {
            "day": "Monday-Friday",
            "hours": [
              "11:00-14:00",
              "17:00-21:00"
            ]
          },
          {
            "day": "Saturday-Sunday",
            "hours": [
              "11:00-14:30",
              "17:00-21:00"
            ]
          }
        ]
      },
      {
        "chineseAddress": "清晨家·首尔烤肉(陆家嘴中心店) 陆家嘴中心L+MALL商场RG层RG01单元",
        "englishAddress": "RG Floor, L+MALL Shopping Center, 899 South Pudong Road, Shanghai",
        "telephone": [
          "13482324569"
        ],
        "branchDistrict": "Pudong",
        "nearestSubway": "Line 2: East Pudong Road Station (260m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": [
              "11:00-14:00",
              "17:00-21:00"
            ]
          }
        ]
      },
      {
        "chineseAddress": "清晨家·首尔烤肉(One ITC店) 华山路1901号OneITC商场负一层下沉花园128号",
        "englishAddress": "Unit 128, B1, One ITC Mall, 1901 Huashan Road, Shanghai",
        "telephone": [
          "15221180809"
        ],
        "branchDistrict": "Xuhui",
        "nearestSubway": "Line 9: Xujiahui Station, Exit 16 (450m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": [
              "11:00-14:00",
              "17:00-21:00"
            ]
          }
        ]
      },
      {
        "chineseAddress": "清晨家烤肉(静安MOHO店) 江宁路699号MOHOMall-L3-28,L3-29",
        "englishAddress": "Units L3-28 & L3-29, 3F, MOHO Mall, 699 Jiangning Road, Shanghai",
        "telephone": [
          "18317190809"
        ],
        "branchDistrict": "Jingan",
        "nearestSubway": "Line 7: Changping Road Station, Exit 2 (1.1km walk)",
        "openingHours": [
          {
            "day": "Monday-Friday",
            "hours": [
              "11:00-14:00",
              "17:00-21:00"
            ]
          },
          {
            "day": "Saturday-Sunday",
            "hours": [
              "11:00-14:30",
              "17:00-21:00"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 90,
    "accountType": "restaurant",
    "username": "grandeamoo",
    "displayName": "Grande A'moo",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#dinner",
      "#birthday",
      "#date",
      "#takepicture",
      "#pizza",
      "#Italian",
      "#goodfood",
      "#recommend",
      "#Putuo",
      "#Pudong",
      "#Changning"
    ],
    "district": [
      "Putuo",
      "Pudong",
      "Changning"
    ],
    "merchantType": "Italian Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 140,
    "needBooking": "No need, but need to queue up usually",
    "branches": [
      {
        "chineseAddress": "Grande A'moo(环宇城MAX店) 铜川路699弄中海环宇城1楼L1023号（2号门旁）",
        "englishAddress": "Unit L1023, 1F, Zhonghai Huanyu City MAX, 699 Tongchuan Road, Shanghai",
        "telephone": [
          "021-60193653",
          "18621023489"
        ],
        "branchDistrict": "Putuo",
        "nearestSubway": "Line 11: Zhenru Station (550m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-22:00"
          }
        ]
      },
      {
        "chineseAddress": "Grande A'moo(世博天地店) 世博大道1467号世博天地L-111室（商场1号门旁,近周家渡路博成路）",
        "englishAddress": "Unit L-111, Expo World, 1467 Expo Avenue, Shanghai",
        "telephone": [
          "13003117616"
        ],
        "branchDistrict": "Pudong",
        "nearestSubway": "Line 8: China Art Museum Station (210m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-21:30"
          }
        ]
      },
      {
        "chineseAddress": "Grande A'moo(上海荟聚店) 金钟路788号上海荟聚L01层01A01号",
        "englishAddress": "Unit 01A01, L01, Shanghai Huiju, 788 Jinzhong Road, Shanghai",
        "telephone": [
          "021-62366656"
        ],
        "branchDistrict": "Changning",
        "nearestSubway": "Line 2: Songhong Road Station (420m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-22:00"
          }
        ]
      }
    ]
  },
  {
    "id": 91,
    "accountType": "restaurant",
    "username": "banuhotpot",
    "displayName": "Banu Hotpot",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": true,
    "hashtags": [
      "#restaurant",
      "#lunch",
      "#dinner",
      "#chinese",
      "#hotpot",
      "#takepicture",
      "#goodfood",
      "#affordable",
      "#midnight",
      "#recommend",
      "#Huangpu",
      "#Pudong",
      "#Changning",
      "#Minhang"
    ],
    "district": [
      "Huangpu",
      "Pudong",
      "Changning",
      "Minhang"
    ],
    "merchantType": "Hotpot Restaurant",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 2,
    "pricePerPerson": 160,
    "needBooking": "Line up at store",
    "branches": [
      {
        "chineseAddress": "巴奴毛肚火锅(人广来福士店) 西藏中路268号上海来福士广场6层",
        "englishAddress": "6F, Raffles City Shanghai, 268 West Xizang Road, Shanghai",
        "telephone": [
          "021-63615177",
          "4000232577"
        ],
        "branchDistrict": "Huangpu",
        "nearestSubway": "Lines 1/8: People's Square Station, Exit 15 (50m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "24 hours"
          }
        ]
      },
      {
        "chineseAddress": "巴奴毛肚火锅(陆家嘴中心店) 浦东南路899号陆家嘴中心L+MALL商场10楼",
        "englishAddress": "10F, L+MALL, 899 South Pudong Road, Shanghai",
        "telephone": [
          "021-58777907"
        ],
        "branchDistrict": "Pudong",
        "nearestSubway": "Line 9: Shangcheng Road Station (150m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "24 hours"
          }
        ]
      },
      {
        "chineseAddress": "巴奴毛肚火锅(七宝领展广场店) 漕宝路七莘路交叉口七宝领展广场5楼",
        "englishAddress": "5F, Qibao Link Plaza, Intersection of Caobao Road & Qixin Road, Shanghai",
        "telephone": [
          "021-62216758",
          "15093760132"
        ],
        "branchDistrict": "Minhang",
        "nearestSubway": "Line 9: Qibao Station, Exit 2 (260m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-03:00"
          }
        ]
      },
      {
        "chineseAddress": "巴奴毛肚火锅(上海荟聚店) 金钟路788号L03层03C16号",
        "englishAddress": "Unit 03C16, L03 Floor, 788 Jinzhong Road, Shanghai",
        "telephone": [
          "021-62030525"
        ],
        "branchDistrict": "Changning",
        "nearestSubway": "Line 2: Songhong Road Station, Exit 5 (390m walk)",
        "openingHours": [
          {
            "day": "Monday-Sunday",
            "hours": "11:00-03:00"
          }
        ]
      }
    ]
  },
  {
    "id": 92,
    "accountType": "barandclub",
    "username": "maxclub",
    "displayName": "Max Shanghai",
    "verified": true,
    "joinDate": "March 2024",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#techno",
      "#bounce",
      "#House",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Max Club 淮海中路98号2-3F",
      "englishAddress": "Max Club, 2-3F, 98 Huaihai Middle Road, Shanghai",
      "nearestSubway": "Line 8/14: Dashijie Station (175m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "20:30-06:00"
        }
      ],
      "needBooking": "No booking needed"
    },
    "entryFee": 158,
    "nearbyMidnightFood": [
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "techno",
      "bounce",
      "House"
    ]
  },
  {
    "id": 93,
    "accountType": "barandclub",
    "username": "hoodclub",
    "displayName": "Hood Shanghai",
    "verified": true,
    "joinDate": "February 2024",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#hiphop",
      "#recommened",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Hood 巨鹿路158号地下一层",
      "englishAddress": "Hood, B1, 158 Julu Road, Shanghai",
      "nearestSubway": "Line 13: Middle Huaihai Road (288m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "22:00-06:00"
        }
      ],
      "needBooking": "No booking needed"
    },
    "entryFee": 100,
    "nearbyMidnightFood": [
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "large dance pool",
      "hiphop"
    ]
  },
  {
    "id": 94,
    "accountType": "barandclub",
    "username": "oriiclub",
    "displayName": "ORii",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#Kpop",
      "#HipHop",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Kpop Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "ORii 黄浦区淮海中路566号二楼",
      "englishAddress": "ORii, 2F, 566 Huaihai Middle Road, Huangpu, Shanghai",
      "nearestSubway": "Line 13: Middle Huaihai Road (350m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "22:00-06:00"
        }
      ],
      "needBooking": "No booking needed"
    },
    "entryFee": 150,
    "nearbyMidnightFood": [
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "Diversified",
      "Kpop",
      "HipHop",
      "EDM",
      "R&B"
    ]
  },
  {
    "id": 95,
    "accountType": "barandclub",
    "username": "kezeeliveHouse",
    "displayName": "Kezee",
    "verified": true,
    "joinDate": "December 2023",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#LiveHouse",
      "#redflag",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "LiveHouse",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Kezee 雁荡路109号Ins復興樂園3楼",
      "englishAddress": "Kezee, 3F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "20:00-04:00"
        }
      ]
    },
    "clubCategories": [
      "LiveHouse"
    ]
  },
  {
    "id": 96,
    "accountType": "barandclub",
    "username": "dirtyhouseclub",
    "displayName": "DirtyHouse",
    "verified": true,
    "joinDate": "November 2023",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#Techno",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Dirty House 雁荡路109号Ins復興樂園4楼",
      "englishAddress": "Dirty House, 4F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Friday-Sunday",
          "hours": "23:00-05:00"
        }
      ]
    },
    "entryFee": 158,
    "clubCategories": [
      "Techno"
    ]
  },
  {
    "id": 97,
    "accountType": "barandclub",
    "username": "friendsclub",
    "displayName": "Friends",
    "verified": true,
    "joinDate": "October 2023",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#Pop songs",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Friends 雁荡路109号Ins復興樂園5楼",
      "englishAddress": "Friends, 5F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Wednesday-Sunday",
          "hours": "21:30-04:30"
        }
      ]
    },
    "entryFee": 168,
    "clubCategories": [
      "Pop songs"
    ]
  },
  {
    "id": 98,
    "accountType": "barandclub",
    "username": "anothersideclub",
    "displayName": "AnotherSide",
    "verified": true,
    "joinDate": "September 2023",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#EDM",
      "#Pop songs",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "EDM Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Another Side 雁荡路109号Ins復興樂園6楼",
      "englishAddress": "Another Side, 6F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Friday-Sunday",
          "hours": "22:00-05:00"
        }
      ]
    },
    "entryFee": 188,
    "clubCategories": [
      "EDM",
      "Pop songs"
    ]
  },
  {
    "id": 99,
    "accountType": "barandclub",
    "username": "freshmenclub",
    "displayName": "Freshmen",
    "verified": true,
    "joinDate": "August 2023",
    "recommended": false,
    "hashtags": [
      "#club",
      "#alcohol",
      "#Pop songs",
      "#Big Dance Floor",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Pop Songs",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Freshmen 雁荡路109号Ins復興樂園1楼",
      "englishAddress": "Freshmen, 1F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Friday-Sunday",
          "hours": "22:00-04:00"
        }
      ]
    },
    "entryFee": 188,
    "clubCategories": [
      "Pop songs",
      "Big Dance Floor"
    ]
  },
  {
    "id": 100,
    "accountType": "barandclub",
    "username": "lafinclub",
    "displayName": "Lafin",
    "verified": true,
    "joinDate": "July 2023",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#HipHop",
      "#Pop songs",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Hip Hop Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Lafin 雁荡路109号Ins復興樂園6楼",
      "englishAddress": "Lafin, 6F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Friday-Sunday",
          "hours": "22:00-05:00"
        }
      ]
    },
    "entryFee": 188,
    "clubCategories": [
      "HipHop",
      "Pop songs"
    ]
  },
  {
    "id": 101,
    "accountType": "barandclub",
    "username": "radiclub",
    "displayName": "Radi",
    "verified": true,
    "joinDate": "June 2023",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#EDM",
      "#Pop songs",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Diversified Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Radi 雁荡路109号Ins復興樂園3楼",
      "englishAddress": "Radi, 3F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "22:00-05:00"
        }
      ]
    },
    "entryFee": 180,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "EDM",
      "Pop songs"
    ]
  },
  {
    "id": 102,
    "accountType": "barandclub",
    "username": "hushclub",
    "displayName": "Hush",
    "verified": true,
    "joinDate": "May 2023",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#Hip Hop",
      "#Pop songs",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "HipHop Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Hush 雁荡路109号Ins復興樂園2楼",
      "englishAddress": "Hush, 2F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Wednesday-Sunday",
          "hours": "22:00-04:00"
        }
      ]
    },
    "entryFee": 158,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "Hip Hop",
      "Pop songs"
    ]
  },
  {
    "id": 103,
    "accountType": "barandclub",
    "username": "cultureclub",
    "displayName": "Culture",
    "verified": true,
    "joinDate": "April 2023",
    "recommended": true,
    "hashtags": [
      "#club",
      "#alcohol",
      "#LGBT",
      "#HipHop",
      "#Pop songs",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "LGBT Club",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Culture 雁荡路109号Ins復興樂園4楼",
      "englishAddress": "Culture, 4F, 109 Yandang Road, Ins Park, Shanghai",
      "nearestSubway": "Line 10/13: Site of the First National Congress of the CPC · Xintiandi Station (477m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Friday-Sunday",
          "hours": "22:00-05:00"
        }
      ]
    },
    "entryFee": 159,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "LGBT",
      "HipHop",
      "Pop songs"
    ]
  },
  {
    "id": 104,
    "accountType": "barandclub",
    "username": "insomnibar",
    "displayName": "Insomnia",
    "verified": true,
    "joinDate": "March 2023",
    "recommended": false,
    "hashtags": [
      "#takepicture",
      "#bar",
      "#alcohol",
      "#RedFlag",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Chill Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Insomnia 淮海中路新歌766号1-03室",
      "englishAddress": "Huaihai Road No.776 (Huawei Branch Beside Shopping Mall Inner) 1-03 Store, Huangpu, Shanghai China",
      "nearestSubway": "Line 13: Middle Huaihai Road Station (Exit 2, 110m walk)",
      "telephone": [
        "13641755928"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "19:00-02:00"
        }
      ]
    },
    "pricePerPerson": 110,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "nice ceiling",
      "music bar"
    ]
  },
  {
    "id": 105,
    "accountType": "barandclub",
    "username": "jollybar",
    "displayName": "Jolly Bar",
    "verified": true,
    "joinDate": "February 2023",
    "recommended": true,
    "hashtags": [
      "#jingan",
      "#jinxianroad",
      "#good drink",
      "#bar",
      "#alcohol",
      "#recommend",
      "#affordable",
      "#Jingan"
    ],
    "district": [
      "Jingan"
    ],
    "merchantType": "Street Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Jolly Bar 进贤路151号",
      "englishAddress": "151 Jinxian Road, Jingan, Shanghai",
      "nearestSubway": "Line 13: Middle Huaihai Road Station (540m walk)",
      "telephone": [
        "19301449569"
      ],
      "branchDistrict": "Jingan"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "16:30-00:30"
        }
      ],
      "needBooking": "No need"
    },
    "pricePerPerson": 30,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "sweet drink",
      "fruit drink",
      "on the street"
    ]
  },
  {
    "id": 106,
    "accountType": "barandclub",
    "username": "sourthernCrossBar",
    "displayName": "Southern Cross",
    "verified": true,
    "joinDate": "January 2023",
    "recommended": true,
    "hashtags": [
      "#date",
      "#quiet bar",
      "#good drink",
      "#bar",
      "#alcohol",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Japanese Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "南十字星 淮海中路1276号（近华亭路）",
      "englishAddress": "1276 Middle Huaihai Road (near Huating Road)",
      "nearestSubway": "Line 1: Changshu Road Station (66m walk)",
      "telephone": [
        "021-54047211",
        "15900595192"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "19:00-02:00"
        }
      ],
      "needBooking": "No need, can walk in"
    },
    "pricePerPerson": 130,
    "nearbyMidnightFood": [
      "likesomechickenpot",
      "zhaozhounoodles",
      "dongtaixiang",
      "dingtelenoodles"
    ],
    "clubCategories": [
      "date",
      "martini",
      "quiet"
    ]
  },
  {
    "id": 107,
    "accountType": "barandclub",
    "username": "SpeakLowBar",
    "displayName": "SpeakLow",
    "verified": true,
    "joinDate": "April 2023",
    "recommended": false,
    "hashtags": [
      "#barfood",
      "#good drink",
      "#bar",
      "#alcohol",
      "#long queue",
      "#Xuhui"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "WorldTop50",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Speak Low 彼楼复兴中路579号（近瑞金二路）",
      "englishAddress": "579 South Fuxing Road (near Ruijin Er Road)",
      "nearestSubway": "Line 13: Middle Huaihai Road Station (740m walk)",
      "telephone": [
        "021-64160133"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "18:00-02:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "18:00-03:00"
        },
        {
          "day": "Sunday",
          "hours": "18:00-02:00"
        }
      ],
      "needBooking": "Not accept booking, only walk in, after 6:30pm seats are full, recommend arrive earlier (三楼需要提前预约)"
    },
    "pricePerPerson": 120,
    "clubCategories": [
      "good barfood",
      "crowded",
      "noisy",
      "quiet"
    ]
  },
  {
    "id": 108,
    "accountType": "barandclub",
    "username": "SuzuBar",
    "displayName": "Suzu",
    "verified": true,
    "joinDate": "May 2023",
    "recommended": true,
    "hashtags": [
      "#Japanese",
      "#martini",
      "#good drink",
      "#bar",
      "#alcohol",
      "#recommend",
      "#Xuhui"
    ],
    "district": [
      "Xuhui"
    ],
    "merchantType": "Martini Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Suzu 华山路301号MORE华山一楼A5",
      "englishAddress": "Unit A5, 1F, MORE·shan, 301 Huashan Road, Shanghai",
      "nearestSubway": "Line 14: Jing'an Temple Station (Exit 12, 220m walk)",
      "telephone": [
        "021-31029289"
      ],
      "branchDistrict": "Xuhui"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "19:00-02:00"
        }
      ],
      "needBooking": "Very busy on weekends, phone reservation recommended"
    },
    "pricePerPerson": 130,
    "clubCategories": [
      "japanese",
      "martini"
    ]
  },
  {
    "id": 109,
    "accountType": "barandclub",
    "username": "AbaWhiskyBar",
    "displayName": "Aba Whisky Bar",
    "verified": true,
    "joinDate": "June 2023",
    "recommended": true,
    "hashtags": [
      "#barfood",
      "#good drink",
      "#date",
      "#whisky",
      "#quiet",
      "#bar",
      "#alcohol",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Whisky Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Aba Whisky Bar 瑞金二路街道瑞金二路89号",
      "englishAddress": "89 Ruijin Er Road, Ruijin Er Road Subdistrict",
      "nearestSubway": "Line 1: South Shaanxi Road Station (533m walk)",
      "telephone": [
        "021-53099556"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "18:00-01:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "18:00-02:00"
        },
        {
          "day": "Sunday",
          "hours": "18:00-01:00"
        }
      ],
      "needBooking": "No need, Can walk in"
    },
    "pricePerPerson": 120,
    "clubCategories": [
      "japanese",
      "martini",
      "whisky",
      "good for date",
      "quiet"
    ]
  },
  {
    "id": 110,
    "accountType": "barandclub",
    "username": "PaalBar",
    "displayName": "Paal",
    "verified": true,
    "joinDate": "July 2023",
    "recommended": true,
    "hashtags": [
      "#good drink",
      "#bar",
      "#alcohol",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "My Top 5 Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Paal 南昌路94号",
      "englishAddress": "94 Nanchang Road, Huangpu, Shanghai",
      "nearestSubway": "Line 13: Middle Huaihai Road Station (570m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "19:30-02:00"
        }
      ],
      "needBooking": "No need, can walk in, highly recommend arrive early"
    },
    "pricePerPerson": 98,
    "clubCategories": [
      "one of my fav",
      "good drink"
    ]
  },
  {
    "id": 111,
    "accountType": "barandclub",
    "username": "PonyUpBar",
    "displayName": "PonyUp",
    "verified": true,
    "joinDate": "August 2023",
    "recommended": true,
    "hashtags": [
      "#barfood",
      "#good drink",
      "#bar",
      "#alcohol",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "My Top 5 Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "Pony Up 进贤路230号",
      "englishAddress": "230 Jinxian Road",
      "nearestSubway": "Line 1: South Shaanxi Road Station (580m walk)",
      "telephone": [
        "13472467476"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "13:00-01:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "13:00-02:00"
        },
        {
          "day": "Sunday",
          "hours": "13:00-01:00"
        }
      ],
      "needBooking": "No need, can walk in, recommend arrive early",
      "peakTime": "21:30-00:00"
    },
    "pricePerPerson": 95,
    "clubCategories": [
      "good barfood",
      "good drinks"
    ]
  },
  {
    "id": 112,
    "accountType": "barandclub",
    "username": "SirEllys",
    "displayName": "Sir Elly's Terrace",
    "verified": true,
    "joinDate": "September 2023",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#date",
      "#bar",
      "#alcohol",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Nightview Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "艾利爵士露台酒吧 中山东一路32号半岛酒店14楼",
      "englishAddress": "14F, The Peninsula Hotel, 32 The Bund",
      "nearestSubway": "Line 2/10: East Nanjing Road Station (600m walk)",
      "telephone": [
        "021-23276756",
        "021-23272888"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "17:00-24:00"
        }
      ],
      "needBooking": "Can walk in, recommend arriving earlier at 8pm",
      "peakTime": "21:00-22:00"
    },
    "pricePerPerson": 170,
    "clubCategories": [
      "rooftop bar",
      "nightview"
    ]
  },
  {
    "id": 113,
    "accountType": "barandclub",
    "username": "FlairBar",
    "displayName": "Flair",
    "verified": true,
    "joinDate": "October 2023",
    "recommended": true,
    "hashtags": [
      "#dinner",
      "#date",
      "#superpicture",
      "#bar",
      "#alcohol",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#affordable",
      "#Pudong"
    ],
    "district": [
      "Pudong"
    ],
    "merchantType": "Nightview Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "FLAIR顶层餐厅酒吧世纪大道8号国金中心上海浦东丽思卡尔顿酒店58楼",
      "englishAddress": "58F, The Ritz-Carlton Shanghai, Pudong, 8 Century Avenue",
      "nearestSubway": "Line 2: Lujiazui Station (300m walk)",
      "telephone": [
        "021-20201717",
        "021-20201778"
      ],
      "branchDistrict": "Pudong"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Thursday",
          "hours": "12:00-01:00"
        },
        {
          "day": "Friday-Saturday",
          "hours": "12:00-02:00"
        },
        {
          "day": "Sunday",
          "hours": "12:00-01:00"
        }
      ],
      "needBooking": "Recommend phone call booking, crowded at night. If walk in, 6:30pm is the best",
      "peakTime": "19:30-22:30"
    },
    "pricePerPerson": 160,
    "clubCategories": [
      "rooftop bar",
      "nightview",
      "good for date"
    ]
  },
  {
    "id": 114,
    "accountType": "barandclub",
    "username": "RooseveltSkyBar",
    "displayName": "罗斯福公馆色戒 Roosevelt Sky Bar",
    "verified": true,
    "joinDate": "November 2023",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#bar",
      "#date",
      "#alcohol",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Nightview Bar",
    "url": "https://27bund.com/roosevelt-sky-bar/",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "罗斯福色戒酒吧(外滩店) 中山东一路27号罗斯福公馆(近北京东路)9楼",
      "englishAddress": "9F, Roosevelt Building, 27 The Bund",
      "nearestSubway": "Line 2/10: East Nanjing Road Station (555m walk)",
      "telephone": [
        "021-23220800"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "14:00-02:00"
        }
      ],
      "needBooking": "Can walk in. recommend to arrive 18:30",
      "peakTime": "19:00-22:00"
    },
    "pricePerPerson": 160,
    "clubCategories": [
      "rooftop bar",
      "nightview",
      "good for date"
    ]
  },
  {
    "id": 115,
    "accountType": "barandclub",
    "username": "KEVBar",
    "displayName": "外滩18号KEV露台",
    "verified": true,
    "joinDate": "December 2023",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#date",
      "#bar",
      "#alcohol",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Nightview Bar",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "KEV 中山东一路18号7层",
      "englishAddress": "7F, 18 The Bund",
      "nearestSubway": "Line 2/10: East Nanjing Road Station (482m walk)",
      "telephone": [
        "021-53833657"
      ],
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Sunday",
          "hours": "20:00-04:00"
        }
      ],
      "needBooking": "Can walk in or booking. but recommend earlier",
      "peakTime": "21:00-01:00"
    },
    "pricePerPerson": 140,
    "clubCategories": [
      "rooftop bar",
      "nightview",
      "good for date"
    ]
  },
  {
    "id": 116,
    "accountType": "barandclub",
    "username": "CaptainBar",
    "displayName": "船长酒吧 The Captain",
    "verified": true,
    "joinDate": "January 2024",
    "recommended": true,
    "hashtags": [
      "#superpicture",
      "#date",
      "#bar",
      "#alcohol",
      "#nightview",
      "#rooftop",
      "#popular",
      "#recommend",
      "#affordable",
      "#Huangpu"
    ],
    "district": [
      "Huangpu"
    ],
    "merchantType": "Nightview Bar",
    "url": "add Wechat - thecaptain37",
    "stats": {
      "mentionedPosts": 0,
      "followers": 0,
      "following": 0
    },
    "profileInterface": 7,
    "location": {
      "chineseAddress": "The Captain Bar 福州路37号船长酒店6搂",
      "englishAddress": "6F, Captain Hostel, 37 Fuzhou Road, Huangpu, Shanghai",
      "nearestSubway": "Line 2/10: East Nanjing Road Station (551m walk)",
      "branchDistrict": "Huangpu"
    },
    "businessInfo": {
      "openingHours": [
        {
          "day": "Monday-Friday",
          "hours": "14:00-01:00"
        },
        {
          "day": "Saturday-Sunday",
          "hours": "11:30-01:00"
        }
      ],
      "needBooking": "Can walk in or booking, recommend booking"
    },
    "pricePerPerson": 160,
    "clubCategories": [
      "rooftop bar",
      "nightview",
      "good for date"
    ]
  }
];

// Instructions for import:
// 1. Copy the EXTRACTED_MERCHANTS array
// 2. Paste it into import-merchants.js to replace the REAL_MERCHANTS array
// 3. Run import-merchants.js to import the merchants to the database

// Export the merchants for use in other scripts
module.exports = {
  ProfileInterface,
  EXTRACTED_MERCHANTS
};
