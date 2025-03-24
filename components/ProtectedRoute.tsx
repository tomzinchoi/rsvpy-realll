"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoadingSpinner from './LoadingSpinner';
import { Database } from '@/lib/database.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          // Redirect to login if not authenticated
          router.push('/login');
        } else {
          // User is authenticated, we can render the content
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkUser();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffef7] flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
