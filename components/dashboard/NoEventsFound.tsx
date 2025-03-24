'use client';

import React from 'react';
import Link from 'next/link';

interface NoEventsFoundProps {
  isFiltering?: boolean;
  onClearFilters?: () => void;
}

export default function NoEventsFound({ isFiltering, onClearFilters }: NoEventsFoundProps) {
  return (
    <div className="glass-card p-8 rounded-lg text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {isFiltering ? 'No events match your filters' : 'No events found'}
      </h3>
      <p className="text-gray-400 mb-6">
        {isFiltering 
          ? 'Try clearing your filters or create a new event'
          : 'Create your first event to get started'}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {isFiltering && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 border border-accent text-accent rounded hover:bg-accent/10 transition-colors"
          >
            Clear Filters
          </button>
        )}
        
        <Link
          href="/create"
          className="spacex-button py-2 px-4 rounded inline-flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Create New Event
        </Link>
      </div>
    </div>
  );
}
