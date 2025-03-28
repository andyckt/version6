'use client';

import Link from 'next/link';

export default function TestMerchantLinks() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Test Merchant Links</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">IAPM Shopping Mall</h2>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Username-based route:</p>
              <Link href="/merchant/iapmmall" className="text-blue-500 hover:underline">
                /merchant/iapmmall
              </Link>
            </div>
            <div>
              <p className="font-medium">ID-based route:</p>
              <Link href="/merchant/id/507" className="text-blue-500 hover:underline">
                /merchant/id/507
              </Link>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Shanghai Museum</h2>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Username-based route:</p>
              <Link href="/merchant/shanghaimuseum" className="text-blue-500 hover:underline">
                /merchant/shanghaimuseum
              </Link>
            </div>
            <div>
              <p className="font-medium">ID-based route:</p>
              <Link href="/merchant/id/503" className="text-blue-500 hover:underline">
                /merchant/id/503
              </Link>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Debug Views</h2>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Debug page:</p>
              <Link href="/debug" className="text-blue-500 hover:underline">
                /debug
              </Link>
            </div>
            <div>
              <p className="font-medium">Merchant Debug API:</p>
              <Link href="/api/debug/merchants" className="text-blue-500 hover:underline">
                /api/debug/merchants
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 