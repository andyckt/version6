"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddMerchantPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    accountType: 'restaurant',
    verified: true,
    recommended: false,
    hashtags: '',
    district: '',
    merchantType: '',
    pricePerPerson: ''
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.displayName || !formData.username || !formData.accountType) {
      setError('Display name, username, and account type are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare merchant data
      const merchant = {
        // We'll let the server assign the ID
        displayName: formData.displayName,
        username: formData.username.toLowerCase().replace(/[^a-z0-9]/g, ''), // Clean username
        accountType: formData.accountType,
        verified: formData.verified,
        recommended: formData.recommended,
        joinDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        hashtags: formData.hashtags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`),
        district: formData.district.split(',').map(district => district.trim()),
        merchantType: formData.merchantType,
        stats: {
          mentionedPosts: 0,
          followers: 0,
          following: 0
        },
        profileInterface: getProfileInterface(formData.accountType),
      };
      
      // Add price per person if provided
      if (formData.pricePerPerson && !isNaN(Number(formData.pricePerPerson))) {
        Object.assign(merchant, { pricePerPerson: Number(formData.pricePerPerson) });
      }
      
      // Send create request to API
      const response = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchant),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create merchant');
      }
      
      const createdMerchant = await response.json();
      
      // Redirect to the edit page for the new merchant
      router.push(`/admin/merchants/edit/${createdMerchant.id}`);
      
    } catch (err) {
      console.error('Error creating merchant:', err);
      setError(err instanceof Error ? err.message : 'Failed to create merchant. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to determine profile interface based on account type
  const getProfileInterface = (accountType: string): number => {
    switch (accountType) {
      case 'restaurant':
        return 1; // SingleShopRestaurant
      case 'attraction':
        return 3; // Attraction
      case 'barandclub':
        return 7; // BarClub
      case 'hotel':
        return 6; // Hotel
      case 'shopping':
        return 5; // Building
      default:
        return 1; // Default to SingleShopRestaurant
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Merchant</h1>
        <Link href="/admin/merchants" className="text-blue-500 hover:underline">
          &larr; Back to merchant list
        </Link>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="e.g. Shanghai Restaurant"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="e.g. shanghairestaurant"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only lowercase letters and numbers, no spaces or special characters.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="barandclub">Bar & Club</option>
                    <option value="attraction">Attraction</option>
                    <option value="hotel">Hotel</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Merchant Type
                  </label>
                  <input
                    type="text"
                    name="merchantType"
                    value={formData.merchantType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Chinese Restaurant"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Person
                  </label>
                  <input
                    type="number"
                    name="pricePerPerson"
                    value={formData.pricePerPerson}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 100"
                    min="0"
                  />
                </div>
                
                <div className="flex space-x-4 items-center">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="verified"
                        checked={formData.verified}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Verified</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="recommended"
                        checked={formData.recommended}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>Recommended</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Taxonomy Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">Taxonomy</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hashtags (comma separated)
                  </label>
                  <textarea
                    name="hashtags"
                    value={formData.hashtags}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                    placeholder="#restaurant, #chinese, #delicious"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The # symbol will be added automatically if not included.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Districts (comma separated)
                  </label>
                  <textarea
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                    placeholder="Huangpu, Xuhui, Jing'an"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/admin/merchants"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Merchant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 