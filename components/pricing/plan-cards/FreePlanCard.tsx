import React from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface FreePlanCardProps {
  user: User | null;
}

const FreePlanCard = ({ user }: FreePlanCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-8 bg-white">
      <h3 className="text-xl font-bold mb-4">Free</h3>
      <p className="text-gray-600 mb-6">Perfect for individuals with occasional events</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">$0</span>
        <span className="text-gray-500">/forever</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Up to 3 events</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Basic RSVP functionality</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Up to 50 guests per event</span>
        </li>
        <li className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Basic event page customization</span>
        </li>
        <li className="flex items-start text-gray-400">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>RSVPY branding included</span>
        </li>
      </ul>
      
      <Link 
        href={user ? "/dashboard" : "/login"}
        className="block w-full py-3 px-4 text-center border border-black rounded-md font-medium"
      >
        {user ? "Access Dashboard" : "Get Started"}
      </Link>
    </div>
  );
};

export default FreePlanCard;
