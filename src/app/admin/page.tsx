"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiDownload, FiRefreshCw } from 'react-icons/fi';

interface WaitingListEntry {
  id: number;
  email: string;
  username: string;
  position: number;
  timestamp: string;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitingListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Function to fetch the waiting list entries
  const fetchEntries = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/waiting-list/admin');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Download waiting list as CSV
  const downloadCSV = () => {
    // Create CSV headers
    let csv = 'ID,Email,Username,Position,Timestamp\n';
    
    // Add each entry
    entries.forEach(entry => {
      csv += `${entry.id},"${entry.email}",${entry.username},${entry.position},"${entry.timestamp}"\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `waiting-list-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    fetchEntries();
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container-app max-w-4xl">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Link href="/" className="p-2 transition-transform hover:scale-110">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-medium ml-2">Admin - Waiting List</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={fetchEntries}
                className="p-2 mr-2"
                disabled={isLoading}
              >
                <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={downloadCSV}
                className="p-2"
                disabled={isLoading || entries.length === 0}
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container-app max-w-4xl py-6">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h2 className="text-lg font-bold mb-2">Waiting List Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold">{entries.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Latest Registration</p>
              <p className="text-lg font-bold">
                {entries.length > 0 
                  ? new Date(entries[entries.length - 1].timestamp).toLocaleDateString() 
                  : 'N/A'}
              </p>
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
            <p className="text-gray-500">Loading waiting list data...</p>
          </div>
        ) : (
          <>
            {entries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-2">No entries in the waiting list yet.</p>
                <p className="text-sm text-gray-400">
                  When users join the waiting list, their information will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{entry.position}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            @{entry.username}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {entry.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {entry.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
} 