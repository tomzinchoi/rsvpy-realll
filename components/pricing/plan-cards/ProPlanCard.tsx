import React from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface ProPlanCardProps {
  billingPeriod: 'monthly' | 'yearly';
  user: User | null;
}

const ProPlanCard = ({ billingPeriod, user }: ProPlanCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h3 className="text-xl font-bold mb-4">Professional</h3>
      <p className="text-gray-600 mb-6">For businesses and event pros</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">${billingPeriod === 'monthly' ? '24.99' : '21.24'}</span>
        <span className="text-gray-500">/{billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Everything in Premium</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Custom domain support</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Unlimited guests</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Advanced analytics</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Priority support</span>
        </li>
      </ul>
      
      <Link
        href={user ? "/subscribe?plan=pro" : "/login?subscribe=pro"}
        className="block w-full py-3 px-4 text-center border border-black rounded-md font-medium hover:bg-gray-50"
      >
        {user ? "Upgrade Now" : "Get Professional"}
      </Link>
    </div>
  );
};

export default ProPlanCard;
