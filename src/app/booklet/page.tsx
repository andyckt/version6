'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'
import WelcomeContent from '@/components/WelcomeContent'
import { motion } from 'framer-motion'
import { FiBookOpen, FiMapPin, FiStar } from 'react-icons/fi'

export default function Booklet() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const buttons = [
    {
      id: 'welcome',
      label: 'Welcome, Read This First!',
      icon: FiBookOpen,
    },
    {
      id: 'attractions',
      label: 'Attractions',
      icon: FiMapPin,
      disabled: true,
    },
    {
      id: 'recommendations',
      label: 'Our Recommendations',
      icon: FiStar,
      disabled: true,
    },
  ]

  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-lg font-medium">My Booklet</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="container-app">
          {!activeSection ? (
            <div className="py-8 space-y-4">
              {buttons.map((button) => (
                <motion.button
                  key={button.id}
                  onClick={() => !button.disabled && setActiveSection(button.id)}
                  className={`w-full p-4 flex items-center bg-white rounded-2xl shadow-sm 
                    hover:shadow-md transition-all
                    ${button.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                  whileHover={!button.disabled ? { scale: 1.02 } : {}}
                  whileTap={!button.disabled ? { scale: 0.98 } : {}}
                >
                  <button.icon className="w-6 h-6 text-primary mr-3" />
                  <span className="text-lg font-medium">{button.label}</span>
                  {button.disabled && (
                    <span className="ml-auto text-sm text-gray-500">Coming Soon</span>
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            <div>
              <motion.button
                onClick={() => setActiveSection(null)}
                className="mt-4 px-4 py-2 text-primary flex items-center hover:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ← Back to sections
              </motion.button>
              {activeSection === 'welcome' && <WelcomeContent />}
            </div>
          )}
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  )
} 