"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiLoader } from 'react-icons/fi';

interface MerchantFormData {
  id: number;
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
  stats?: {
    mentionedPosts: number;
    followers: number;
    following: number;
  };
  // Common detail fields
  location?: any;
  businessInfo?: any;
  pricePerPerson?: number;
  languagesSpoken?: string[];
  michelinStars?: number;
  // Specific fields for merchant types
  branches?: any[];
  ticketPrice?: number;
  floors?: number;
  featuredStores?: string[];
  pricePerNight?: number;
  amenities?: string[];
  stars?: number;
  nearbyMidnightFood?: string[];
  clubCategories?: string[];
  entryFee?: number;
}

export default function EditMerchantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Function to fetch merchant data
  const fetchMerchant = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/merchants/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch merchant data');
      }
      
      const data = await response.json();
      setMerchant(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the merchant data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update merchant data
  const updateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`/api/admin/merchants/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchant),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update merchant');
      }
      
      setSuccessMessage('Merchant updated successfully');
      
      // Refresh the data
      const data = await response.json();
      setMerchant(data.merchant);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the merchant');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    if (!merchant) return;
    
    setMerchant({
      ...merchant,
      [field]: value,
    });
  };
  
  // Handle nested field changes (e.g., stats, location)
  const handleNestedChange = (parentField: string, field: string, value: any) => {
    if (!merchant) return;
    
    setMerchant({
      ...merchant,
      [parentField]: {
        ...merchant[parentField as keyof MerchantFormData],
        [field]: value,
      },
    });
  };
  
  // Handle array field changes
  const handleArrayChange = (field: string, value: string) => {
    if (!merchant) return;
    
    // Split by commas and trim each item
    const array = value.split(',').map(item => item.trim());
    
    setMerchant({
      ...merchant,
      [field]: array,
    });
  };
  
  // Fetch merchant data on initial render
  useEffect(() => {
    fetchMerchant();
  }, [params.id]);
  
  // Helper function to get profile interface label
  const getProfileInterfaceLabel = (type: number): string => {
    switch (type) {
      case 1: return 'Single Shop Restaurant';
      case 2: return 'Multiple Branch Merchant';
      case 3: return 'Attraction';
      case 4: return 'Street';
      case 5: return 'Building';
      case 6: return 'Hotel';
      case 7: return 'Bar/Club';
      default: return 'Unknown';
    }
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
              <h1 className="text-lg font-medium ml-2">Edit Merchant</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={updateMerchant}
                disabled={isLoading || isSaving}
                className="bg-primary text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-4xl py-6">
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading merchant data...</p>
          </div>
        ) : merchant ? (
          <form onSubmit={updateMerchant} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={merchant.id}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={merchant.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={merchant.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={merchant.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    Merchant Type
                  </label>
                  <input
                    type="text"
                    value={merchant.merchantType}
                    onChange={(e) => handleInputChange('merchantType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Italian Restaurant, Boutique Hotel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Interface Type
                  </label>
                  <select
                    value={merchant.profileInterface}
                    onChange={(e) => handleInputChange('profileInterface', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    value={merchant.url || ''}
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
                    value={merchant.joinDate}
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
                      checked={merchant.verified}
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
                      checked={merchant.recommended}
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
                    value={merchant.hashtags?.join(', ') || ''}
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
                    value={merchant.district?.join(', ') || ''}
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
                    value={merchant.stats?.mentionedPosts || 0}
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
                    value={merchant.stats?.followers || 0}
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
                    value={merchant.stats?.following || 0}
                    onChange={(e) => handleNestedChange('stats', 'following', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
            
            {/* Type-specific sections */}
            {/* For simplicity, we're only showing a few key fields based on type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">
                {getProfileInterfaceLabel(merchant.profileInterface)} Details
              </h2>
              
              {/* Generic section for pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {(merchant.profileInterface === 1 || merchant.profileInterface === 2 || merchant.profileInterface === 7) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Person
                    </label>
                    <input
                      type="number"
                      value={merchant.pricePerPerson || ''}
                      onChange={(e) => handleInputChange('pricePerPerson', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                )}
                
                {merchant.profileInterface === 6 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Night
                    </label>
                    <input
                      type="number"
                      value={merchant.pricePerNight || ''}
                      onChange={(e) => handleInputChange('pricePerNight', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                )}
                
                {merchant.profileInterface === 3 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Price
                    </label>
                    <input
                      type="number"
                      value={merchant.ticketPrice || ''}
                      onChange={(e) => handleInputChange('ticketPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                )}
                
                {(merchant.profileInterface === 1 || merchant.profileInterface === 2 || merchant.profileInterface === 3 || merchant.profileInterface === 7) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Languages Spoken (comma separated)
                    </label>
                    <input
                      type="text"
                      value={merchant.languagesSpoken?.join(', ') || ''}
                      onChange={(e) => handleArrayChange('languagesSpoken', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Chinese, English"
                    />
                  </div>
                )}
              </div>
              
              {/* This is just a placeholder - in a real application, you would have more detailed
                  forms for each merchant type with all the specific fields they require */}
              <p className="text-sm text-gray-500 mb-4">
                For a complete editing experience, additional type-specific fields would be displayed here based on the merchant type.
                This includes location details, business hours, branches, and more specialized information.
              </p>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-primary">
                  Note: This is a simplified form for demonstration purposes. A production version would include all type-specific fields and validation.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-2">Merchant not found.</p>
            <Link href="/admin/merchants" className="text-primary hover:underline">
              Return to merchants list
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 