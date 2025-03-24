'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { logStartup } from '@/lib/debug';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    logStartup('AuthContextProvider', 'Initializing');
    
    const getUser = async () => {
      try {
        logStartup('AuthContextProvider', 'Fetching user');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error during getUser:', error);
          setAuthError(error);
        } else {
          setUser(user);
          logStartup('AuthContextProvider', user ? 'User found' : 'No user found');
        }
      } catch (error) {
        console.error('Unexpected error during auth check:', error);
        setAuthError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logStartup('AuthContextProvider', `Auth state change: ${event}`);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {authError ? (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="max-w-md p-8 rounded-lg text-center" 
               style={{
                 backdropFilter: 'blur(12px)',
                 backgroundColor: 'rgba(21,21,21,0.7)',
                 border: '1px solid rgba(51,51,51,0.2)',
                 boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
               }}>
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p className="mb-6">{authError.message || 'An error occurred during authentication'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-white rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
