'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RsvpForm from '@/components/RsvpForm';
import Link from 'next/link';

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  custom_fields: any[];
  event_image_url: string | null;
}

export default function PublicRsvpPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Track view count
        await supabase.rpc('increment_event_views', { event_id: id });
        
        // Fetch event details
        const { data, error } = await supabase
          .from('events')
          .select('id, title, description, date, time, location, custom_fields, event_image_url')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error: any) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id]);

  const handleRsvpSubmitted = (data: any) => {
    setSubmitted(true);
    
    // Optionally send analytics or perform other actions
    // For example, increment a counter or update some UI state
    
    // We'll handle the success state in the RsvpForm component itself
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fffff0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#fffff0] min-h-screen">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
          <p className="text-gray-700 mb-4">
            Sorry, we couldn't find the event you're looking for. It may have been removed or the link is incorrect.
          </p>
          <Link href="/" className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#fffff0] min-h-screen">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="text-gray-700 mb-4">
            Your RSVP has been submitted successfully.
          </p>
          <Link href="/" className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#fffff0] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-center">{event.title}</h1>
          
          {/* Add image display */}
          {event.event_image_url && (
            <div className="mb-6">
              <img 
                src={event.event_image_url} 
                alt={event.title} 
                className="w-full max-h-72 object-cover rounded-lg shadow-sm mb-4"
              />
            </div>
          )}
          
          <div className="mb-6">
            <div className="text-center mb-4">
              <p className="text-xl mb-2">
                <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
              </p>
              {event.time && <p className="text-xl mb-2"><span className="font-medium">Time:</span> {event.time}</p>}
              <p className="text-xl mb-2"><span className="font-medium">Location:</span> {event.location}</p>
            </div>
            
            {event.description && (
              <div className="mt-4 text-center">
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        <RsvpForm 
          eventId={id as string} 
          customFields={event.custom_fields} 
          onRsvpSubmitted={handleRsvpSubmitted}
        />
      </div>
    </div>
  );
}
