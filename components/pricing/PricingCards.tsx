import React from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import FreePlanCard from './plan-cards/FreePlanCard';
import PremiumPlanCard from './plan-cards/PremiumPlanCard';
import ProPlanCard from './plan-cards/ProPlanCard';

interface PricingCardsProps {
  billingPeriod: 'monthly' | 'yearly';
  user: User | null;
}

const PricingCards = ({ billingPeriod, user }: PricingCardsProps) => {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
      <FreePlanCard user={user} />
      <PremiumPlanCard billingPeriod={billingPeriod} user={user} />
      <ProPlanCard billingPeriod={billingPeriod} user={user} />
    </div>
  );
};

export default PricingCards;
