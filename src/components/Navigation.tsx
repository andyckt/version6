"use client";

import { FiHome, FiBook, FiUser } from 'react-icons/fi'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
      <div className="container-app">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center flex-1">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link href="/booklet" className="flex flex-col items-center flex-1">
            <FiBook className="w-6 h-6" />
            <span className="text-xs mt-1">Booklet</span>
          </Link>
          
          <Link href="/account" className="flex flex-col items-center flex-1">
            <FiUser className="w-6 h-6" />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 