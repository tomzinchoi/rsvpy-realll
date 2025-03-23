'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SubscribePage() {
  const { user, isLoading } = useAuth(); // Use isLoading instead of loading
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'premium';
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/subscribe?plan=${plan}`);
    }
  }, [user, isLoading, router, plan]);
  
  // Plan details
  const planDetails = {
    premium: {
      name: 'Premium Plan',
      monthly: 9.99,
      yearly: 8.49 * 12,
      features: [
        'Unlimited events',
        'Advanced RSVP features',
        'Up to 200 guests per event',
        'Custom image uploads',
        'No RSVPY branding'
      ]
    },
    pro: {
      name: 'Professional Plan',
      monthly: 24.99,
      yearly: 21.24 * 12,
      features: [
        'Everything in Premium',
        'Custom domain support',
        'Unlimited guests',
        'Advanced analytics',
        'Priority support'
      ]
    }
  };
  
  // Mock payment handler (replace with real payment processing)
  const handlePayment = async (billingCycle: 'monthly' | 'yearly') => {
    if (!user) return;
    
    setProcessingPayment(true);
    setError(null);
    
    try {
      // In a real app, this would call a payment API
      console.log(`Processing ${billingCycle} payment for ${plan} plan`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - in a real app, we would update the user's subscription in the database
      router.push('/dashboard?subscription=success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // Get the current plan details
  const currentPlanData = planDetails[plan as keyof typeof planDetails] || planDetails.premium;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/pricing" className="inline-block mb-8 text-black hover:underline">
        &larr; Back to Plans
      </Link>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Subscribe to {currentPlanData.name}</h1>
        <p className="text-gray-600 mb-8">Select your preferred billing cycle to continue</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-6 hover:border-black">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">Monthly Billing</h3>
                <p className="text-gray-600">Flexible, cancel anytime</p>
              </div>
              <p className="text-2xl font-bold">${currentPlanData.monthly.toFixed(2)}/mo</p>
            </div>
            <button
              onClick={() => handlePayment('monthly')}
              disabled={processingPayment}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {processingPayment ? 'Processing...' : 'Choose Monthly Billing'}
            </button>
          </div>
          
          <div className="border-2 border-black rounded-lg p-6 relative">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              BEST VALUE
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">Annual Billing</h3>
                <p className="text-gray-600">Save 15% compared to monthly</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${(currentPlanData.yearly / 12).toFixed(2)}/mo</p>
                <p className="text-gray-600 text-sm">Billed as ${currentPlanData.yearly.toFixed(2)}/year</p>
              </div>
            </div>
            <button
              onClick={() => handlePayment('yearly')}
              disabled={processingPayment}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {processingPayment ? 'Processing...' : 'Choose Annual Billing'}
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium mb-3">Plan Includes:</h3>
          <ul className="space-y-2">
            {currentPlanData.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
