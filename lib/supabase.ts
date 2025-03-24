import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Retrieve environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Ensure we have valid values for the Supabase URL and key
if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co' || 
    !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('WARNING: Supabase URL or anonymous key is missing or using placeholder values. Authentication will not work correctly.');
}

// Create the Supabase client with more verbose logging in development
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

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
  return createClient(supabaseUrl, supabaseAnonKey);
};
