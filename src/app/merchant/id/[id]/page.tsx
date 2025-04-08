"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMerchantById } from '@/hooks/useMerchant';

// Redirect component that fetches merchant by ID and redirects to the username URL
export default function MerchantIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { merchant, isLoading, isError } = useMerchantById(id);
  
  useEffect(() => {
    // Once we have the merchant data, redirect to the canonical URL
    if (merchant && merchant.username) {
      router.replace(`/merchant/${merchant.username}`);
    }
  }, [merchant, router]);
  
  // Show loading state while fetching or redirecting
  return (
    <main className="pb-12 bg-white min-h-screen flex flex-col">
      <div className="container-app pt-6 space-y-6">
        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-40 w-full bg-gray-200 animate-pulse rounded"></div>
      </div>
    </main>
  );
} 