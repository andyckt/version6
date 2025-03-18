"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft, 
  FiUser, 
  FiLock, 
  FiEye, 
  FiBell, 
  FiSun, 
  FiLogOut,
  FiChevronRight
} from 'react-icons/fi';

// Mock user data - in a real app, this would come from an API
const mockUser = {
  id: 12345678,
  username: 'travelenthusiast',
  displayName: 'Travel Enthusiast ✈️',
  profileImage: 'https://placehold.co/400x400/ffd100/ffffff?text=T',
  email: 'travel.enthusiast@example.com'
};

// Settings categories with their respective pages
const settingsCategories = [
  {
    id: 'account',
    title: 'Account',
    description: 'Manage your profile, email, and account details',
    icon: <FiUser className="w-5 h-5" />,
    color: 'bg-blue-500',
    pages: [
      { id: 'profile', title: 'Profile Information', path: '/settings/account/profile' },
      { id: 'email', title: 'Email & Password', path: '/settings/account/email' },
      { id: 'delete', title: 'Delete Account', path: '/settings/account/delete' }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Control your visibility and data sharing preferences',
    icon: <FiEye className="w-5 h-5" />,
    color: 'bg-purple-500',
    pages: [
      { id: 'visibility', title: 'Profile Visibility', path: '/settings/privacy/visibility' },
      { id: 'activity', title: 'Activity Visibility', path: '/settings/privacy/activity' },
      { id: 'location', title: 'Location Sharing', path: '/settings/privacy/location' }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Emergency',
    description: 'Set up emergency contacts and important information',
    icon: <FiLock className="w-5 h-5" />,
    color: 'bg-red-500',
    pages: [
      { id: 'emergency', title: 'Emergency Contacts', path: '/settings/safety/emergency' },
      { id: 'medical', title: 'Medical Information', path: '/settings/safety/medical' },
      { id: 'insurance', title: 'Travel Insurance', path: '/settings/safety/insurance' }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Customize how and when you receive alerts',
    icon: <FiBell className="w-5 h-5" />,
    color: 'bg-amber-500',
    pages: [
      { id: 'preferences', title: 'Notification Preferences', path: '/settings/notifications/preferences' },
      { id: 'email', title: 'Email Notifications', path: '/settings/notifications/email' },
      { id: 'push', title: 'Push Notifications', path: '/settings/notifications/push' }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize how the app looks and feels',
    icon: <FiSun className="w-5 h-5" />,
    color: 'bg-orange-500',
    pages: [
      { id: 'theme', title: 'Theme', path: '/settings/appearance/theme' },
      { id: 'language', title: 'Language', path: '/settings/appearance/language' }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Protect your account with additional security measures',
    icon: <FiLock className="w-5 h-5" />,
    color: 'bg-slate-700',
    pages: [
      { id: 'twoFactor', title: 'Two-Factor Authentication', path: '/settings/security/two-factor' },
      { id: 'sessions', title: 'Active Sessions', path: '/settings/security/sessions' },
      { id: 'apps', title: 'Connected Apps', path: '/settings/security/apps' }
    ]
  }
];

export default function SettingsPage() {
  const router = useRouter();
  
  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      <PageTransition>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-app py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/account" className="p-1.5 bg-gray-100 rounded-full mr-3 hover:bg-gray-200 transition-colors">
                  <FiChevronLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold">Settings</h1>
              </div>
              
              {/* User Profile Preview */}
              <Link href={`/account/${mockUser.username}`} className="flex items-center">
                <div className="mr-3 text-right hidden sm:block">
                  <div className="font-medium text-sm">{mockUser.displayName}</div>
                  <div className="text-xs text-gray-500">@{mockUser.username}</div>
                </div>
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={mockUser.profileImage}
                    alt={mockUser.displayName}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full ${category.color} text-white mr-3`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{category.title}</h3>
                      <p className="text-gray-500 text-sm">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {category.pages.map((page) => (
                      <Link 
                        key={page.id} 
                        href={page.path}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm">{page.title}</span>
                        <FiChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiLogOut className="w-4 h-4 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 