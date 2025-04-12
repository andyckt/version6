"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function SimpleUploadTest() {
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
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Simple Image Upload Test</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
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
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Upload Successful!</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Thumbnail</h3>
              <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={result.file.thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Medium</h3>
              <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={result.file.mediumUrl}
                  alt="Medium"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Large</h3>
              <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={result.file.largeUrl}
                  alt="Large"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><strong>Original filename:</strong> {result.file.originalFilename}</p>
            <p><strong>Dimensions:</strong> {result.file.width}×{result.file.height} (Aspect ratio: {result.file.aspectRatio})</p>
            <div>
              <strong>URLs:</strong>
              <ul className="space-y-1 mt-1 bg-white p-2 rounded overflow-x-auto">
                <li className="font-mono text-xs break-all">Thumbnail: {result.file.thumbnailUrl}</li>
                <li className="font-mono text-xs break-all">Medium: {result.file.mediumUrl}</li>
                <li className="font-mono text-xs break-all">Large: {result.file.largeUrl}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 