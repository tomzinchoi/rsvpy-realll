'use client';

import Link from 'next/link';

interface FreePlanCardProps {
  name: string;
  description: string;
  price: number;
  features: string[];
  limitations: string[];
  cta: string;
  highlighted: boolean;
  billingInterval: 'monthly' | 'yearly';
}

export default function FreePlanCard({
  name,
  description,
  price,
  features,
  limitations,
  cta,
  highlighted,
  billingInterval
}: FreePlanCardProps) {
  return (
    <div className="glass-card rounded-2xl flex flex-col w-full border border-border/20 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-border/20">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <p className="mt-2 text-gray-400">{description}</p>
        <div className="mt-6 flex items-baseline">
          <span className="text-5xl font-bold text-white">{price}</span>
          {price > 0 && (
            <span className="ml-1 text-gray-400">
              /{billingInterval === 'monthly' ? 'mo' : 'mo, billed annually'}
            </span>
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className="flex-grow p-6">
        <h4 className="text-lg font-semibold text-white mb-4">What's included:</h4>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        {limitations.length > 0 && (
          <>
            <h4 className="text-lg font-semibold text-white mt-6 mb-4">Limitations:</h4>
            <ul className="space-y-3">
              {limitations.map((limitation, idx) => (
                <li key={idx} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{limitation}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      
      {/* CTA Button */}
      <div className="p-6 border-t border-border/20">
        <Link
          href={price === 0 ? "/signup" : "/subscribe"}
          className={`w-full block text-center py-3 rounded-lg spacex-button-outline`}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
