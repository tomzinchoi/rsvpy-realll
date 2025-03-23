import React, { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import Link from 'next/link';

interface ImageUploaderProps {
  eventId: string;
  onImageUploaded?: (url: string) => void;
}

const ImageUploader = ({ eventId, onImageUploaded }: ImageUploaderProps) => {
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
      const fileName = `${eventId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
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
          // Call the callback with the URL
          onImageUploaded && onImageUploaded(urlData.publicUrl);
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
        const placeholderUrl = `https://placehold.co/600x400/F8F7F2/000000?text=Event:+${encodeURIComponent(eventId)}`;
        
        // Call the callback with the placeholder URL
        onImageUploaded && onImageUploaded(placeholderUrl);
        
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

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Event Image
      </label>
      
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
            {uploading ? `Uploading... ${progress}%` : 'Click to upload an image'}
          </span>
          
          {!storageReady && !uploading && (
            <span className="text-xs text-yellow-600 mt-1">
              Using placeholder images for free accounts
            </span>
          )}
        </label>
      </div>
      
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
      
      <div className="mt-2 text-xs text-gray-500">
        Free accounts use placeholder images. <Link href="/pricing" className="text-black underline">Upgrade</Link> for custom image uploads.
        <span className="italic"> (Coming soon: Free tier will be limited to 3 photos per event)</span>
      </div>
    </div>
  );
};

export default ImageUploader;
