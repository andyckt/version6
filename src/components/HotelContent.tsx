'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiStar, FiDollarSign, FiMapPin, FiCamera, FiInfo, FiClock } from 'react-icons/fi'
import { LuHotel, LuBed } from 'react-icons/lu'
import { RiHotelLine, RiHotelFill } from 'react-icons/ri'
import { MdOutlineApartment, MdOutlineLuggage } from 'react-icons/md'
import { TbBuildingSkyscraper, TbMoon, TbSun } from 'react-icons/tb'

interface Hotel {
  id: string;
  name: string;
  category: 'luxury' | 'affordable' | 'top-pick';
  description: string;
  features: string[];
  location: string;
  image?: string;
  rating: number; // 1-5
}

export default function HotelContent() {
  const [activeCategory, setActiveCategory] = useState<'luxury' | 'affordable' | 'top-pick'>('luxury')
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Hotel data
  const hotels: Hotel[] = [
    // Luxury Hotels
    {
      id: 'w-bund',
      name: 'W Hotel - The Bund',
      category: 'luxury',
      description: 'Trendy luxury with breathtaking views of the Huangpu River and the iconic Shanghai skyline.',
      features: [
        'Spectacular Huangpu River views',
        'Stylish rooftop bar',
        'Instagram-worthy infinity pool',
        'Contemporary designer rooms'
      ],
      location: 'The Bund',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 5
    },
    {
      id: 'banyan-tree',
      name: 'Banyan Tree Shanghai',
      category: 'luxury',
      description: 'Indulgent luxury with private river-view mini-pools in every suite.',
      features: [
        'In-room infinity plunge pools',
        'Panoramic skyline views',
        'Award-winning spa',
        'Gourmet dining experiences'
      ],
      location: 'On the Bund',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 5
    },
    {
      id: 'ritz-carlton',
      name: 'The Ritz-Carlton Shanghai',
      category: 'luxury',
      description: 'Classic opulence atop one of Shanghai\'s most prestigious buildings.',
      features: [
        'Art deco elegance',
        'Flair Rooftop Bar',
        'Michelin-starred dining',
        'World-class Club Lounge'
      ],
      location: 'Pudong, Lujiazui',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 5
    },
    {
      id: 'grand-hyatt',
      name: 'Grand Hyatt Shanghai',
      category: 'luxury',
      description: 'Sky-high luxury in the heart of Pudong\'s financial district.',
      features: [
        '54th-88th floor views',
        'Cloud 9 nightclub',
        'Stunning atrium design',
        'Premium shopping access'
      ],
      location: 'Jin Mao Tower, Pudong',
      image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 5
    },
    // Top Pick
    {
      id: 'zhotel-somekh',
      name: 'ZHotel The Somekh Building',
      category: 'top-pick',
      description: 'A stunning boutique hotel in the historic Somekh Building with perfect balance of luxury and authenticity.',
      features: [
        'Historic landmark building',
        'Stunning architectural details',
        'Perfect central location',
        'Unique blend of old and new'
      ],
      location: 'Central Shanghai',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 5
    },
    // Affordable Hotels
    {
      id: 'golden-tulip',
      name: 'Golden Tulip Bund New Asia',
      category: 'affordable',
      description: 'Excellent value with surprisingly good amenities close to the Bund.',
      features: [
        'Walking distance to the Bund',
        'Clean, modern rooms',
        'Helpful English-speaking staff',
        'Rooftop terrace'
      ],
      location: 'Near The Bund',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 4
    },
    {
      id: 'urcove-hyatt',
      name: 'UrCove by HYATT Shanghai',
      category: 'affordable',
      description: 'Hyatt\'s affordable brand with premium touches and urban convenience.',
      features: [
        'Hyatt quality at budget price',
        'Perfect location for explorers',
        'Smart room technology',
        '24-hour fitness center'
      ],
      location: 'Jing\'an District',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 4
    },
    {
      id: 'urside-hotel',
      name: 'Shanghai URSIDE Hotel',
      category: 'affordable',
      description: 'Hip, design-focused hotel that punches above its price range.',
      features: [
        'Stylish boutique feel',
        'Insta-worthy decor',
        'Cozy co-working spaces',
        'Great neighborhood vibes'
      ],
      location: 'Former French Concession',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 4
    },
    {
      id: 'blossom-house',
      name: 'Blossom House Shanghai On The Bund',
      category: 'affordable',
      description: 'Charming boutique hotel with character and excellent location.',
      features: [
        'Renovated historic building',
        '5-min walk to the Bund',
        'Comfy home-like atmosphere',
        'Local designer touches'
      ],
      location: 'Near The Bund',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      rating: 3
    }
  ]

  const filteredHotels = hotels.filter(hotel => hotel.category === activeCategory)
  
  // Helper function to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FiStar 
            key={index} 
            className={`w-3.5 h-3.5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} mr-0.5`} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="py-6">
      {/* Main Heading */}
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shanghai Hotels</h1>
      </motion.div>

      {/* Category Toggle */}
      <div className="flex justify-center mb-8">
        <motion.div 
          className="bg-white rounded-full p-1 shadow-md flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.button
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'luxury' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveCategory('luxury')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeCategory === 'luxury' && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                layoutId="categoryBackground"
                initial={false}
              />
            )}
            <span className="relative flex items-center justify-center">
              <TbBuildingSkyscraper className="mr-2" />
              Luxury
            </span>
          </motion.button>
          
          <motion.button
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'top-pick' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveCategory('top-pick')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeCategory === 'top-pick' && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                layoutId="categoryBackground"
                initial={false}
              />
            )}
            <span className="relative flex items-center justify-center">
              <FiStar className="mr-2" />
              My Top 1
            </span>
          </motion.button>
          
          <motion.button
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'affordable' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setActiveCategory('affordable')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeCategory === 'affordable' && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                layoutId="categoryBackground"
                initial={false}
              />
            )}
            <span className="relative flex items-center justify-center">
              <FiDollarSign className="mr-2" />
              Affordable
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Category Description */}
      <AnimatePresence mode="wait">
        {activeCategory === 'luxury' && (
          <motion.div 
            key="luxury-desc"
            className="mb-8 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 italic">
              "I would recommend to spend at least one night of these to snap as many photos as possible with the nightview of Shanghai"
            </p>
          </motion.div>
        )}
        
        {activeCategory === 'top-pick' && (
          <motion.div 
            key="top-pick-desc"
            className="mb-8 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 italic">
              "A stunning boutique hotel in the historic Somekh Building with perfect balance of luxury and authenticity."
            </p>
          </motion.div>
        )}
        
        {activeCategory === 'affordable' && (
          <motion.div 
            key="affordable-desc"
            className="mb-8 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 italic">
              "Budget-friendly but still impressively comfortable options for the smart traveler"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredHotels.map((hotel, index) => (
          <motion.div
            key={hotel.id}
            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
              selectedHotel === hotel.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedHotel(selectedHotel === hotel.id ? null : hotel.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            {/* Hotel Card Header with gradient overlay */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gray-800 opacity-30 z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ 
                  backgroundImage: `url(${hotel.image || (hotel.category === 'luxury' 
                    ? 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' 
                    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')})` 
                }}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-xl font-bold text-white mb-1">{hotel.name}</h3>
                <div className="flex items-center text-white text-sm">
                  <FiMapPin className="mr-1" />
                  <span>{hotel.location}</span>
                </div>
              </div>
            </div>
            
            {/* Hotel Card Body */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {renderStars(hotel.rating)}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hotel.category === 'luxury' 
                    ? 'bg-purple-100 text-purple-800' 
                    : hotel.category === 'top-pick' 
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {hotel.category === 'luxury' ? 'Luxury' : hotel.category === 'top-pick' ? 'My Top 1' : 'Affordable'}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{hotel.description}</p>
              
              {/* Features preview (only show 2, expand to show all when selected) */}
              <div className="space-y-1">
                {hotel.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <FiStar className="w-3.5 h-3.5 text-yellow-400 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="text-blue-500 text-xs font-medium pt-1">
                  {selectedHotel === hotel.id ? 'See less' : `+${hotel.features.length - 2} more features`}
                </div>
              </div>
            </div>
            
            {/* Expanded Details */}
            <AnimatePresence>
              {selectedHotel === hotel.id && (
                <motion.div 
                  ref={detailsRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 px-4 pb-4 border-t border-gray-100"
                >
                  <div className="pt-4 space-y-3">
                    <div className="flex items-start">
                      <FiCamera className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {hotel.category === 'luxury' 
                          ? 'Perfect for incredible night photography of the Shanghai skyline!'
                          : hotel.category === 'top-pick'
                            ? 'This landmark building has been beautifully renovated to showcase its historic charm.'
                            : 'Great central location makes it easy to capture the essence of Shanghai.'}
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <FiInfo className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {hotel.category === 'luxury'
                          ? 'Ask for a high floor room facing the river for the best views.'
                          : hotel.category === 'top-pick'
                            ? 'Request a room with a balcony overlooking the historic district.'
                            : 'Request a room away from the street for a quieter stay.'}
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <FiClock className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {hotel.category === 'luxury'
                          ? 'Best to visit during Shanghai\'s major festivals for special hotel offers.'
                          : hotel.category === 'top-pick'
                            ? 'My absolute favorite - book well in advance as it\'s often fully reserved.'
                            : 'Lower rates on weekdays and non-holiday seasons.'}
                      </p>
                    </div>
                    
                    {/* All features */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">All Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {hotel.features.map((feature, idx) => (
                          <motion.div 
                            key={idx}
                            className="flex items-center text-sm text-gray-600"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 mr-2">
                              <FiStar className="w-3 h-3 text-blue-600" />
                            </span>
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Book now button */}
                    <motion.button 
                      className={`mt-4 w-full py-2 rounded-lg text-white font-medium ${
                        hotel.category === 'luxury' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : hotel.category === 'top-pick'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                            : 'bg-gradient-to-r from-green-500 to-teal-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Check Availability
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}