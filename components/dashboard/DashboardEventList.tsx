'use client';

import { Event } from '@/types/event';
import EventCard from './EventCard';

interface DashboardEventListProps {
  events: Event[];
  formatDate: (dateString?: string) => string;
}

export default function DashboardEventList({ 
  events, 
  formatDate
}: DashboardEventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
}
