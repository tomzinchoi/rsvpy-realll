'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, signIn, signUp, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Background gradient as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
          {/* Attempt to load the image */}
          <img 
            src="/login-background.jpg" 
            alt=""
            className="object-cover w-full h-full opacity-60"
            onError={(e) => {
              // Hide broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center max-w-md px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to RSVPY</h1>
            <p className="text-white/80">
              Create and manage elegant event invitations with our modern platform
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-black flex items-center justify-center px-4 py-12 md:py-0">
        <div className="glass-card w-full max-w-md p-8 rounded-lg">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-white">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-gray-400">
              {isSignUp 
                ? 'Start creating amazing events'
                : 'Welcome back! Please enter your details'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full spacex-button py-3 rounded-md flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-3">
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </span>
                </div>
              ) : (
                isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent hover:text-accent-light text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Don\'t have an account? Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
