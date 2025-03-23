'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          RSVPY
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {user ? (
              <>
                <li>
                  <Link href="/dashboard" className="text-gray-600 hover:text-black">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-gray-600 hover:text-black">
                    Create Event
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-black"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="text-gray-600 hover:text-black">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
