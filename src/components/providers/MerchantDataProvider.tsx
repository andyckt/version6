"use client";

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { BaseMerchant, merchants } from '@/data/merchants';

interface MerchantDataContextType {
  getMerchantByUsername: (username: string) => BaseMerchant | null;
  getMerchantsByUsernames: (usernames: string[]) => BaseMerchant[];
}

const MerchantDataContext = createContext<MerchantDataContextType | null>(null);

export const useMerchantData = () => {
  const context = useContext(MerchantDataContext);
  if (!context) {
    throw new Error('useMerchantData must be used within a MerchantDataProvider');
  }
  return context;
};

export function MerchantDataProvider({ children }: { children: React.ReactNode }) {
  // Create a memoized cache
  const merchantCache = useMemo(() => new Map<string, BaseMerchant>(), []);

  const getMerchantByUsername = useCallback((username: string) => {
    // Check cache first
    if (merchantCache.has(username)) {
      return merchantCache.get(username)!;
    }

    // Find merchant in our data store
    const merchant = merchants.find(m => m.username === username);
    
    // Cache the result (even if null)
    if (merchant) {
      merchantCache.set(username, merchant);
    }

    return merchant || null;
  }, [merchantCache]);

  const getMerchantsByUsernames = useCallback((usernames: string[]) => {
    return usernames
      .map(username => getMerchantByUsername(username))
      .filter((merchant): merchant is BaseMerchant => merchant !== null);
  }, [getMerchantByUsername]);

  const value = useMemo(() => ({
    getMerchantByUsername,
    getMerchantsByUsernames,
  }), [getMerchantByUsername, getMerchantsByUsernames]);

  return (
    <MerchantDataContext.Provider value={value}>
      {children}
    </MerchantDataContext.Provider>
  );
} 