'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiMapPin, FiInfo, FiStar, FiCamera, FiCoffee, FiMap, FiSend, FiDroplet, FiCheckCircle, FiX, FiAlertTriangle } from 'react-icons/fi'
import { GiTicket, GiSharkFin, GiSurfBoard, GiDolphin, GiJungle } from 'react-icons/gi'
import { MdOutlineRestaurant, MdFastfood, MdBedroomChild, MdLocalActivity, MdPets } from 'react-icons/md'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { LuHotel, LuWaves } from 'react-icons/lu'
import { TbCrown } from 'react-icons/tb'
import { RiShoppingBag3Line } from 'react-icons/ri'
import { BsBuilding, BsBagHeart } from 'react-icons/bs'

// Attraction type for TypeScript
interface Attraction {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  image: string;
  icon: React.ElementType;
  color: string;
}

export default function AttractionsContent() {
  const [activeAttraction, setActiveAttraction] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(detailsRef, { once: true })

  // When attraction changes, animate the details view
  useEffect(() => {
    if (activeAttraction) {
      setShowDetails(true)
      // Scroll to details after a short delay for animation
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      setShowDetails(false)
    }
  }, [activeAttraction])

  // Define attractions
  const attractions: Attraction[] = [
    {
      id: 'north-bund',
      name: 'North Bund',
      description: '🌃 The Bund vs. North Bund - Here\'s a Pro Tip!',
      highlights: [
        'Manner Coffee ☕',
        'The Little Egg 🥚',
        'Zhapu Road Bridge 🌉',
        'Shanghai Postal Museum 📮'
      ],
      image: '/attractions/wild-animal.jpg',
      icon: LuWaves,
      color: '#3b2e7e'
    },
    {
      id: 'lujiazui-towers',
      name: 'Lujiazui Three Towers',
      description: 'Shanghai\'s iconic skyscrapers that define the skyline 🌆',
      highlights: [
        'Shanghai Tower 632m 🏙️',
        'World Financial Center 492m 🏢',
        'Jin Mao Tower 420.5m 🗼',
        'Perfect Photo Spots 📸'
      ],
      image: '/attractions/wild-animal.jpg',
      icon: BsBuilding,
      color: '#1e40af'
    },
    {
      id: 'oriental-pearl',
      name: 'Oriental Pearl Tower',
      description: 'Shanghai\'s iconic TV tower with spectacular views 🗼',
      highlights: [
        'Glass Floor at 259m 😱',
        'History Museum 🏛️',
        'VR Rollercoaster 🎢',
        'Light Show 🌌'
      ],
      image: '/attractions/wild-animal.jpg',
      icon: MdLocalActivity,
      color: '#d946ef'
    },
    {
      id: 'ocean-park',
      name: 'Hai Chang Ocean Park',
      description: 'Shanghai Haichang Ocean Park: Your No-BS Guide to Maximum Fun 🐋🎢',
      highlights: [
        'Penguin Palace 🐧',
        'Sea Lion Snack Time 🦭',
        'Orca Show ⚡',
        'Iceberg Cable Car 🚡'
      ],
      image: '/attractions/ocean-park.jpg',
      icon: GiSharkFin,
      color: '#0099cc'
    },
    {
      id: 'wild-animal-park',
      name: 'Shanghai Wild Animal Park',
      description: '🐯 Shanghai Wildlife Zoo Adventure 🦁',
      highlights: [
        'Sea Lion Theater',
        'Safari Bus Ride',
        'Sun Plaza',
        'Tiger Zone'
      ],
      image: '/attractions/wild-animal.jpg',
      icon: MdPets,
      color: '#33cc66'
    },
    {
      id: 'disneyland',
      name: 'Shanghai Disneyland',
      description: '🗺️ Disney Route for Maximum Fun',
      highlights: [
        "Cinderella's Castle 🏰",
        'TRON Lightcycle',
        'Avatar Land 🌌',
        'Pirates of Caribbean'
      ],
      image: '/attractions/disney.jpg',
      icon: TbCrown,
      color: '#ff66cc'
    },
    {
      id: 'east-nanjing-road',
      name: 'City Walk East Nanjing Road',
      description: "Shanghai's most famous shopping street 🚶‍♀️",
      highlights: [
        'Lai Lai Xiao Long Bao 🥟',
        'Yuxing Ji Noodles 🍜',
        'MINISO LAND 🎨',
        'Nike 001 Store 👟'
      ],
      image: '/attractions/nanjing-road.jpg',
      icon: RiShoppingBag3Line,
      color: '#ff9933'
    },
    {
      id: 'wukang-road',
      name: 'CityWalk Wukang Road',
      description: "🏛️ Wukang Road - Shanghai's CityWalk Street with beautiful old buildings!",
      highlights: [
        'Wukang Building 🏛️',
        'The Cottage Cafe ☕',
        'Apoli Itabakery 🥐',
        'Gathering Cafe 📸'
      ],
      image: '/attractions/wukang-road.jpg',
      icon: BsBuilding,
      color: '#8e7cc3'
    },
    {
      id: 'anfu-road',
      name: 'City Walk Anfu Road',
      description: "Where trendy locals come to eat, shop, and vibe 🛍️",
      highlights: [
        'Wiggle Wiggle 🏠',
        'Brandy Melville 👗',
        'LookNow & Flow 🌟',
        '13 DE MARZO CAFÉ ☕'
      ],
      image: '/attractions/anfu-road.jpg',
      icon: BsBagHeart,
      color: '#4ade80'
    }
  ]

  // Helper function to render the formatted description
  const renderFormattedDescription = (id: string) => {
    if (id === 'north-bund') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiCamera className="text-blue-500" />
              <span>Better than The Bund! 🌃</span>
            </div>
            
            <div className="pl-4 border-l-2 border-blue-200 mb-4">
              <p className="text-gray-700">
                While The Bund is ALWAYS packed with like a million people at night (no joke! 😅), the North Bund is way more chill. The North Bund has better lighting at night, way fewer crowds, and makes for a super comfy city walk. Plus, your photos will turn out way better here! 📸 don't forget to go to Manner Coffee Shop if you are at North Bund
              </p>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiStar className="text-yellow-400" />
              <span>What's on the North Bund?</span>
            </div>
            
            <div className="space-y-6">
              {/* Manner Coffee */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">☕</span> Manner Coffee
                </h3>
                <p className="text-gray-700">
                  A coffee here will set you back about 25 yuan, but trust me - you're getting one of the best views in Shanghai! Here's what I recommend: Pick a nice weather day, get there before 4:30 PM, grab your coffee, and just chill for the whole afternoon. Bonus: It's right next to the Little Egg!
                </p>
              </motion.div>
              
              {/* The Little Egg */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🥚</span> The Little Egg
                </h3>
                <p className="text-gray-700">
                  This place is totally blowing up on social media! It's become one of those must-visit photo spots that everyone's talking about.
                </p>
              </motion.div>

              {/* Zhapu Road Bridge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌉</span> Zhapu Road Bridge
                </h3>
                <p className="text-gray-700">
                  Okay, this is such a hidden spot! If you want awesome photos with the Oriental Pearl Tower but hate crowds (who doesn't?), this is your spot! It's especially gorgeous at night. The best part? Barely anyone knows about it! ✨
                </p>
              </motion.div>
              
              {/* Shanghai Postal Museum */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">📮</span> Shanghai Postal Museum
                </h3>
                <p className="text-gray-700">
                  Not much here, it's just got a cool spot to take photos at the entrance. You can just take a snap and leave. It's one of those perfect photo spots that not many tourists know about.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="mt-4">
            <div className="bg-amber-50 p-4 rounded-lg flex items-start">
              <FiInfo className="w-5 h-5 mt-0.5 mr-3 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Pro Tip:</span> Visit during sunset for the most magical lighting for photos. The golden hour here makes the skyline glow!
              </div>
            </div>
          </div>
        </div>
      )
    } else if (id === 'lujiazui-towers') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <BsBuilding className="text-blue-600" />
              <span>Shanghai's Famous Trio 🏙️</span>
            </div>
            
            <div className="pl-4 border-l-2 border-blue-200 mb-4">
              <p className="text-gray-700">
                Shanghai's famous "Lujiazui Three Towers" - three iconic skyscrapers, these bad boys aren't just pretty to look at, they basically define Shanghai's skyline:
              </p>
            </div>
          </section>

          <section>            
            <div className="space-y-6">
              {/* Shanghai World Financial Center */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span> Shanghai World Financial Center
                </h3>
                <p className="text-gray-700">
                  This 492m tall giant with 101 floors opened in 2008.
                </p>
              </motion.div>
              
              {/* Jin Mao Tower */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span> Jin Mao Tower
                </h3>
                <p className="text-gray-700">
                  Standing at 420.5m with 88 floors (93 if you count the spike!), this 1999-built beauty still looks fresh af
                </p>
              </motion.div>

              {/* Shanghai Tower */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span> Shanghai Tower
                </h3>
                <p className="text-gray-700">
                  The tallest of the bunch at 632m (completed 2013)
                </p>
              </motion.div>
            </div>
          </section>

          <div className="mt-4">
            <div className="bg-amber-50 p-4 rounded-lg flex items-start">
              <FiInfo className="w-5 h-5 mt-0.5 mr-3 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Photo Tip:</span> Together they make the perfect skyline set for Shanghai 🌆. Best viewed from The Bund at night when they're all lit up!
              </div>
            </div>
          </div>
        </div>
      )
    } else if (id === 'oriental-pearl') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <GiTicket className="text-purple-500" />
              <span>🎟️ Ticket Hacks</span>
            </div>
            
            <div className="pl-4 border-l-2 border-purple-200 mb-4">
              <p className="text-gray-700">
                "Two-Sphere Pass" (¥199) is the sweet spot - so get the Two-Sphere Pass and tell the third sphere pass to fuck right off – that ¥99 upgrade, um... up to you. Pro move: Enter around 5PM ⏰ to avoid crowds and catch day-night views.
              </p>
              <p className="text-gray-700 mt-2 font-medium">
                Btw🍔: Eat beforehand
              </p>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiMap className="text-blue-500" />
              <span>Route 🚀</span>
            </div>
            
            <div className="space-y-6">
              {/* 263m Observatory */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-purple-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">1️⃣</span> 263m Observatory
                </h3>
                <p className="text-gray-700">
                  Take the elevator up to 263m observatory first - take a few snaps 🏙️📸
                </p>
              </motion.div>
              
              {/* Glass Floor */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-purple-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">2️⃣</span> Glass Floor at 259m
                </h3>
                <p className="text-gray-700">
                  Descend to 259m's glass floor - "Oh shit I can see my future down there!" moment.
                </p>
              </motion.div>
              
              {/* History Museum */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-purple-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">3️⃣</span> Shanghai History Museum
                </h3>
                <p className="text-gray-700">
                  Ground Level Secret: Shanghai History Museum (way cooler than your middle school field trip, I swear)
                </p>
              </motion.div>
              
              {/* VR Rollercoaster */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-purple-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">4️⃣</span> VR Rollercoaster
                </h3>
                <p className="text-gray-700">
                  At 95m: VR rollercoaster 🎢 tbh, quite fun for a 3mins experience
                </p>
              </motion.div>
              
              {/* Light Show */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="bg-purple-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">5️⃣</span> Light Show
                </h3>
                <p className="text-gray-700">
                  Descend to 78m for light show 🌌 before returning to the ground. It's trippy AF visuals that make you question if you accidentally ate shrooms earlier 🌌
                </p>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="text-yellow-500" />
              <span>Pro Tips 💡</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-gray-700">Comfy shoes &gt;&gt; fashion shoes 👟 Your feet will thank you</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-gray-700">Overall? Worth the hype, views+experiences make Shanghai feel like a real-good city</p>
              </div>
            </div>
          </section>

          <div className="mt-4">
            <div className="bg-amber-50 p-4 rounded-lg flex items-start">
              <FiInfo className="w-5 h-5 mt-0.5 mr-3 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Bonus local secret 🤫:</span> The tower looks best FROM it, not AT it - snap your skyline pics from the Bund later!
              </div>
            </div>
          </div>
        </div>
      )
    } else if (id === 'ocean-park') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiStar className="text-yellow-400" />
              <span>Must-Go or STFU 🏆</span>
            </div>
            
            <div className="space-y-6">
              {/* Penguin Palace */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🐧</span> Penguin Palace
                </h3>
                <p className="text-gray-700">
                  Holy moly, the 360° "Penguin Fishbowl" is massive. It&apos;s like a big-ass glass where you can see through the penguins. Pro tip: Bring a jacket – it&apos;s colder than my ex&apos;s heart in there ❄️
                </p>
              </motion.div>
              
              {/* Sea Lion */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🦭</span> Sea Lion Snack Time
                </h3>
                <p className="text-gray-700">
                  Watch these chonky bois flip for fish snacks! Feeding sessions are limited – check times early or you&apos;ll be crying into your popcorn 🍿
                </p>
              </motion.div>

              {/* Orca Show */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">⚡</span> Orca Show
                </h3>
                <p className="text-gray-700">
                  Mind = blown. These black-and-white torpedoes make Shamu look basic. Sit upfront if you wanna get wet (and I don&apos;t mean emotionally). Bonus: Nerd out in the Q&A – I aced it like a boss 😎
                </p>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiMap className="text-blue-500" />
              <span>Getting Around 🚡</span>
            </div>
            
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-blue-200">
                <p className="text-gray-700">
                  Iceberg Cable Car = Best 50¥ you&apos;ll spend. 20-min ride with views so good you&apos;ll forget you&apos;re still in Shanghai.
                </p>
                <p className="text-gray-700 mt-2">
                  Pro tip: Wave at the dolphins below – they won&apos;t wave back but it&apos;s cute to try 🐬
                </p>
                <p className="text-gray-700 mt-2">
                  4D Cinema – Chair throws you around like a bad Tinder date 💺😅
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <MdOutlineRestaurant className="text-orange-500" />
              <span>Food Situation 🍔</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-medium">Burger King = Your wallet&apos;s BFF.</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-medium">Penguin Cafe 🐧❄️ = Pricey but worth it for the Antarctica vibes. Eating while penguins judge your life choices? Priceless.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <LuHotel className="text-indigo-500" />
              <span>Sleep 😴</span>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-4">
              <h3 className="font-medium">Haichang Hotel (500-800¥/night)</h3>
              <p className="text-gray-700 mt-1">
                Clean beds, free shuttle, and ZERO guilt about wearing pajamas to breakfast. 10/10 would snooze again 🛌💤
              </p>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="text-yellow-500" />
              <span>Pro Tips 💡</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                <p>FastPass for sure if you see crowds – your time &gt; money when Karens are involved</p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                <p>Staff offering interactions? SAY YES! Free souvenirs &gt; pride</p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                <p>Pack snacks – eat while you wait in line</p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiX className="text-red-500" />
              <span>Skip These 🚫</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <FiX className="text-red-500 flex-shrink-0 mt-1" />
                <p>Explorer Canoe – Sunburn simulator 2024 ☀️🔥</p>
              </div>
              <div className="flex gap-2">
                <FiX className="text-red-500 flex-shrink-0 mt-1" />
                <p>Park meals – Longer lines than Taylor Swift tickets 🎫</p>
              </div>
              <div className="flex gap-2">
                <FiX className="text-red-500 flex-shrink-0 mt-1" />
                <p>Street vendors – Ignore them, their stuffed animals pretty bad qualities in my POV</p>
              </div>
            </div>
          </section>

          <div className="mt-4 text-center">
            <p className="text-gray-600 italic">Got Qs? Slide into my comments like you&apos;re stealing home base ⚾❤️</p>
          </div>
        </div>
      )
    } else if (id === 'wild-animal-park') {
      return (
        <div className="space-y-5 my-2">
          <motion.section 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 rounded-xl p-4"
          >
            <p className="text-gray-700">
              First stop? Sea Lion Theater – those little dudes are straight-up adorable! 🤣 Watching them clap, you can even wave at them, they won&apos;t wave back at you. Rmb to stick around after the show, you might be able to snap a selfie with them
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 rounded-xl p-4"
          >
            <p className="text-gray-700">
              Next up: Safari Bus Ride, saw tigers and lions, and bears being... well, bear-y scary. Felt like I was in a National Geographic episode (but with AC, thank god). 🐅👑
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 rounded-xl p-4"
          >
            <p className="text-gray-700">
              Lunchtime at Sun Plaza, but I packed my own food.
            </p>
          </motion.section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiStar className="text-yellow-400" />
              <span>Pro Tips 🔥</span>
            </div>
            
            <div className="pl-4 border-l-2 border-green-200 space-y-3">
              <p className="text-gray-700">
                2️⃣ BYO snacks unless you wanna sell a kidney for zoo fries 🍟💸
              </p>
              <p className="text-gray-700">
                3️⃣ Long lens = mandatory for dope animal pics. Your phone camera ain&apos;t cuttin&apos; it 📷🐆
              </p>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiAlertTriangle className="text-amber-500" />
              <span>Avoid These Mistakes 💩</span>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-xl space-y-3">
              <div className="flex gap-2">
                <FiX className="text-red-500 flex-shrink-0 mt-1" />
                <p>Weekends = human zoo. Go weekday mornings!</p>
              </div>
              <div className="flex gap-2">
                <FiX className="text-red-500 flex-shrink-0 mt-1" />
                <p>Safari bus lines get stupid long – hit it early!</p>
              </div>
            </div>
          </section>

          <div className="mt-4 text-center">
            <p className="text-gray-700 font-medium">Overall? Helluva fun day! 10/10 👌</p>
            <p className="text-gray-600 italic mt-2">Yo if this helped, smash that like button! ❤️❤️ Catch ya on the flip side! ✌️</p>
          </div>
        </div>
      )
    } else if (id === 'disneyland') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiCamera className="text-purple-500" />
              <span>Picture taking Gold Spots 📸</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-purple-50 rounded-lg p-3"
              >
                <p className="font-medium">🔸 Cinderella&apos;s Castle 🏰</p>
                <p className="text-gray-600 text-sm">Basic bitch photo op that&apos;s somehow still magical at 3AM</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-50 rounded-lg p-3"
              >
                <p className="font-medium">🔸 Little Mermaid Show 🐚</p>
                <p className="text-gray-600 text-sm">Watch Ursula roast everyone in the audience (not really, but she should)</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-purple-50 rounded-lg p-3 md:col-span-2"
              >
                <p className="font-medium">🔸 Avatar Land 🌌</p>
                <p className="text-gray-600 text-sm">Blue people territory. Those floating mountains? Worth the 2-hour line. Maybe.</p>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <MdLocalActivity className="text-pink-500" />
              <span>Ride Lowdown 🎢</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="font-medium">TRON Lightcycle</p>
                <p className="text-gray-600 text-sm">Hold onto your Mickey ears or lose them</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="font-medium">Pirates of Caribbean</p>
                <p className="text-gray-600 text-sm">Best nap spot (just kidding... kinda)</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="font-medium">Peter Pan&apos;s Flight</p>
                <p className="text-gray-600 text-sm">Nostalgia overdose in 4 minutes</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="font-medium">Seven Dwarfs Mine Train</p>
                <p className="text-gray-600 text-sm">Baby&apos;s first rollercoaster</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-3 md:col-span-2">
                <p className="font-medium">Buzz Lightyear</p>
                <p className="text-gray-600 text-sm">Shoot lasers like you&apos;re 5 years old again (because you are now)</p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <MdLocalActivity className="text-indigo-500" />
              <span>Shows That Don&apos;t Suck 🎭</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="font-medium">Lion King Musical</p>
                <p className="text-gray-600 text-sm">Circle of Life with actual fire 🔥</p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="font-medium">Mickey&apos;s Storybook</p>
                <p className="text-gray-600 text-sm">Disney&apos;s greatest hits on speed</p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="font-medium">Jack Sparrow Stunt Show</p>
                <p className="text-gray-600 text-sm">Drunk pirate simulator (PG version)</p>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <MdFastfood className="text-yellow-500" />
              <span>Food Court Confessions 🍔</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span>🧇</span>
                </div>
                <div>
                  <p className="font-medium">Mickey waffles</p>
                  <p className="text-gray-600 text-sm">Breakfast of champions (who can&apos;t cook)</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span>🍗</span>
                </div>
                <div>
                  <p className="font-medium">Turkey legs</p>
                  <p className="text-gray-600 text-sm">Medieval-sized meat sweats</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span>🧋</span>
                </div>
                <div>
                  <p className="font-medium">Bubble tea in light-up cups</p>
                  <p className="text-gray-600 text-sm">Because adulting is hard</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )
    } else if (id === 'east-nanjing-road') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiMapPin className="text-orange-400" />
              <span>Pro Tip 💡</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-orange-50 rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-700">
                Come here at night when all the neon signs are lit up
              </p>
            </motion.div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="text-yellow-500" />
              <span>Insider Tips 💡</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <p className="text-gray-700">
                  The street gets SUPER packed on weekends and holidays (like, can-barely-move packed!)
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <p className="text-gray-700">
                  Best time to visit? Late afternoon till night
                </p>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <MdOutlineRestaurant className="text-orange-500" />
              <span>What's on this street:</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🥟</span> Lai Lai Xiao Long Bao
                </h3>
                <p className="text-gray-700">
                  It's my number 1 go to places for Xiao Long Bao, aka soup dumplings. If you're new to xiaolongbao, this place is a MUST.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🍜</span> Yuxing Ji Noodles
                </h3>
                <p className="text-gray-700">
                  Super well-known for their crab noodles, another must try 🦀🦀🦀
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🎨</span> MINISO LAND
                </h3>
                <p className="text-gray-700">
                  This isn't your regular MINISO store - it's MINISO on steroids! 😍
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.7 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">👗</span> W Management
                </h3>
                <p className="text-gray-700">
                  This is where all the fashion-forward people shop! Perfect for updating your wardrobe with some Asian style! ✨
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🥮</span> Shen DaCheng
                </h3>
                <p className="text-gray-700">
                  Famous for traditional Shanghai snacks and pastries. Pro tip: Get some to take home as souvenirs - way better than generic tourist stuff!
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.9 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🍫</span> M&M's Store
                </h3>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1.0 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">👟</span> Nike 001 (@nike001)
                </h3>
                <p className="text-gray-700">
                  Asia's biggest NIKE store, for the bois!
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1.1 }}
                className="bg-orange-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🎮</span> TOP TOY (@toptoyshanghai)
                </h3>
                <p className="text-gray-700">
                  also for the bois!
                </p>
              </motion.div>
            </div>
          </section>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 italic">Remember: This street gets PACKED, but that's part of the authentic Shanghai shopping experience! Just go with the flow and have fun! 🌈</p>
          </div>
        </div>
      )
    } else if (id === 'wukang-road') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiCamera className="text-purple-500" />
              <span>About This Street 📸</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-purple-50 rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-700">
                It's got the beautiful old buildings and a mix of Shanghai vibes 📸📸📸
              </p>
            </motion.div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiMapPin className="text-blue-500" />
              <span>🚶‍♀️ Best Time to Visit</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm"
              >
                <p className="text-gray-700">
                  Early morning is THE time to visit if you want those perfect shots without crowds 👌 But honestly, the street has a different vibe at each time of day:
                </p>
                <div className="mt-3 pl-4 border-l-2 border-blue-200 space-y-2">
                  <p className="text-gray-700">Morning = peaceful + perfect lighting</p>
                  <p className="text-gray-700">Afternoon = busy but super lively</p>
                  <p className="text-gray-700">Evening = romantic vibes with all the restaurant lights on</p>
                </div>
              </motion.div>
            </div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiStar className="text-yellow-500" />
              <span>Top 5 Popular Places</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🏛️</span> 武康大楼 Wukang Building
                </h3>
                <p className="text-gray-700">
                  It looks like a giant ship and was actually designed by a Hungarian architect, very historical
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">☕</span> 老麦咖啡馆 The Cottage Cafe (inside Wukang Building)
                </h3>
                <p className="text-gray-700">
                  🌟 Grab a seat by the window on the second floor. Trust me on this - you can watch all the tourists and cars buzzing around below while feeling like you're the boss.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🥐</span> Apoli Itabakery
                </h3>
                <p className="text-gray-700">
                  They have like a MILLION different kinds of bread and pastries
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">☕</span> Gathering Cafe
                </h3>
                <p className="text-gray-700">
                  This place is straight-up VIBES! ☕ Order your fave coffee, hang out until sunset, chat with your friends, and snap some photos. It's literally the definition of a perfect afternoon! 📸
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.7 }}
                className="bg-yellow-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">👗</span> Subdued
                </h3>
                <p className="text-gray-700">
                  👗 This Italian brand is super popular with the younger crowd. If you're into cute, trendy clothes with that European flair, you've got to check it out!
                </p>
              </motion.div>
            </div>
          </section>
          
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="text-orange-500" />
              <span>Quick Tips 💡</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                <p>🔥 The cafes here can get pretty packed on weekends, so try coming on a weekday if you can!</p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                <p>🔥 Plan to spend at least 2-3 hours here if you want to really soak it all in</p>
              </div>
            </div>
          </section>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 italic">This is one of Shanghai's most photogenic streets - make sure your phone is charged! 📱</p>
          </div>
        </div>
      )
    } else if (id === 'anfu-road') {
      return (
        <div className="space-y-6 my-2">
          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <FiInfo className="text-green-500" />
              <span>About This Street</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-green-50 rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-700">
                Anfu Road is basically where all the trendy locals come to eat, shop, and just vibe. It's like the perfect mix of cute cafes and cute shops!
              </p>
            </motion.div>
          </section>

          <section>
            <div className="text-xl font-bold flex items-center gap-2 mb-3">
              <RiShoppingBag3Line className="text-green-600" />
              <span>🛍️ Top 6 Shopping Spots</span>
            </div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-green-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌟</span> Wiggle Wiggle
                </h3>
                <p className="text-gray-700">
                  FOUR FLOORS of cute stuff! 🏠 an hour isn't enough to see everything! They've got the most adorable home and lifestyle stuff ever.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-green-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌟</span> Brandy Melville
                </h3>
                <p className="text-gray-700">
                  They've got TONS of styles here, but mostly Asian fashion trends! If you're tired of the same old American styles, this is your chance to switch things up.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-green-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌟</span> LookNow & Flow
                </h3>
                <p className="text-gray-700">
                  It's one of those perfect lifestyle concept stores where everything is just aesthetic.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="bg-green-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌟</span> Sunflour Bakery
                </h3>
                <p className="text-gray-700">
                  Their pastries are pretty decent ngl.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }}
                className="bg-green-50 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <span className="text-xl">🌟</span> 13 DE MARZO CAFÉ
                </h3>
                <p className="text-gray-700">
                  This place isn't just about great coffee - it's about the whole experience. You can go to their rooftop and take photos of Shanghai, quite cool tbh
                </p>
              </motion.div>
            </div>
          </section>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 italic">Come ready to shop and eat your heart out! And maybe bring an extra bag for all your purchases... 👜✨</p>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div className="py-6">
      {/* Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Top Attractions in Shanghai
      </motion.h1>
      
      {/* Attractions Cards */}
      <div className="grid grid-cols-1 gap-4">
        {attractions.map((attraction, index) => (
          <motion.div
            key={attraction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl shadow-md bg-white cursor-pointer`}
            onClick={() => setActiveAttraction(activeAttraction === attraction.id ? null : attraction.id)}
            style={{
              borderLeft: `4px solid ${attraction.color}`
            }}
          >
            <div className="flex p-4 items-center">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4" 
                style={{ backgroundColor: `${attraction.color}20` }}
              >
                <attraction.icon size={24} style={{ color: attraction.color }} />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-bold">{attraction.name}</h2>
                <p className="text-gray-600 text-sm">{attraction.description}</p>
              </div>
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: activeAttraction === attraction.id ? 180 : 0 }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <FiSend className="transform rotate-90" />
                </motion.div>
              </div>
            </div>
            
            {/* Highlights */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {attraction.highlights.map((highlight, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${attraction.color}15`,
                      color: attraction.color 
                    }}
                  >
                    {highlight}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attraction Details */}
      <AnimatePresence>
        {activeAttraction && showDetails && (
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg p-5">
              {/* Header */}
              {attractions.find(a => a.id === activeAttraction) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${attractions.find(a => a.id === activeAttraction)?.color}20` 
                      }}
                    >
                      {React.createElement(attractions.find(a => a.id === activeAttraction)?.icon as React.ElementType, {
                        size: 20,
                        color: attractions.find(a => a.id === activeAttraction)?.color
                      })}
                    </motion.div>
                    <h2 className="text-xl font-bold">{attractions.find(a => a.id === activeAttraction)?.name}</h2>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="ml-auto bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      Highly Recommend
                    </motion.div>
                  </div>

                  <p className="text-gray-600 mt-2">{attractions.find(a => a.id === activeAttraction)?.description}</p>
                </div>
              )}

              {/* Content */}
              {renderFormattedDescription(activeAttraction)}
              
              {/* Close button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveAttraction(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 font-medium flex items-center gap-2"
                >
                  <FiX size={16} />
                  Close details
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 