"use client";

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface ProfileImageUploaderProps {
  initialImage?: string | { micro: string; media: string; original?: string };
  onImageUploaded: (imageData: { micro: string; media: string; original: string }) => void;
  className?: string;
}

export default function ProfileImageUploader({ 
  initialImage, 
  onImageUploaded, 
  className = '' 
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof initialImage === 'string' 
      ? initialImage 
      : initialImage?.media || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format the image URL for Cloudinary if needed
  const formatImageUrl = (url: string, size = 300) => {
    if (!url) return '';
    // If it's already a Cloudinary URL with transformations, return as is
    if (url.includes('/upload/c_')) return url;
    
    // For Cloudinary URLs, add transformations
    if (url.includes('cloudinary.com')) {
      return url.replace(/\/upload\//, `/upload/c_fill,g_face,w_${size},h_${size}/`);
    }
    
    return url;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile');

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Notify parent component about the uploaded image
      onImageUploaded({
        micro: data.micro || data.url,
        media: data.media || data.url,
        original: data.url
      });

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      // Reset preview on error
      setPreviewImage(
        typeof initialImage === 'string' 
          ? initialImage 
          : initialImage?.media || null
      );
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded({ micro: '', media: '', original: '' });
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-32 h-32 mb-4">
        {previewImage ? (
          <>
            <Image
              src={formatImageUrl(previewImage)}
              alt="Profile preview"
              width={128}
              height={128}
              className="rounded-full object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <FiX size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <FiUploadCloud size={40} />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white">
            Uploading...
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <FiUploadCloud className="mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
      </button>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Square images work best. Max 5MB.
      </p>
    </div>
  );
} 