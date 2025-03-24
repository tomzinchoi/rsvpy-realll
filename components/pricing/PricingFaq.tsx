'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function PricingFaq() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  
  const faqItems: FaqItem[] = [
    {
      question: 'How does the free plan work?',
      answer: 'Our free plan allows you to create up to 3 events per month with up to 50 guests per event. You\'ll have access to basic event pages and analytics, with RSVPY branding. It\'s perfect for personal events or trying out our platform.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can upgrade your plan at any time and the new features will be available immediately. If you downgrade, your current plan will remain active until the end of your billing cycle, then switch to the new plan.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal for payment. All payments are processed securely through our payment processor.'
    },
    {
      question: 'Is there a contract or commitment?',
      answer: 'No long-term contracts! Monthly plans can be canceled at any time. Annual plans provide savings but are paid upfront for the year - you can still cancel anytime, but refunds are prorated.'
    },
    {
      question: 'What happens to my events if I cancel my premium subscription?',
      answer: 'If you cancel your premium subscription, your existing events will remain accessible, but will revert to free plan limitations. You\'ll need to reduce your events to 3 or fewer if you exceed that limit.'
    },
    {
      question: 'Do you offer discounts for nonprofits or educational institutions?',
      answer: 'Yes, we offer special pricing for nonprofits, educational institutions, and community organizations. Please contact our sales team for more information about our discount programs.'
    }
  ];
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="glass-card rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
            >
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  openItems[index] ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openItems[index] 
                  ? 'max-h-96 pb-6 opacity-100' 
                  : 'max-h-0 pb-0 opacity-0'
              }`}
            >
              <p className="text-gray-400">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Still have questions? We're here to help!
        </p>
        <a
          href="/contact"
          className="mt-4 inline-block spacex-button-outline rounded-lg px-6 py-3"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
