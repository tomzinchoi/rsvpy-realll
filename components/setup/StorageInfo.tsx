import React from 'react';

const StorageInfo = () => {
  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-semibold mb-3">Storage Setup</h2>
      
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="text-blue-800">
          RSVPY will automatically set up storage for your images when you upload them.
          Free accounts use placeholder images. Upgrade to Premium for custom image uploads.
        </p>
      </div>
    </div>
  );
};

export default StorageInfo;
