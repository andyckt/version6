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
  ProfileInterface,
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
import MentionedGrid from '@/components/MentionedGrid';
import { MerchantDocument } from '@/models/merchant';

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
  const renderMerchantSpecificSections = (merchant: MerchantDocument) => {
    const sections = [];

    // Handle the multi-location merchant case
    if (merchant.profileInterface === ProfileInterface.MultipleBranchMerchant && merchant.branches) {
      sections.push(
        <div key="branch-locations" className="mt-4">
          <BranchList merchant={merchant} />
        </div>
      );
    }

    // Remove any building merchant specific sections since we don't want Featured Shops
    if (merchant.profileInterface === ProfileInterface.Building) {
      // No sections to add for building merchants
    }

    return sections;
  };
  
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
          
          {/* Related posts section */}
          <div className="pt-5">
            <h3 className="font-bold text-sm mb-4 flex items-center">
              Users Mentioning this place
              <div className="ml-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-[11px] font-medium text-gray-600">
                  {relatedPosts.length}
                </span>
              </div>
            </h3>
            
            <MentionedGrid posts={relatedPosts} />
          </div>
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