"use client";

import useSWR from 'swr';
import { BaseMerchant } from '@/data/merchants';

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch merchant data: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Store in sessionStorage for faster subsequent loads
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`merchant_${url}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Failed to cache merchant data in sessionStorage:', e);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    throw error;
  }
};

export function useMerchant(username: string) {
  // Try to get cached data from sessionStorage
  let fallbackData = undefined;
  
  if (typeof window !== 'undefined' && username) {
    try {
      const cachedData = sessionStorage.getItem(`merchant_${`/api/merchants/${username}`}`);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isStale = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
        
        if (!isStale) {
          fallbackData = data;
        }
      }
    } catch (e) {
      console.error('Failed to retrieve cached merchant data:', e);
    }
  }

  const { data, error, isLoading, mutate } = useSWR<BaseMerchant>(
    username ? `/api/merchants/${username}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true,
      fallbackData,
      focusThrottleInterval: 10000, // Only revalidate at most once every 10 seconds on focus
    }
  );

  return {
    merchant: data,
    isLoading: isLoading && !fallbackData, // Not loading if we have fallback data
    isError: error,
    mutate,
  };
} 