'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(); // Use isLoading instead of loading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if loading is complete and no user is found
    if (!isLoading && !user && typeof window !== 'undefined') {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading state while determining auth status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // If authenticated, show the protected content
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
