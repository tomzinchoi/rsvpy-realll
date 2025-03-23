import React from 'react';
import Link from 'next/link';

// This is a simple replacement for the original StorageSetupHelper
// It now just redirects users to the setup page
const StorageSetupHelper = () => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="font-medium text-lg mb-3">Storage Setup</h3>
      
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="text-blue-800">
          RSVPY automatically configures storage for your images when you upload them.
          Free users get placeholder images, while premium subscribers can upload custom images.
        </p>
      </div>
      
      <div className="mt-4">
        <Link 
          href="/setup"
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm inline-block"
        >
          Go to Setup Wizard
        </Link>
        
        <div className="mt-3 text-sm text-gray-600">
          <p>If you encounter any issues with image uploads:</p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Visit the Setup Wizard page</li>
            <li>Run the automatic setup process</li>
            <li>If problems persist, check our troubleshooting guide</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StorageSetupHelper;
