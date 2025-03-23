import React from 'react';

interface BillingToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

const BillingToggle = ({ billingPeriod, setBillingPeriod }: BillingToggleProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center p-1 border border-gray-300 rounded-full">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={`px-6 py-2 rounded-full text-sm font-medium ${
            billingPeriod === 'monthly' 
              ? 'bg-black text-white' 
              : 'text-gray-600'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={`px-6 py-2 rounded-full text-sm font-medium ${
            billingPeriod === 'yearly' 
              ? 'bg-black text-white' 
              : 'text-gray-600'
          }`}
        >
          Yearly <span className="text-green-500 font-bold">Save 15%</span>
        </button>
      </div>
    </div>
  );
};

export default BillingToggle;
