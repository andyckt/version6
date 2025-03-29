import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMerchantData } from './providers/MerchantDataProvider';
import { BaseMerchant } from '@/data/merchants';

// Create our own MerchantTypeIcon component since it's not exported from MerchantHeader
const MerchantTypeIcon = ({ merchant }: { merchant: BaseMerchant }) => {
  switch (merchant.accountType) {
    case 'restaurant':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
        </svg>
      );
    case 'hotel':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
        </svg>
      );
    case 'attraction':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'barandclub':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" />
        </svg>
      );
    case 'shopping':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
        </svg>
      );
  }
};

interface TaggedAccountCardProps {
  username: string;
  onPinMerchant?: (username: string) => void;
  isPinned?: boolean;
}

export default function TaggedAccountCard({ 
  username, 
  onPinMerchant,
  isPinned = false 
}: TaggedAccountCardProps) {
  const { getMerchantByUsername } = useMerchantData();
  const [merchantData, setMerchantData] = useState<BaseMerchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const merchant = getMerchantByUsername(username);
    setMerchantData(merchant);
    setIsLoading(false);
  }, [username, getMerchantByUsername]);

  if (isLoading) {
    return (
      <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 animate-pulse">
        <div className="w-6 h-6 bg-gray-200 rounded-md mr-2.5" />
        <div className="flex flex-col flex-1">
          <div className="w-24 h-4 bg-gray-200 rounded mb-1" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
        <span className="text-sm text-gray-500">@{username}</span>
      </div>
    );
  }

  return (
    <Link 
      href={`/merchant/${username}`}
      className="flex items-center bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-200 transition-colors relative"
    >
      <div className="relative w-6 h-6 rounded-md overflow-hidden bg-primary mr-2.5 flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
          <MerchantTypeIcon merchant={merchantData} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{merchantData.displayName}</span>
        <span className="text-xs text-gray-500">@{merchantData.username}</span>
      </div>
      {onPinMerchant && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            onPinMerchant(username);
          }}
          className="ml-3 p-1 focus:outline-none"
        >
          <svg 
            width="18" height="18" 
            viewBox="0 0 24 24" 
            fill={isPinned ? "currentColor" : "none"} 
            className={`w-4.5 h-4.5 ${isPinned ? "text-amber-400" : "text-gray-500"}`}
          >
            <path 
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}
    </Link>
  );
} 