'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCards from '@/components/pricing/PricingCards';
import PricingFaq from '@/components/pricing/PricingFaq';

export default function PricingPage() {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-6">Subscription Plans</h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Choose the perfect plan to elevate your event management experience with RSVPY
      </p>
      
      <BillingToggle 
        billingPeriod={billingPeriod} 
        setBillingPeriod={setBillingPeriod} 
      />
      
      <PricingCards 
        billingPeriod={billingPeriod} 
        user={user} 
      />
      
      <PricingFaq />
    </div>
  );
}
