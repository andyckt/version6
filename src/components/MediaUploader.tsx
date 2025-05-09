"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader, FiImage, FiZoomIn, FiAlertCircle, FiCheck, FiUploadCloud } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

// Calculate average compression percentage from stats
const calculateAverageCompression = (stats: Record<string, { original: number, compressed: number }>) => {
  if (Object.keys(stats).length === 0) return 0;
  
  let totalSavings = 0;
  let totalFiles = 0;
  
  Object.values(stats).forEach(({ original, compressed }) => {
    const savingsPercent = ((original - compressed) / original) * 100;
    totalSavings += savingsPercent;
    totalFiles++;
  });
  
  return totalFiles > 0 ? Math.round(totalSavings / totalFiles) : 0;
};

export interface UploadedMedia {
  id: string;
  url: string;           // Default URL (now using large)
  thumbnailUrl: string;  // Thumbnail variant (300px)
  mediumUrl: string;     // Medium variant (800px)
  largeUrl: string;      // Large variant (1600px max)
  width: number;
  height: number;
  aspectRatio: string;
  originalFilename?: string;
  size?: number;
}

interface MediaUploaderProps {
  onMediaUpload?: (media: UploadedMedia[]) => void;
  onUploadStart?: () => void;
  maxFiles?: number;
  acceptedTypes?: string;
  className?: string;
}

