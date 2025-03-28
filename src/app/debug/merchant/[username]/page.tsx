"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BaseMerchant } from '@/data/merchants';

export default function DebugMerchant() {
  const params = useParams();
  const username = params.username as string;
  const [merchant, setMerchant] = useState<BaseMerchant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchant() {
      try {
        setLoading(true);
        const response = await fetch(`/api/merchants/${username}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        setMerchant(data);
      } catch (err) {
        console.error("Error fetching merchant:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchMerchant();
    }
  }, [username]);

  if (loading) {
    return <div className="p-8">Loading merchant data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (!merchant) {
    return <div className="p-8">No merchant found with username: {username}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Merchant Debug: {merchant.displayName}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>ID:</div>
          <div>{merchant.id}</div>
          
          <div>Username:</div>
          <div>{merchant.username}</div>
          
          <div>Display Name:</div>
          <div>{merchant.displayName}</div>
          
          <div>Account Type:</div>
          <div>{merchant.accountType}</div>
          
          <div>Merchant Type:</div>
          <div>{merchant.merchantType}</div>
          
          <div>Profile Interface:</div>
          <div>{merchant.profileInterface}</div>
          
          <div>Districts:</div>
          <div>{merchant.district.join(', ')}</div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Raw JSON Data</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
          {JSON.stringify(merchant, null, 2)}
        </pre>
      </div>
    </div>
  );
} 