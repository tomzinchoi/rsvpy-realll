'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import EventCreationWizard from '@/components/event-creation/EventCreationWizard';

// Import types from EventCreationWizard component
import type { EventData } from '@/components/event-creation/EventCreationWizard';

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleCreateEvent = async (eventData: EventData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create the event object to match the database schema
      const { data: event, error: insertError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          user_id: user.id,
          created_at: new Date().toISOString(),
          // Store these as JSON fields in the custom_fields column
          custom_fields: JSON.stringify({
            theme: eventData.theme,
            rsvp_options: eventData.rsvp_options,
            images: eventData.images
          }),
          notification_settings: eventData.notification_settings
        })
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      router.push(`/dashboard?created=${event.id}`);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Error creating event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-gradient">Create New Event</h1>
          
          {error && (
            <div className="glass-card p-4 rounded-lg mb-8 border border-red-500/30 bg-red-900/20 text-red-200">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {isSubmitting ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="large" />
              <span className="ml-4 text-white">Creating your event...</span>
            </div>
          ) : (
            <div className="glass-card rounded-lg p-6">
              <EventCreationWizard onSubmit={handleCreateEvent} />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
