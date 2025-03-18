"use client";

import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="container-app">
        {/* Profile Info Skeleton */}
        <div className="relative">
          {/* Profile Picture Skeleton */}
          <div className="absolute -top-12 left-4 border-4 border-white rounded-full bg-white shadow-md">
            <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          </div>
          
          {/* Follow/Edit Button Skeleton */}
          <div className="flex justify-end pt-2 gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        
        {/* User Info Skeleton */}
        <div className="mt-14 mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
          
          <div className="h-16 w-full bg-gray-200 rounded mb-3"></div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* User Stats Skeleton */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="text-center flex-1">
            <div className="h-5 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="text-center flex-1">
            <div className="h-5 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="text-center flex-1">
            <div className="h-5 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="border-b border-gray-100 mb-3">
          <div className="flex">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 py-3 flex justify-center">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-3 gap-1 mb-8">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
} 