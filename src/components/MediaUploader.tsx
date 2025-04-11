"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';

export interface UploadedMedia {
  id: string;
  url: string;
  thumbnailUrl: string;
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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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

  // Common function to handle file uploads
  const uploadFiles = async (fileList: FileList) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      
      // Loop through each file and append to formData
      // Limit to maxFiles
      const filesToUpload = Array.from(fileList).slice(0, maxFiles);
      filesToUpload.forEach(file => {
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
        disabled={isUploading}
      />

      {/* Drop zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={!isUploading ? openFileDialog : undefined}
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
          ) : (
            <>
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drop your images here, or <span className="text-blue-500">click to browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to {maxFiles} images (JPG, PNG, WebP)
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
                  <Image
                    src={file.thumbnailUrl || file.url}
                    alt={file.originalFilename}
                    fill
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