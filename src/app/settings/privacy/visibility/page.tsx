"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiLock,
  FiUsers,
  FiUser,
  FiGlobe,
  FiInfo,
  FiCheck,
  FiToggleLeft,
  FiToggleRight,
  FiShield
} from 'react-icons/fi';

// Mock user data
const mockUserPrivacySettings = {
  profileVisibility: 'public',
  nameVisibility: true,
  bioVisibility: true,
  locationVisibility: true,
  followersListVisibility: 'public',
  followingListVisibility: 'public',
  searchIndexing: true,
};

export default function ProfileVisibilityPage() {
  const [settings, setSettings] = useState(mockUserPrivacySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    // Reset success message if shown
    if (saveSuccess) setSaveSuccess(false);
  };
  
  const handleRadioChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset success message if shown
    if (saveSuccess) setSaveSuccess(false);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      if (setSaveSuccess) {
        setSaveSuccess(false);
      }
    }, 3000);
  };
  
  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      <PageTransition>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-app py-4">
            <div className="flex items-center">
              <Link href="/settings" className="p-1.5 bg-gray-100 rounded-full mr-3 hover:bg-gray-200 transition-colors">
                <FiChevronLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-bold">Profile Visibility</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                  <FiShield className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Profile Privacy</h2>
                  <p className="text-gray-600">
                    Control who can see your profile information and how it appears to others.
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Profile Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="public"
                      name="profileVisibility"
                      checked={settings.profileVisibility === 'public'}
                      onChange={() => handleRadioChange('profileVisibility', 'public')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="public" className="ml-3 flex items-center">
                      <FiGlobe className="w-4 h-4 text-gray-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900 block">Public</span>
                        <span className="text-xs text-gray-500">Anyone can view your profile</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="followers"
                      name="profileVisibility"
                      checked={settings.profileVisibility === 'followers'}
                      onChange={() => handleRadioChange('profileVisibility', 'followers')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="followers" className="ml-3 flex items-center">
                      <FiUsers className="w-4 h-4 text-gray-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900 block">Followers Only</span>
                        <span className="text-xs text-gray-500">Only people who follow you can view your profile</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="private"
                      name="profileVisibility"
                      checked={settings.profileVisibility === 'private'}
                      onChange={() => handleRadioChange('profileVisibility', 'private')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="private" className="ml-3 flex items-center">
                      <FiLock className="w-4 h-4 text-gray-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900 block">Private</span>
                        <span className="text-xs text-gray-500">Only approved followers can view your profile</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Profile Information Visibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 text-gray-600 mr-3" />
                      <span className="text-gray-900">Display Name</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('nameVisibility')}
                      className="text-gray-700"
                    >
                      {settings.nameVisibility ? (
                        <FiToggleRight className="w-8 h-5 text-blue-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiInfo className="w-4 h-4 text-gray-600 mr-3" />
                      <span className="text-gray-900">Bio Information</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('bioVisibility')}
                      className="text-gray-700"
                    >
                      {settings.bioVisibility ? (
                        <FiToggleRight className="w-8 h-5 text-blue-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiGlobe className="w-4 h-4 text-gray-600 mr-3" />
                      <span className="text-gray-900">Location Information</span>
                    </div>
                    <button 
                      onClick={() => handleToggle('locationVisibility')}
                      className="text-gray-700"
                    >
                      {settings.locationVisibility ? (
                        <FiToggleRight className="w-8 h-5 text-blue-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">List Visibility</h3>
                
                <div className="mb-5">
                  <p className="text-sm text-gray-600 mb-3">Who can see your followers</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="followers-public"
                        name="followersListVisibility"
                        checked={settings.followersListVisibility === 'public'}
                        onChange={() => handleRadioChange('followersListVisibility', 'public')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="followers-public" className="ml-3 text-gray-900">Public</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="followers-followers"
                        name="followersListVisibility"
                        checked={settings.followersListVisibility === 'followers'}
                        onChange={() => handleRadioChange('followersListVisibility', 'followers')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="followers-followers" className="ml-3 text-gray-900">Followers Only</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="followers-private"
                        name="followersListVisibility"
                        checked={settings.followersListVisibility === 'private'}
                        onChange={() => handleRadioChange('followersListVisibility', 'private')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="followers-private" className="ml-3 text-gray-900">Private</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-3">Who can see who you follow</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="following-public"
                        name="followingListVisibility"
                        checked={settings.followingListVisibility === 'public'}
                        onChange={() => handleRadioChange('followingListVisibility', 'public')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="following-public" className="ml-3 text-gray-900">Public</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="following-followers"
                        name="followingListVisibility"
                        checked={settings.followingListVisibility === 'followers'}
                        onChange={() => handleRadioChange('followingListVisibility', 'followers')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="following-followers" className="ml-3 text-gray-900">Followers Only</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="following-private"
                        name="followingListVisibility"
                        checked={settings.followingListVisibility === 'private'}
                        onChange={() => handleRadioChange('followingListVisibility', 'private')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="following-private" className="ml-3 text-gray-900">Private</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Additional Privacy Options</h3>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="text-gray-900 block">Search Engine Visibility</span>
                    <span className="text-xs text-gray-500">Allow search engines to index your profile</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('searchIndexing')}
                    className="text-gray-700"
                  >
                    {settings.searchIndexing ? (
                      <FiToggleRight className="w-8 h-5 text-blue-600" />
                    ) : (
                      <FiToggleLeft className="w-8 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {saveSuccess && (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-6 flex items-center">
                  <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                  Settings saved successfully
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 