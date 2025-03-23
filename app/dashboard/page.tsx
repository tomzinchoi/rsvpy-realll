'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import EventStatistics from '@/components/EventStatistics';
import EventCalendar from '@/components/EventCalendar';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the StorageSetupHelper with a fallback for better error handling
const StorageSetupHelper = dynamic(
  () => import('@/components/StorageSetupHelper').catch(() => () => (
    <div className="bg-yellow-50 p-4 rounded-md">
      <p className="text-yellow-800">Storage setup component is not available. Please visit the <Link href="/setup" className="underline">setup page</Link>.</p>
    </div>
  )),
  { ssr: false, loading: () => <div className="bg-gray-100 p-4 rounded-md animate-pulse">Loading storage setup...</div> }
);

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  rsvp_count: number;
  view_count: number;
  created_at: string;
  new_rsvps_count?: number; // Add this property
}

interface Statistics {
  totalEvents: number;
  totalRsvps: number;
  confirmedRsvps: number;
  viewCount: number;
  responseRate: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalEvents: 0,
    totalRsvps: 0,
    confirmedRsvps: 0,
    viewCount: 0,
    responseRate: 0,
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        // Simple query for events without nested relationships
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('id, title, date, time, location, created_at, view_count')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (eventsError) throw eventsError;

        // Get RSVP counts in a separate query, including counts of recent RSVPs (last 24 hours)
        const rsvpPromises = eventsData.map(async (event) => {
          const [{ count, error: countError }, { data: recentRsvps, error: recentError }] = await Promise.all([
            supabase
              .from('rsvps')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.id),
            supabase
              .from('rsvps')
              .select('id')
              .eq('event_id', event.id)
              .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          ]);
          
          const newRsvpsCount = recentRsvps?.length || 0;
          
          return { 
            ...event, 
            rsvp_count: count || 0,
            new_rsvps_count: newRsvpsCount
          };
        });

        const eventsWithRsvpCount = await Promise.all(rsvpPromises);
        setEvents(eventsWithRsvpCount);

        // Compute statistics
        const totalEvents = eventsData.length;
        const totalViews = eventsData.reduce((sum, event) => sum + (event.view_count || 0), 0);
        
        // Get all RSVPs for the user's events
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('rsvps')
          .select('event_id, attending')
          .in('event_id', eventsData.map(e => e.id));
        
        if (rsvpError) {
          console.error('Error fetching RSVPs:', rsvpError);
          // Continue without the RSVP data
        }

        const totalRsvps = rsvpData?.length || 0;
        const confirmedRsvps = rsvpData?.filter(rsvp => rsvp.attending).length || 0;
        const responseRate = totalViews > 0 ? Math.round((totalRsvps / totalViews) * 100) : 0;

        setStatistics({
          totalEvents,
          totalRsvps,
          confirmedRsvps,
          viewCount: totalViews,
          responseRate,
        });
      } catch (error: any) {
        console.error('Error fetching events:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleCreateEvent = () => {
    router.push('/create');
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Events</h1>
          <div className="flex space-x-2">
            <Link 
              href="/pricing" 
              className="text-sm text-gray-600 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 mr-2"
            >
              Pricing
            </Link>
            <button
              onClick={handleCreateEvent}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Create New Event
            </button>
          </div>
        </div>

        {/* Show a banner about email feature */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Welcome to RSVPY!</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Create your first event by clicking the "Create New Event" button. Email notifications feature is coming soon.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Only show storage helper if there are no events or we're getting errors */}
        {(events.length === 0 || error) && <StorageSetupHelper />}

        {/* Statistics component */}
        {!isLoading && events.length > 0 && (
          <EventStatistics {...statistics} />
        )}

        {/* View toggle buttons */}
        {events.length > 0 && (
          <div className="mb-6 flex justify-end">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'calendar'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            Error loading events: {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
            <button
              onClick={handleCreateEvent}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Create Your First Event
            </button>
          </div>
        ) : viewMode === 'calendar' ? (
          <EventCalendar events={events} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer relative"
                onClick={() => handleViewEvent(event.id)}
              >
                {/* New RSVPs notification badge - with proper null check */}
                {(event.new_rsvps_count !== undefined && event.new_rsvps_count > 0) && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {event.new_rsvps_count}
                  </div>
                )}
                
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Created {new Date(event.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium py-1 px-2 rounded-full">
                      {event.view_count || 0} Views
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded-full">
                      {event.rsvp_count} RSVPs
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
