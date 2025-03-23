'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Unified AuthContextType with both loading and isLoading for compatibility
export interface AuthContextType {
  user: User | null;
  loading: boolean; // Legacy prop
  isLoading: boolean; // New prop
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  error: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInitialUser = async () => {
      try {
        setIsLoading(true);
        
        // Get the initial session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        // Set up auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log(`Auth state changed: ${event}`);
            setUser(session?.user || null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Error in auth state initialization:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      setUser(data.user);
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'An error occurred during sign in');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'An error occurred during sign up');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message || 'An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    loading: isLoading, // For backward compatibility
    isLoading,
    error,
    signIn,
    signUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
