import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing environment variables for Supabase. Please check your .env.local file.'
  );
}

// Create client with explicit type assertion to fix TypeScript errors
export const supabase = createClient<Database>(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

// Improved error handling for Supabase operations
export async function handleSupabaseError(promise: Promise<any>) {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error('Supabase Error:', error.message, error.details, error.hint);
      throw new Error(error.message || 'Database operation failed');
    }
    return { data, error: null };
  } catch (err: any) {
    console.error('Unexpected Supabase error:', err);
    return { data: null, error: err };
  }
}

// Wrap the auth calls in try-catch blocks to prevent undefined errors
export const getUser = async () => {
  try {
    const { data: { user }, error } = await handleSupabaseError(supabase.auth.getUser());
    return user;
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await handleSupabaseError(supabase.auth.signOut());
    return { error };
  } catch (err) {
    console.error('Unexpected error signing out:', err);
    return { error: new Error('Failed to sign out') };
  }
};

// Add auth helper functions for login
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await handleSupabaseError(supabase.auth.signInWithPassword({
      email,
      password,
    }));
    return { data, error };
  } catch (err) {
    console.error('Unexpected error signing in:', err);
    return { data: null, error: new Error('Failed to sign in') };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await handleSupabaseError(supabase.auth.signUp({
      email,
      password,
    }));
    return { data, error };
  } catch (err) {
    console.error('Unexpected error signing up:', err);
    return { data: null, error: new Error('Failed to sign up') };
  }
};

// Helper function to create component client
export const createClientComponentClient = () => {
  return createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '');
};

// Utility function to check auth status
export const checkAuthStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { session: null, error };
  }
};
