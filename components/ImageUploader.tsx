'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

export interface ImageUploaderProps {
  currentImages?: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ currentImages = [], onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [storageReady, setStorageReady] = useState<boolean>(false);

  // Check if storage is available and try to ensure it's set up
  useEffect(() => {
    const setupStorage = async () => {
      try {
        // First check if bucket exists
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.warn('Storage bucket check failed:', bucketError);
          setStorageReady(false);
          return;
        }
        
        const eventsBucket = buckets.find(bucket => bucket.name === 'events');
        
        if (eventsBucket) {
          // Bucket exists
          setStorageReady(true);
        } else {
          // Try to create the bucket
          try {
            const { error: createError } = await supabase.storage.createBucket('events', { 
              public: true 
            });
            
            if (createError) {
              console.warn('Could not create storage bucket:', createError);
              setStorageReady(false);
            } else {
              setStorageReady(true);
            }
          } catch (err) {
            console.warn('Error creating bucket:', err);
            setStorageReady(false);
          }
        }
      } catch (err) {
        console.warn('Storage setup check failed:', err);
        setStorageReady(false);
      }
    };
    
    setupStorage();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadError(null);
      const files = event.target.files;
      
      if (!files || files.length === 0) {
        return;
      }
      
      const file = files[0];
      
      // Basic file validation
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only JPG, PNG and GIF files are allowed');
        return;
      }
      
      setUploading(true);
      setProgress(25);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      try {
        // Try to upload directly
        const { data, error } = await supabase.storage
          .from('events')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        setProgress(75);
        
        if (error) {
          throw error;
        }
        
        setProgress(100);
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
        
        if (urlData && urlData.publicUrl) {
          // Add the new image to currentImages
          const updatedImages = [...currentImages, urlData.publicUrl];
          onChange(updatedImages);
        } else {
          setUploadError('Failed to get public URL for uploaded image');
        }
      } catch (uploadError: any) {
        // If the bucket doesn't exist or there's a policy issue,
        // we'll fall back to using a placeholder or external image hosting
        console.error('Upload error:', uploadError);
        
        // For the free tier without proper storage, we can either:
        // 1. Use placeholders
        // 2. Guide users to a workaround
        
        // Example: Generate a placeholder URL
        const placeholderUrl = `https://placehold.co/600x400/F8F7F2/000000?text=Event+Image`;
        
        // Add the placeholder to currentImages
        const updatedImages = [...currentImages, placeholderUrl];
        onChange(updatedImages);
        
        // Show a helpful message but don't treat it as a fatal error
        setUploadError(
          'Your image was replaced with a placeholder. Upgrade to Premium for custom image uploads.'
        );
      }
    } catch (error: any) {
      console.error('Unexpected error during upload:', error);
      setUploadError('Unexpected error: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="h-32 w-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentImages.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span className="mt-2 text-gray-600">
              {uploading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Uploading... {progress}%</span>
                </div>
              ) : (
                `Click to upload image (${currentImages.length}/${maxImages})`
              )}
            </span>
            
            {!storageReady && !uploading && (
              <span className="text-xs text-yellow-600 mt-1">
                Using placeholder images for free accounts
              </span>
            )}
          </label>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-2">
          {uploadError.includes('placeholder') ? (
            <div className="text-yellow-600 text-sm p-2 bg-yellow-50 rounded flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{uploadError}</p>
            </div>
          ) : (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              <p>{uploadError}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Free accounts use placeholder images. <Link href="/pricing" className="text-black underline">Upgrade</Link> for custom image uploads.
        <span className="italic"> (Coming soon: Free tier will be limited to 3 photos per event)</span>
      </div>
    </div>
  );
}
