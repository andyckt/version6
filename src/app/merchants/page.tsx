"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProfileInterface, AccountType } from '@/data/merchants';
import { MerchantDocument } from '@/models/merchant';

// Map ProfileInterface enum to human-readable names
const profileInterfaceNames = {
  [ProfileInterface.SingleShopRestaurant]: 'Restaurants',
  [ProfileInterface.MultipleBranchMerchant]: 'Chain Stores',
  [ProfileInterface.Attraction]: 'Attractions',
  [ProfileInterface.Street]: 'Streets',
  [ProfileInterface.Building]: 'Buildings',
  [ProfileInterface.Hotel]: 'Hotels',
  [ProfileInterface.BarClub]: 'Bars & Clubs',
};

export default function MerchantsIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse query parameters
  const typeParam = searchParams.get('type');
  const districtParam = searchParams.get('district');
  const searchParam = searchParams.get('search');
  
  // Component state
  const [merchants, setMerchants] = useState<MerchantDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>(typeParam || '');
  const [filterDistrict, setFilterDistrict] = useState<string>(districtParam || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '');
  const [districts, setDistricts] = useState<string[]>([]);
  
  // Fetch merchants data
  useEffect(() => {
    async function fetchMerchants() {
      setLoading(true);
      
      try {
        // Build query string
        const params = new URLSearchParams();
        if (filterType) params.append('type', filterType);
        if (filterDistrict) params.append('district', filterDistrict);
        if (searchQuery) params.append('search', searchQuery);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await fetch(`/api/merchants${queryString}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch merchants');
        }
        
        const data = await response.json();
        setMerchants(data.merchants || []);
        
        // Extract unique districts for filter dropdown
        const uniqueDistricts = new Set<string>();
        data.merchants.forEach((merchant: MerchantDocument) => {
          if (merchant.district) {
            merchant.district.forEach(d => uniqueDistricts.add(d));
          }
        });
        
        setDistricts(Array.from(uniqueDistricts).sort());
      } catch (err) {
        console.error('Error fetching merchants:', err);
        setError('Failed to load merchants. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMerchants();
  }, [filterType, filterDistrict, searchQuery]);
  
  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (filterType) params.append('type', filterType);
    if (filterDistrict) params.append('district', filterDistrict);
    if (searchQuery) params.append('search', searchQuery);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    router.push(`/merchants${queryString}`);
  };
  
  // Group merchants by profile interface
  const merchantsByType = merchants.reduce((acc, merchant) => {
    const type = merchant.profileInterface;
    if (!acc[type]) acc[type] = [];
    acc[type].push(merchant);
    return acc;
  }, {} as Record<number, MerchantDocument[]>);
  
  // Handle filter changes
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };
  
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDistrict(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };
  
  // Render merchant card
  const renderMerchantCard = (merchant: MerchantDocument) => (
    <Link
      href={`/merchant/${merchant.username}`}
      key={merchant._id.toString()}
      className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">{merchant.displayName}</h3>
        {merchant.verified && (
          <span className="bg-primary text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-1">{merchant.merchantType}</div>
      <div className="text-xs text-gray-500 mb-2">
        {merchant.district?.join(', ')}
      </div>
      <div className="flex items-center text-xs text-gray-600">
        <span className="mr-2">{merchant.stats.mentionedPosts} posts</span>
        <span>{merchant.stats.followers} followers</span>
      </div>
    </Link>
  );
  
  return (
    <main className="container-app py-6">
      <h1 className="text-2xl font-bold mb-6">Explore Merchants</h1>
      
      {/* Filters */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              id="type"
              value={filterType}
              onChange={handleTypeChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="restaurant">Restaurants</option>
              <option value="hotel">Hotels</option>
              <option value="attraction">Attractions</option>
              <option value="barandclub">Bars & Clubs</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              id="district"
              value={filterDistrict}
              onChange={handleDistrictChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search merchants..."
                className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </form>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* No results */}
      {!loading && !error && merchants.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No merchants found</h3>
          <p className="text-gray-500">Try changing your filters or search query</p>
        </div>
      )}
      
      {/* Results grouped by type */}
      {!loading && !error && merchants.length > 0 && (
        <div className="space-y-8">
          {Object.entries(merchantsByType).map(([typeId, typeMerchants]) => (
            <div key={typeId} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {profileInterfaceNames[parseInt(typeId) as keyof typeof profileInterfaceNames] || 'Other'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {typeMerchants.map(merchant => renderMerchantCard(merchant))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 