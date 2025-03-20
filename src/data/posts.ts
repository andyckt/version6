export interface TravelPost {
  id: number;
  title: string;
  image?: string;
  media?: MediaItem[];
  author: string;           // Legacy field (keeping for backward compatibility)
  userId: number;           // Reference to user ID
  username: string;         // Reference to username
  createdAt: string;        // Post creation date
  likes: number;
  bookmarks?: number;
  hashtags: string[];
  description?: string;
  taggedAccounts?: TaggedAccount[];
  location?: string;        // Location where the post was created
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'livePhoto';
  url: string;
  aspectRatio?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
  livePhotoVideoUrl?: string; // For Live Photos: URL to the video component
}

export interface TaggedAccount {
  id: number;
  username: string;
  displayName: string;
  accountType: 'user' | 'restaurant' | 'hotel' | 'attraction';
  avatar?: string;
}

export const travelPosts: TravelPost[] = [
  {
    id: 1,
    title: 'Exploring the hidden gems of Shanghai',
    image: 'https://picsum.photos/600/600?random=4',
    media: [
      {
        id: 201,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=4',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 202,
        type: 'image',
        url: 'https://picsum.photos/600/800?random=5',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 203,
        type: 'image',
        url: 'https://picsum.photos/800/600?random=6',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      },
      {
        id: 204,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=7',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    author: 'wanderlust_emma',
    userId: 101,
    username: 'wanderlust_emma',
    createdAt: '2025-03-15T14:30:00Z',
    likes: 842,
    bookmarks: 176,
    location: 'Shanghai, China',
    hashtags: ['Shanghai', 'Hidden Gems', 'attractions'],
    description: 'Shanghai\'s hidden gems are absolutely incredible! From the historic Bund to the modern skyscrapers, there\'s something for everyone. I spent a week exploring different neighborhoods and my favorite was definitely Tianzifang. Had the most amazing dumplings at @shanghaitaste restaurant - they\'re juicy, flavorful, and perfectly steamed! Also visited the famous @shanghaigarden where the traditional architecture and peaceful ponds create a perfect escape from the city. My local friend @shanghaiguide showed me some hidden gems away from the tourist spots. Don\'t miss the xiaolongbao (soup dumplings) at @dumplinghouse stand!',
    taggedAccounts: [
      {
        id: 201,
        username: 'shanghaitaste',
        displayName: 'Shanghai Taste',
        accountType: 'restaurant',
        avatar: 'S'
      },
      {
        id: 202,
        username: 'shanghaigarden',
        displayName: 'Shanghai Garden',
        accountType: 'attraction',
        avatar: 'G'
      },
      {
        id: 203,
        username: 'shanghaiguide',
        displayName: 'Shanghai Local Guide',
        accountType: 'user',
        avatar: 'S'
      },
      {
        id: 204,
        username: 'dumplinghouse',
        displayName: 'Dumpling House',
        accountType: 'restaurant',
        avatar: 'D'
      }
    ]
  },
  {
    id: 2,
    title: 'Sunset over the Bund waterfront',
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
    media: [
      {
        id: 202,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
        aspectRatio: '16:9',
        width: 800,
        height: 450
      }
    ],
    author: 'Jane Smith',
    userId: 2,
    username: 'travelwithme',
    createdAt: '2023-06-15T14:30:00Z',
    likes: 892,
    bookmarks: 103,
    hashtags: ['#shanghai', '#bund', '#sunset', '#skyline', '#attractions'],
    description: 'One of the most iconic views in Shanghai - watching the sunset over the historic Bund waterfront with the futuristic Pudong skyline as a backdrop.',
    taggedAccounts: [
      {
        id: 6,
        username: 'shanghaiguide',
        displayName: 'Shanghai Official Guide',
        accountType: 'attraction',
        avatar: 'https://picsum.photos/64/64?random=6'
      }
    ],
    location: 'The Bund, Shanghai, China'
  },
  {
    id: 3,
    title: 'Luxury weekend in Sanya: The St. Regis Experience',
    image: 'https://picsum.photos/600/800?random=10',
    media: [
      {
        id: 207,
        type: 'image',
        url: 'https://picsum.photos/600/800?random=10',
        aspectRatio: '3:4',
        width: 600,
        height: 800
      },
      {
        id: 208,
        type: 'image',
        url: 'https://picsum.photos/800/600?random=11',
        aspectRatio: '4:3',
        width: 800,
        height: 600
      },
      {
        id: 209,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=12',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    author: 'luxury_zhao',
    userId: 103,
    username: 'luxury_zhao',
    createdAt: '2025-03-12T16:45:00Z',
    likes: 1243,
    bookmarks: 342,
    location: 'Sanya, Hainan, China',
    hashtags: ['Luxury Travel', 'Sanya', 'Hotel Review'],
    description: 'Just spent the most perfect weekend at @stregissanya and I\'m still dreaming about their signature butler service! From the moment we arrived, everything was absolute perfection. Our Oceanfront Suite had breathtaking views of Yalong Bay and the private balcony infinity plunge pool was the highlight of our stay. Don\'t miss their champagne sabering ritual at sunset - a St. Regis tradition! The Cantonese restaurant on property, @ruiyican, offers the most exquisite dim sum I\'ve ever tasted. Already planning my return visit for the lunar new year celebration!'
  },
  {
    id: 4,
    title: 'Panoramic view of Hong Kong skyline',
    image: 'https://images.unsplash.com/photo-1555086156-e6c7353d283f',
    media: [
      {
        id: 204,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555086156-e6c7353d283f',
        aspectRatio: '16:9',
        width: 900,
        height: 500
      }
    ],
    author: 'Alex Chen',
    userId: 4,
    username: 'urban_explorer',
    createdAt: '2023-05-29T10:15:00Z',
    likes: 745,
    bookmarks: 91,
    hashtags: ['#hongkong', '#skyline', '#cityscape', '#nightview', '#attractions'],
    description: 'The iconic Hong Kong skyline at sunset, viewed from Victoria Peak. The perfect blend of mountains, harbor, and skyscrapers makes this one of the most spectacular urban views in the world.',
    location: 'Victoria Peak, Hong Kong'
  },
  {
    id: 5,
    title: 'The ultimate street food tour of Chengdu',
    image: 'https://picsum.photos/600/600?random=15',
    media: [
      {
        id: 212,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=15',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 213,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=16',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 214,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=17',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      },
      {
        id: 215,
        type: 'image',
        url: 'https://picsum.photos/600/600?random=18',
        aspectRatio: '1:1',
        width: 600,
        height: 600
      }
    ],
    author: 'foodie_zhang',
    userId: 105,
    username: 'foodie_zhang',
    createdAt: '2025-03-08T19:35:00Z',
    likes: 892,
    bookmarks: 267,
    location: 'Chengdu, Sichuan, China',
    hashtags: ['Street Food', 'Chengdu', 'Sichuan Cuisine'],
    description: 'My 6-hour Chengdu street food tour was an absolute flavor explosion! We started at the famous Chunxi Road food stalls, where I tried dan dan noodles with the perfect balance of spicy, numbing Sichuan peppercorns. Next was Jinli Ancient Street for some incredible rabbit heads (yes, really - and they\'re delicious!). The secret locals-only spot was a tiny family-run place near Wenshu Monastery that serves the most incredible mapo tofu I\'ve ever tasted. Swipe to see all the incredible dishes! Pro tip: most street food in Chengdu is spicy, but you can ask for "bu la" (not spicy) if you need a break from the heat. What\'s your favorite Sichuan dish?'
  }
]; 