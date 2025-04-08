"use client";

import useSWR from 'swr';
import { BaseMerchant } from '@/data/merchants';
import { MerchantDocument } from '@/models/merchant';
import { useState, useEffect } from 'react';

// Custom error type for fetch errors
interface FetchError extends Error {
  info?: any;
  status?: number;
}

// Configured fetcher with error handling
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('Failed to fetch merchant data') as FetchError;
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return response.json();
};

// Basic merchant data fetcher (fast, minimal)
const fetcherBasic = async (url: string) => {
  // Add projection to only fetch essential fields
  const fetchUrl = `${url}?include=basic`;
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch merchant data');
  }
  return response.json();
};

// Types for progressive loading
interface MerchantHookReturn {
  merchant: MerchantDocument | null;
  isLoading: boolean;
  isError: any;
  mutate: () => void;
  isLoadingDetails: boolean;
}

// Primary hook with progressive loading
export function useMerchant(username: string): MerchantHookReturn {
  // State for client-side caching
  const [cachedMerchant, setCachedMerchant] = useState<MerchantDocument | null>(null);
  
  // First, fetch basic merchant data (fast)
  const { 
    data: merchantBasic, 
    error: errorBasic, 
    isLoading: isLoadingBasic,
    mutate: mutateBasic 
  } = useSWR<MerchantDocument>(
    username ? `/api/merchants/${username}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 60000, // 1 minute
      loadingTimeout: 3000, // Consider slow after 3s
      keepPreviousData: true,
      onSuccess: (data) => {
        // When we get basic data, update the cache
        setCachedMerchant(prev => ({...prev, ...data}));
      }
    }
  );
  
  // Merge any newly fetched data with our cached version
  useEffect(() => {
    if (merchantBasic) {
      setCachedMerchant(prev => ({...prev, ...merchantBasic}));
    }
  }, [merchantBasic]);
  
  // Return best available data
  return {
    merchant: cachedMerchant || merchantBasic || null,
    isLoading: isLoadingBasic && !cachedMerchant,
    isError: errorBasic,
    mutate: mutateBasic,
    isLoadingDetails: false
  };
}

// If specifically need to fetch by ID instead of username
export function useMerchantById(id: string) {
  const { data, error, isLoading, mutate } = useSWR<MerchantDocument>(
    id ? `/api/merchants/id/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    merchant: data,
    isLoading,
    isError: error,
    mutate,
  };
} 