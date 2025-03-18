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
  FiMapPin, 
  FiLink, 
  FiEdit2,
  FiCamera,
  FiX,
  FiCheck,
  FiHome
} from 'react-icons/fi';

// Mock user data - in a real app, this would come from an API
const mockUser = {
  id: 12345678,
  username: 'travelenthusiast',
  displayName: 'Travel Enthusiast ✈️',
  bio: 'Travel blogger exploring Asia. Sharing authentic experiences and hidden gems. Currently based in Seoul.',
  profileImage: 'https://placehold.co/400x400/ffd100/ffffff?text=T',
  coverImage: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3',
  location: 'Seoul, South Korea',
  homeLocation: 'Vancouver, Canada',
  website: 'https://travelenthusiast.blog'
};

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: mockUser.displayName,
    username: mockUser.username,
    bio: mockUser.bio,
    location: mockUser.location,
    homeLocation: mockUser.homeLocation,
    website: mockUser.website
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setIsSaving(true);
    
    // In a real app, this would be an API call to update the user profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setIsEditing(false);
    
    // Show success message or redirect
  };
  
  return (
    <main className="pb-16 min-h-screen bg-gray-50">
      <PageTransition>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-app py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/settings" className="p-1.5 bg-gray-100 rounded-full mr-3 hover:bg-gray-200 transition-colors">
                  <FiChevronLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold">Profile Information</h1>
              </div>
              
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    disabled={isSaving}
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCheck className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="container-app py-6">
          <form onSubmit={handleSubmit}>
            {/* Profile & Cover Images */}
            <div className="mb-8">
              <div className="relative h-36 md:h-48 w-full bg-gray-200 rounded-xl overflow-hidden">
                <Image 
                  src={mockUser.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                
                {isEditing && (
                  <button 
                    type="button"
                    className="absolute bottom-3 right-3 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                  >
                    <FiCamera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="relative -mt-12 ml-4 border-4 border-white rounded-full bg-white shadow-md inline-block">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image 
                    src={mockUser.profileImage}
                    alt={mockUser.displayName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {isEditing && (
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Your display name"
                    maxLength={50}
                  />
                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-500">
                      This is how your name appears throughout the app. You can use emojis.
                    </p>
                  )}
                </div>
                
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className={`flex items-center w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg`}>
                    <span className="text-gray-500">@</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="flex-1 ml-1 focus:outline-none bg-transparent"
                      placeholder="username"
                      maxLength={30}
                    />
                  </div>
                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-500">
                      Your unique username. Only letters, numbers, and underscores.
                    </p>
                  )}
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Tell us about yourself"
                    rows={4}
                    maxLength={160}
                  />
                  {isEditing && (
                    <div className="mt-1 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Brief description for your profile.
                      </p>
                      <span className="text-xs text-gray-500">
                        {formData.bio.length}/160
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location
                  </label>
                  <div className={`flex items-center w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg`}>
                    <FiMapPin className="text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="flex-1 ml-2 focus:outline-none bg-transparent"
                      placeholder="Where are you now?"
                    />
                  </div>
                </div>
                
                {/* Home Location */}
                <div>
                  <label htmlFor="homeLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Home Location
                  </label>
                  <div className={`flex items-center w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg`}>
                    <FiHome className="text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="homeLocation"
                      name="homeLocation"
                      value={formData.homeLocation}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="flex-1 ml-2 focus:outline-none bg-transparent"
                      placeholder="Where do you call home?"
                    />
                  </div>
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <div className={`flex items-center w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-lg`}>
                    <FiLink className="text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="flex-1 ml-2 focus:outline-none bg-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button - Only visible when editing on mobile */}
            {isEditing && (
              <div className="mt-6 md:hidden">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </PageTransition>
      
      <Navigation />
    </main>
  );
} 