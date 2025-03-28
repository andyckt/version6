"use client";

import useSWR from 'swr';
import { BaseMerchant } from '@/data/merchants';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch merchant data');
  }
  return response.json();
};

export function useMerchantById(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<BaseMerchant>(
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