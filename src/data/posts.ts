export interface TravelPost {
  id: number;
  title: string;
  image: string;
  author: string;
  likes: number;
  tags: string[];
  description?: string;
  taggedAccounts?: TaggedAccount[];
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
    image: 'https://placehold.co/600x800/ffd100/ffffff',
    author: 'TravelExplorer',
    likes: 24,
    tags: ['Shanghai', 'Hidden Gems', 'attractions'],
    description: 'Shanghai is a city of contrasts, where traditional temples sit alongside futuristic skyscrapers. Had an amazing dinner at @shanghaitaste restaurant last night! Also visited @shanghaigarden for sightseeing. During my recent trip, I discovered some amazing hidden spots that most tourists miss. The winding alleys of Tianzifang were filled with local artisans and cozy cafes. I spent hours exploring the area and sampling delicious street food. The Yu Garden was another highlight, especially early in the morning before the crowds arrived.',
    taggedAccounts: [
      {
        id: 101,
        username: 'shanghaitaste',
        displayName: 'Shanghai Taste',
        accountType: 'restaurant',
        avatar: 'S'
      },
      {
        id: 103,
        username: 'luxuryhotel',
        displayName: 'Shanghai Luxury Hotel',
        accountType: 'hotel',
        avatar: 'L'
      }
    ]
  },
  {
    id: 2,
    title: 'Best street food in Seoul you must try',
    image: 'https://placehold.co/600x600/ffd100/ffffff',
    author: 'FoodieJourney',
    likes: 42,
    tags: ['Seoul', 'Food', 'korea'],
    description: 'Seoul\'s street food scene is absolutely incredible! From tteokbokki (spicy rice cakes) to hotteok (sweet pancakes), there\'s something for everyone. I spent a week exploring different night markets and food streets, and my favorite was definitely Myeongdong. The vendors there serve everything from tornado potatoes to giant ice cream cones. Don\'t miss the Korean fried chicken - it\'s crispy, sweet, and spicy all at once!'
  },
  {
    id: 3,
    title: 'A weekend getaway to Jeju Island',
    image: 'https://placehold.co/600x900/ffd100/ffffff',
    author: 'IslandHopper',
    likes: 18,
    tags: ['Jeju', 'Weekend Trip', 'korea'],
    description: 'Jeju Island is the perfect weekend escape from Seoul. Just a short flight away, this volcanic island offers stunning landscapes, beautiful beaches, and unique cultural experiences. I hiked up Mount Hallasan, the highest peak in South Korea, and the views from the top were absolutely breathtaking. The Jeju Olle Trail was another highlight, with coastal paths that lead to hidden coves and dramatic cliffs. Don\'t miss the fresh seafood - it\'s some of the best in Korea!'
  },
  {
    id: 4,
    title: 'Traditional tea houses in Kyoto',
    image: 'https://placehold.co/600x700/ffd100/ffffff',
    author: 'TeaExplorer',
    likes: 31,
    tags: ['Kyoto', 'Tea Culture', 'attractions'],
    description: 'Kyoto\'s traditional tea houses offer a glimpse into Japan\'s rich cultural heritage. I spent a week visiting different establishments, from centuries-old tea rooms to modern interpretations of the classic tea ceremony. The most memorable experience was at a small tea house near Kiyomizu-dera Temple, where the tea master had been perfecting his craft for over 40 years. The careful preparation and presentation of matcha was like watching an art form unfold before my eyes.'
  },
  {
    id: 5,
    title: 'Luxury hotel experience in Bali',
    image: 'https://placehold.co/600x800/4ecdc4/ffffff',
    author: 'LuxuryTraveler',
    likes: 89,
    tags: ['Bali', 'Luxury', 'hotel'],
    description: 'My stay at the cliffside resort in Uluwatu was nothing short of magical. The infinity pool overlooking the Indian Ocean offered breathtaking sunset views. The private villa came with a personal butler who arranged everything from in-room dining to private yoga sessions on the beach. The spa treatments using traditional Balinese techniques were incredibly rejuvenating.'
  },
  {
    id: 6,
    title: 'Street photography in Tokyo',
    image: 'https://placehold.co/600x800/ff6b6b/ffffff',
    author: 'UrbanShooter',
    likes: 56,
    tags: ['Tokyo', 'Photography', 'superpicture'],
    description: 'Tokyo\'s streets are a photographer\'s dream. The neon lights of Shinjuku, the fashion-forward crowds in Harajuku, and the traditional architecture in Asakusa all offer unique photo opportunities. I spent a week wandering the city with my camera, capturing the beautiful contrast between old and new that defines Tokyo.'
  },
  {
    id: 7,
    title: 'Hidden bars in Hong Kong',
    image: 'https://placehold.co/600x800/1a535c/ffffff',
    author: 'CocktailHunter',
    likes: 37,
    tags: ['Hong Kong', 'Nightlife', 'getdrunk'],
    description: 'Hong Kong\'s speakeasy scene is thriving! Behind unmarked doors and through secret entrances, I discovered some of the most creative cocktail bars I\'ve ever experienced. My favorite was a tiny spot in Central that you access through a vintage telephone booth. Their signature drink combines local baijiu with tropical fruits and a hint of spice.'
  },
  {
    id: 8,
    title: 'Best dim sum in Guangzhou',
    image: 'https://placehold.co/600x800/ff9f1c/ffffff',
    author: 'DimSumLover',
    likes: 45,
    tags: ['Guangzhou', 'Dim Sum', 'food'],
    description: 'Guangzhou is the birthplace of dim sum, and the options here are endless. From century-old teahouses to modern restaurants, I sampled over 50 different dim sum varieties during my visit. The har gow (shrimp dumplings) were so fresh, and the char siu bao (BBQ pork buns) were perfectly fluffy. Don\'t miss the cheung fun (rice noodle rolls) with crispy dough inside!'
  },
  {
    id: 9,
    title: 'Ancient temples of Siem Reap',
    image: 'https://placehold.co/600x800/7b68ee/ffffff',
    author: 'HistoryBuff',
    likes: 62,
    tags: ['Siem Reap', 'Temples', 'treasurehunt'],
    description: 'Exploring the temples of Angkor was like stepping back in time. I woke up at 4am to catch the sunrise at Angkor Wat, and it was absolutely worth it. The stone faces of Bayon Temple were hauntingly beautiful, and Ta Prohm with its tree-covered ruins felt like something out of an adventure movie. Hire a good guide to learn about the fascinating history behind these architectural marvels.'
  },
  {
    id: 10,
    title: 'Beachfront villa in Phuket',
    image: 'https://placehold.co/600x800/6a0572/ffffff',
    author: 'BeachLover',
    likes: 73,
    tags: ['Phuket', 'Beach', 'luxurious'],
    description: 'My beachfront villa in Phuket offered the perfect balance of luxury and natural beauty. Waking up to the sound of waves and having breakfast on a private terrace overlooking the Andaman Sea was incredible. The villa came with a private chef who prepared the freshest seafood dishes with local Thai flavors. The nearby beach was pristine with soft white sand and crystal clear water.'
  },
  {
    id: 11,
    title: 'Mountain retreat in Hakone',
    image: 'https://placehold.co/600x800/ffd166/ffffff',
    author: 'ZenSeeker',
    likes: 29,
    tags: ['Hakone', 'Onsen', 'hotel'],
    description: 'My ryokan stay in Hakone was the perfect escape from Tokyo\'s hustle and bustle. The traditional Japanese inn featured tatami floors, sliding paper doors, and a private onsen (hot spring bath) with views of Mount Fuji. The kaiseki dinner was a work of art, with each seasonal dish more beautiful than the last. Sleeping on a futon on the tatami floor gave me the best sleep I\'ve had in years.'
  },
  {
    id: 12,
    title: 'Cycling through Vietnam\'s countryside',
    image: 'https://placehold.co/600x800/ff5e5b/ffffff',
    author: 'AdventureSeeker',
    likes: 41,
    tags: ['Vietnam', 'Cycling', 'attractions'],
    description: 'Cycling through Vietnam\'s lush countryside was an unforgettable adventure. I pedaled past endless rice paddies, through small villages where children ran alongside my bike, and along coastal roads with breathtaking views. The highlight was cycling through the limestone karsts of Ninh Binh, often called the "Halong Bay on land." The local homestays along the route offered authentic food and warm hospitality.'
  },
  {
    id: 13,
    title: 'Craft beer tour in Seoul',
    image: 'https://placehold.co/600x800/4ecdc4/ffffff',
    author: 'BeerExplorer',
    likes: 33,
    tags: ['Seoul', 'Craft Beer', 'korea', 'getdrunk'],
    description: 'Seoul\'s craft beer scene is booming! I visited over a dozen microbreweries in neighborhoods like Hongdae and Itaewon. Each brewery had its own unique take on traditional styles, often incorporating local ingredients like Jeju tangerines or Korean chili. My favorite was a small brewpub in Gyeongridan that served a makgeolli-inspired wheat beer alongside delicious Korean-Mexican fusion tacos.'
  },
  {
    id: 14,
    title: 'Stunning sunrise at Mount Bromo',
    image: 'https://placehold.co/600x800/ff6b6b/ffffff',
    author: 'VolcanoChaser',
    likes: 87,
    tags: ['Indonesia', 'Volcano', 'superpicture'],
    description: 'Hiking up to the viewpoint for sunrise over Mount Bromo was challenging but absolutely worth it. As the first light broke over the horizon, the volcanic landscape was revealed in all its otherworldly glory. The sea of clouds surrounding the caldera, with Mount Bromo and Mount Semeru rising above them, created a scene that looked like something from another planet. The hike to the crater afterward let me experience the raw power of this active volcano up close.'
  },
  {
    id: 15,
    title: 'Hidden waterfall in Bali',
    image: 'https://placehold.co/600x800/7b68ee/ffffff',
    author: 'JungleExplorer',
    likes: 52,
    tags: ['Bali', 'Waterfall', 'treasurehunt'],
    description: 'After a challenging two-hour trek through dense jungle, I discovered a secluded waterfall that wasn\'t on any tourist map. The local guide from a nearby village led me through unmarked paths, crossing streams and climbing over fallen trees. When we finally reached the waterfall, I had it completely to myself. The powerful cascade dropped into a crystal-clear pool perfect for swimming. This hidden gem was well worth the effort to reach it.'
  },
  {
    id: 16,
    title: 'Luxury glamping in Mongolia',
    image: 'https://placehold.co/600x800/6a0572/ffffff',
    author: 'NomadLuxury',
    likes: 68,
    tags: ['Mongolia', 'Glamping', 'luxurious'],
    description: 'My luxury ger (yurt) in the Mongolian steppe offered an unforgettable blend of traditional nomadic living and modern comforts. The beautifully decorated tent featured a king-sized bed, wooden floors with rugs, and even a wood-burning stove for chilly nights. During the day, I went horseback riding with local nomads and learned about their fascinating way of life. At night, the lack of light pollution revealed the most spectacular starry sky I\'ve ever seen.'
  }
] 