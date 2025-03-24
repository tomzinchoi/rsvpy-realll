"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '@/components/Header';
import TopBanner from '@/components/TopBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Database } from '@/lib/database.types';
import Image from 'next/image';
import InfiniteMarquee from '@/components/InfiniteMarquee';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };
    
    checkUser();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffef7] flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
          {/* Using a div with background gradient as fallback if image doesn't exist */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
            <div className="absolute inset-0 opacity-30">
              {/* Attempt to load the image, but don't break if it doesn't exist */}
              <img 
                src="/hero-background.jpg" 
                alt=""
                className="object-cover object-center w-full h-full opacity-1"
                onError={(e) => {
                  // Hide broken image and let the background gradient show
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 pt-24">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-gradient">Redefining</span> Event RSVPs
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Launch your events into orbit with our modern, minimal approach to invitations
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link 
                href="/login" 
                className="spacex-button rounded text-center py-3"
              >
                GET STARTED
              </Link>
              <Link 
                href="#features" 
                className="spacex-button-outline rounded text-center py-3"
              >
                EXPLORE FEATURES
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-white mb-2">25K+</h3>
              <p className="text-gray-400">Events Created</p>
            </div>
            <div className="glass-card p-8 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
              <p className="text-gray-400">Uptime</p>
            </div>
            <div className="glass-card p-8 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-white mb-2">4.9</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Full Suite of <span className="text-accent">Powerful Features</span>
            </h2>
            <p className="text-gray-400">
              Everything you need to create stunning events and manage RSVPs effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Stunning Designs</h3>
              <p className="text-gray-400">
                Customize your event page with our sleek templates inspired by modern web design.
              </p>
            </div>

            <div className="glass-card p-6 rounded-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Custom RSVP Forms</h3>
              <p className="text-gray-400">
                Create tailored RSVP forms with custom fields and questions for your guests.
              </p>
            </div>

            <div className="glass-card p-6 rounded-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Real-time Analytics</h3>
              <p className="text-gray-400">
                Track views, RSVPs, and guest responses with our powerful analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              What Our Users Say
            </h2>
            <p className="text-gray-400">
              Join thousands of satisfied event planners who've elevated their event experience
            </p>
          </div>
          
          <div className="mt-16">
            <InfiniteMarquee
              items={[
                {
                  quote: "RSVPY transformed how I manage my corporate events. The analytics are incredible.",
                  author: "Sarah J., Event Manager"
                },
                {
                  quote: "The sleek design of my wedding invitation impressed all our guests. Highly recommended!",
                  author: "Michael & David"
                },
                {
                  quote: "I've tried many RSVP platforms, but RSVPY's custom forms give me exactly what I need.",
                  author: "Elena R., Party Planner"
                },
                {
                  quote: "As a tech conference organizer, RSVPY's modern interface aligns perfectly with our brand.",
                  author: "Thomas K., Conference Director"
                },
                {
                  quote: "The real-time updates and notifications are game-changers for event management.",
                  author: "Priya M., Marketing Executive"
                }
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Launch Your Next Event?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join RSVPY today and experience event management in a whole new way
            </p>
            <Link 
              href="/login" 
              className="spacex-button rounded text-center py-3 px-8 inline-block"
            >
              GET STARTED NOW
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
