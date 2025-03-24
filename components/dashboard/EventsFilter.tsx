'use client';

import Link from 'next/link';

interface EventsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showNewRsvpsOnly: boolean;
  setShowNewRsvpsOnly: (value: boolean) => void;
}

export default function EventsFilter({
  searchTerm,
  setSearchTerm,
  showNewRsvpsOnly,
  setShowNewRsvpsOnly
}: EventsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={showNewRsvpsOnly}
            onChange={() => setShowNewRsvpsOnly(!showNewRsvpsOnly)}
          />
          <div className={`h-6 w-12 rounded-full transition-colors ${
            showNewRsvpsOnly ? "bg-black" : "bg-gray-300"
          }`}>
            <div className={`h-4 w-4 rounded-full bg-white m-1 transform transition-transform ${
              showNewRsvpsOnly ? "translate-x-6" : ""
            }`} />
          </div>
          <span className="ml-2">Show events with new RSVPs only</span>
        </label>
      </div>
    </div>
  );
}
