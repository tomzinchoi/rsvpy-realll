"use client";

import Link from 'next/link';
import EventCard from './EventCard';
import NoEventsFound from './NoEventsFound';

interface DashboardEventListProps {
  events: any[];
}

export default function DashboardEventList({ events }: DashboardEventListProps) {
  if (events.length === 0) {
    return <NoEventsFound />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        
        <Link href="/create" className="glass-card rounded-lg p-6 flex flex-col items-center justify-center text-center border border-border/20 hover:border-accent/50 transition-all duration-300 min-h-[200px]">
          <div className="bg-accent/10 text-accent p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-white font-medium mt-4">Create New Event</h3>
          <p className="text-gray-400 text-sm mt-2">Set up your next event with our step-by-step wizard</p>
        </Link>
      </div>
    </div>
  );
}
