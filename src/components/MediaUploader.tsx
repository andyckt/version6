"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader, FiSettings } from 'react-icons/fi';
import BlurImage from './BlurImage';

export interface UploadedMedia {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  aspectRatio: string;
  originalFilename: string;
  dominantColor?: string;
}

interface MediaUploaderProps {
  onMediaUpload?: (media: UploadedMedia[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
  className?: string;
  maxImageSize?: number; // Max image size in MB
  maxDimension?: number; // Max width/height in pixels
  compressionQuality?: number; // 0-1 value for image compression
}

// Constants for client-side optimization
const MAX_IMAGE_SIZE_MB = 5;  // Default max image size in MB
const MAX_DIMENSION = 2048;   // Default max dimension (width/height)
const DEFAULT_QUALITY = 0.85; // Default compression quality
const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB chunks for upload

// Helper function to compress an image client-side
const optimizeImage = async (
  file: File, 
  maxDimension: number, 
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create a new FileReader to read the file
    const reader = new FileReader();
    
    // Set up the onload handler
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // Create an image element
      const img = new Image();
      
      img.onload = () => {
        // Get the image dimensions and determine scaling factor
        let width = img.width;
        let height = img.height;
        let scaleFactor = 1;
        
        // Scale down the image if it exceeds max dimensions
        if (width > maxDimension || height > maxDimension) {
          scaleFactor = maxDimension / Math.max(width, height);
          width = width * scaleFactor;
          height = height * scaleFactor;
        }
        
        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Get the canvas context and draw the image
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          file.type,
          quality
        );
      };
      
      // Set the image source to the loaded file
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};

// Helper function to extract dominant color from an image
const extractDominantColor = async (file: File): Promise<string | undefined> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        
        img.onload = () => {
          // Create a tiny canvas to sample the average color
          const canvas = document.createElement('canvas');
          canvas.width = 5;
          canvas.height = 5;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(undefined);
          
          // Draw the image scaled down to 5x5
          ctx.drawImage(img, 0, 0, 5, 5);
          
          // Get the pixel data
          const data = ctx.getImageData(0, 0, 5, 5).data;
          
          // Calculate average color
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          
          // Calculate the averages
          const count = data.length / 4;
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          // Return the color as hex
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          resolve(hex);
        };
        
        img.onerror = () => resolve(undefined);
        img.src = event.target?.result as string;
      };
      
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    } catch (error) {
      resolve(undefined);
    }
  });
};

export default function MediaUploader({
  onMediaUpload,
  maxFiles = 5,
  acceptedTypes = "image/*",
  className = "",
  maxImageSize = MAX_IMAGE_SIZE_MB,
  maxDimension = MAX_DIMENSION,
  compressionQuality = DEFAULT_QUALITY,
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingFiles, setProcessingFiles] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for when files are selected via the file input
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
    }
  };

  // Handler for the drop event
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  // Common function to handle file uploads with optimizations
  const uploadFiles = async (fileList: FileList) => {
    setProcessingFiles(true);
    setIsUploading(false);
    setUploadError(null);
    
    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      
      // Loop through each file, process it, and append to formData
      const filesToUpload = Array.from(fileList).slice(0, maxFiles);
      
      // Process all files in parallel
      await Promise.all(filesToUpload.map(async (file, index) => {
        // Only process image files
        if (file.type.startsWith('image/')) {
          try {
            // Extract dominant color before optimizing
            const dominantColor = await extractDominantColor(file);
            
            // Optimize the image
            const optimizedImageBlob = await optimizeImage(
              file,
              maxDimension,
              compressionQuality
            );
            
            // Create a new File from the optimized blob
            const optimizedFile = new File(
              [optimizedImageBlob],
              file.name,
              { type: file.type }
            );
            
            // Add a data attribute to track the dominant color
            if (dominantColor) {
              formData.append(`color_${index}`, dominantColor);
            }
            
            // Add the optimized file
            formData.append('media', optimizedFile);
          } catch (err) {
            console.warn('Error optimizing image, using original:', err);
            formData.append('media', file);
          }
        } else {
          // For non-image files, just add them directly
          formData.append('media', file);
        }
      }));
      
      setProcessingFiles(false);
      setIsUploading(true);
      
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
      setProcessingFiles(false);
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
        disabled={isUploading || processingFiles}
      />

      {/* Drop zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
          ${(isUploading || processingFiles) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={!(isUploading || processingFiles) ? openFileDialog : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {isUploading ? (
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
          ) : processingFiles ? (
            <div className="flex flex-col items-center space-y-3">
              <FiSettings className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Optimizing images...</p>
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
              <p className="text-xs text-gray-400 mt-1">
                Images will be optimized automatically
              </p>
            </>
          )}
        </div>
      </div>

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
                  <BlurImage
                    src={file.thumbnailUrl || file.url}
                    alt={file.originalFilename}
                    aspectRatio="aspect-square"
                    className="object-cover"
                    dominantColor={file.dominantColor}
                    sizes="(max-width: 768px) 120px, 150px"
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