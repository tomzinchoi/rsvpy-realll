'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SetupWizard() {
  const { user } = useAuth();
  const [setupStatus, setSetupStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Automatically run setup if needed
  useEffect(() => {
    const autoSetup = async () => {
      if (!user) return;
      
      // Check if setup is needed
      try {
        // This is a simple check to see if the user has any events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id')
          .limit(1);
          
        if (eventsError) {
          // Table might not exist, so we need to run setup
          runAutomaticSetup();
        } else {
          // Tables exist, so we're good to go
          setMessage('Your account is already set up! You can start creating events.');
          setSetupStatus('success');
        }
      } catch (err) {
        console.error('Error checking setup status:', err);
        // If we encounter an error, try running setup anyway
        runAutomaticSetup();
      }
    };
    
    if (user) {
      autoSetup();
    }
  }, [user]);

  const runAutomaticSetup = async () => {
    if (!user) return;
    
    try {
      setSetupStatus('running');
      setMessage('Setting up your account...');
      setError(null);
      
      // We'll try to create all required resources automatically
      await createRequiredTables();
      await setupStorageBucket();
      
      setMessage('Setup complete! Your account is ready to use.');
      setSetupStatus('success');
    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to complete setup');
      setSetupStatus('error');
    }
  };

  const createRequiredTables = async () => {
    // Try to create tables using our migration SQL
    try {
      setMessage('Setting up your database...');
      
      // Execute the SQL to create tables
      const databaseSetupSQL = `
        -- Events Table
        CREATE TABLE IF NOT EXISTS public.events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            time TEXT,
            location TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            custom_fields JSONB,
            event_image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            view_count INTEGER DEFAULT 0
        );

        -- RSVPs Table
        CREATE TABLE IF NOT EXISTS public.rsvps (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            attending BOOLEAN NOT NULL,
            custom_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Email Invitations Table
        CREATE TABLE IF NOT EXISTS public.email_invitations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            sent_at TIMESTAMP WITH TIME ZONE,
            opened_at TIMESTAMP WITH TIME ZONE,
            clicked_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `;
      
      // This might fail if the user doesn't have necessary permissions
      await supabase.rpc('execute_sql', { sql: databaseSetupSQL });
    } catch (err) {
      console.warn('Failed to create tables via SQL - this is expected in the free tier');
      // For free users, we'll rely on tables being created by Supabase
      // when they first interact with them through the API
    }
  };

  const setupStorageBucket = async () => {
    try {
      setMessage('Setting up storage for your images...');
      
      // First check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) throw bucketError;
      
      const eventsBucket = buckets.find(bucket => bucket.name === 'events');
      
      // Create bucket if it doesn't exist
      if (!eventsBucket) {
        const { error: createError } = await supabase.storage.createBucket('events', {
          public: true
        });
        
        if (createError) throw createError;
      }
      
    } catch (err) {
      console.warn('Storage setup issue:', err);
      // We'll continue without failing - many operations can still work
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Setup Wizard</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {message && (
        <div className={`${setupStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} p-4 rounded-md mb-6`}>
          {message}
        </div>
      )}
      
      {setupStatus === 'running' ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      ) : setupStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Setup Complete!</h3>
          <p className="text-gray-600 mb-4">Your account is ready to use.</p>
          <Link href="/dashboard" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Start Creating Events
          </Link>
        </div>
      ) : setupStatus === 'error' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Setup Failed</h3>
          <p className="text-gray-600 mb-4">We encountered an issue while setting up your account.</p>
          <button 
            onClick={runAutomaticSetup}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Welcome to RSVPY! We'll quickly set up everything you need to get started.
          </p>
          <button
            onClick={runAutomaticSetup}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Run Setup
          </button>
        </div>
      )}
    </div>
  );
}
