'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMoon, FiInfo, FiClock, FiStar, FiDollarSign, FiPhoneCall, FiAlertTriangle, FiCheck, FiMapPin } from 'react-icons/fi'
import { LuBath, LuBed } from 'react-icons/lu'
import { GiWaterSplash, GiSteamBlast, GiFootprint } from 'react-icons/gi'
import { MdOutlineSpa, MdShower } from 'react-icons/md'
import { TbMassage } from 'react-icons/tb'

export default function ChineseSpaContent() {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="py-3">
      {/* Beginner Guide Accordion */}
      <div className="mb-6 bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full p-4 flex items-center justify-between font-semibold text-gray-800 bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <div className="flex items-center">
            <MdOutlineSpa className="h-5 w-5 text-blue-600 mr-2" />
            <span>Beginner Guide to Chinese Overnight Spas</span>
          </div>
          <div className={`transform transition-transform ${showGuide ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {showGuide && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            <div className="flex gap-3 mb-5">
              <MdOutlineSpa className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">What are Chinese overnight spas?</h3>
                <p className="text-gray-700 mt-1">
                  These 24-hour bathhouses are a uniquely Chinese experience where you can soak in hot pools, get massages, enjoy snacks, and even spend the night for less than a hotel room! They're super popular with locals and make for an authentic cultural experience.
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FiInfo className="mr-2 text-blue-500" />
                What to expect:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-sm"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -4px rgba(59, 130, 246, 0.2)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center mb-2">
                    <MdShower className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Bathing Areas</span>
                  </div>
                  <p className="text-sm text-gray-600">Gender-separated bathing zones with hot/cold pools and showers.</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-sm"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -4px rgba(59, 130, 246, 0.2)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center mb-2">
                    <LuBed className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Sleeping Areas</span>
                  </div>
                  <p className="text-sm text-gray-600">Common sleeping rooms with mats or heated stone beds.</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-sm"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -4px rgba(59, 130, 246, 0.2)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center mb-2">
                    <TbMassage className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Massage Services</span>
                  </div>
                  <p className="text-sm text-gray-600">From budget foot massages to premium full-body treatments.</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-sm"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -4px rgba(59, 130, 246, 0.2)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center mb-2">
                    <GiSteamBlast className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Sauna & Steam</span>
                  </div>
                  <p className="text-sm text-gray-600">Various temperature rooms for detoxing and relaxation.</p>
                </motion.div>
              </div>
            </div>

            {/* Tips for first-timers */}
            {/* <div className="mt-4 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-3">Tips for First-Timers:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FiStar className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Bring clean clothes for after your bath and to sleep in.</span>
                </li>
                <li className="flex items-start">
                  <FiStar className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Don't be shy! Most locals are used to foreigners and will help if needed.</span>
                </li>
                <li className="flex items-start">
                  <FiStar className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Take photos of the price list on your phone to avoid language confusion.</span>
                </li>
                <li className="flex items-start">
                  <FiStar className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Earplugs and an eye mask can be lifesavers in the common sleeping areas.</span>
                </li>
                <li className="flex items-start">
                  <FiStar className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Entry fees are usually paid upfront, and services are charged to your wristband.</span>
                </li>
              </ul>
            </div> */}
          </motion.div>
        )}
      </div>

      {/* Main Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Must-try Chinese Overnight Spa</h1>
        <h2 className="text-lg text-gray-600 italic">cheaper than staying at a hotel</h2>
      </div>

      {/* Top Recommendation */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4 border-b border-blue-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
              <FiStar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Shui Guo Spa</h3>
              <div className="flex items-center mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">Top 1 Overnight Spa</span>
                <span className="text-gray-600 text-sm ml-2">highly recommend</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 italic mt-3 text-lg font-medium">"Where else can you soak, snack, and snooze like royalty without breaking the bank?"</p>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            {/* Spa 101 */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🌈🫧</span> Spa 101 <span className="text-lg ml-2">🧼</span>
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🛁</span>
                  <span>Bubble baths that make you feel like human soup dumpling 🥟</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🔥</span>
                  <span>Sauna sessions where you'll sweat out your life choices 💦</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍦</span>
                  <span>Unlimited Häagen-Dazs (eat your feelings!)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍒</span>
                  <span>Fruit buffet with JJJ-grade cherries – take that, Whole Foods!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🧦</span>
                  <span>Secret hack: Ask staff for free socks (way comfier than your ex's hoodie)</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Pro Tips */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🚨</span> Pro Tips <span className="text-lg ml-2">💥</span>
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🦀</span>
                  <span>Come hungry – their crab dishes slap harder than my sleep schedule</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🕶️</span>
                  <span>Weekday afternoons = empty game arcade = unlimited selfies with cute staff 👫</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">😴</span>
                  <span>BYO eye mask – the "sleeping pods" glow like Vegas at night 🌃</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">👙</span>
                  <span>PSA for lazy queens: They've got EVERYTHING – even nipple covers?!</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Game Zone */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🎮</span> Game Zone Lowdown <span className="text-lg ml-2">🏆</span>
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🏒</span>
                  <span>Ice hockey table that'll make you feel like Olympic material (until you lose)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🏀</span>
                  <span>Basketball machine = instant arm workout 💪 (RIP my biceps next day)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🧸</span>
                  <span>Claw machines stocked with plushies cuter than baby pandas</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Overnight Survival Guide */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🌙</span> Overnight Survival Guide <span className="text-lg ml-2">⛺</span>
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🛏️</span>
                  <span>Thin mattresses + strangers' snores = "spa camping" experience</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🏃♀️</span>
                  <span>Claim your nest early – prime real estate goes fast!</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🧘♂️</span>
                  <span>2AM life hack: Earplugs + eye mask = instant zen master</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
          
          {/* Why We Stan */}
          <motion.div 
            className="mt-4 bg-white rounded-lg shadow-sm p-4"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.1), 0 8px 10px -6px rgba(244, 114, 182, 0.1)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
              <span className="text-lg mr-2">🌟</span> Why We Stan <span className="text-lg ml-2">💖</span>
            </h4>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <span className="text-lg mr-2 flex-shrink-0">👩🍳</span>
                <span>Staff hotter than the sauna (and actually helpful!) 🔥</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <span className="text-lg mr-2 flex-shrink-0">💄</span>
                <span>Fancy toiletries that make you feel bougie on a budget 💅</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <span className="text-lg mr-2 flex-shrink-0">🕛</span>
                <span>24/7 fruit bar – because midnight cherries fix everything 🍒</span>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Final Verdict */}
          <motion.div 
            className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(124, 58, 237, 0.15)",
              background: "linear-gradient(to right, #e0f2fe, #f3e8ff)",
              borderColor: "#c7d2fe"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.p 
              className="font-bold text-gray-800 flex items-center mb-2"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
            >
              <span className="text-lg mr-2">🎯</span>
              <span>Final Verdict:</span>
            </motion.p>
            <p className="text-gray-700 text-lg">This spot is basically adult Disneyland – come for the baths, stay for the chaos. Just don't blame me when you're addicted to their coconut water! 🥥</p>
          </motion.div>
        </div>
      </div>

      {/* Second Recommendation */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl overflow-hidden border border-green-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 p-4 border-b border-green-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-3">
              <FiStar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Young·SPACE Hot Spring Spa</h3>
              <div className="flex items-center mt-1">
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">My second favourite</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            {/* What you get */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🤑</span> What ¥329/person gets you:
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✅</span>
                  <span>Can stay overnight</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✅</span>
                  <span>Breakfast buffet</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✅</span>
                  <span>UNLIMITED stuff: fruits 🍉, drinks 🥤, Häagen-Dazs</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✅</span>
                  <span>Gender-separated hot baths ♨️ (no awkward eye contact)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">📝</span>
                  <span>There are other services like foot massage, restaurant food, they cost extra</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">💰</span>
                  <span>Btw, All the bills will be paid when you leave.</span>
                </motion.li>
              </ul>
              <p className="mt-3 text-gray-600 italic">So pretty similar to the Shui Guo Spa, but this one is more closer to the city, not too far away.</p>
            </motion.div>
            
            {/* Why Pick This Spot */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">📍</span> Why Pick This Spot?
              </h4>
              <motion.p 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <span>City center location – closer than your ex's new dating profile 📍</span>
              </motion.p>
            </motion.div>
            
            {/* Layout 101 */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.1), 0 8px 10px -6px rgba(236, 72, 153, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🏠</span> Layout 101
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="font-semibold mr-2">1st Floor:</span>
                  <span>Naked zone alert! 🚨</span>
                </motion.li>
                <motion.li 
                  className="flex items-start ml-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🔥</span>
                  <span>Baths hotter than Shanghai summer 🔥</span>
                </motion.li>
                <motion.li 
                  className="flex items-start ml-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">💅</span>
                  <span>Free fancy toiletries (MUJI lotions, Arden body cream – bougie on a budget 💅)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="font-semibold mr-2">2nd Floor:</span>
                  <span>food and playground! 🎪</span>
                </motion.li>
                <motion.li 
                  className="flex items-start ml-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍨</span>
                  <span>Ice cream bar 🍨</span>
                </motion.li>
                <motion.li 
                  className="flex items-start ml-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🎮</span>
                  <span>Gaming arcade 🕹️, mahjong rooms 🀄, karaoke 🎤 (extra $$$)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start ml-6"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">👨‍👩‍👧‍👦</span>
                  <span>Family suites 👨👩👧👦 – basically AirBnB but with free snacks</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Foodie Highlights */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🍴</span> Foodie Highlights
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍒</span>
                  <span>Unlimited Cherry mountain 🍒 + pre-peeled mangosteen</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍜</span>
                  <span>18¥ scallion noodles 🍜  I liked it a lot</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Sleep Ops */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">😴</span> Sleep Ops
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🛌</span>
                  <span>Each one of yall will sleep on a cushion or a nest</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🏃‍♀️</span>
                  <span>Pro tip: Claim your nest early, or else other people will take the spot 🏃‍♀️</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Service */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.1), 0 8px 10px -6px rgba(244, 114, 182, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🎉</span> Service
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">👍</span>
                  <span>Staff are pretty nice in my POV</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">❄️</span>
                  <span>Summer survival kit: AC ❄️ + ice cream + movies = I don't where else I can find such a place</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">💳</span>
                  <span>Leaving before maxing out your credit card 💳</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Third Recommendation - Luxury Spa */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl overflow-hidden border border-purple-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-4 border-b border-purple-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-3">
              <FiStar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Qushui Lanting Spa</h3>
              <div className="flex items-center mt-1">
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">Ultra Luxury Experience</span>
                <span className="text-gray-600 text-sm ml-2">💸 ¥1200/night</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 italic mt-3 text-lg font-medium">This one is more luxurious, especially the environment and the food options.</p>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            {/* Overview */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.1), 0 8px 10px -6px rgba(168, 85, 247, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <p className="text-gray-700">
                Again, can stay overnight, with unlimited drinks, unlimited fruit. This one offers whole day buffets, so you would expect your stomach will be calling 911.
              </p>
              <p className="text-gray-700 mt-3 font-medium">
                This place makes other spas look like roadside foot massage shops, super luxurious environment.
              </p>
            </motion.div>
            
            {/* First Impressions */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.1), 0 8px 10px -6px rgba(236, 72, 153, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">✨</span> First Impressions
              </h4>
              <motion.p 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <span>Every corner screams "rich auntie vibes" 🤑 From marble bathtubs to lounge areas fancier than your apartment, they've got ✨aesthetic✨ down pat.</span>
              </motion.p>
            </motion.div>
            
            {/* VIP Treatment */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(217, 70, 239, 0.1), 0 8px 10px -6px rgba(217, 70, 239, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">👑</span> VIP Treatment
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✔️</span>
                  <span>Private bathing suites with solo tubs 🛁 (no awkward naked eye contact!)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✔️</span>
                  <span>Beauty arsenal: Kérastase shampoo 💇‍♀️, Valmont face cream 💆‍♀️, Dyson blowouts 🌪️</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">✔️</span>
                  <span>Free makeup kit (Chanel/Dior) 💄 - they even got contact lens cases! 👁️</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Food Frenzy */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(251, 113, 133, 0.1), 0 8px 10px -6px rgba(251, 113, 133, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🍽️</span> Food Frenzy
              </h4>
              <p className="mb-2 font-medium">24/7 buffet featuring:</p>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍒</span>
                  <span>Unlimited fruits</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🦀</span>
                  <span>King crab legs, red shrimp 🦐 - would be awesome if you're a seafood lover</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🥥</span>
                  <span>Coconut water is the best (I drank EIGHT of'em!)</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Playground Perks */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">🎮</span> Playground Perks
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🎮</span>
                  <span>PS5 gaming den</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🎥</span>
                  <span>Private movie theater</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🔥</span>
                  <span>Hot/cold stone rooms (for that human rotisserie experience)</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Pro Tips */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.1), 0 8px 10px -6px rgba(244, 114, 182, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center">
                <span className="text-lg mr-2">💡</span> Pro Tips
              </h4>
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🍣</span>
                  <span>Must-eat: Crab, lobster, caviar (aka the "bank account revenge" platter)</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">💣</span>
                  <span>Bloody waste of stomach space: Overly sweet desserts 🍰, basic bitch sparkling water 💦</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <span className="text-lg mr-2 flex-shrink-0">🕵️‍♂️</span>
                  <span>Secret menu hack: Ask staff for unlisted goodies like mangosteen 🍈</span>
                </motion.li>
              </ul>
            </motion.div>
            
            {/* Final Verdict */}
            <motion.div 
              className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.15), 0 8px 10px -6px rgba(236, 72, 153, 0.15)",
                background: "linear-gradient(to right, #f5f3ff, #fce7f3)",
                borderColor: "#e9d5ff"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <motion.p 
                className="font-bold text-gray-800 flex items-center mb-2"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                <span className="text-lg mr-2">💸</span>
                <span>Final Verdict:</span>
              </motion.p>
              <p className="text-gray-700 text-lg">Basically it's like Disneyland for adults who want to cosplay as millionaires for a day 👑</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 