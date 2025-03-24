'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ivory shadow-md py-2' : 'bg-ivory py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black hover:opacity-80 transition-opacity">
          RSVPY
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-black hover:underline transition-all">
            Home
          </Link>
          {!isLoading && user && (
            <>
              <Link href="/dashboard" className="text-black hover:underline transition-all">
                Dashboard
              </Link>
              <Link href="/create" className="text-black hover:underline transition-all">
                Create Event
              </Link>
              <Link href="/pricing" className="text-black hover:underline transition-all">
                Pricing
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-black text-ivory rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              >
                Sign Out
              </button>
            </>
          )}
          {!isLoading && !user && (
            <>
              <Link href="/pricing" className="text-black hover:underline transition-all">
                Pricing
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-black text-ivory rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-ivory border-t border-gray-200 py-3 px-4 space-y-3">
          <Link href="/" className="block text-black hover:underline py-2">
            Home
          </Link>
          {!isLoading && user && (
            <>
              <Link href="/dashboard" className="block text-black hover:underline py-2">
                Dashboard
              </Link>
              <Link href="/create" className="block text-black hover:underline py-2">
                Create Event
              </Link>
              <Link href="/pricing" className="block text-black hover:underline py-2">
                Pricing
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left py-2 text-black hover:underline"
              >
                Sign Out
              </button>
            </>
          )}
          {!isLoading && !user && (
            <>
              <Link href="/pricing" className="block text-black hover:underline py-2">
                Pricing
              </Link>
              <Link
                href="/login"
                className="block text-black hover:underline py-2"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
