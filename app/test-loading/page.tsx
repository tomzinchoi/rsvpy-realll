'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TestLoadingPage() {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setStatus('Creating Supabase client...');
        const supabase = createClientComponentClient();
        
        setStatus('Testing connection...');
        // Try a simple query that doesn't require authentication
        const { count, error } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          throw new Error(`Database query failed: ${error.message}`);
        }
        
        setStatus('Connection successful!');
      } catch (err: any) {
        console.error('Error testing Supabase connection:', err);
        setError(err.message || 'Unknown error occurred');
        setStatus('Failed');
      }
    };
    
    checkSupabase();
  }, []);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="glass-card p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">RSVPY Connection Test</h1>
        
        <div className="flex items-center justify-center mb-4">
          <LoadingSpinner size="medium" />
          <span className="ml-3 text-white">{status}</span>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded mb-4">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="mt-6">
          <a href="/" className="spacex-button py-2 px-4 rounded inline-block">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
