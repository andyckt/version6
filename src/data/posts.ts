export interface TravelPost {
  id: number;
  title: string;
  image: string;
  author: string;
  likes: number;
  tags: string[];
  description?: string;
}

export const travelPosts: TravelPost[] = [
  {
    id: 1,
    title: 'Exploring the hidden gems of Shanghai',
    image: 'https://placehold.co/600x800/ffd100/ffffff',
    author: 'TravelExplorer',
    likes: 24,
    tags: ['Shanghai', 'Hidden Gems'],
    description: 'Shanghai is a city of contrasts, where traditional temples sit alongside futuristic skyscrapers. During my recent trip, I discovered some amazing hidden spots that most tourists miss. The winding alleys of Tianzifang were filled with local artisans and cozy cafes. I spent hours exploring the area and sampling delicious street food. The Yu Garden was another highlight, especially early in the morning before the crowds arrived.'
  },
  {
    id: 2,
    title: 'Best street food in Seoul you must try',
    image: 'https://placehold.co/600x600/ffd100/ffffff',
    author: 'FoodieJourney',
    likes: 42,
    tags: ['Seoul', 'Food'],
    description: 'Seoul\'s street food scene is absolutely incredible! From tteokbokki (spicy rice cakes) to hotteok (sweet pancakes), there\'s something for everyone. I spent a week exploring different night markets and food streets, and my favorite was definitely Myeongdong. The vendors there serve everything from tornado potatoes to giant ice cream cones. Don\'t miss the Korean fried chicken - it\'s crispy, sweet, and spicy all at once!'
  },
  {
    id: 3,
    title: 'A weekend getaway to Jeju Island',
    image: 'https://placehold.co/600x900/ffd100/ffffff',
    author: 'IslandHopper',
    likes: 18,
    tags: ['Jeju', 'Weekend Trip'],
    description: 'Jeju Island is the perfect weekend escape from Seoul. Just a short flight away, this volcanic island offers stunning landscapes, beautiful beaches, and unique cultural experiences. I hiked up Mount Hallasan, the highest peak in South Korea, and the views from the top were absolutely breathtaking. The Jeju Olle Trail was another highlight, with coastal paths that lead to hidden coves and dramatic cliffs. Don\'t miss the fresh seafood - it\'s some of the best in Korea!'
  },
  {
    id: 4,
    title: 'Traditional tea houses in Kyoto',
    image: 'https://placehold.co/600x700/ffd100/ffffff',
    author: 'TeaExplorer',
    likes: 31,
    tags: ['Kyoto', 'Tea Culture'],
    description: 'Kyoto\'s traditional tea houses offer a glimpse into Japan\'s rich cultural heritage. I spent a week visiting different establishments, from centuries-old tea rooms to modern interpretations of the classic tea ceremony. The most memorable experience was at a small tea house near Kiyomizu-dera Temple, where the tea master had been perfecting his craft for over 40 years. The careful preparation and presentation of matcha was like watching an art form unfold before my eyes.'
  }
] 