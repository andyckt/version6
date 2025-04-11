"use client";

import { useState } from 'react';
import { FiTrash2, FiImage, FiHardDrive, FiRefreshCw, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function MediaManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Function to trigger media cleanup
  const triggerCleanup = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Get the API key from environment or use a default for development
      const apiKey = process.env.NEXT_PUBLIC_MEDIA_CLEANUP_API_KEY || 'media-cleanup-secret-key';
      
      const response = await fetch('/api/media/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run cleanup');
      }
      
      setResult(data.result);
    } catch (error) {
      console.error('Cleanup error:', error);
      setError((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Media Storage Management</h1>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Storage Overview Card */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
          <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
            <FiHardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Total Storage Used
            </p>
            <p className="text-lg font-semibold text-gray-700">
              Approx. 2.5 GB
            </p>
          </div>
        </div>
        
        {/* Media Count Card */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
          <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full">
            <FiImage className="w-5 h-5" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Total Media Items
            </p>
            <p className="text-lg font-semibold text-gray-700">
              1,258 items
            </p>
          </div>
        </div>
      </div>
      
      {/* Cleanup Actions */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Storage Optimization</h2>
        <p className="text-gray-600 mb-6">
          Run storage optimization tasks to free up space by removing original images older than 60 days.
          This will keep the high-quality versions but remove the largest files to save storage costs.
        </p>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <button
            onClick={triggerCleanup}
            disabled={isLoading}
            className={`
              inline-flex items-center justify-center px-4 py-2 rounded-lg
              ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white focus:outline-none
            `}
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Running Cleanup...
              </>
            ) : (
              <>
                <FiTrash2 className="w-5 h-5 mr-2" />
                Run Storage Optimization
              </>
            )}
          </button>
          
          <div className="text-sm text-gray-500">
            This process may take a few minutes depending on the amount of media.
          </div>
        </div>
        
        {/* Results display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start">
            <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            <div className="flex items-center mb-2">
              <FiCheck className="w-5 h-5 mr-2" />
              <p className="font-medium">Cleanup completed successfully</p>
            </div>
            
            <div className="pl-7 space-y-2">
              <div>
                <p className="font-medium">Original media cleanup:</p>
                <p>Processed {result.originals.processed} items with {result.originals.errors} errors</p>
              </div>
              
              {result.unused.processed > 0 && (
                <div>
                  <p className="font-medium">Unused media cleanup:</p>
                  <p>Removed {result.unused.processed} unused items</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Storage Breakdown */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Storage Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Count</th>
                <th className="py-3 px-4 font-medium">Average Size</th>
                <th className="py-3 px-4 font-medium">Total Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4">Original Images</td>
                <td className="py-3 px-4">824</td>
                <td className="py-3 px-4">1.2 MB</td>
                <td className="py-3 px-4">988.8 MB</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Large Variants</td>
                <td className="py-3 px-4">1,258</td>
                <td className="py-3 px-4">350 KB</td>
                <td className="py-3 px-4">440.3 MB</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Medium Variants</td>
                <td className="py-3 px-4">1,258</td>
                <td className="py-3 px-4">120 KB</td>
                <td className="py-3 px-4">150.9 MB</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Thumbnails</td>
                <td className="py-3 px-4">1,258</td>
                <td className="py-3 px-4">15 KB</td>
                <td className="py-3 px-4">18.9 MB</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-medium">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4">4,598</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">1.59 GB</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Note: These statistics are for demonstration purposes. 
          In production, these would be calculated from actual database metrics.
        </p>
      </div>
    </div>
  );
} 