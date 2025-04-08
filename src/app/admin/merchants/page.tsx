"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Merchant {
  id: number;
  username: string;
  displayName: string;
  accountType: string;
  district: string[];
  verified: boolean;
  recommended: boolean;
}

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Merchant[]>([]);
  const router = useRouter();
  
  // Fetch merchants on page load
  useEffect(() => {
    async function fetchMerchants() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/merchants?page=${page}&limit=50`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch merchants');
        }
        
        const data = await response.json();
        setMerchants(data.merchants);
      } catch (err) {
        setError('Error loading merchants. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMerchants();
  }, [page]);
  
  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/merchants/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.merchants);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Display merchants (either search results or all merchants)
  const displayedMerchants = searchResults.length > 0 ? searchResults : merchants;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Merchant Management</h1>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search merchants..."
          className="flex-grow p-2 border rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Search
        </button>
        {searchResults.length > 0 && (
          <button 
            onClick={clearSearch} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Clear
          </button>
        )}
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Merchants table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Username</th>
                  <th className="py-2 px-4 border">Display Name</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">District</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{merchant.id}</td>
                    <td className="py-2 px-4 border">{merchant.username}</td>
                    <td className="py-2 px-4 border">{merchant.displayName}</td>
                    <td className="py-2 px-4 border">{merchant.accountType}</td>
                    <td className="py-2 px-4 border">{merchant.district.join(', ')}</td>
                    <td className="py-2 px-4 border">
                      {merchant.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                          Verified
                        </span>
                      )}
                      {merchant.recommended && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/merchants/edit/${merchant.id}`}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/merchant/${merchant.username}`}
                          target="_blank"
                          className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* No results message */}
          {displayedMerchants.length === 0 && (
            <div className="text-center py-8">
              {searchResults.length === 0 && searchQuery ? 
                'No merchants found matching your search criteria.' : 
                'No merchants found.'}
            </div>
          )}
          
          {/* Pagination */}
          {!searchQuery && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${
                  page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
                }`}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={merchants.length < 50}
                className={`px-4 py-2 rounded ${
                  merchants.length < 50 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Add new merchant button */}
      <div className="mt-8">
        <Link 
          href="/admin/merchants/new"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Merchant
        </Link>
      </div>
    </div>
  );
} 