'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SetupRedirect() {
  const { user, isLoading } = useAuth(); // Use isLoading from context
  const router = useRouter();

  // Redirect to dashboard or login
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login?redirect=/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return null;
}
