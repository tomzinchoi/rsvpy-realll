import React from 'react';
import Link from 'next/link';

const SubscriptionBenefits = () => {
  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-semibold mb-3">Subscription Benefits</h2>
      <p className="text-gray-600 mb-4">
        RSVPY is free to use, but our premium subscription offers additional features:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Remove RSVPY branding from invitations</li>
        <li>Increased event attendance limits</li>
        <li>Advanced analytics and reporting</li>
        <li>Priority support</li>
        <li>Custom domain for your event pages</li>
      </ul>
      
      <div className="mt-4">
        <Link href="/pricing" className="text-black font-medium hover:underline">
          View Subscription Plans &rarr;
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBenefits;
