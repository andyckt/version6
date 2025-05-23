"use client";

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useMerchant } from '@/hooks/useMerchant';
import { useMerchantPosts } from '@/hooks/useMerchantPosts';
import MerchantHeader from '@/components/merchant/MerchantHeader';
import MerchantTopNav from '@/components/merchant/MerchantTopNav';
import { useState } from 'react';
import ShareDialog from '@/components/ShareDialog';
import MentionedGrid from '@/components/MentionedGrid';
import PageTransition from '@/components/PageTransition';

export default function MerchantProfile() {
  const params = useParams();
  const username = params.username as string;
  
  const { merchant, isLoading: isMerchantLoading, isError: merchantError } = useMerchant(username);
  const { 
    posts, 
    error: postsError, 
    isLoading: isPostsLoading, 
    hasMore, 
    loadMore, 
    isLoadingMore,
    updatePostEngagement,
    totalPosts
  } = useMerchantPosts(username);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Render loading state
  if (isMerchantLoading) {
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
  if (merchantError || !merchant) {
    return notFound();
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
          {/* Related posts section */}
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
      
      {/* Share Dialog */}
      <ShareDialog
        isOpen={merchant && showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title={`Check out ${merchant.displayName}`}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/merchant/${merchant.username}`}
      />
    </main>
  );
} 