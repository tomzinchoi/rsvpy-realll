'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Event Planning Made Simple
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in">
            Create beautiful invitations, collect RSVPs, and manage your events all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {!isLoading && user ? (
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-primary">
                  Get Started
                </Link>
                <Link href="/pricing" className="btn-outline">
                  View Pricing
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RSVPY?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-hover transition-shadow">
              <div className="mb-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Event Creation</h3>
              <p className="text-gray-600">Create beautiful event pages in minutes with our intuitive editor.</p>
            </div>
            <div className="card text-center hover:shadow-hover transition-shadow">
              <div className="mb-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Effortless RSVP Management</h3>
              <p className="text-gray-600">Collect responses and track attendance with real-time updates.</p>
            </div>
            <div className="card text-center hover:shadow-hover transition-shadow">
              <div className="mb-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Get insights on your event performance with comprehensive statistics.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Event Planners</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-xl font-semibold opacity-75">500+ Events</div>
            <div className="text-xl font-semibold opacity-75">10,000+ RSVPs</div>
            <div className="text-xl font-semibold opacity-75">98% Satisfaction</div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to plan your next event?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event planners who trust RSVPY for their invitation needs.
          </p>
          <Link href={!isLoading && user ? "/dashboard" : "/login"} className="btn-primary">
            {!isLoading && user ? "Go to Dashboard" : "Get Started for Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
