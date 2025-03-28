"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useMerchant } from '@/hooks/useMerchant';
import MerchantHeader from '@/components/merchant/MerchantHeader';
import MerchantTopNav from '@/components/merchant/MerchantTopNav';
import BusinessInfo from '@/components/merchant/BusinessInfo';
import OpenStatus from '@/components/merchant/OpenStatus';
import BranchList from '@/components/merchant/BranchList';
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
import PageTransition from '@/components/PageTransition';
import { travelPosts, TravelPost } from '@/data/posts';
import BlurImage from '@/components/BlurImage';
import ShareDialog from '@/components/ShareDialog';
import { FiNavigation, FiPhone, FiMusic, FiCoffee, FiLock, FiMic, FiRadio, FiTag, FiStar, FiAward, FiDollarSign } from 'react-icons/fi';
import LocationSlideUp from '@/components/merchant/LocationSlideUp';
import PhoneNumberDialog from '@/components/merchant/PhoneNumberDialog';
import { Navigation, X, Phone, Copy, Car, Train } from "lucide-react";
import { motion } from "framer-motion";

export default function MerchantProfile() {
  const params = useParams();
  const username = params.username as string;
  
  const { merchant, isLoading, isError } = useMerchant(username);
  const [relatedPosts, setRelatedPosts] = useState<TravelPost[]>([]);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // State for branch dialogs
  const [activeBranchIndex, setActiveBranchIndex] = useState<number | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  
  // Find posts that mention this merchant
  useEffect(() => {
    if (merchant) {
      console.log("Merchant data received:", merchant);
      // Filter posts that tag this merchant
      const filtered = travelPosts.filter(post => 
        post.taggedAccounts?.some(account => account.username === merchant.username)
      );
      setRelatedPosts(filtered);
    }
  }, [merchant]);
  
  // Render loading state
  if (isLoading) {
    return (
      <main className="pb-16 min-h-screen">
        <div className="animate-pulse">
          {/* Skeleton for cover image */}
          <div className="h-40 md:h-60 w-full bg-gray-200"></div>
          
          {/* Skeleton for merchant info */}
          <div className="container-app relative pt-20">
            <div className="absolute -top-16 left-4 rounded-full w-24 h-24 bg-gray-300"></div>
            
            <div className="space-y-2 mt-4">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render error or not found
  if (isError) {
    console.error("Error loading merchant:", isError);
    return notFound();
  }
  
  if (!merchant) {
    console.log("No merchant data found");
    return notFound();
  }
  
  // Function to render merchant-specific sections
  const renderMerchantSpecificSections = (merchant: BaseMerchant) => {
    const sections = [];

    // Handle the multi-location merchant case
    if (isMultiLocationMerchant(merchant)) {
      sections.push(
        <div key="branch-locations">
          <BranchList merchant={merchant as MultiLocationMerchant} />
        </div>
      );
    }

    // Remove any building merchant specific sections since we don't want Featured Shops
    if (isBuildingMerchant(merchant)) {
      // No sections to add for building merchants
    }

    return sections;
  };
  
  return (
    <main className="pb-12 min-h-screen">
      <PageTransition>
        <MerchantTopNav 
          merchant={merchant} 
          onShareClick={() => setShowShareDialog(true)} 
        />
        <MerchantHeader merchant={merchant} />
        
        <div className="container-app pt-4 pb-6 space-y-6">
          {renderMerchantSpecificSections(merchant)}
          
          {/* Related posts section */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                Posts Mentioning This Place
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-bold px-2 py-0.5 rounded">
                  {relatedPosts.length}
                </span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="aspect-square relative overflow-hidden rounded-lg group"
                  >
                    <BlurImage
                      src={post.media && post.media.length > 0 ? post.media[0].url : (post.image || '')}
                      alt={post.title}
                      aspectRatio="aspect-square"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 text-white">
                        <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                        <p className="text-xs opacity-80">@{post.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageTransition>
      
      {/* Share Dialog - Moved to the end of the main component */}
      <ShareDialog 
        isOpen={merchant && showShareDialog}
        onClose={() => setShowShareDialog(false)}
        postId={merchant?.id || 0}
        postTitle={`Check out ${merchant?.displayName || ''}`}
        customUrl={`/merchant/${merchant?.username || ''}`}
      />
    </main>
  );
} 