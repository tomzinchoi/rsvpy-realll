'use client';

import { useState } from 'react';
import FreePlanCard from './plan-cards/FreePlanCard';
import PremiumPlanCard from './plan-cards/PremiumPlanCard';
import ProPlanCard from './plan-cards/ProPlanCard';
import BillingToggle from './BillingToggle';

export default function PricingCards() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  
  // Apply a discount for yearly billing
  const yearlyDiscount = 0.2; // 20% discount
  const calculateYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12 * (1 - yearlyDiscount);
    return Math.floor(yearlyPrice / 12); // Monthly equivalent price
  };
  
  // Pricing data
  const pricingData = {
    free: {
      name: 'Free',
      description: 'Perfect for small events and personal use',
      price: 0, // 문자열 "$0"에서 숫자 0으로 변경
      features: [
        'Up to 3 events per month',
        'Basic event pages',
        'Up to 50 guests per event',
        'Email invitations with RSVPY branding',
        'Basic analytics'
      ],
      limitations: [
        'Limited to 3 photos per event',
        'RSVPY branding on event pages',
        'Standard support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    premium: {
      name: 'Premium',
      description: 'For frequent event planners who need more features',
      price: billingInterval === 'monthly' ? 12 : calculateYearlyPrice(12),
      features: [
        'Unlimited events',
        'Custom event pages',
        'Up to 250 guests per event',
        'Email invitations without branding',
        'Advanced analytics',
        'Custom forms and fields',
        'Priority email support'
      ],
      limitations: [],
      cta: 'Upgrade Now',
      highlighted: true
    },
    pro: {
      name: 'Professional',
      description: 'For businesses and professional event planners',
      price: billingInterval === 'monthly' ? 29 : calculateYearlyPrice(29),
      features: [
        'Everything in Premium',
        'Unlimited guests',
        'API access',
        'White-label solution',
        'Dedicated account manager',
        'Custom domain support',
        'Event series and recurring events',
        'Priority phone support'
      ],
      limitations: [],
      cta: 'Contact Sales',
      highlighted: false
    }
  };
  
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <BillingToggle
          value={billingInterval}
          onChange={setBillingInterval}
        />
        {billingInterval === 'yearly' && (
          <div className="mt-2 inline-block bg-accent/10 text-accent text-sm px-3 py-1 rounded-full">
            Save 20% with annual billing
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        <div className="h-full flex">
          <FreePlanCard 
            billingInterval={billingInterval}
            {...pricingData.free}
          />
        </div>
        
        <div className="h-full flex transform md:scale-105 md:-translate-y-2 z-10">
          <PremiumPlanCard 
            billingInterval={billingInterval}
            {...pricingData.premium}
          />
        </div>
        
        <div className="h-full flex">
          <ProPlanCard 
            billingInterval={billingInterval}
            {...pricingData.pro}
          />
        </div>
      </div>
      
      <div className="text-center mt-10 text-gray-400 max-w-2xl mx-auto">
        <p className="text-sm">
          All plans include a 14-day free trial. No credit card required for free plan.
          Questions about our pricing? <a href="/contact" className="text-accent hover:underline">Contact us</a>.
        </p>
      </div>
    </div>
  );
}
