'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardStatsSection from '@/components/dashboard/DashboardStatsSection';
import DashboardEventList from '@/components/dashboard/DashboardEventList';
import EventsFilter from '@/components/dashboard/EventsFilter';

interface EnhancedEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location: string;
  user_id: string;
  created_at: string;
  view_count: number;
  custom_fields?: Record<string, any>;
  event_image_url?: string;
  rsvp_count: number;
  new_rsvps_count: number;
}

// Add interface for RSVP count results
interface RsvpCountResult {
  event_id: string;
  count: number;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EnhancedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [showNewRsvpsOnly, setShowNewRsvpsOnly] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRsvps: 0,
    totalViews: 0
  });
  
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const createdEventId = searchParams.get('created');
  
  // Fetch events for the logged-in user
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First, get all events created by the user
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (eventsError) throw eventsError;
        
        if (!eventsData || eventsData.length === 0) {
          setEvents([]);
          setStats({
            totalEvents: 0,
            totalRsvps: 0,
            totalViews: 0
          });
          setIsLoading(false);
          return;
        }
        
        // Get event IDs to use in subsequent queries
        const eventIds = eventsData.map(event => event.id);
        
        // Get RSVP counts for each event using the correct query pattern
        let rsvpCounts: RsvpCountResult[] = [];
        let rsvpCountsError = null;
        
        try {
          // Try to use stored procedure if available
          const rpcResult = await supabase.rpc(
            'get_rsvp_counts_by_events',
            { event_ids: eventIds }
          );
          
          if (rpcResult.error) throw rpcResult.error;
          rsvpCounts = rpcResult.data || [];
        } catch (err) {
          console.warn('RPC function not available, using fallback:', err);
          
          // Fallback method: individual count queries
          for (const eventId of eventIds) {
            const { count, error } = await supabase
              .from('rsvps')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', eventId);
              
            if (!error && count !== null) {
              rsvpCounts.push({ event_id: eventId, count });
            }
          }
        }
        
        // Get new RSVP counts (last 24 hours) - same pattern
        let newRsvpCounts: RsvpCountResult[] = [];
        let newRsvpsError = null;
        
        try {
          const rpcResult = await supabase.rpc(
            'get_new_rsvp_counts_by_events',
            { 
              event_ids: eventIds, 
              hours_ago: 24 
            }
          );
          
          if (rpcResult.error) throw rpcResult.error;
          newRsvpCounts = rpcResult.data || [];
        } catch (err) {
          console.warn('New RSVPs RPC function not available, using fallback:', err);
          
          // Fallback method: individual count queries with date filter
          const yesterday = new Date();
          yesterday.setHours(yesterday.getHours() - 24);
          
          for (const eventId of eventIds) {
            const { count, error } = await supabase
              .from('rsvps')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', eventId)
              .gt('created_at', yesterday.toISOString());
              
            if (!error && count !== null) {
              newRsvpCounts.push({ event_id: eventId, count });
            }
          }
        }
        
        // Create maps for easy lookup
        const rsvpCountsMap: Record<string, number> = {};
        if (rsvpCounts) {
          rsvpCounts.forEach((item: RsvpCountResult) => {
            rsvpCountsMap[item.event_id] = item.count;
          });
        }
        
        const newRsvpsMap: Record<string, number> = {};
        if (newRsvpCounts) {
          newRsvpCounts.forEach((item: RsvpCountResult) => {
            newRsvpsMap[item.event_id] = item.count;
          });
        }
        
        // Calculate total RSVP count
        const totalRsvps = Object.values(rsvpCountsMap).reduce((sum, count) => sum + count, 0);
        
        // Calculate total views
        const totalViews = eventsData.reduce((sum, event) => sum + (event.view_count || 0), 0);
        
        // Set statistics
        setStats({
          totalEvents: eventsData.length,
          totalRsvps,
          totalViews
        });
        
        // Enhance events with RSVP counts
        const enhancedEvents = eventsData.map(event => ({
          ...event,
          rsvp_count: rsvpCountsMap[event.id] || 0,
          new_rsvps_count: newRsvpsMap[event.id] || 0
        }));
        
        setEvents(enhancedEvents as EnhancedEvent[]);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [user, supabase]);
  
  // Filter events based on search term and new RSVPs toggle
  const filteredEvents = events
    .filter(event => {
      const matchesFilter = filter === '' ||
        event.title.toLowerCase().includes(filter.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(filter.toLowerCase()));
      
      const matchesRsvpFilter = !showNewRsvpsOnly || 
        (event.new_rsvps_count !== undefined && event.new_rsvps_count > 0);
      
      return matchesFilter && matchesRsvpFilter;
    });
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Your Events Dashboard</h1>
          
          {createdEventId && (
            <div className="glass-card p-4 rounded-lg mb-8 border border-green-500/30 bg-green-900/20">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-200">
                  Event created successfully! Share your event link: <a href={`/event/${createdEventId}`} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">/event/{createdEventId}</a>
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="glass-card p-4 rounded-lg mb-8 border border-red-500/30 bg-red-900/20">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              <DashboardStatsSection stats={stats} />
              
              <div className="mt-12">
                <EventsFilter
                  filter={filter}
                  onFilterChange={setFilter}
                  showNewRsvpsOnly={showNewRsvpsOnly}
                  onToggleNewRsvps={setShowNewRsvpsOnly}
                />
                
                <DashboardEventList events={filteredEvents} />
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
