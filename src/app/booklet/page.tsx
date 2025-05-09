'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBookOpen, FiMapPin, FiStar, FiCoffee, FiShoppingBag, FiMoon, FiHome, FiWind, FiMusic, FiInfo, FiChevronLeft } from 'react-icons/fi'

// Dynamically import content components with loading fallbacks
const WelcomeContent = dynamic(() => import('@/components/WelcomeContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const ShanghaiTipsContent = dynamic(() => import('@/components/ShanghaiTipsContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const FoodSpotsContent = dynamic(() => import('@/components/FoodSpotsContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const AttractionsContent = dynamic(() => import('@/components/AttractionsContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const FashionSpotsContent = dynamic(() => import('@/components/FashionSpotsContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const HotelContent = dynamic(() => import('@/components/HotelContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const ChineseSpaContent = dynamic(() => import('@/components/ChineseSpaContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const GetDrunkContent = dynamic(() => import('@/components/GetDrunkContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})
const NightClubsContent = dynamic(() => import('@/components/NightClubsContent'), {
  loading: () => <div className="py-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div><div className="h-24 bg-gray-100 rounded"></div></div>
})

export default function Booklet() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants for buttons
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    }
  }

  // Define button backgrounds and styles
  const buttonStyles = [
    { bg: "from-blue-500 to-indigo-600", iconBg: "bg-indigo-400", shadow: "shadow-blue-500/25" },
    { bg: "from-green-500 to-teal-600", iconBg: "bg-teal-400", shadow: "shadow-green-500/25" },
    { bg: "from-orange-500 to-amber-600", iconBg: "bg-amber-400", shadow: "shadow-orange-500/25" },
    { bg: "from-purple-500 to-pink-600", iconBg: "bg-pink-400", shadow: "shadow-purple-500/25" },
    { bg: "from-red-500 to-rose-600", iconBg: "bg-rose-400", shadow: "shadow-red-500/25" },
    { bg: "from-cyan-500 to-blue-600", iconBg: "bg-blue-400", shadow: "shadow-cyan-500/25" },
    { bg: "from-violet-500 to-purple-600", iconBg: "bg-purple-400", shadow: "shadow-violet-500/25" },
    { bg: "from-fuchsia-500 to-purple-600", iconBg: "bg-purple-400", shadow: "shadow-fuchsia-500/25" },
    { bg: "from-emerald-500 to-teal-600", iconBg: "bg-teal-400", shadow: "shadow-emerald-500/25" },
  ]

  const buttons = [
    {
      id: 'welcome',
      label: 'Welcome,\nRead This First!',
      icon: FiBookOpen,
    },
    {
      id: 'shanghai-tips',
      label: 'Shanghai Tips',
      icon: FiInfo,
    },
    {
      id: 'food-spots',
      label: 'Best Spots to Eat',
      icon: FiCoffee,
    },
    {
      id: 'attractions',
      label: 'Attractions',
      icon: FiMapPin,
    },
    {
      id: 'get-drunk',
      label: 'Get Drunk',
      icon: FiWind,
    },
    {
      id: 'nightclubs',
      label: 'Nightclubs',
      icon: FiMusic,
    },
    {
      id: 'chinese-spa',
      label: 'Must-try Chinese Overnight Spa',
      icon: FiMoon,
    },
    {
      id: 'hotels',
      label: 'Hotels',
      icon: FiHome,
    },
    {
      id: 'fashion-spots',
      label: 'Fashion & Shopping',
      icon: FiShoppingBag,
    },
  ]

  // Prefetch component for active section
  useEffect(() => {
    if (activeSection) {
      // Dynamically prefetch the active content
      import(`@/components/${activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}Content`);
    }
  }, [activeSection]);

  return (
    <main className="pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-md transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-md' : 'bg-white'}`}>
        <div className="container-app">
          <div className="flex items-center justify-between py-4">
            <AnimatePresence mode="wait">
              {activeSection ? (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setActiveSection(null)}
                  className="flex items-center space-x-2 text-primary font-medium"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  <span>Back to booklet</span>
                </motion.button>
              ) : (
                <motion.h1 
                  key="page-title"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
                >
                  Travel Booklet
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app px-4 md:px-8">
          <AnimatePresence mode="wait">
            {!activeSection ? (
              <motion.div 
                key="button-grid"
                className="py-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              >
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {buttons.map((button, index) => {
                    const style = buttonStyles[index % buttonStyles.length];
                    
                    return (
                      <motion.button
                        key={button.id}
                        variants={itemVariants}
                        onClick={() => setActiveSection(button.id)}
                        className={`relative overflow-hidden rounded-2xl p-4 text-left text-white bg-gradient-to-br ${style.bg} ${style.shadow} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mt-8 -mr-8 transition-transform duration-500 group-hover:scale-150" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-black/5 -mb-6 -ml-6" />
                        
                        <div className="flex flex-col items-center text-center relative z-10">
                          <div className={`p-3 rounded-xl ${style.iconBg} bg-opacity-30 mb-3`}>
                            <button.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1">{button.label.split('\n').map((text, i) => (
                              <span key={i} className="block">{text}</span>
                            ))}</h3>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="pt-2"
              >
                {activeSection === 'welcome' && <WelcomeContent />}
                {activeSection === 'shanghai-tips' && <ShanghaiTipsContent />}
                {activeSection === 'food-spots' && <FoodSpotsContent />}
                {activeSection === 'attractions' && <AttractionsContent />}
                {activeSection === 'fashion-spots' && <FashionSpotsContent />}
                {activeSection === 'hotels' && <HotelContent />}
                {activeSection === 'chinese-spa' && <ChineseSpaContent />}
                {activeSection === 'get-drunk' && <GetDrunkContent />}
                {activeSection === 'nightclubs' && <NightClubsContent />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  )
} 