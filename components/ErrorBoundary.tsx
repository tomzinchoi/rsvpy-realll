"use client";

import React, { useState, useEffect } from 'react';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught in error boundary:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="max-w-md p-8 rounded-lg text-center" 
          style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(21,21,21,0.7)',
            border: '1px solid rgba(51,51,51,0.2)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
          }}>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">We encountered an error while loading the application.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
