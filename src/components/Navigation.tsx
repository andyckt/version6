"use client";

import { useState, useEffect } from 'react';
import { FiHome, FiBook, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Only enable client-side features after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine active link based on pathname
  const isActive = (path: string) => {
    if (!mounted) return false; // During SSR, don't highlight any link
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1.5 z-10">
      <div className="container-app">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className={`flex flex-col items-center flex-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}
            prefetch={true}
          >
            <FiHome className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          
          <Link 
            href="/booklet" 
            className={`flex flex-col items-center flex-1 transition-colors ${isActive('/booklet') ? 'text-primary' : 'text-gray-500'}`}
            prefetch={true}
          >
            <FiBook className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Booklet</span>
          </Link>
          
          <Link 
            href="/account" 
            className={`flex flex-col items-center flex-1 transition-colors ${isActive('/account') ? 'text-primary' : 'text-gray-500'}`}
            prefetch={true}
          >
            <FiUser className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 