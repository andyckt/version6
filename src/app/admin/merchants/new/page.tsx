"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiLoader } from 'react-icons/fi';

// Interface for new merchant form
interface NewMerchantFormData {
  username: string;
  displayName: string;
  accountType: string;
  verified: boolean;
  merchantType: string;
  joinDate: string;
  recommended: boolean;
  hashtags: string[];
  district: string[];
  profileInterface: number;
  url?: string;
  stats: {
    mentionedPosts: number;
    followers: number;
    following: number;
  };
}

export default function NewMerchantPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<NewMerchantFormData>({
    username: '',
    displayName: '',
    accountType: 'restaurant',
    verified: false,
    merchantType: '',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    recommended: false,
    hashtags: [],
    district: [],
    profileInterface: 1,
    stats: {
      mentionedPosts: 0,
      followers: 0,
      following: 0
    }
  });
  
  // Function to create a new merchant
  const createMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    
    try {
      const response = await fetch('/api/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create merchant');
      }
      
      const data = await response.json();
      
      // Redirect to the merchant list page
      router.push('/admin/merchants');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the merchant');
      setIsCreating(false);
    }
  };
  
  // Handle form field changes
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  // Handle nested field changes (e.g., stats)
  const handleNestedChange = (parentField: string, field: string, value: string | number | boolean) => {
    setFormData((prevData) => {
      if (parentField === 'stats') {
        return {
          ...prevData,
          stats: {
            ...prevData.stats,
            [field]: value,
          },
        };
      }
      return prevData;
    });
  };
  
  // Handle array field changes
  const handleArrayChange = (field: string, value: string) => {
    // Split by commas and trim each item
    const array = value.split(',').map(item => item.trim());
    
    setFormData({
      ...formData,
      [field]: array,
    });
  };
  
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app max-w-4xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Link href="/admin/merchants" className="p-2 transition-transform hover:scale-110">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-medium ml-2">Add New Merchant</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={createMerchant}
                disabled={isCreating}
                className="bg-primary text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {isCreating ? (
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4 mr-2" />
                )}
                Create Merchant
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-4xl py-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={createMerchant} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., restaurantname"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be unique, no spaces, used in URLs
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Restaurant Name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel</option>
                  <option value="attraction">Attraction</option>
                  <option value="barandclub">Bar & Club</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.merchantType}
                  onChange={(e) => handleInputChange('merchantType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Italian Restaurant, Boutique Hotel"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Interface Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.profileInterface}
                  onChange={(e) => handleInputChange('profileInterface', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value={1}>Single Shop Restaurant</option>
                  <option value={2}>Multiple Branch Merchant</option>
                  <option value={3}>Attraction</option>
                  <option value={4}>Street</option>
                  <option value={5}>Building</option>
                  <option value={6}>Hotel</option>
                  <option value={7}>Bar/Club</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="text"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Month Year (e.g., January 2023)"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => handleInputChange('verified', e.target.checked)}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                    Verified
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommended"
                    checked={formData.recommended}
                    onChange={(e) => handleInputChange('recommended', e.target.checked)}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="ml-2 block text-sm text-gray-700">
                    Recommended
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.hashtags.join(', ')}
                  onChange={(e) => handleArrayChange('hashtags', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#italian, #restaurant"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Districts (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.district.join(', ')}
                  onChange={(e) => handleArrayChange('district', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Jing'an, Huangpu"
                />
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mentioned Posts
                </label>
                <input
                  type="number"
                  value={formData.stats.mentionedPosts}
                  onChange={(e) => handleNestedChange('stats', 'mentionedPosts', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Followers
                </label>
                <input
                  type="number"
                  value={formData.stats.followers}
                  onChange={(e) => handleNestedChange('stats', 'followers', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Following
                </label>
                <input
                  type="number"
                  value={formData.stats.following}
                  onChange={(e) => handleNestedChange('stats', 'following', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Additional Information</h2>
            
            <p className="text-sm text-gray-500 mb-4">
              After creating the basic merchant, you will be able to add type-specific details like:
            </p>
            
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-6 space-y-1">
              <li>Location information</li>
              <li>Business hours</li>
              <li>Pricing details</li>
              <li>Multiple branches</li>
              <li>Amenities and features</li>
            </ul>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-primary">
                Note: This is a simplified form for creating the merchant. You can add more details after creation.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-primary text-white px-6 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              {isCreating ? (
                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FiSave className="w-4 h-4 mr-2" />
              )}
              Create Merchant
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 