"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { BaseMerchant } from '@/data/merchants';
import useSWR, { SWRConfig } from 'swr';

interface MerchantDataContextType {
  getMerchantByUsername: (username: string) => Promise<BaseMerchant | null>;
  getMerchantsByUsernames: (usernames: string[]) => Promise<BaseMerchant[]>;
  clearCache: () => void;
}

const MerchantDataContext = createContext<MerchantDataContextType | null>(null);

export const useMerchantData = () => {
  const context = useContext(MerchantDataContext);
  if (!context) {
    throw new Error('useMerchantData must be used within a MerchantDataProvider');
  }
  return context;
};

// Fetcher for API calls
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch merchant data');
  }
  return response.json();
};

export function MerchantDataProvider({ children }: { children: React.ReactNode }) {
  // In-memory merchant cache for quicker access
  const [cache, setCache] = useState<Map<string, BaseMerchant>>(new Map());
  
  // Batch usernames to avoid multiple fetches for the same merchant
  const [pendingBatches, setPendingBatches] = useState<Map<string, Promise<BaseMerchant | null>>>(new Map());
  
  // Clear the entire cache (for logout or refresh)
  const clearCache = useCallback(() => {
    setCache(new Map());
    setPendingBatches(new Map());
  }, []);

  // Get a single merchant by username
  const getMerchantByUsername = useCallback(async (username: string): Promise<BaseMerchant | null> => {
    // Check in-memory cache first
    if (cache.has(username)) {
      return cache.get(username) || null;
    }
    
    // Check if we already have a pending request for this username
    if (pendingBatches.has(username)) {
      return pendingBatches.get(username) || null;
    }
    
    // Create a new fetch promise
    const fetchPromise = new Promise<BaseMerchant | null>(async (resolve) => {
      try {
        // Fetch from API
        const merchant = await fetcher(`/api/merchants/${username}`);
        
        // Update cache
        setCache(prevCache => {
          const newCache = new Map(prevCache);
          newCache.set(username, merchant);
          return newCache;
        });
        
        // Remove from pending
        setPendingBatches(prev => {
          const newPending = new Map(prev);
          newPending.delete(username);
          return newPending;
        });
        
        resolve(merchant);
      } catch (error) {
        console.error(`Error fetching merchant ${username}:`, error);
        
        // Remove from pending on error
        setPendingBatches(prev => {
          const newPending = new Map(prev);
          newPending.delete(username);
          return newPending;
        });
        
        resolve(null);
      }
    });
    
    // Track this pending request
    setPendingBatches(prev => {
      const newPending = new Map(prev);
      newPending.set(username, fetchPromise);
      return newPending;
    });
    
    return fetchPromise;
  }, [cache, pendingBatches]);

  // Get multiple merchants by usernames (with batching for better performance)
  const getMerchantsByUsernames = useCallback(async (usernames: string[]): Promise<BaseMerchant[]> => {
    if (!usernames.length) return [];
    
    // First check how many we already have in cache
    const cachedMerchants: BaseMerchant[] = [];
    const usernamesToFetch: string[] = [];
    
    usernames.forEach(username => {
      if (cache.has(username)) {
        const merchant = cache.get(username);
        if (merchant) cachedMerchants.push(merchant);
      } else {
        usernamesToFetch.push(username);
      }
    });
    
    // If all are cached, return immediately
    if (usernamesToFetch.length === 0) {
      return cachedMerchants;
    }
    
    // For small numbers of uncached merchants, fetch them individually
    if (usernamesToFetch.length <= 3) {
      const fetchedMerchants = await Promise.all(
        usernamesToFetch.map(username => getMerchantByUsername(username))
      );
      
      return [
        ...cachedMerchants,
        ...fetchedMerchants.filter((m): m is BaseMerchant => m !== null)
      ];
    }
    
    // For larger batches, use a single API call with comma-separated usernames
    try {
      const query = usernamesToFetch.join(',');
      const response = await fetcher(`/api/merchants?usernames=${query}`);
      
      // Update cache with fetched merchants
      const fetchedMerchants = response.merchants || [];
      fetchedMerchants.forEach((merchant: BaseMerchant) => {
        setCache(prevCache => {
          const newCache = new Map(prevCache);
          newCache.set(merchant.username, merchant);
          return newCache;
        });
      });
      
      // Combine cached and newly fetched merchants
      return [...cachedMerchants, ...fetchedMerchants];
    } catch (error) {
      console.error('Error fetching merchant batch:', error);
      
      // Fall back to individual fetches on batch failure
      const fallbackFetched = await Promise.all(
        usernamesToFetch.map(username => getMerchantByUsername(username))
      );
      
      return [
        ...cachedMerchants,
        ...fallbackFetched.filter((m): m is BaseMerchant => m !== null)
      ];
    }
  }, [cache, getMerchantByUsername]);

  // Create context value
  const value = useMemo(() => ({
    getMerchantByUsername,
    getMerchantsByUsernames,
    clearCache
  }), [getMerchantByUsername, getMerchantsByUsernames, clearCache]);

  // Configure global SWR settings for consistent caching
  return (
    <SWRConfig 
      value={{
        dedupingInterval: 60000, // 1 minute
        focusThrottleInterval: 60000, // 1 minute
        revalidateOnFocus: false,
        errorRetryCount: 3
      }}
    >
      <MerchantDataContext.Provider value={value}>
        {children}
      </MerchantDataContext.Provider>
    </SWRConfig>
  );
} 