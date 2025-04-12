"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function CloudinaryUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Eager Transformations Test</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">About This Test</h2>
        <p className="mb-2">This page tests Cloudinary's eager transformations feature. When you upload an image:</p>
        <ol className="list-decimal pl-5 mb-2 space-y-1">
          <li>The original image is uploaded to Cloudinary</li>
          <li>Cloudinary generates 3 variants immediately (thumbnail, medium, large)</li>
          <li>All transformations happen on Cloudinary's servers</li>
          <li>No local storage is used - everything is served from Cloudinary's CDN</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4">
              <label htmlFor="file-input" className="block text-sm font-medium mb-2">
                Select an image to upload:
              </label>
              <input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm border border-gray-300 rounded p-2"
                disabled={isUploading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading to Cloudinary...' : 'Upload Image'}
            </button>
          </form>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
            
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Original filename:</strong> {result.file.originalFilename}</p>
              <p><strong>Dimensions:</strong> {result.file.width}×{result.file.height} (Aspect ratio: {result.file.aspectRatio})</p>
              <p><strong>Cloudinary ID:</strong> <span className="font-mono text-xs break-all">{result.file.cloudinaryId}</span></p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Thumbnail (300×300)</h3>
                <div className="relative h-36 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={result.file.thumbnailUrl}
                    alt="Thumbnail"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="text-xs text-gray-500">Optimized for lists and grids</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Medium (800×800)</h3>
                <div className="relative h-36 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={result.file.mediumUrl}
                    alt="Medium"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="text-xs text-gray-500">Standard view size</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium">Large (1600×1600)</h3>
              <div className="relative h-48 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={result.file.largeUrl}
                  alt="Large"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="text-xs text-gray-500">For detailed viewing</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Cloudinary URLs:</h3>
              <div className="space-y-2 font-mono text-xs">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">Thumbnail</span>
                    <span className="text-gray-500">300×300 fill crop</span>
                  </div>
                  <p className="break-all bg-gray-100 p-2 rounded">{result.file.thumbnailUrl}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Medium</span>
                    <span className="text-gray-500">800×800 limit</span>
                  </div>
                  <p className="break-all bg-gray-100 p-2 rounded">{result.file.mediumUrl}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Large</span>
                    <span className="text-gray-500">1600×1600 limit</span>
                  </div>
                  <p className="break-all bg-gray-100 p-2 rounded">{result.file.largeUrl}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">Original</span>
                  </div>
                  <p className="break-all bg-gray-100 p-2 rounded">{result.file.originalUrl}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 