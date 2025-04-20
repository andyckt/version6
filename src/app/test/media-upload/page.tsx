"use client";

import { useState } from 'react';
import MediaUploader, { UploadedMedia } from '@/components/MediaUploader';

export default function MediaUploadTestPage() {
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);

  const handleMediaUpload = (media: UploadedMedia[]) => {
    setUploadedMedia(media);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Media Upload Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
        
        <MediaUploader 
          onMediaUpload={handleMediaUpload}
          maxFiles={5}
          acceptedTypes="image/jpeg,image/png,image/webp"
          className="mb-6"
        />
        
        {uploadedMedia.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Uploaded Media Details</h3>
            
            <div className="overflow-x-auto bg-gray-50 rounded p-4">
              <pre className="text-xs">{JSON.stringify(uploadedMedia, null, 2)}</pre>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">How to use the uploaded media:</h3>
              <div className="bg-gray-50 p-4 rounded text-sm">
                <p className="mb-2">1. The <code className="bg-gray-200 px-1 rounded">thumbnailUrl</code> (300px) is ideal for list items and thumbnails.</p>
                <p className="mb-2">2. The <code className="bg-gray-200 px-1 rounded">mediumUrl</code> (800px) is suitable for content displays and typical viewing.</p>
                <p className="mb-2">3. The <code className="bg-gray-200 px-1 rounded">largeUrl</code> (1600px) is the highest quality variant for full-screen and detailed viewing.</p>
                <p className="mb-2">4. The <code className="bg-gray-200 px-1 rounded">url</code> is now an alias to largeUrl for backward compatibility.</p>
                <p className="mb-2">5. Store the <code className="bg-gray-200 px-1 rounded">id</code> in your database to reference this media.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 