export default function MediaUploader({
  onMediaUpload,
  onUploadStart,
  maxFiles = 10,
  acceptedTypes = "image/*",
  className = "",
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<Record<string, { original: number, compressed: number }>>({});
  const [useHighQuality, setUseHighQuality] = useState<boolean>(false);
  const [filesToProcess, setFilesToProcess] = useState<number>(0);
  const [filesProcessed, setFilesProcessed] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image with quality preservation
  const compressImage = async (file: File): Promise<File> => {
    try {
      // Determine if this is a PNG file that needs more aggressive compression
      const isPNG = file.type.includes('png');
      const isLargePNG = isPNG && file.size > 5 * 1024 * 1024; // Check if PNG is larger than 5MB
      
      // Log original file info
      console.log(`Compressing: ${file.name}, Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, Type: ${file.type}`);
      
      // Configure compression options based on file type and size
      const options = {
        // Much more aggressive compression for large PNGs
        maxSizeMB: isPNG 
          ? (isLargePNG 
              ? 0.2 // Super aggressive for large PNGs (10MB+)
              : (useHighQuality ? 0.5 : 0.3)) // Still aggressive for regular PNGs
          : (useHighQuality ? 3 : 1.5), // Original settings for JPGs and other formats
          
        // Limit dimensions more aggressively for large PNGs
        maxWidthOrHeight: isPNG && isLargePNG
          ? 1600 // Force large PNGs to maximum 1600px
          : (useHighQuality ? 2560 : 2048),
           
        // Much lower quality for PNGs since they're converted to JPG anyway
        initialQuality: isPNG
          ? (isLargePNG 
              ? 0.5 // 50% quality for large PNGs
              : (useHighQuality ? 0.7 : 0.6)) // Reduced quality for regular PNGs
          : (useHighQuality ? 0.9 : 0.85), // Original settings for JPGs
          
        useWebWorker: true,
        preserveExif: !isPNG, // Don't preserve EXIF for PNGs to reduce size
        exifOrientationFix: true,
        fileType: isPNG ? 'image/jpeg' : file.type, // Force PNG to JPEG conversion for large PNGs
        alwaysKeepResolution: !isLargePNG, // Allow resolution reduction for large PNGs
      };
      
      // Store original size for stats
      const fileName = file.name;
      const originalSize = file.size;
      
      // Perform compression
      console.log(`Starting compression with options:`, options);
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB, Reduction: ${(100 - (compressedFile.size / originalSize) * 100).toFixed(1)}%`);
      
      // Update compression stats
      setCompressionStats(prev => ({
        ...prev,
        [fileName]: {
          original: originalSize,
          compressed: compressedFile.size
        }
      }));
      
      // If compression resulted in a larger file, return original
      if (compressedFile.size > originalSize) {
        console.log('Compression resulted in larger file, using original');
        return file;
      }
      
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      return file; // Return original file if compression fails
    }
  };
  
  // Process multiple files with compression
  const processFiles = async (fileList: FileList): Promise<File[]> => {
    const filesToProcess = Array.from(fileList).slice(0, maxFiles);
    
    // Reset counters
    setFilesProcessed(0);
    setFilesToProcess(filesToProcess.length);
    setIsCompressing(true);
    
    // Process files in parallel
    const processPromises = filesToProcess.map(async (file, index) => {
      if (file.type.startsWith('image/')) {
        try {
          const result = await compressImage(file);
          // Increment processed count
          setFilesProcessed(prev => prev + 1);
          return result;
        } catch (error) {
          console.error('Error compressing file:', file.name, error);
          // Still count as processed even if error
          setFilesProcessed(prev => prev + 1);
          return file; // Use original if compression fails
        }
      } else {
        // Non-image files pass through unchanged
        setFilesProcessed(prev => prev + 1);
        return file;
      }
    });
    
    // Wait for all files to be processed in parallel
    const processedFiles = await Promise.all(processPromises);
    setIsCompressing(false);
    
    return processedFiles;
  };

  // Handler for when files are selected via the file input
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processedFiles = await processFiles(e.target.files);
      await uploadFiles(processedFiles);
    }
  };

  // Handler for the drop event
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const processedFiles = await processFiles(e.dataTransfer.files);
      await uploadFiles(processedFiles);
    }
  };

  // Upload files to the server
  const uploadFiles = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;
    
    // Signal that the upload is starting
    if (onUploadStart) {
      onUploadStart();
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      
      // Append each file to the form data
      files.forEach(file => {
        formData.append('media', file);
      });
      
      // If there's more than 5 files, show batch notification
      if (files.length > 5) {
        toast(`Processing ${files.length} files in batches for optimal performance...`);
      }
      
      // Add high quality flag if enabled
      if (useHighQuality) {
        formData.append('highQuality', 'true');
      }
      
      // Upload the files
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Handle successful upload
      const uploadedMediaFiles = result.files
        .filter((file: any) => !file.error)
        .map((file: any) => ({
          id: file.id || `temp-${Date.now()}`,
          url: file.url || file.largeUrl,
          thumbnailUrl: file.thumbnailUrl,
          mediumUrl: file.mediumUrl,
          largeUrl: file.largeUrl,
          width: file.width,
          height: file.height,
          aspectRatio: file.aspectRatio,
          originalFilename: file.originalFilename,
          size: file.size
        }));
      
      // Update the state with the new files
      setUploadedFiles(prevFiles => [...prevFiles, ...uploadedMediaFiles]);
      
      // Call the callback with the uploaded files
      if (onMediaUpload) {
        onMediaUpload(uploadedMediaFiles);
      }
      
      // Show success message
      if (uploadedMediaFiles.length > 0) {
        // Show compression stats if available
        const compressionInfo = Object.values(compressionStats).length > 0 
          ? `\nAvg compression: ${calculateAverageCompression(compressionStats)}%` 
          : '';
        
        toast.success(
          `Successfully uploaded ${uploadedMediaFiles.length} files${compressionInfo}`
        );
      }
      
      // Show warnings for any files that failed
      const failedFiles = result.files.filter((file: any) => file.error);
      if (failedFiles.length > 0) {
        toast.error(`${failedFiles.length} files failed to upload`);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Unknown upload error');
      toast.error(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Open file dialog when the drop area is clicked
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle removing an uploaded file
  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    // Call the callback if provided
    if (onMediaUpload) {
      onMediaUpload(newFiles);
    }
  };
  
  // Calculate total compression savings
  const calculateTotalSavings = () => {
    if (Object.keys(compressionStats).length === 0) return null;
    
    const totalOriginal = Object.values(compressionStats).reduce((sum, item) => sum + item.original, 0);
    const totalCompressed = Object.values(compressionStats).reduce((sum, item) => sum + item.compressed, 0);
    const savedBytes = totalOriginal - totalCompressed;
    const savingsPercent = Math.round((savedBytes / totalOriginal) * 100);
    
    // Count PNG files
    const pngFiles = Object.keys(compressionStats).filter(name => name.toLowerCase().endsWith('.png')).length;
    
    // Format for human-readable display
    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    };
    
    return {
      original: formatSize(totalOriginal),
      compressed: formatSize(totalCompressed),
      saved: formatSize(savedBytes),
      percent: savingsPercent,
      pngCount: pngFiles
    };
  };
  
  const savings = calculateTotalSavings();
  
  // Log the compressionStats and savings (for debugging)
  useEffect(() => {
    if (Object.keys(compressionStats).length > 0) {
      console.log('Current compression stats:', compressionStats);
      console.log('Calculated savings:', savings);
    }
  }, [compressionStats, savings]);

  // Toggle high-quality mode
  const toggleHighQuality = () => {
    const newQualityMode = !useHighQuality;
    setUseHighQuality(newQualityMode);
    
    // Log the quality choice for analytics
    try {
      // Get existing analytics or initialize empty object
      const analyticsData = localStorage.getItem('mediaAnalytics') 
        ? JSON.parse(localStorage.getItem('mediaAnalytics') || '{}')
        : { highResViews: 0, totalViews: 0, uploadQualityChoices: { standard: 0, high: 0 } };
      
      // Initialize uploadQualityChoices if not present
      if (!analyticsData.uploadQualityChoices) {
        analyticsData.uploadQualityChoices = { standard: 0, high: 0 };
      }
      
      // Increment appropriate counter
      if (newQualityMode) {
        analyticsData.uploadQualityChoices.high = (analyticsData.uploadQualityChoices.high || 0) + 1;
      } else {
        analyticsData.uploadQualityChoices.standard = (analyticsData.uploadQualityChoices.standard || 0) + 1;
      }
      
      // Store analytics data
      localStorage.setItem('mediaAnalytics', JSON.stringify(analyticsData));
      
      // If in production, you could send this to your analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        // Example: sendAnalyticsEvent('quality_choice', { choice: newQualityMode ? 'high' : 'standard' });
      }
    } catch (error) {
      console.error('Failed to log analytics:', error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || isCompressing}
      />
      
      {/* Upload progress indicator */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading {uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Compression progress indicator */}
      {isCompressing && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Compressing images...</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing {filesProcessed}/{filesToProcess}</span>
          </div>
        </div>
      )}
      
      {/* Upload error */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <div className="flex">
            <FiAlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}
      
      {/* Compression stats */}
      {savings && Object.keys(compressionStats).length > 0 && !isUploading && !isCompressing && (
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <div className="flex">
            <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-700">
                Reduced file size by {savings.percent}% ({savings.saved} saved)
              </p>
              {savings.pngCount > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {savings.pngCount} PNG {savings.pngCount === 1 ? 'file' : 'files'} optimized
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uploaded files ({uploadedFiles.length}/{maxFiles})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={file.id} className="relative group aspect-square">
                <Image
                  src={file.thumbnailUrl || file.url}
                  alt={file.originalFilename || `Uploaded image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Drop zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
          transition-colors duration-200
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isUploading || isCompressing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <FiUploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 text-center mb-1">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 text-center mb-3">
          Supports: {acceptedTypes.replace(/\*/g, 'all')} (Max: {maxFiles} files)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={openFileDialog}
            disabled={isUploading || isCompressing || uploadedFiles.length >= maxFiles}
          >
            Select Files
          </button>
          
          {/* Quality toggle button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleHighQuality();
            }}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center
              ${useHighQuality 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {useHighQuality ? 'High Quality' : 'Standard Quality'}
          </button>
        </div>
      </div>
    </div>
  );
} 