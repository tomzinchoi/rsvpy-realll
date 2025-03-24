'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-bold logo-font">R</span>
            </div>
            <span className="text-4xl text-gradient font-bold text-white tracking-tight logo-font">RSVPY</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm transition-colors ${
                pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className={`text-sm transition-colors ${
                pathname === '/pricing' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm transition-colors ${
                    pathname === '/dashboard' ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/create" 
                  className={`text-sm transition-colors ${
                    pathname === '/create' ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Create Event
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-white/20 rounded text-sm text-white hover:bg-white/10 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="px-5 py-2 spacex-button rounded"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg pt-4 pb-6 px-4 space-y-4 animate-fade-in">
          <Link 
            href="/" 
            className={`block py-2 text-center ${pathname === '/' ? 'text-accent' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/pricing" 
            className={`block py-2 text-center ${pathname === '/pricing' ? 'text-accent' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className={`block py-2 text-center ${pathname === '/dashboard' ? 'text-accent' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/create" 
                className={`block py-2 text-center ${pathname === '/create' ? 'text-accent' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Event
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 border border-white/20 rounded text-white hover:bg-white/10 transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="block w-full py-2 bg-accent text-white text-center rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
