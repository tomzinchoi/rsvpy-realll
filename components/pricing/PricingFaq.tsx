import React from 'react';

const PricingFaq = () => {
  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">Can I try premium features before subscribing?</h3>
          <p className="text-gray-600">Not currently, but we're working on a 7-day trial option. Stay tuned!</p>
        </div>
        
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">Can I change my subscription plan?</h3>
          <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
        </div>
        
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">What happens to my data if I downgrade?</h3>
          <p className="text-gray-600">Your data is preserved, but access to premium features is restricted. Events over your new plan's limit will be archived but not deleted.</p>
        </div>
        
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">How do I cancel my subscription?</h3>
          <p className="text-gray-600">You can cancel your subscription anytime from your account settings. You'll continue to have access until the end of your current billing period.</p>
        </div>
      </div>
    </div>
  );
};

export default PricingFaq;
