"use client";

import { FiHome, FiBook, FiUser, FiPlus } from 'react-icons/fi'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
      <div className="container-app">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center w-1/3">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          {/* Create button */}
          <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg -mt-5">
            <FiPlus className="w-6 h-6" />
          </button>
          
          <Link href="/booklet" className="flex flex-col items-center w-1/3">
            <FiBook className="w-6 h-6" />
            <span className="text-xs mt-1">Booklet</span>
          </Link>
          
          <Link href="/account" className="flex flex-col items-center w-1/3">
            <FiUser className="w-6 h-6" />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 