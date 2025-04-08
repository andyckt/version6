"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { ProfileInterface } from '@/data/merchants';

// Type definitions based on Merchant model
interface Merchant {
  _id: string;
  id: number;
  username: string;
  displayName: string;
  accountType: string;
  profileInterface: number;
  merchantType: string;
  verified: boolean;
  district: string[];
  createdAt?: string;
  updatedAt?: string;
  openStatus?: {
    isCurrentlyOpen: boolean;
    nextOpeningTime: string;
  };
}

// Function to get profile interface label
function getProfileInterfaceLabel(type: number): string {
  switch (type) {
    case 1: return 'Single Shop';
    case 2: return 'Multi Branch';
    case 3: return 'Attraction';
    case 4: return 'Street';
    case 5: return 'Building';
    case 6: return 'Hotel';
    case 7: return 'Bar/Club';
    default: return 'Unknown';
  }
}

export default function MerchantsAdminPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // Function to fetch merchants
  const fetchMerchants = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch all merchants by using a very large limit
      const response = await fetch(`/api/merchants?limit=1000`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch merchants');
      }
      
      const data = await response.json();
      setMerchants(data.merchants || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching merchants');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete merchant function
  const deleteMerchant = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete merchant');
      }
      
      // Refresh the list
      fetchMerchants();
      setDeleteModalOpen(false);
      setMerchantToDelete(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the merchant');
    }
  };
  
  // Filter merchants based on search term and type filter
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = 
      searchTerm === '' || 
      merchant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.merchantType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === '' ||
      merchant.profileInterface === parseInt(typeFilter);
    
    return matchesSearch && matchesType;
  });
  
  // Load merchants on initial render
  useEffect(() => {
    fetchMerchants();
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app max-w-7xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Link href="/admin" className="p-2 transition-transform hover:scale-110">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-medium ml-2">Admin - Merchants Management</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => fetchMerchants()}
                className="p-2 mr-2"
                disabled={isLoading}
              >
                <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                href="/admin/merchants/new"
                className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Merchant
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-7xl py-6">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h2 className="text-lg font-bold mb-2">Merchants Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Merchants</p>
              <p className="text-2xl font-bold">{merchants.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Single Shops</p>
              <p className="text-2xl font-bold">
                {merchants.filter(m => m.profileInterface === 1).length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Multi Branch</p>
              <p className="text-2xl font-bold">
                {merchants.filter(m => m.profileInterface === 2).length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Currently Open</p>
              <p className="text-2xl font-bold">
                {merchants.filter(m => m.openStatus?.isCurrentlyOpen).length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or type..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="typeFilter" className="block text-sm text-gray-500 mb-1">
                  Filter by Type
                </label>
                <select
                  id="typeFilter"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="1">Single Shop</option>
                  <option value="2">Multi Branch</option>
                  <option value="3">Attraction</option>
                  <option value="4">Street</option>
                  <option value="5">Building</option>
                  <option value="6">Hotel</option>
                  <option value="7">Bar/Club</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading merchants data...</p>
          </div>
        ) : (
          <>
            {filteredMerchants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-2">No merchants found.</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || typeFilter ? 'Try adjusting your search or filters.' : 'Add a merchant to get started.'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMerchants.map((merchant) => (
                        <tr key={merchant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {merchant.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="font-medium">{merchant.displayName}</span>
                              {merchant.verified && (
                                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            @{merchant.username}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {getProfileInterfaceLabel(merchant.profileInterface)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {merchant.merchantType}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {merchant.openStatus?.isCurrentlyOpen ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Open
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Closed
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <Link 
                                href={`/merchant/${merchant.username}`}
                                className="text-gray-400 hover:text-gray-600"
                                title="View"
                              >
                                <FiEye className="w-5 h-5" />
                              </Link>
                              <Link 
                                href={`/admin/merchants/${merchant.id}/edit`}
                                className="text-blue-400 hover:text-blue-600"
                                title="Edit"
                              >
                                <FiEdit2 className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => {
                                  setMerchantToDelete(merchant);
                                  setDeleteModalOpen(true);
                                }}
                                className="text-red-400 hover:text-red-600"
                                title="Delete"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t text-sm text-gray-500">
                  Showing {filteredMerchants.length} merchants {searchTerm || typeFilter ? '(filtered)' : ''}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && merchantToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete <strong>{merchantToDelete.displayName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMerchantToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMerchant(merchantToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 