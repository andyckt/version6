"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader, FiImage, FiZoomIn, FiAlertCircle, FiCheck, FiUploadCloud } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';

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
  const [currentBatch, setCurrentBatch] = useState<number>(1);
  const [totalBatches, setTotalBatches] = useState<number>(1);
  
  const BATCH_SIZE = 5; // Process in batches of 5 for performance
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
    // Take up to maxFiles from the input
    const allFilesToProcess = Array.from(fileList).slice(0, maxFiles);
    
    // Reset counters
    setFilesProcessed(0);
    setFilesToProcess(allFilesToProcess.length);
    setIsCompressing(true);
    
    // Calculate total batches
    const batches = Math.ceil(allFilesToProcess.length / BATCH_SIZE);
    setTotalBatches(batches);
    setCurrentBatch(1);
    
    // Process all files in parallel for compression
    const processPromises = allFilesToProcess.map(async (file, index) => {
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

  // Common function to handle file uploads
  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);
    
    // Notify parent component that upload has started
    if (onUploadStart) {
      onUploadStart();
    }
    
    try {
      // Split files into batches of BATCH_SIZE
      const fileBatches = [];
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        fileBatches.push(files.slice(i, i + BATCH_SIZE));
      }
      
      let allUploadedMedia: UploadedMedia[] = [];
      
      // Process each batch sequentially
      for (let batchIndex = 0; batchIndex < fileBatches.length; batchIndex++) {
        const batch = fileBatches[batchIndex];
        setCurrentBatch(batchIndex + 1);
        
        // Create a FormData object for this batch
        const formData = new FormData();
        
        // Append each file in the batch to formData
        batch.forEach(file => {
          formData.append('media', file);
        });
        
        // Upload the batch with progress monitoring
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            // Calculate overall progress across batches
            const batchProgress = Math.round((event.loaded / event.total) * 100);
            const overallProgress = Math.round(
              ((batchIndex * 100) + batchProgress) / fileBatches.length
            );
            setUploadProgress(overallProgress);
          }
        });
        
        // Create a promise to handle the XHR response for this batch
        const uploadBatchPromise = new Promise<UploadedMedia[]>((resolve, reject) => {
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  resolve(response.files);
                } else {
                  reject(new Error(response.error || 'Upload failed'));
                }
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };
        });
        
        // Send the request for this batch
        xhr.open('POST', '/api/media/upload');
        xhr.send(formData);
        
        // Wait for this batch to complete before proceeding to the next
        const batchUploadedMedia = await uploadBatchPromise;
        allUploadedMedia = [...allUploadedMedia, ...batchUploadedMedia];
      }
      
      // Update state with all the uploaded files
      setUploadedFiles(prev => [...prev, ...allUploadedMedia]);
      
      // Call the callback if provided
      if (onMediaUpload) {
        onMediaUpload(allUploadedMedia);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError((error as Error).message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentBatch(1);
      
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
            {totalBatches > 1 && (
              <span>Batch {currentBatch} of {totalBatches}</span>
            )}
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
          Supports: {acceptedTypes.replace(/\*/g, 'all')} (Max: {maxFiles} files, processed in batches of {BATCH_SIZE})
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