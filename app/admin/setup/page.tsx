'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminSetupRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/setup');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
      <p className="text-center">Redirecting to the new setup page...</p>
      <Link href="/setup" className="text-blue-600 hover:underline mt-4">Click here if you're not redirected automatically</Link>
    </div>
  );
}
