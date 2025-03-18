"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiMapPin,
  FiGlobe,
  FiUsers,
  FiLock,
  FiCheck,
  FiToggleLeft,
  FiToggleRight,
  FiMap,
  FiAlertTriangle,
  FiClock,
  FiNavigation
} from 'react-icons/fi';

// Mock user data
const mockLocationSettings = {
  shareLocation: true,
  preciseLevelSharing: 'city',
  shareWith: 'followers',
  enableAutomatic: false,
  notifyOnSharing: true,
  saveLocationHistory: false,
  showLocationInPosts: true,
  locationTaggingAccuracy: 'neighborhood'
};

export default function LocationSharingPage() {
  const [settings, setSettings] = useState(mockLocationSettings);
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
              <h1 className="text-xl font-bold">Location Sharing</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-green-100 rounded-full mr-4 flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Location Privacy</h2>
                  <p className="text-gray-600">
                    Control how your location information is shared and used on the platform.
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <FiMap className="w-4 h-4 text-gray-600 mr-3" />
                    <div>
                      <span className="text-gray-900 block font-medium">Location Sharing</span>
                      <span className="text-xs text-gray-500">Enable or disable location sharing globally</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggle('shareLocation')}
                    className="text-gray-700"
                  >
                    {settings.shareLocation ? (
                      <FiToggleRight className="w-8 h-5 text-green-600" />
                    ) : (
                      <FiToggleLeft className="w-8 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {settings.shareLocation && (
                <>
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Location Precision</h3>
                    <p className="text-sm text-gray-600 mb-3">Choose how precise your location is shown to others</p>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="exact"
                          name="preciseLevelSharing"
                          checked={settings.preciseLevelSharing === 'exact'}
                          onChange={() => handleRadioChange('preciseLevelSharing', 'exact')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="exact" className="ml-3 flex items-center">
                          <FiNavigation className="w-4 h-4 text-gray-600 mr-2" />
                          <div>
                            <span className="font-medium text-gray-900 block">Exact Location</span>
                            <span className="text-xs text-gray-500">Your precise coordinates are shared</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="neighborhood"
                          name="preciseLevelSharing"
                          checked={settings.preciseLevelSharing === 'neighborhood'}
                          onChange={() => handleRadioChange('preciseLevelSharing', 'neighborhood')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="neighborhood" className="ml-3 flex items-center">
                          <FiMapPin className="w-4 h-4 text-gray-600 mr-2" />
                          <div>
                            <span className="font-medium text-gray-900 block">Neighborhood</span>
                            <span className="text-xs text-gray-500">Only the neighborhood or area is shared</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="city"
                          name="preciseLevelSharing"
                          checked={settings.preciseLevelSharing === 'city'}
                          onChange={() => handleRadioChange('preciseLevelSharing', 'city')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="city" className="ml-3 flex items-center">
                          <FiMap className="w-4 h-4 text-gray-600 mr-2" />
                          <div>
                            <span className="font-medium text-gray-900 block">City Only</span>
                            <span className="text-xs text-gray-500">Only the city name is shared</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Who Can See Your Location</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="public"
                          name="shareWith"
                          checked={settings.shareWith === 'public'}
                          onChange={() => handleRadioChange('shareWith', 'public')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="public" className="ml-3 flex items-center">
                          <FiGlobe className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-gray-900">Public</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="followers"
                          name="shareWith"
                          checked={settings.shareWith === 'followers'}
                          onChange={() => handleRadioChange('shareWith', 'followers')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="followers" className="ml-3 flex items-center">
                          <FiUsers className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-gray-900">Followers Only</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="private"
                          name="shareWith"
                          checked={settings.shareWith === 'private'}
                          onChange={() => handleRadioChange('shareWith', 'private')}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="private" className="ml-3 flex items-center">
                          <FiLock className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-gray-900">Private</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Additional Location Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <FiClock className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-900 block">Automatic Location Updates</span>
                            <span className="text-xs text-gray-500">Periodically update your location automatically</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('enableAutomatic')}
                          className="text-gray-700"
                        >
                          {settings.enableAutomatic ? (
                            <FiToggleRight className="w-8 h-5 text-green-600" />
                          ) : (
                            <FiToggleLeft className="w-8 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <FiAlertTriangle className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-900 block">Location Sharing Notifications</span>
                            <span className="text-xs text-gray-500">Receive notifications when your location is accessed</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('notifyOnSharing')}
                          className="text-gray-700"
                        >
                          {settings.notifyOnSharing ? (
                            <FiToggleRight className="w-8 h-5 text-green-600" />
                          ) : (
                            <FiToggleLeft className="w-8 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <FiMap className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-900 block">Location History</span>
                            <span className="text-xs text-gray-500">Save history of places you've visited</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('saveLocationHistory')}
                          className="text-gray-700"
                        >
                          {settings.saveLocationHistory ? (
                            <FiToggleRight className="w-8 h-5 text-green-600" />
                          ) : (
                            <FiToggleLeft className="w-8 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-900 block">Location Tagging in Posts</span>
                            <span className="text-xs text-gray-500">Allow location to be added to your posts</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('showLocationInPosts')}
                          className="text-gray-700"
                        >
                          {settings.showLocationInPosts ? (
                            <FiToggleRight className="w-8 h-5 text-green-600" />
                          ) : (
                            <FiToggleLeft className="w-8 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2 text-yellow-800 flex items-center">
                      <FiAlertTriangle className="w-4 h-4 mr-2" />
                      Privacy Note
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Sharing your location makes it easier for friends to connect with you, but it also exposes your whereabouts. Consider limiting location sharing to only people you trust.
                    </p>
                  </div>
                </>
              )}
              
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
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