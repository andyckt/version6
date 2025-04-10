"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  FiUsers, FiSettings, FiBarChart2, FiFile, 
  FiDatabase, FiAlertCircle, FiMenu, FiX, FiHome,
  FiLogOut
} from 'react-icons/fi';
import { logoutAdmin } from '@/app/actions';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Users', href: '/admin/users', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Content', href: '/admin/content', icon: <FiFile className="w-5 h-5" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { name: 'Database', href: '/admin/database', icon: <FiDatabase className="w-5 h-5" /> },
    { name: 'Issues', href: '/admin/issues', icon: <FiAlertCircle className="w-5 h-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];
  
  const isActive = (href: string) => {
    // For the root admin page, only match exact
    if (href === '/admin') {
      return pathname === '/admin';
    }
    // For other pages, match with startsWith
    return pathname.startsWith(href);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button 
            className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md group
                ${isActive(item.href)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          {/* Logout button - mobile */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 group"
            >
              <span className="mr-3"><FiLogOut className="w-5 h-5" /></span>
              Logout
            </button>
          </form>
        </nav>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-100 lg:bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md group
                ${isActive(item.href)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          {/* Logout button - desktop */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 group"
              >
                <span className="mr-3"><FiLogOut className="w-5 h-5" /></span>
                Logout
              </button>
            </form>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-gray-100 lg:hidden">
          <button
            className="p-1 mr-3 text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-medium">Admin Panel</h2>
        </div>
        
        {/* Main content wrapper */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 