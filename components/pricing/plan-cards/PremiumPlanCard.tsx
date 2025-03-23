import React from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface PremiumPlanCardProps {
  billingPeriod: 'monthly' | 'yearly';
  user: User | null;
}

const PremiumPlanCard = ({ billingPeriod, user }: PremiumPlanCardProps) => {
  return (
    <div className="border-2 border-black rounded-lg p-8 bg-white relative shadow-lg transform md:scale-105">
      <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        POPULAR
      </div>
      <h3 className="text-xl font-bold mb-4">Premium</h3>
      <p className="text-gray-600 mb-6">For regular event organizers</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">${billingPeriod === 'monthly' ? '9.99' : '8.49'}</span>
        <span className="text-gray-500">/{billingPeriod === 'monthly' ? 'month' : 'month, billed yearly'}</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Unlimited events</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Advanced RSVP features</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Up to 200 guests per event</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Custom image uploads</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>No RSVPY branding</span>
        </li>
      </ul>
      
      <Link
        href={user ? "/subscribe?plan=premium" : "/login?subscribe=premium"}
        className="block w-full py-3 px-4 text-center bg-black text-white rounded-md font-medium hover:bg-gray-800"
      >
        {user ? "Upgrade Now" : "Get Premium"}
      </Link>
    </div>
  );
};

export default PremiumPlanCard;
