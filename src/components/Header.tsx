"use client";

import { FiSearch, FiMenu, FiPlus } from 'react-icons/fi'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
      <div className="container-app">
        <div className="flex items-center justify-between py-3">
          <button className="p-2">
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-6">
            <Link href="/following" className="text-gray-500 font-medium">
              Following
            </Link>
            <Link href="/" className="text-gray-900 font-medium border-b-2 border-primary pb-1">
              Discover
            </Link>
            <Link href="/nearby" className="text-gray-500 font-medium">
              Nearby
            </Link>
          </div>
          
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm mr-2">
              <FiPlus className="w-5 h-5" />
            </button>
            <button className="p-2">
              <FiSearch className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 