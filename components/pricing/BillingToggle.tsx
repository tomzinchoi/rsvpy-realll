'use client';

import React from 'react';

interface BillingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
}

export default function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <span className={`text-sm font-medium ${value === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
        Monthly
      </span>
      
      <button
        type="button"
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
        style={{ 
          backgroundColor: value === 'yearly' ? 'var(--accent)' : 'var(--muted)'
        }}
        onClick={() => onChange(value === 'monthly' ? 'yearly' : 'monthly')}
        aria-pressed={value === 'yearly'}
      >
        <span className="sr-only">
          {value === 'monthly' ? 'Enable yearly billing' : 'Enable monthly billing'}
        </span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value === 'yearly' ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium ${value === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
        Yearly
      </span>
    </div>
  );
}
