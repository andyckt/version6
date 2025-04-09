'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiShoppingBag, FiTag, FiMapPin, FiClock, FiStar, FiDollarSign, FiHeart, FiCamera, FiInfo, FiCoffee } from 'react-icons/fi'
import { RiTShirt2Line, RiShoppingBag3Line } from 'react-icons/ri'
import { GiClothes, GiLargeDress } from 'react-icons/gi'
import { TbHanger, TbShoe } from 'react-icons/tb'
import { IoShirtOutline } from 'react-icons/io5'
import { PiHandbagSimpleLight } from 'react-icons/pi'

type FashionTab = 
  // | 'luxury' 
  // | 'streetwear' 
  // | 'vintage' 
  // | 'local-designers' 
  | 'top-women'
  | 'for-the-bois'
  | 'cute-stuff'
  | 'dessert'
  | 'malls' 
  // | 'accessories'

interface FashionLocation {
  id: string;
  name: string;
  type: string;
  price: 1 | 2 | 3 | 4; // $ to $$$$
  description: string;
  address: string;
  highlights: string[];
  hours: string;
  image?: string;
  website?: string;
  instagramHandle?: string;
}

export default function FashionSpotsContent() {
  const [activeTab, setActiveTab] = useState<FashionTab>('top-women')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  // Fashion spots by category
  const fashionSpots: Record<FashionTab, FashionLocation[]> = {
    /*
    'luxury': [
      {
        id: 'luxgallery',
        name: 'Luxury Gallery',
        type: 'Multi-brand Designer',
        price: 4,
        description: 'Immerse yourself in a curated selection of high-end brands like LV, Gucci, Prada, and Dior, all in one sleek space. The staff knows fashion history and will help curate your perfect look.',
        address: 'Plaza 66, 1266 Nanjing West Road, Jing\'an',
        highlights: [
          'Personal VIP shopping suites',
          'Champagne service',
          'Exclusive preview events',
          'Runway collection pieces'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=1'
      },
      {
        id: 'ix66',
        name: 'IX66 Designer Hub',
        type: 'Luxury Department Store',
        price: 4,
        description: 'This fashion destination showcases the most exclusive designer collections with personal shoppers to elevate your experience. The architecture alone is Instagram-worthy!',
        address: 'IFC Mall, 8 Century Avenue, Pudong',
        highlights: [
          'Limited edition collections',
          'Rooftop fashion lounge',
          'Designer trunk shows',
          'Tailoring services'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=2'
      }
    ],
    */
    /*
    'streetwear': [
      {
        id: 'upt',
        name: 'Urban Playground Threads',
        type: 'Streetwear Concept Store',
        price: 2,
        description: 'The go-to spot for hypebeasts and fashion-forward locals. Carries both international brands and underground Chinese labels that are about to blow up! Amazing selection of sneakers too.',
        address: '123 Anfu Road, Near Wukang Road, Xuhui',
        highlights: [
          'Weekly drops',
          'Skateboard half-pipe inside',
          'Underground DJ sets on weekends',
          'Custom sneaker cleaning service'
        ],
        hours: 'Mon-Sun: 11:00-21:00',
        image: 'https://picsum.photos/800/400?random=3'
      },
      {
        id: 'dostreet',
        name: 'DOT Streetwear',
        type: 'Urban Apparel Store',
        price: 2,
        description: 'Mixing international brands with local Chinese streetwear designers, DOT is the perfect hybrid of East meets West style. Their graphic tees are especially 🔥!',
        address: 'Columbia Circle, 1262 Yan\'an Road West, Changning',
        highlights: [
          'Exclusive collabs with local artists',
          'In-house print shop for custom tees',
          'Sneaker trading events',
          'Hidden sneaker wall (ask staff)'
        ],
        hours: 'Mon-Sun: 12:00-22:00',
        image: 'https://picsum.photos/800/400?random=4'
      },
      {
        id: 'innx',
        name: 'INNX Skateboard Shop',
        type: 'Skate & Streetwear',
        price: 2,
        description: 'Not just a skate shop but a cultural hub for the underground scene. Their curated streetwear selection is small but every piece is 💯. Great for unique finds!',
        address: 'TX Huaihai, 523 Middle Huaihai Road, Huangpu',
        highlights: [
          'Skate video premieres',
          'Small-batch local brands',
          'Weekend skate meetups',
          'Custom grip tape art'
        ],
        hours: 'Tue-Sun: 13:00-22:00, Closed Mondays',
        image: 'https://picsum.photos/800/400?random=5'
      }
    ],
    */
    /*
    'vintage': [
      {
        id: 'fly21',
        name: 'Fly 21 Vintage',
        type: 'Curated Vintage Store',
        price: 3,
        description: 'A treasure trove of carefully selected vintage pieces from the 70s-90s. Their denim and leather jacket selection is unmatched in Shanghai! Each piece has been professionally cleaned and restored.',
        address: 'Ferguson Lane, 376 Wukang Road, Xuhui',
        highlights: [
          'Rare Japanese denim finds',
          'Authenticated vintage designer',
          'Custom alterations available',
          'Monthly themed collections'
        ],
        hours: 'Wed-Sun: 12:00-20:00, Closed Mon-Tue',
        image: 'https://picsum.photos/800/400?random=6',
        instagramHandle: '@fly21vintage'
      },
      {
        id: 'pastperfect',
        name: 'Past Perfect',
        type: 'High-end Vintage',
        price: 3,
        description: 'Specializing in vintage designer pieces from the 80s and 90s - think Versace, Moschino, and Jean Paul Gaultier. The owner personally sources everything from Japan and Europe.',
        address: 'Building 5, Taikang Road, Huangpu',
        highlights: [
          'Rare vintage Chanel jackets',
          'Archive designer pieces',
          'Authentication service',
          'Vintage jewelry collection'
        ],
        hours: 'Thu-Tue: 13:00-21:00, Closed Wednesdays',
        image: 'https://picsum.photos/800/400?random=7',
        instagramHandle: '@pastperfect_sh'
      }
    ],
    'local-designers': [
      {
        id: 'labelhood',
        name: 'Labelhood',
        type: 'Chinese Designer Collective',
        price: 3,
        description: 'The epicenter of China\'s independent fashion scene, Labelhood showcases the most exciting up-and-coming Chinese designers. If you want truly unique pieces you won\'t find back home, this is THE place.',
        address: 'West Bund Art Center, 2555 Longteng Avenue, Xuhui',
        highlights: [
          'Exclusive Shanghai-only labels',
          'Designer meet-and-greets',
          'Fashion week pop-ups',
          'Limited edition collaborations'
        ],
        hours: 'Tue-Sun: 10:00-19:00, Closed Mondays',
        image: 'https://picsum.photos/800/400?random=8',
        instagramHandle: '@labelhood_official'
      },
      {
        id: 'shcollective',
        name: 'SH Collective',
        type: 'Designer Incubator',
        price: 2,
        description: 'A platform for emerging Shanghai designers with a focus on sustainable and innovative approaches. Their pieces combine traditional Chinese elements with futuristic design.',
        address: 'M50 Art District, 50 Moganshan Road, Putuo',
        highlights: [
          'Upcycled fashion pieces',
          'Experimental textile work',
          'Affordable designer pieces',
          'Monthly designer workshops'
        ],
        hours: 'Wed-Mon: 11:00-20:00, Closed Tuesdays',
        image: 'https://picsum.photos/800/400?random=9',
        instagramHandle: '@sh_collective'
      }
    ],
    */
    'malls': [
      {
        id: 'iapmmall',
        name: 'IAPM Mall',
        type: 'Luxury Shopping Mall',
        price: 3,
        description: 'This sleek, modern mall stays open until midnight and houses everything from high street to high-end brands. The best part is their late-night shopping with special evening events and DJ sets.',
        address: '999 Middle Huaihai Road, Xuhui',
        highlights: [
          'Open until midnight',
          'Great food court options',
          'Regular fashion events',
          'Connected to metro station'
        ],
        hours: 'Mon-Sun: 10:00-22:00 (Some stores until 24:00)',
        image: 'https://picsum.photos/800/400?random=10'
      },
      {
        id: 'k11',
        name: 'K11 Art Mall',
        type: 'Art & Fashion Mall',
        price: 3,
        description: 'Not just a mall but a cultural complex where art meets retail. K11 combines galleries, installations, and unique concept stores with a great selection of both Chinese and international brands.',
        address: '300 Middle Huaihai Road, Huangpu',
        highlights: [
          'Rotating art exhibitions',
          'Unique concept stores',
          'Urban farm on rooftop',
          'Limited edition art-fashion collabs'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=11'
      }
    ],
    /*
    'accessories': [
      {
        id: 'glassesvillage',
        name: 'Glasses Village',
        type: 'Eyewear Emporium',
        price: 2,
        description: 'Hidden gem for eyewear enthusiasts! Offers both vintage frames and cutting-edge designs from independent brands. Custom lens cutting on-site with same-day service available.',
        address: 'Unit 103, 1376 Nanjing West Road, Jing\'an',
        highlights: [
          'Rare vintage frames',
          'Custom tinting options',
          'Expert style consultations',
          'Same-day lens service'
        ],
        hours: 'Mon-Sat: 11:00-20:00, Sun: 12:00-18:00',
        image: 'https://picsum.photos/800/400?random=12',
        instagramHandle: '@glassesvillage'
      },
      {
        id: 'bowandheels',
        name: 'Bow & Heels',
        type: 'Footwear Boutique',
        price: 3,
        description: 'Heaven for shoe lovers! This curated footwear boutique features everything from comfortable-yet-stylish walking shoes to statement heels from independent designers across Asia.',
        address: 'Xintiandi Style, Lane 245, Madang Road, Huangpu',
        highlights: [
          'Exclusive Asian footwear brands',
          'Custom insole fittings',
          'Limited edition collaborations',
          'Shoe care workshops'
        ],
        hours: 'Mon-Sun: 10:00-21:00',
        image: 'https://picsum.photos/800/400?random=13',
        instagramHandle: '@bownheels'
      }
    ],
    */
    'cute-stuff': [
      {
        id: 'wigglewiggle',
        name: 'Wiggle Wiggle',
        type: 'Korean Lifestyle & Cute Goods',
        price: 2,
        description: 'This adorable Korean lifestyle store offers the cutest stationery, home goods, and accessories with whimsical designs and pastel colors. Everything here feels special and gift-worthy!',
        address: 'Xintiandi Style, Lane 245, Madang Road, Huangpu',
        highlights: [
          'Korean-designed stationery',
          'Adorable home accessories',
          'Seasonal limited collections',
          'Perfect gifts for any occasion'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=14'
      },
      {
        id: 'looknowflow',
        name: 'LookNow & Flow',
        type: 'Design & Lifestyle Concept Store',
        price: 2,
        description: 'A creative sanctuary combining cute design items, artisanal gifts, and beautifully packaged goods. Their unique selection focuses on both aesthetics and functionality.',
        address: 'Anfu Road, Xuhui District',
        highlights: [
          'Artistic lifestyle products',
          'Unique designer collaborations',
          'Instagram-worthy displays',
          'Curated gift collections'
        ],
        hours: 'Tue-Sun: 11:00-20:00, Closed Mondays',
        image: 'https://picsum.photos/800/400?random=15'
      }
    ],
    'dessert': [
      {
        id: 'shendacheng',
        name: 'Shen DaCheng',
        type: 'Traditional Shanghai Desserts',
        price: 1,
        description: 'A century-old Shanghai institution famous for traditional sweet treats that locals have loved for generations. Their signature eight-treasure rice pudding and green bean soup are must-tries!',
        address: '7 Ninghai East Road, Huangpu District',
        highlights: [
          'Eight-treasure rice pudding',
          'Traditional green bean soup',
          'Sesame rice balls',
          'Authentic Shanghai recipes'
        ],
        hours: 'Mon-Sun: 8:00-20:00',
        image: 'https://picsum.photos/800/400?random=16'
      },
      {
        id: 'mmshanghai',
        name: 'M&M Shanghai',
        type: 'Modern Dessert Cafe',
        price: 2,
        description: 'A contemporary dessert spot blending Chinese flavors with Western techniques. Their beautifully plated desserts taste as good as they look and offer a perfect East-meets-West experience.',
        address: 'Xintiandi, 123 Huangpi Road, Huangpu',
        highlights: [
          'Chinese-inspired soufflés',
          'Artistic dessert platings',
          'Seasonal tea-infused creations',
          'Perfect for Instagram moments'
        ],
        hours: 'Mon-Sun: 11:00-22:00',
        image: 'https://picsum.photos/800/400?random=17'
      },
      {
        id: 'shenjingdessert',
        name: 'Shenjing Dessert',
        type: 'Fusion Sweet Shop',
        price: 2,
        description: 'Known for their innovative approach to Chinese desserts with a modern twist. Flavors are familiar yet exciting, making traditional desserts appealing to younger generations.',
        address: 'Found 158, 158 Julu Road, Huangpu',
        highlights: [
          'Modern Chinese desserts',
          'Innovative presentation',
          'Unique flavor combinations',
          'Trendy atmosphere'
        ],
        hours: 'Mon-Sun: 12:00-23:00',
        image: 'https://picsum.photos/800/400?random=19'
      }
    ],
    'for-the-bois': [
      {
        id: 'nike001',
        name: 'Nike 001',
        type: 'Asia\'s Biggest Nike Store',
        price: 2,
        description: 'The biggest Nike store in Asia, offering an incredible selection of sportswear, limited edition sneakers, and exclusive collections you won\'t find anywhere else. The multi-floor experience includes interactive zones and customization services.',
        address: 'East Nanjing Road, Huangpu',
        highlights: [
          'Exclusive Asia-only releases',
          'Sneaker customization station',
          'Interactive sports zones',
          'Athlete meet-and-greet events'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=18'
      }
    ],
    'top-women': [
      {
        id: 'basementfg',
        name: 'BASEMENT FG',
        type: 'Top 1 Clothing',
        price: 2,
        description: 'The number one spot for fashion-forward women in Shanghai! BASEMENT FG offers unique cuts, high-quality materials and styles you won\'t find anywhere else. A must-visit for serious fashion enthusiasts.',
        address: 'Ferguson Lane, 376 Wukang Road, Xuhui',
        highlights: [
          'Curated collection of independent labels',
          'Stylish essentials with unique details',
          'Exclusive Shanghai-only pieces',
          'Expert styling consultation'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=20'
      },
      {
        id: 'wmanagement',
        name: 'W Management',
        type: 'Designer Boutique',
        price: 3,
        description: 'The second best women\'s fashion destination in Shanghai offers sophisticated collections with both casual and formal options. Their curated pieces from select designers never fail to impress.',
        address: 'K11, 300 Huaihai Middle Road, Huangpu',
        highlights: [
          'Carefully selected designer pieces',
          'Seasonal capsule collections',
          'Premium quality materials',
          'Personal shopping assistance'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=21'
      },
      {
        id: 'brandymelville',
        name: 'Brandy Melville',
        type: 'Casual Women\'s Fashion',
        price: 2,
        description: 'Rounding out the top 3 spots for women\'s fashion in Shanghai, Brandy Melville brings California cool-girl style to China. Known for their relaxed fits and casual basics that create the perfect everyday wardrobe.',
        address: 'IAPM Mall, 999 Huaihai Middle Road, Xuhui',
        highlights: [
          'California-inspired casual styles',
          'Soft, comfortable materials',
          'Affordable everyday basics',
          'Instagram-worthy aesthetic'
        ],
        hours: 'Mon-Sun: 10:00-22:00',
        image: 'https://picsum.photos/800/400?random=22'
      }
    ]
  }

  // Icon mapping for fashion categories
  const categoryIcons = {
    // 'luxury': RiVipCrownLine,
    // 'streetwear': RiTShirt2Line,
    // 'vintage': GiClothes,
    // 'local-designers': RiScissorsCutLine,
    'top-women': GiLargeDress,
    'for-the-bois': IoShirtOutline,
    'cute-stuff': FiHeart,
    'dessert': FiCoffee,
    'malls': RiShoppingBag3Line
    // 'accessories': GiSunglasses,
  }

  // Price level render helper
  const renderPriceLevel = (level: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4].map(i => (
          <FiDollarSign 
            key={i} 
            className={`w-3.5 h-3.5 ${i <= level ? 'text-primary' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  }

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    if (selectedLocation === locationId) {
      setSelectedLocation(null)
    } else {
      setSelectedLocation(locationId)
      // Scroll to the selected location after a short delay
      setTimeout(() => {
        const element = document.getElementById(`location-${locationId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }

  return (
    <div className="py-8" ref={containerRef}>
      {/* Fashion Category Tabs */}
      <div className="mb-8">
        <motion.h2 
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Fashion Districts & Stores
        </motion.h2>
        
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2">
            {Object.entries(categoryIcons).map(([key, Icon]) => {
              const isActive = activeTab === key
              const category = key as FashionTab
              
              return (
                <motion.button
                  key={key}
                  onClick={() => {
                    setActiveTab(category)
                    setSelectedLocation(null)
                  }}
                  className={`px-4 py-3 rounded-xl flex items-center whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'} mr-2`} />
                  <span className="capitalize">
                    {key.replace('-', ' ')}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Category Subheading for Cute Stuff */}
      {activeTab === 'cute-stuff' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-pink-50 rounded-lg p-3 border border-pink-100"
        >
          <h3 className="text-pink-600 text-sm font-medium flex items-center">
            <FiHeart className="w-4 h-4 mr-2" />
            Bois, buy for your girlfriend
          </h3>
        </motion.div>
      )}

      {/* Fashion Spots */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: 20 }}
          variants={containerVariants}
          className="space-y-4"
        >
          {fashionSpots[activeTab].map((spot, index) => {
            const isSelected = selectedLocation === spot.id
            const isTopWomen = activeTab === 'top-women'
            
            return (
              <motion.div
                key={spot.id}
                id={`location-${spot.id}`}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                  isSelected ? 'shadow-md' : ''
                } ${isTopWomen ? 'border-l-4' : ''} ${
                  isTopWomen && index === 0 ? 'border-yellow-400' : 
                  isTopWomen && index === 1 ? 'border-gray-400' : 
                  isTopWomen && index === 2 ? 'border-amber-600' : ''
                }`}
                variants={itemVariants}
                layout
              >
                {/* Location Header */}
                <motion.div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleLocationSelect(spot.id)}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold flex items-center">
                        {isTopWomen && (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-white text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-600' : ''
                          }`}>
                            {index + 1}
                          </span>
                        )}
                        {spot.name}
                        <motion.div
                          className="ml-2"
                          animate={{ rotate: isSelected ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="mr-2">{spot.type}</span>
                        {renderPriceLevel(spot.price)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {spot.instagramHandle && (
                        <motion.div 
                          className="p-1.5 rounded-full bg-pink-50 text-pink-500"
                          whileHover={{ scale: 1.1, backgroundColor: '#fcdfeb' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17.5 7C17.5 7.27614 17.2761 7.5 17 7.5C16.7239 7.5 16.5 7.27614 16.5 7C16.5 6.72386 16.7239 6.5 17 6.5C17.2761 6.5 17.5 6.72386 17.5 7Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </motion.div>
                      )}
                      <motion.button 
                        className="p-1.5 rounded-full bg-red-50 text-red-500"
                        whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                      >
                        <FiHeart className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Optional Image */}
                      {spot.image && (
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                          <img 
                            src={spot.image} 
                            alt={spot.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4 pt-2">
                        {/* Description */}
                        <p className="text-gray-700 mb-4">
                          {spot.description}
                        </p>
                        
                        {/* Highlights */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-500 mr-2" />
                            Highlights
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {spot.highlights.map((highlight, index) => (
                              <motion.div 
                                key={index}
                                className="flex items-center p-2 bg-gray-50 rounded-md"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ x: 5 }}
                              >
                                <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                                <span className="text-sm">{highlight}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Location Info */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start">
                            <FiMapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{spot.address}</span>
                          </div>
                          <div className="flex items-start">
                            <FiClock className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{spot.hours}</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            className="flex-1 py-2 px-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center"
                            whileHover={{ scale: 1.02, backgroundColor: '#0371e3' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiMapPin className="w-4 h-4 mr-2" />
                            Get Directions
                          </motion.button>
                          
                          <motion.button
                            className="py-2 px-3 border border-gray-200 rounded-lg font-medium flex items-center justify-center"
                            whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiCamera className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            className="py-2 px-3 border border-gray-200 rounded-lg font-medium flex items-center justify-center"
                            whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiInfo className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
      
      {/* Pro Tips Box */}
      <motion.div 
        className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FiHeart className="w-5 h-5 text-primary mr-2" />
          Fashion Pro Tips
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">✨ Visit during Shanghai Fashion Week</span> (usually April and October) 
            for the best pop-up shops and events!
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">🛍️ Bring your passport</span> to get the tax refund at luxury stores 
            for purchases over ¥500.
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">📱 Follow the Shanghai Fashion WeChat accounts</span> like "StylePhyle" 
            and "NiceShanghai" for sample sales announcements.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 