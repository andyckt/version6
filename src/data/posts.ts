export interface TravelPost {
  id: number;
  title: string;
  image?: string;
  media?: MediaItem[];
  userId: number;           // Reference to user ID
  username: string;         // Username - display with @ prefix (e.g., @username) when showing the author
  createdAt: string;        // Post creation date
  likes: number;
  bookmarks?: number;
  views: number;            // Track view count for posts
  hashtags: string[];
  description?: string;
  taggedAccounts?: TaggedAccount[];
  location?: string;        // Location where the post was created
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  aspectRatio?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface TaggedAccount {
  username: string;  // Reference to merchant username - merchant data will be fetched from merchant store
}

export const travelPosts: TravelPost[] = [
  {
    id: 1001,
    title: 'Ultimate Shanghai Guide: Every Place You Need to Visit',
    media: [
      {
        id: 10001,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_1_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '2:3',
        width: 800,
        height: 1200
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-18T10:30:00Z',
    likes: 124,
    bookmarks: 45,
    views: 356,
    hashtags: ['#shanghai', '#guide', '#travel', '#mustvisit'],
    description: 'Your complete guide to Shanghai! From amazing dumplings at @shanghaitaste and @dumplinghouse to cultural experiences at @shanghaimuseum. Stay at the historic @peacehotel, enjoy drinks at @speaklow, explore the artsy @taikangroad, shop at @iapmmall, and grab snacks at @seveneleven, @familymart, or @lawson. This post covers all the must-visit spots!',
    location: 'Shanghai, China',
    taggedAccounts: [
      {
        username: 'shanghaitaste'
      },
      {
        username: 'dumplinghouse'
      },
      {
        username: 'shanghaimuseum'
      },
      {
        username: 'peacehotel'
      },
      {
        username: 'speaklow'
      },
      {
        username: 'taikangroad'
      },
      {
        username: 'iapmmall'
      },
      {
        username: 'seveneleven'
      },
      {
        username: 'familymart'
      },
      {
        username: 'lawson'
      }
    ]
  },
  {
    id: 1002,
    title: 'Shanghai Food & Shopping Marathon',
    media: [
      {
        id: 10002,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_2_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 10003,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_3_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-16T19:45:00Z',
    likes: 218,
    bookmarks: 87,
    views: 432,
    hashtags: ['#shanghai', '#food', '#shopping', '#cityguide'],
    description: 'Had the most amazing day exploring Shanghai! Started with breakfast at @seveneleven, then amazing dumplings at @shanghaitaste and @dumplinghouse. Visited the incredible @shanghaimuseum, then checked into the luxurious @peacehotel. Evening drinks at @speaklow were perfect! Also explored the charming @taikangroad and did some shopping at @iapmmall. Late night snacks from @familymart and @lawson completed the day!',
    location: 'Shanghai, China',
    taggedAccounts: [
      {
        username: 'shanghaitaste'
      },
      {
        username: 'dumplinghouse'
      },
      {
        username: 'shanghaimuseum'
      },
      {
        username: 'peacehotel'
      },
      {
        username: 'speaklow'
      },
      {
        username: 'taikangroad'
      },
      {
        username: 'iapmmall'
      },
      {
        username: 'seveneleven'
      },
      {
        username: 'familymart'
      },
      {
        username: 'lawson'
      }
    ]
  },
  {
    id: 1003,
    title: 'Forbidden City architecture',
    media: [
      {
        id: 10004,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_1_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      },
      {
        id: 10005,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_2_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-14T11:20:00Z',
    likes: 342,
    bookmarks: 113,
    views: 789,
    hashtags: ['#beijing', '#attractions', '#forbiddencity', '#architecture', '#history'],
    description: 'Exploring the magnificent Forbidden City in Beijing. The intricate details in the architecture are simply stunning, representing centuries of imperial history.',
    location: 'Forbidden City, Beijing, China'
  },
  {
    id: 1004,
    title: 'Luxury stay at Waldorf Astoria Shanghai',
    media: [
      {
        id: 10006,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_1_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '16:9',
        width: 800,
        height: 450
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-12T15:10:00Z',
    likes: 186,
    bookmarks: 95,
    views: 412,
    hashtags: ['#shanghai', '#luxurious', '#hotel', '#waldorfastoria', '#fivestar'],
    description: 'Experience ultimate luxury at the historic Waldorf Astoria Shanghai on the Bund. The room service is impeccable and the views of the Huangpu River are spectacular.',
    location: 'Waldorf Astoria, Shanghai, China'
  },
  {
    id: 1005,
    title: 'Night out in Shanghai cocktail bars',
    media: [
      {
        id: 10007,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_2_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 10008,
        type: 'image',
        url: '/newpostmedia/random1.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 10009,
        type: 'image',
        url: '/newpostmedia/random2.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-10T22:05:00Z',
    likes: 273,
    bookmarks: 64,
    views: 531,
    hashtags: ['#shanghai', '#getdrunk', '#nightlife', '#cocktails', '#speakeasy'],
    description: 'Explored some of Shanghai\'s best speakeasy bars tonight. @speaklow has the most innovative cocktails and @uniontrading has an amazing atmosphere. Perfect night out!',
    location: 'Shanghai, China',
    taggedAccounts: [
      {
        username: 'speaklow'
      },
      {
        username: 'uniontrading'
      }
    ]
  },
  {
    id: 1006,
    title: 'Hidden boutique hotel in Hangzhou',
    media: [
      {
        id: 10010,
        type: 'image',
        url: '/newpostmedia/random3.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-08T13:40:00Z',
    likes: 165,
    bookmarks: 72,
    views: 385,
    hashtags: ['#hangzhou', '#hotel', '#boutique', '#westlake', '#treasurehunt'],
    description: 'Found this hidden gem of a boutique hotel near West Lake in Hangzhou. It\'s tucked away in a renovated traditional house with modern amenities. The perfect blend of old and new!',
    location: 'West Lake, Hangzhou, China'
  },
  {
    id: 1007,
    title: 'Korean street food adventure in Seoul',
    media: [
      {
        id: 10011,
        type: 'image',
        url: '/newpostmedia/media1.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 10012,
        type: 'image',
        url: '/newpostmedia/media2.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 10013,
        type: 'image',
        url: '/newpostmedia/media3.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 10014,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_1_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-05T18:25:00Z',
    likes: 429,
    bookmarks: 117,
    views: 876,
    hashtags: ['#seoul', '#korea', '#streetfood', '#foodtour', '#myeongdong'],
    description: 'The street food in Myeongdong, Seoul is incredible! From tteokbokki to hotteok, every bite was delicious. Don\'t miss the egg bread and tornado potatoes!',
    location: 'Myeongdong, Seoul, South Korea'
  },
  {
    id: 1008,
    title: 'Sunrise hike on Huangshan Mountain',
    media: [
      {
        id: 10015,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_1_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '16:9',
        width: 800,
        height: 450
      },
      {
        id: 10016,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_2_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '16:9',
        width: 800,
        height: 450
      }
    ],
    userId: 106,
    username: 'andyckt123',
    createdAt: '2025-03-02T06:15:00Z',
    likes: 517,
    bookmarks: 203,
    views: 1248,
    hashtags: ['#huangshan', '#attractions', '#hiking', '#sunrise', '#superpicture'],
    description: 'Woke up at 4am for this sunrise hike on Huangshan (Yellow Mountain). The sea of clouds and granite peaks make it obvious why this mountain inspired so many traditional Chinese paintings.',
    location: 'Huangshan Mountain, Anhui, China'
  },
  {
    id: 1,
    title: 'Exploring the hidden gems of Shanghai',
    image: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_1_拯救胡萝卜_来自小红书网页版.jpg',
    media: [
      {
        id: 201,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_1_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 202,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_2_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 203,
        type: 'image',
        url: '/newpostmedia/random1.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      },
      {
        id: 204,
        type: 'image',
        url: '/newpostmedia/random2.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    userId: 101,
    username: 'wanderlust_emma',
    createdAt: '2025-03-15T14:30:00Z',
    likes: 842,
    bookmarks: 176,
    views: 145,
    location: 'Shanghai, China',
    hashtags: ['#shanghai', '#travel', '#china', '#exploration', '#hiddenspots', '#superpicture'],
    description: 'Shanghai\'s hidden gems are absolutely incredible! From the historic Bund to the modern skyscrapers, there\'s something for everyone. I spent a week exploring different neighborhoods and my favorite was definitely Tianzifang. Had the most amazing dumplings at @shanghaitaste restaurant - they\'re juicy, flavorful, and perfectly steamed! Also visited the famous @shanghaigarden where the traditional architecture and peaceful ponds create a perfect escape from the city. My local friend @shanghaiguide showed me some hidden gems away from the tourist spots. Don\'t miss the xiaolongbao (soup dumplings) at @dumplinghouse stand!',
    taggedAccounts: [
      {
        username: 'shanghaitaste'
      },
      {
        username: 'shanghaigarden'
      },
      {
        username: 'shanghaiguide'
      },
      {
        username: 'dumplinghouse'
      },
      {
        username: 'shanghailounge'
      },
      {
        username: 'silkmarket'
      }
    ]
  },
  {
    id: 2,
    title: 'Sunset over the Bund waterfront',
    image: '/newpostmedia/random3.jpg',
    media: [
      {
        id: 202,
        type: 'image',
        url: '/newpostmedia/random3.jpg',
        aspectRatio: '16:9',
        width: 800,
        height: 450
      }
    ],
    userId: 2,
    username: 'travelwithme',
    createdAt: '2023-06-15T14:30:00Z',
    likes: 892,
    bookmarks: 103,
    views: 89,
    hashtags: ['#shanghai', '#bund', '#sunset', '#skyline', '#attractions'],
    description: 'One of the most iconic views in Shanghai - watching the sunset over the historic Bund waterfront with the futuristic Pudong skyline as a backdrop.',
    taggedAccounts: [
      {
        username: 'shanghaiguide'
      }
    ],
    location: 'The Bund, Shanghai, China'
  },
  {
    id: 3,
    title: 'Luxury weekend in Sanya: The St. Regis Experience',
    image: '/newpostmedia/media1.jpg',
    media: [
      {
        id: 207,
        type: 'image',
        url: '/newpostmedia/media1.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 208,
        type: 'image',
        url: '/newpostmedia/media2.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      },
      {
        id: 209,
        type: 'image',
        url: '/newpostmedia/media3.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    userId: 103,
    username: 'luxury_zhao',
    createdAt: '2025-03-12T16:45:00Z',
    likes: 1243,
    bookmarks: 342,
    views: 212,
    location: 'Sanya, Hainan, China',
    hashtags: ['#luxurious', '#Sanya', '#Hotel', '#LuxuryTravel'],
    description: 'Just spent the most perfect weekend at @stregissanya and I\'m still dreaming about their signature butler service! From the moment we arrived, everything was absolute perfection. Our Oceanfront Suite had breathtaking views of Yalong Bay and the private balcony infinity plunge pool was the highlight of our stay. Don\'t miss their champagne sabering ritual at sunset - a St. Regis tradition! The Cantonese restaurant on property, @ruiyican, offers the most exquisite dim sum I\'ve ever tasted. Already planning my return visit for the lunar new year celebration!'
  },
  {
    id: 4,
    title: 'Panoramic view of Hong Kong skyline',
    image: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_2_珞博Robopoet_来自小红书网页版.jpg',
    media: [
      {
        id: 204,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_2_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '16:9',
        width: 900,
        height: 500
      }
    ],
    userId: 4,
    username: 'urban_explorer',
    createdAt: '2023-05-29T10:15:00Z',
    likes: 745,
    bookmarks: 91,
    views: 167,
    hashtags: ['#hongkong', '#skyline', '#cityscape', '#nightview', '#attractions', '#treasurehunt'],
    description: 'The iconic Hong Kong skyline at sunset, viewed from Victoria Peak. The perfect blend of mountains, harbor, and skyscrapers makes this one of the most spectacular urban views in the world.',
    location: 'Victoria Peak, Hong Kong'
  },
  {
    id: 5,
    title: 'The ultimate street food tour of Chengdu',
    image: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_3_珞博Robopoet_来自小红书网页版.jpg',
    media: [
      {
        id: 212,
        type: 'image',
        url: '/newpostmedia/Fuzzoo应援大赛｜可以....给我投票嘛？_3_珞博Robopoet_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 213,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_1_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 214,
        type: 'image',
        url: '/newpostmedia/Deepseek太👍🏻了，25年真的让我硬气啦_2_卡罗拉_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 215,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_1_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    userId: 105,
    username: 'foodie_zhang',
    createdAt: '2025-03-08T19:35:00Z',
    likes: 892,
    bookmarks: 267,
    views: 103,
    location: 'Chengdu, Sichuan, China',
    hashtags: ['#StreetFood', '#Chengdu', '#SichuanCuisine', '#food'],
    description: 'My 6-hour Chengdu street food tour was an absolute flavor explosion! We started at the famous Chunxi Road food stalls, where I tried dan dan noodles with the perfect balance of spicy, numbing Sichuan peppercorns. Next was Jinli Ancient Street for some incredible rabbit heads (yes, really - and they\'re delicious!). The secret locals-only spot was a tiny family-run place near Wenshu Monastery that serves the most incredible mapo tofu I\'ve ever tasted. Swipe to see all the incredible dishes! Pro tip: most street food in Chengdu is spicy, but you can ask for "bu la" (not spicy) if you need a break from the heat. What\'s your favorite Sichuan dish?'
  },
  {
    id: 6,
    title: 'Hidden beach gems in Jeju Island',
    image: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_2_拯救胡萝卜_来自小红书网页版.jpg',
    media: [
      {
        id: 301,
        type: 'image',
        url: '/newpostmedia/【揭秘！毛绒玩具背后的7大工艺细节】_2_拯救胡萝卜_来自小红书网页版.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      }
    ],
    userId: 3,
    username: 'sarahwanders',
    createdAt: '2023-04-18T12:30:00Z',
    likes: 487,
    bookmarks: 112,
    views: 195,
    hashtags: ['#korea', '#jejuisland', '#beach', '#islandlife', '#koreanbeauty'],
    description: "Found this incredible secluded beach on the eastern side of Jeju Island. The volcanic rock formations create natural swimming pools at low tide. The water was crystal clear and surprisingly warm! Bring water shoes as the rocks can be sharp, but it's absolutely worth the trek.",
    location: 'Jeju Island, South Korea',
    taggedAccounts: [
      {
        username: 'visitjeju'
      }
    ]
  },
  {
    id: 7,
    title: 'The best craft cocktail bars in Tokyo',
    image: '/newpostmedia/random1.jpg',
    media: [
      {
        id: 302,
        type: 'image',
        url: '/newpostmedia/random1.jpg',
        aspectRatio: '3:2',
        width: 900,
        height: 600
      }
    ],
    userId: 4,
    username: 'urban_explorer',
    createdAt: '2023-05-01T19:45:00Z',
    likes: 633,
    bookmarks: 239,
    views: 281,
    hashtags: ['#tokyo', '#cocktails', '#nightlife', '#japan', '#getdrunk', '#luxurious'],
    description: "Just spent an amazing night touring Tokyo's hidden cocktail scene! Bar High Five in Ginza is a must-visit - the bartender created a custom sakura-infused gin drink that changed my life. Bar Benfiddich uses herbs and spices grown by the owner himself. These aren't cheap (expect $15-25 per drink) but the craftsmanship is unmatched anywhere in the world.",
    location: 'Ginza, Tokyo, Japan',
    taggedAccounts: [
      {
        username: 'tokyodrinks'
      }
    ]
  },
  {
    id: 8,
    title: 'Luxury glamping in the mountains of Taiwan',
    image: '/newpostmedia/random2.jpg',
    media: [
      {
        id: 303,
        type: 'image',
        url: '/newpostmedia/random2.jpg',
        aspectRatio: '16:9',
        width: 1600,
        height: 900
      }
    ],
    userId: 1,
    username: 'meizhangtravels',
    createdAt: '2023-06-10T09:20:00Z',
    likes: 526,
    bookmarks: 184,
    views: 217,
    hashtags: ['#hotel', '#glamping', '#taiwan', '#mountainretreat', '#luxurytravel'],
    description: 'Just spent two magical nights at this luxury glamping site in the mountains of Taiwan. Each tent has a private hot spring bath with panoramic views of the misty mountains. The beds were more comfortable than most 5-star hotels, and they serve a gourmet breakfast of local delicacies right to your tent! Worth every penny for a special occasion.',
    location: 'Nantou County, Taiwan',
    taggedAccounts: [
      {
        username: 'taiwanglamp'
      }
    ]
  },
  {
    id: 9,
    title: 'Shopping and Nightlife Tour in Shenzhen',
    image: '/newpostmedia/random3.jpg',
    media: [
      {
        id: 401,
        type: 'image',
        url: '/newpostmedia/random3.jpg',
        aspectRatio: '16:9',
        width: 1600,
        height: 900
      },
      {
        id: 402,
        type: 'image',
        url: '/newpostmedia/media1.jpg',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 403,
        type: 'image',
        url: '/newpostmedia/media2.jpg',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      }
    ],
    userId: 4,
    username: 'urban_explorer',
    createdAt: '2023-06-25T20:15:00Z',
    likes: 728,
    bookmarks: 215,
    views: 302,
    hashtags: ['#shenzhen', '#shopping', '#nightlife', '#china', '#getdrunk', '#luxurious'],
    description: 'My weekend tour of Shenzhen was the perfect mix of shopping and nightlife! Started at @huaqiangbei electronics market where you can find literally ANY gadget imaginable. Then spent the afternoon at @cococity for luxury brands and amazing local designer shops. For dinner, I tried the fusion cuisine at @szfusion which was mind-blowing! After that, went to @skybarlounge for spectacular city views and craft cocktails, then ended the night dancing at @pulseclub until sunrise. If you\'re visiting Shenzhen, this combination of shopping and nightlife is a must-experience itinerary!',
    location: 'Shenzhen, Guangdong, China',
    taggedAccounts: [
      {
        username: 'huaqiangbei'
      },
      {
        username: 'cococity'
      },
      {
        username: 'szfusion'
      },
      {
        username: 'skybarlounge'
      },
      {
        username: 'pulseclub'
      }
    ]
  }
]; 