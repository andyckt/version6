'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiMapPin, FiClock, FiCoffee, FiZap, FiTrendingUp, FiSun, FiMoon, FiCamera, FiAlertTriangle } from 'react-icons/fi'
import { MdDirectionsSubway, MdOutlineDirectionsCar } from 'react-icons/md'
import { PiCoffeeFill, PiCastleTurret } from 'react-icons/pi'
import { HiOutlineLightBulb } from 'react-icons/hi'

export default function ShanghaiTipsContent() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="py-6 pb-20">
      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-center">Shanghai Tips</h2>
        <p className="text-center text-gray-500 mt-2">Local insider knowledge to level up your Shanghai visit</p>
      </motion.div>

      {/* Tips cards container */}
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* North Bund Tip */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiMapPin className="text-blue-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">North Bund &gt; The Bund 🌃</h3>
              <p className="text-gray-700 leading-relaxed">
                Skip the big crowd at <span className="text-blue-600 font-medium">@thebund</span>! Head to North Bund for 10x better experience 🌉 <em>and</em> night views – way better photo spots 📸. You'll actually get to see the skyline without 10,000 people in your shot! 🙅♂️
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disney Tip */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-purple-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <PiCastleTurret className="text-purple-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-purple-800">Disneyland Fast Pass = Lifesaver 🏰💨</h3>
              <p className="text-gray-700 leading-relaxed">
                Made a huge mistake - didn't get the Disney Speed Pass 😭. Spent 2+ hours in line for Tron Lightcycle (legs still crying after standing 🦵💢).
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Hot tip: VIP access is worth every dollar 💸 when you see the VIP people walk past you!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Nightview Show Schedule */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <HiOutlineLightBulb className="text-amber-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-amber-800">Nightview Show Schedule 💡✨</h3>
              <ul className="space-y-2 ml-1 mt-3">
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiSun className="text-amber-500 mr-2" /> 
                  <span>The Bund lights up: 6PM 🕕</span>
                </motion.li>
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiMoon className="text-indigo-500 mr-2" /> 
                  <span>Lights out: 10PM 🕙</span>
                </motion.li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Lujiazui Tip */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FiTrendingUp className="text-teal-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-teal-800">Lujiazui Three Towers <span className="text-teal-600">@threetowers</span></h3>
              <p className="text-gray-700 leading-relaxed">
                Pro tip: Hit up Lujiazu Three Towers (those crazy skyscrapers 🏙️) during dark time – looks <em>straight fire</em> at night🌃
              </p>
            </div>
          </div>
        </motion.div>

        {/* Coffee View Tip */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-orange-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiCoffee className="text-orange-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-orange-800">Coffee with a View ☕️📸</h3>
              <p className="text-gray-700 leading-relaxed">
                Those Insta-famous window seats? Need reservations. But psst... the whole floor usually has free photo spots 🤫📸 (they just don't advertise it!)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transport Tips */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-red-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <MdDirectionsSubway className="text-red-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-red-800">Transport Truths 🚇🚦</h3>
              <p className="text-gray-700 leading-relaxed">
                The metro in Shanghai pretty much goes everywhere 🗺️ – anything within walking distance, I'd recommend walking 👟
              </p>
              
              <div className="mt-3 bg-white/50 p-3 rounded-lg border border-red-100">
                <p className="font-medium text-red-700 mb-2">Taxis? 🚖 Save yourself the headache:</p>
                <ul className="space-y-2">
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiAlertTriangle className="text-orange-500 mt-1 mr-2 flex-shrink-0" /> 
                    <span>Waiting times feel longer than a K-pop concert line 🎤</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiAlertTriangle className="text-orange-500 mt-1 mr-2 flex-shrink-0" /> 
                    <span>Traffic is damn bad 🚗💨 especially during weekends, weekdays rush hours when everyone gets off work 🏢→🏠</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FiAlertTriangle className="text-orange-500 mt-1 mr-2 flex-shrink-0" /> 
                    <span>Rush hour (7-9AM & 5-7PM) = Actual parking lots on roads 🅿️</span>
                  </motion.li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coffee Culture */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150"></div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-cyan-100 p-2 rounded-lg">
              <PiCoffeeFill className="text-cyan-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-cyan-800">Coffee Culture in Shanghai 💸🇨🇳</h3>
              <p className="text-gray-700 leading-relaxed">
                Ditch Starbucks - locals are all about Luckin Coffee (from $1.50!) or Manner Coffee, it's everywhere in China ☕️📍
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-gray-500 italic mt-8"
        >
          <p>
            <em>I will keep updating this page, stay tuned :) 👀</em>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
} 