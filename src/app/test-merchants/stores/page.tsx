'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TestStores() {
  const [results, setResults] = useState<any>(null);
  
  useEffect(() => {
    // Fetch the merchant status on component mount
    fetch('/api/debug/merchant-status')
      .then(res => res.json())
      .then(data => setResults(data));
  }, []);
  
  const stores = [
    { name: '7-Eleven', username: 'seveneleven', id: 508 },
    { name: 'Family Mart', username: 'familymart', id: 509 },
    { name: 'Lawson', username: 'lawson', id: 510 },
    { name: 'Shanghai Taste', username: 'shanghaitaste', id: 501 },
    { name: 'Speak Low', username: 'speaklow', id: 505 }
  ];
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test 24/7 Stores and Special Hours</h1>
      
      {results && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Current Time Info:</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p><strong>China Time:</strong> {results.time.china.day} {results.time.china.time}</p>
            <p><strong>UTC Time:</strong> {new Date(results.time.current).toUTCString()}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map(store => (
          <div key={store.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
            
            {results && (
              <div className="mb-4">
                <p className="text-lg">
                  Status: 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    results.merchants.find((m: any) => m.id === store.id)?.isOpen 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {results.merchants.find((m: any) => m.id === store.id)?.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-lg">View Merchant Profile:</h3>
              <div className="flex space-x-4">
                <Link 
                  href={`/merchant/${store.username}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Username Route
                </Link>
                <Link 
                  href={`/merchant/id/${store.id}`}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  ID Route
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Test with Different Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            href="/api/debug/merchant-status?time=3:00&day=1" 
            target="_blank"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-center"
          >
            3:00 AM Monday
          </Link>
          <Link 
            href="/api/debug/merchant-status?time=13:00&day=3" 
            target="_blank"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-center"
          >
            1:00 PM Wednesday
          </Link>
          <Link 
            href="/api/debug/merchant-status?time=23:00&day=5" 
            target="_blank"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-center"
          >
            11:00 PM Friday
          </Link>
        </div>
      </div>
    </div>
  );
} 