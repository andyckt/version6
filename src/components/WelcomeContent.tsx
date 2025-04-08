'use client'

import { motion } from 'framer-motion'
import { FiHeart, FiCoffee, FiUsers, FiSmile } from 'react-icons/fi'

export default function WelcomeContent() {
  return (
    <div className="py-8">
      {/* Content Cards */}
      <div className="space-y-6">
        {/* Who made this website card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <FiHeart className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold">Who made this cute little website?</h2>
          </div>
          <p className="text-gray-600 ml-9">Me and my engineer boyfriend! 👩‍💻👨‍💻</p>
        </motion.div>

        {/* Who is me card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <FiSmile className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold">Who is me?</h2>
          </div>
          <p className="text-gray-600 ml-9">
            I'm just a half-American-half-Korean girl studying in Shanghai, and have an engineer boyfriend! 🌏✨
          </p>
        </motion.div>

        {/* Who is he card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <FiCoffee className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold">Who is he?</h2>
          </div>
          <p className="text-gray-600 ml-9">
            He's just a computer guy who loves to make websites, so we decided to make one to share with you about the REAL Shanghai! Yeah, authentic contents! 💻✨
          </p>
        </motion.div>

        {/* Content creators card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <FiUsers className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-xl font-semibold">You might wonder who makes these contents?</h2>
          </div>
          <p className="text-gray-600 ml-9">
            My bf and I each invited 10 of our close friends who are also studying in Shanghai (actually same uni as us!) to share contents on the platform once every while. Hope y'all enjoy! 🎉
          </p>
        </motion.div>
      </div>
    </div>
  )
} 