'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-ivory shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">RSVPY</Link>
        <nav>
          <ul className="flex gap-6 items-center">
            {user && (
              <>
                <li><Link href="/create" className="hover:underline">Create</Link></li>
                <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
                <li>
                  <button 
                    onClick={() => signOut()} 
                    className="hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            
            {!user && (
              <li><Link href="/login" className="btn-black">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
