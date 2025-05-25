"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiCheck, FiX, FiAlertCircle, FiSave, FiUser } from 'react-icons/fi';

// User interface matching the MongoDB model
interface User {
  _id?: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  location: string;
  homeLocation: string;
  website: string;
  joinDate: string;
  role: 'user' | 'creator' | 'admin';
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export default function UserEditor() {
  const router = useRouter();
  
  // Search states
  const [searchUsername, setSearchUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // User and form states
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    bio: '',
    verified: false
  });
  
  // Username validation states
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setUser(null);
    
    try {
      const response = await fetch(`/api/users/${searchUsername}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User @${searchUsername} not found`);
        }
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      // Initialize form with user data
      setForm({
        displayName: userData.displayName || '',
        username: userData.username || '',
        bio: userData.bio || '',
        verified: userData.verified || false
      });
      
      // Reset username validation since we're using the current username
      setIsUsernameAvailable(true);
      setUsernameMessage('');
      
    } catch (error: any) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // If username is being changed, check its availability after typing stops
    if (name === 'username' && value !== user?.username) {
      setIsUsernameAvailable(false);
      setUsernameMessage('Checking availability...');
      setIsCheckingUsername(true);
      
      // Debounce the username check
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Check if a username is available
  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim()) {
      setIsUsernameAvailable(false);
      setUsernameMessage('Username cannot be empty');
      setIsCheckingUsername(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${username}`);
      
      // If 404, username is available
      if (response.status === 404) {
        setIsUsernameAvailable(true);
        setUsernameMessage('Username is available');
      } 
      // If 200, username exists but might be the current user
      else if (response.ok) {
        const existingUser = await response.json();
        
        // If it's the same user, that's okay
        if (existingUser._id === user?._id) {
          setIsUsernameAvailable(true);
          setUsernameMessage('Current username');
        } else {
          setIsUsernameAvailable(false);
          setUsernameMessage('Username is already taken');
        }
      } else {
        throw new Error('Failed to check username');
      }
    } catch (error) {
      setIsUsernameAvailable(false);
      setUsernameMessage('Error checking username');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Handle save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!isUsernameAvailable) {
      setSaveError('Please fix the username issue before saving');
      return;
    }
    
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      // Always use the original username for the API endpoint
      const endpoint = `/api/users/${user.username}`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      const updatedUser = await response.json();
      
      // Update the user state with the new data
      setUser(updatedUser);
      
      // If username changed, update the search field and route
      if (form.username !== user.username) {
        setSearchUsername(form.username);
        
        // Show success message before potentially redirecting
        setSaveSuccess(true);
        setTimeout(() => {
          // If we're still on this page after 1.5 seconds, clear the success message
          setSaveSuccess(false);
        }, 1500);
      } else {
        setSaveSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
      
    } catch (error: any) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
        <div className="container-app max-w-6xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Link href="/admin/users" className="p-2 mr-2 transition-transform hover:scale-110">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-medium">Edit User</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-6xl py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Search for a User</h2>
          
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
              disabled={isSearching || !searchUsername.trim()}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {searchError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 mr-2" />
                <p>{searchError}</p>
              </div>
            </div>
          )}
        </div>
        
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Edit User: @{user.username}</h2>
            
            <form onSubmit={handleSave}>
              {/* Display Name */}
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              {/* Username (with availability check) */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      form.username !== user.username
                        ? isUsernameAvailable
                          ? 'border-green-300'
                          : 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  
                  {/* Username status indicator */}
                  {isCheckingUsername ? (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-primary rounded-full"></div>
                    </div>
                  ) : form.username !== user.username && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isUsernameAvailable ? (
                        <FiCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiX className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Username message */}
                {form.username !== user.username && usernameMessage && (
                  <p className={`mt-1 text-sm ${
                    isUsernameAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {usernameMessage}
                  </p>
                )}
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Verified Status */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    name="verified"
                    checked={form.verified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                    Verified User
                  </label>
                </div>
              </div>
              
              {/* Save Error */}
              {saveError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2" />
                    <p>{saveError}</p>
                  </div>
                </div>
              )}
              
              {/* Save Success */}
              {saveSuccess && (
                <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">
                  <div className="flex items-center">
                    <FiCheck className="w-5 h-5 mr-2" />
                    <p>User updated successfully!</p>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={isSaving || isCheckingUsername || !isUsernameAvailable}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {!user && !searchError && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium mb-2">No User Selected</h3>
            <p className="text-gray-500 text-sm">
              Search for a user by username to edit their details.
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 