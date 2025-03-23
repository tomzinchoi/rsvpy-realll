import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const ConfigCheck = () => {
  const [status, setStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    connection: boolean;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    connection: false
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        // Check Supabase URL and key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        const validUrl = !!supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co';
        const validKey = !!supabaseKey && supabaseKey !== 'your-anon-key';
        
        // Check connection to Supabase
        let connectionSuccess = false;
        try {
          const { data, error } = await supabase.auth.getSession();
          connectionSuccess = !error;
        } catch (e) {
          connectionSuccess = false;
        }
        
        setStatus({
          supabaseUrl: validUrl,
          supabaseKey: validKey,
          connection: connectionSuccess
        });
      } catch (err) {
        console.error('Error checking configuration:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkConfig();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-md animate-pulse">
        <p className="font-medium">Checking configuration...</p>
      </div>
    );
  }

  const allGood = status.supabaseUrl && status.supabaseKey && status.connection;

  return (
    <div className={`p-4 rounded-md ${allGood ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <h3 className={`font-medium mb-2 ${allGood ? 'text-green-800' : 'text-yellow-800'}`}>
        Configuration Status
      </h3>
      
      <ul className="space-y-1">
        <li className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status.supabaseUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            Supabase URL: {status.supabaseUrl ? 'Configured' : 'Missing or invalid'}
          </span>
        </li>
        <li className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status.supabaseKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            Supabase Key: {status.supabaseKey ? 'Configured' : 'Missing or invalid'}
          </span>
        </li>
        <li className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status.connection ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            Supabase Connection: {status.connection ? 'Connected' : 'Failed'}
          </span>
        </li>
      </ul>
      
      {!allGood && (
        <div className="mt-3 text-sm text-yellow-800">
          <p className="font-medium">Configuration Issues Detected</p>
          <p className="mt-1">
            Please check your <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> file and make sure your Supabase project is set up correctly.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfigCheck;
