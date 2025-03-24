'use client';

import React from 'react';

interface EventsFilterProps {
  filter: string;
  onFilterChange: (value: string) => void;
  showNewRsvpsOnly: boolean;
  onToggleNewRsvps: (value: boolean) => void;
}

export default function EventsFilter({
  filter,
  onFilterChange,
  showNewRsvpsOnly,
  onToggleNewRsvps
}: EventsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div className="relative w-full md:w-64 mb-4 md:mb-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search events..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-input border border-border/30 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>
      
      <div className="flex items-center">
        <button
          onClick={() => onToggleNewRsvps(!showNewRsvpsOnly)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            showNewRsvpsOnly
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border/30 bg-transparent text-gray-400 hover:text-white hover:border-accent/50'
          }`}
        >
          <span className="relative flex h-3 w-3">
            {showNewRsvpsOnly && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${showNewRsvpsOnly ? 'bg-accent' : 'bg-gray-600'}`}></span>
          </span>
          <span>Show events with new RSVPs</span>
        </button>
      </div>
    </div>
  );
}
