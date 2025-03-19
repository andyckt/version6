export interface TravelPost {
  id: number;
  title: string;
  image?: string;
  media?: MediaItem[];
  author: string;
  likes: number;
  bookmarks?: number;
  hashtags: string[];
  description?: string;
  taggedAccounts?: TaggedAccount[];
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
    author: 'TravelExplorer',
    likes: 42,
    bookmarks: 1404,
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
  }
]; 