"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader, FiImage, FiZoomIn } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';

export interface UploadedMedia {
  id: string;
  url: string;           // Default URL (now using large)
  thumbnailUrl: string;  // Thumbnail variant (300px)
  gridUrl: string;       // Grid variant (200px)
  mediumUrl: string;     // Medium variant (800px)
  largeUrl: string;      // Large variant (1600px max)
  width: number;
  height: number;
  aspectRatio: string;
  originalFilename: string;
}

interface MediaUploaderProps {
  onMediaUpload?: (media: UploadedMedia[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
  className?: string;
}

export default function MediaUploader({
  onMediaUpload,
  maxFiles = 5,
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
  const [compressingFiles, setCompressingFiles] = useState<Record<string, boolean>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image with quality preservation
  const compressImage = async (file: File): Promise<File> => {
    setCompressingFiles(prev => ({ ...prev, [file.name]: true }));
    
    try {
      // Determine if this is a detailed/important image that needs higher quality
      // For now, assume all images are important in a travel context
      const options = {
        maxSizeMB: useHighQuality ? 3 : 1.5,             
        maxWidthOrHeight: useHighQuality ? 2560 : 2048,   
        initialQuality: useHighQuality ? 0.9 : 0.85,     
        useWebWorker: true,
        preserveExif: true,                              
        exifOrientationFix: true,
        fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg',
        alwaysKeepResolution: true,
      };
      
      // Store original size for stats
      const fileName = file.name;
      const originalSize = file.size;
      
      // Perform compression
      const compressedFile = await imageCompression(file, options);
      
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
    } finally {
      setCompressingFiles(prev => ({ ...prev, [file.name]: false }));
    }
  };
  
  // Process multiple files with compression in parallel
  const processFiles = async (fileList: FileList): Promise<File[]> => {
    const filesToProcess = Array.from(fileList).slice(0, maxFiles);
    
    // Set the global compressing state
    setIsCompressing(true);
    
    try {
      // Process all image files in parallel
      const processPromises = filesToProcess.map(async (file) => {
        if (file.type.startsWith('image/')) {
          // Compress images in parallel
          return await compressImage(file);
        } else {
          // Non-image files pass through unchanged
          return file;
        }
      });
      
      // Wait for all files to be processed
      const processedFiles = await Promise.all(processPromises);
      return processedFiles;
    } finally {
      // Clear the global compressing state when all done
      setIsCompressing(false);
    }
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
    
    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      
      // Append each file to formData
      files.forEach(file => {
        formData.append('media', file);
      });
      
      // Upload the files with progress monitoring
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Create a promise to handle the XHR response
      const uploadPromise = new Promise<UploadedMedia[]>((resolve, reject) => {
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
      
      // Send the request
      xhr.open('POST', '/api/media/upload');
      xhr.send(formData);
      
      // Wait for the promise to resolve
      const uploadedMedia = await uploadPromise;
      
      // Update state with the uploaded files
      setUploadedFiles(prev => [...prev, ...uploadedMedia]);
      
      // Call the callback if provided
      if (onMediaUpload) {
        onMediaUpload(uploadedMedia);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError((error as Error).message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
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
    
    // Log the statistics (for debugging)
    console.log('Compression stats:', {
      totalOriginal,
      totalCompressed,
      savedBytes,
      savingsPercent,
      items: Object.keys(compressionStats).length
    });
    
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
      percent: savingsPercent
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

  // Get count of files currently being compressed
  const compressingCount = Object.values(compressingFiles).filter(Boolean).length;

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
      
      {/* Quality toggle */}
      <div className="flex items-center justify-end mb-2">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useHighQuality}
            onChange={toggleHighQuality}
            className="mr-2 h-4 w-4"
            disabled={isUploading || isCompressing}
          />
          High quality upload
        </label>
        <div className="ml-2 text-xs text-gray-500 inline-flex items-center">
          <FiZoomIn className="mr-1" />
          {useHighQuality ? 'Less compression, higher quality' : 'Standard quality'}
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
          ${(isUploading || isCompressing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={!(isUploading || isCompressing) ? openFileDialog : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {isCompressing ? (
            <div className="flex flex-col items-center space-y-3">
              <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">
                Optimizing {compressingCount} {compressingCount === 1 ? 'image' : 'images'}...
              </p>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drop your images here, or <span className="text-blue-500">click to browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to {maxFiles} images (JPG, PNG, WebP)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {useHighQuality 
                  ? 'Using high quality mode (up to 3MB per image)' 
                  : 'Images will be optimized for web (up to 1.5MB per image)'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Compression statistics - Make more prominent and ensure it's always visible after compression */}
      {Object.keys(compressionStats).length > 0 && savings && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Image Optimization Results</h3>
          <div className="text-sm text-blue-700">
            <p>
              <span className="font-medium">Files optimized:</span> {Object.keys(compressionStats).length}
            </p>
            <p>
              <span className="font-medium">Size reduction:</span> {savings.original} → {savings.compressed}
            </p>
            <p>
              <span className="font-medium">Space saved:</span> {savings.saved} ({savings.percent}%)
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {uploadError}
        </div>
      )}

      {/* Preview of uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.id}-${index}`} className="relative group rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={file.thumbnailUrl || file.url}
                    alt={file.originalFilename}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw" 
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 