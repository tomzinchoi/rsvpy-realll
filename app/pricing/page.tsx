'use client';

import PricingCards from '@/components/pricing/PricingCards';
import PricingFaq from '@/components/pricing/PricingFaq';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 text-lg">
            Choose the perfect plan to elevate your event management experience with RSVPY
          </p>
          {/* Removed the unused toggle switch that was here */}
        </div>
        
        <PricingCards />
        
        <div className="section-divider"></div>
        
        <PricingFaq />
      </div>
    </div>
  );
}
