"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { 
  FiChevronLeft,
  FiActivity,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiEye,
  FiUserPlus,
  FiCheck,
  FiToggleLeft,
  FiToggleRight,
  FiShield
} from 'react-icons/fi';

// Mock user data
const mockActivitySettings = {
  likesVisibility: 'followers',
  commentsVisibility: 'public',
  bookmarksVisibility: 'private',
  newFollowsVisibility: true,
  recentActivityVisibility: 'public',
  showActivityStatus: true,
  showReadReceipts: true,
};

export default function ActivityVisibilityPage() {
  const [settings, setSettings] = useState(mockActivitySettings);
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
              <h1 className="text-xl font-bold">Activity Visibility</h1>
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-purple-100 rounded-full mr-4 flex-shrink-0">
                  <FiActivity className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Activity Privacy</h2>
                  <p className="text-gray-600">
                    Control who can see your activities and interactions on the platform.
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Actions Visibility</h3>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Who can see posts you've liked</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="likes-public"
                        name="likesVisibility"
                        checked={settings.likesVisibility === 'public'}
                        onChange={() => handleRadioChange('likesVisibility', 'public')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="likes-public" className="ml-3 flex items-center">
                        <div>
                          <span className="font-medium text-gray-900 block">Public</span>
                          <span className="text-xs text-gray-500">Anyone can see posts you've liked</span>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="likes-followers"
                        name="likesVisibility"
                        checked={settings.likesVisibility === 'followers'}
                        onChange={() => handleRadioChange('likesVisibility', 'followers')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="likes-followers" className="ml-3 flex items-center">
                        <div>
                          <span className="font-medium text-gray-900 block">Followers Only</span>
                          <span className="text-xs text-gray-500">Only people who follow you can see posts you've liked</span>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="likes-private"
                        name="likesVisibility"
                        checked={settings.likesVisibility === 'private'}
                        onChange={() => handleRadioChange('likesVisibility', 'private')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="likes-private" className="ml-3 flex items-center">
                        <div>
                          <span className="font-medium text-gray-900 block">Private</span>
                          <span className="text-xs text-gray-500">Nobody can see posts you've liked</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Who can see your comments</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="comments-public"
                        name="commentsVisibility"
                        checked={settings.commentsVisibility === 'public'}
                        onChange={() => handleRadioChange('commentsVisibility', 'public')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="comments-public" className="ml-3 text-gray-900">Public</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="comments-followers"
                        name="commentsVisibility"
                        checked={settings.commentsVisibility === 'followers'}
                        onChange={() => handleRadioChange('commentsVisibility', 'followers')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="comments-followers" className="ml-3 text-gray-900">Followers Only</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="comments-private"
                        name="commentsVisibility"
                        checked={settings.commentsVisibility === 'private'}
                        onChange={() => handleRadioChange('commentsVisibility', 'private')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="comments-private" className="ml-3 text-gray-900">Private</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Who can see saved items</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bookmarks-public"
                        name="bookmarksVisibility"
                        checked={settings.bookmarksVisibility === 'public'}
                        onChange={() => handleRadioChange('bookmarksVisibility', 'public')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="bookmarks-public" className="ml-3 text-gray-900">Public</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bookmarks-followers"
                        name="bookmarksVisibility"
                        checked={settings.bookmarksVisibility === 'followers'}
                        onChange={() => handleRadioChange('bookmarksVisibility', 'followers')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="bookmarks-followers" className="ml-3 text-gray-900">Followers Only</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bookmarks-private"
                        name="bookmarksVisibility"
                        checked={settings.bookmarksVisibility === 'private'}
                        onChange={() => handleRadioChange('bookmarksVisibility', 'private')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="bookmarks-private" className="ml-3 text-gray-900">Private</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Activity Feed Visibility</h3>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Who can see your recent activity</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="activity-public"
                        name="recentActivityVisibility"
                        checked={settings.recentActivityVisibility === 'public'}
                        onChange={() => handleRadioChange('recentActivityVisibility', 'public')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="activity-public" className="ml-3 text-gray-900">Public</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="activity-followers"
                        name="recentActivityVisibility"
                        checked={settings.recentActivityVisibility === 'followers'}
                        onChange={() => handleRadioChange('recentActivityVisibility', 'followers')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="activity-followers" className="ml-3 text-gray-900">Followers Only</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="activity-private"
                        name="recentActivityVisibility"
                        checked={settings.recentActivityVisibility === 'private'}
                        onChange={() => handleRadioChange('recentActivityVisibility', 'private')}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="activity-private" className="ml-3 text-gray-900">Private</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Additional Activity Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiUserPlus className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <span className="text-gray-900 block">New Follow Notifications</span>
                        <span className="text-xs text-gray-500">Show when you follow someone in their notifications</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggle('newFollowsVisibility')}
                      className="text-gray-700"
                    >
                      {settings.newFollowsVisibility ? (
                        <FiToggleRight className="w-8 h-5 text-purple-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <span className="text-gray-900 block">Activity Status</span>
                        <span className="text-xs text-gray-500">Show when you're active on the platform</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggle('showActivityStatus')}
                      className="text-gray-700"
                    >
                      {settings.showActivityStatus ? (
                        <FiToggleRight className="w-8 h-5 text-purple-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <FiEye className="w-4 h-4 text-gray-600 mr-3" />
                      <div>
                        <span className="text-gray-900 block">Read Receipts</span>
                        <span className="text-xs text-gray-500">Show when you've read messages</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggle('showReadReceipts')}
                      className="text-gray-700"
                    >
                      {settings.showReadReceipts ? (
                        <FiToggleRight className="w-8 h-5 text-purple-600" />
                      ) : (
                        <FiToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2 text-purple-800 flex items-center">
                  <FiShield className="w-4 h-4 mr-2" />
                  Privacy Tip
                </h3>
                <p className="text-sm text-purple-700">
                  Setting your activity to private helps protect your privacy, but may limit social interactions on the platform. Consider what matters most to you when configuring these settings.
                </p>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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