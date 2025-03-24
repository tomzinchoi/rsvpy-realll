"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardStatsSection from "@/components/dashboard/DashboardStatsSection";
import EventsFilter from "@/components/dashboard/EventsFilter";
import DashboardEventList from "@/components/dashboard/DashboardEventList";
import NoEventsFound from "@/components/dashboard/NoEventsFound";
import { FaCalendarPlus } from "react-icons/fa";
import { Event } from "@/types/event";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRsvps, setTotalRsvps] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [showNewRsvpsOnly, setShowNewRsvpsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchEvents() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (eventsError) {
          throw eventsError;
        }

        setEvents(eventsData || []);
        
        // Get total RSVPs
        const { count: rsvpCount, error: rsvpError } = await supabase
          .from("rsvps")
          .select("*", { count: "exact", head: true })
          .in(
            "event_id",
            eventsData?.map((event) => event.id) || []
          );
          
        if (rsvpError) {
          console.error("Error fetching RSVPs:", rsvpError);
        } else {
          setTotalRsvps(rsvpCount || 0);
        }
        
        // Calculate total views
        const totalViewsCount = eventsData?.reduce(
          (sum: number, event: Event) => sum + (event.views_count || 0),
          0
        );
        setTotalViews(totalViewsCount || 0);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        console.error("Failed to load events:", err.message || err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user, supabase]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRsvpFilter = !showNewRsvpsOnly || (event.new_rsvps_count !== undefined && event.new_rsvps_count > 0);
    
    return matchesSearch && matchesRsvpFilter;
  });

  // Handle creation button click
  const handleCreateEvent = () => {
    router.push("/create");
  };

  // Format date helper
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-ivory">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Your Events</h1>
            <button
              onClick={handleCreateEvent}
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              <FaCalendarPlus className="mr-2" />
              Create New Event
            </button>
          </div>

          {/* Stats Overview Section */}
          <DashboardStatsSection 
            eventsCount={events.length} 
            totalRsvps={totalRsvps} 
            totalViews={totalViews} 
          />

          {/* Filter Controls */}
          <EventsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showNewRsvpsOnly={showNewRsvpsOnly}
            setShowNewRsvpsOnly={setShowNewRsvpsOnly}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">Error loading events</p>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <DashboardEventList 
              events={filteredEvents} 
              formatDate={formatDate} 
            />
          ) : (
            <NoEventsFound 
              searchTerm={searchTerm}
              showNewRsvpsOnly={showNewRsvpsOnly}
              handleCreateEvent={handleCreateEvent}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
