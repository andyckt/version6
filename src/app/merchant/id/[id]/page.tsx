"use client";

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useMerchantById } from '@/hooks/useMerchantById';
import { useMerchantPostsById } from '@/hooks/useMerchantPostsById';
import MerchantHeader from '@/components/merchant/MerchantHeader';
import MerchantTopNav from '@/components/merchant/MerchantTopNav';
import BusinessInfo from '@/components/merchant/BusinessInfo';
import OpenStatus from '@/components/merchant/OpenStatus';
import BranchList from '@/components/merchant/BranchList';
import PageTransition from '@/components/PageTransition';
import ShareDialog from '@/components/ShareDialog';
import MentionedGrid from '@/components/MentionedGrid';
import { 
  isSingleLocationMerchant,
  isMultiLocationMerchant,
  isHotelMerchant, 
  isAttractionMerchant, 
  isStreetMerchant, 
  isBuildingMerchant, 
  isBarClubMerchant,
  BaseMerchant,
  getMerchantByUsername,
  MultiLocationMerchant
} from '@/data/merchants';
import { FiNavigation, FiPhone, FiMusic, FiCoffee, FiLock, FiMic, FiRadio, FiStar, FiAward } from 'react-icons/fi';
import LocationSlideUp from '@/components/merchant/LocationSlideUp';
import PhoneNumberDialog from '@/components/merchant/PhoneNumberDialog';
import { Navigation, X, Phone, Copy, Car, Train } from "lucide-react";
import { motion } from "framer-motion";

export default function MerchantProfileById() {
  // Get the merchant ID from the URL
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;
  
  // Use the useMerchantById hook to fetch merchant data
  const { merchant, isLoading, isError } = useMerchantById(id);
  const { 
    posts, 
    error: postsError, 
    isLoading: isPostsLoading, 
    hasMore, 
    loadMore, 
    isLoadingMore,
    updatePostEngagement,
    totalPosts
  } = useMerchantPostsById(id);
  
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // State for branch dialogs
  const [activeBranchIndex, setActiveBranchIndex] = useState<number | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  
  // If we're loading, show a loading state
  if (isLoading) {
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
  
  // If there's an error or no merchant data, show a not found page
  if (isError || !merchant) {
    return notFound();
  }
  
  // Function to render different sections based on merchant type
  function renderMerchantSpecificSections(merchant: BaseMerchant) {
    if (isHotelMerchant(merchant)) {
      return (
        <>
          {/* Hotel specific sections removed */}
        </>
      );
    }
    
    if (isAttractionMerchant(merchant)) {
      return null; // Remove attraction information section
    }
    
    if (isStreetMerchant(merchant)) {
      return (
        <>
          {/* Streets don't have business hours or pricing */}
        </>
      );
    }
    
    if (isBuildingMerchant(merchant)) {
      return (
        <>
          {/* Removing Featured Shops section */}
        </>
      );
    }
    
    if (isBarClubMerchant(merchant)) {
      return (
        <>
          {merchant.nearbyMidnightFood && merchant.nearbyMidnightFood.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold">What to eat at midnight?</h3>
              </div>
              <div className="flex flex-col space-y-1.5">
                <div 
                  className="flex overflow-x-auto pb-1.5 space-x-1.5 scrollbar-hide"
                  id="id-midnight-food-scroll-container"
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollWidth = container.scrollWidth - container.clientWidth;
                    const progress = Math.max(0.1, container.scrollLeft / scrollWidth);
                    const progressBar = document.getElementById('id-midnight-food-progress');
                    if (progressBar) progressBar.style.width = `${progress * 100}%`;
                  }}
                >
                  {merchant.nearbyMidnightFood.map((foodMerchantUsername: string, index: number) => {
                    const foodMerchant = getMerchantByUsername(foodMerchantUsername);
                    
                    if (!foodMerchant) {
                      return (
                        <div key={index} className="flex-shrink-0 w-[calc(50%-4px)] min-w-[150px] max-w-[250px] bg-gray-100 p-1.5 rounded-lg">
                          <p className="font-medium text-xs">@{foodMerchantUsername}</p>
                          <p className="text-[10px] text-gray-500">Merchant not found</p>
                        </div>
                      );
                    }
                    
                    return (
                      <Link
                        href={`/merchant/${foodMerchantUsername}`}
                        key={index}
                        className="flex-shrink-0 w-[calc(50%-4px)] min-w-[150px] max-w-[250px] bg-white hover:bg-gray-50 p-1.5 rounded-lg border border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center flex-shrink-0 min-w-0 max-w-[70%] mr-1">
                            <h3 className="font-medium text-xs truncate">{foodMerchant.displayName}</h3>
                            {foodMerchant.verified && (
                              <div className="bg-primary text-white rounded-full p-0.5 ml-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2">
                                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <OpenStatus merchant={foodMerchant} size="small" />
                          </div>
                        </div>
                        <div className="text-[9px] text-gray-600 truncate mt-0.5">
                          <span>{foodMerchant.merchantType}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Progress bar for horizontal scroll */}
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    id="id-midnight-food-progress"
                    className="h-full bg-primary/60 rounded-full transition-all duration-300 ease-out"
                    style={{ width: '10%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    
    if (isMultiLocationMerchant(merchant)) {
      return (
        <div key="branch-locations" className="mt-4">
          <BranchList merchant={merchant as MultiLocationMerchant} />
        </div>
      );
    }
    
    // Default case - Single location merchant
    if (isSingleLocationMerchant(merchant) || isBarClubMerchant(merchant) || isBuildingMerchant(merchant)) {
      return (
        <>
          {/* Business info now displayed in the MerchantHeader */}
        </>
      );
    }
    
    // Fallback for any unhandled types
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Merchant information unavailable.</p>
      </div>
    );
  }
  
  return (
    <main className="pb-12 min-h-screen">
      <PageTransition>
        <div className="bg-white">
          <MerchantTopNav 
            merchant={merchant} 
            onShareClick={() => setShowShareDialog(true)}
          />
          <MerchantHeader merchant={merchant} />
        </div>
        
        <div className="container-app pb-6">
          {renderMerchantSpecificSections(merchant)}
          
          {/* Posts Mentioning This Place section */}
          <div className="pt-5">
            <h3 className="font-bold text-sm mb-4 flex items-center">
              Users Mentioning this place
              <div className="ml-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-medium text-gray-600">
                  {totalPosts || 0}
                </span>
              </div>
            </h3>
            <MentionedGrid 
              posts={posts} 
              isLoading={isPostsLoading}
              isEmpty={!isPostsLoading && posts.length === 0}
              hasMore={hasMore}
              loadMore={loadMore}
              isLoadingMore={isLoadingMore}
              updatePostEngagement={updatePostEngagement}
            />
          </div>
        </div>
      </PageTransition>
      
      {/* Share Dialog - Added at root level */}
      <ShareDialog 
        isOpen={merchant && showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title={`Check out ${merchant?.displayName || ''}`}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/merchant/id/${merchant?.id || ''}`}
      />
    </main>
  );
} 