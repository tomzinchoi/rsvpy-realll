'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import RsvpForm from '@/components/RsvpForm';
import EmailInviter from '@/components/EmailInviter';
import Link from 'next/link';

interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  user_id: string;
  custom_fields: any[];
  created_at: string;
  view_count: number;
  event_image_url: string | null;
}

interface Rsvp {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  custom_data: any;
  created_at: string;
}

interface EmailInvitation {
  id: string;
  email: string;
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'failed';
  created_at: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [invitations, setInvitations] = useState<EmailInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch RSVPs
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('rsvps')
          .select('*')
          .eq('event_id', id)
          .order('created_at', { ascending: false });

        if (rsvpError) throw rsvpError;
        setRsvps(rsvpData || []);

        // Fetch email invitations if user is the event owner
        if (user && eventData.user_id === user.id) {
          const { data: invitationData, error: invitationError } = await supabase
            .from('email_invitations')
            .select('id, email, status, created_at')
            .eq('event_id', id)
            .order('created_at', { ascending: false });

          if (invitationError) throw invitationError;
          setInvitations(invitationData || []);
        }
      } catch (error: any) {
        console.error('Error fetching event data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id, user]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/rsvp/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy');
      });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error || 'Event not found'}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  const isEventOwner = user?.id === event.user_id;
  const totalRsvps = rsvps.length;
  const confirmedRsvps = rsvps.filter(rsvp => rsvp.attending).length;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-block mb-6 text-black hover:underline">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          {/* Add image display if available */}
          {event.event_image_url && (
            <div className="mb-6">
              <img 
                src={event.event_image_url} 
                alt={event.title} 
                className="w-full max-h-72 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Event Details</h2>
              <p className="mb-2"><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              {event.time && <p className="mb-2"><span className="font-medium">Time:</span> {event.time}</p>}
              <p className="mb-2"><span className="font-medium">Location:</span> {event.location}</p>
              {event.description && (
                <div className="mt-4">
                  <h3 className="font-medium mb-1">Description:</h3>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              )}
              
              {isEventOwner && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Views:</span> {event.view_count || 0}
                  </p>
                </div>
              )}
            </div>

            {isEventOwner && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Share Event</h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleCopyLink}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  >
                    Copy Invitation Link
                  </button>
                  {copySuccess && <p className="text-green-600 text-sm">{copySuccess}</p>}
                  
                  <button
                    onClick={() => setShowEmailForm(!showEmailForm)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    {showEmailForm ? 'Hide Email Form' : 'Send Email Invitations'}
                  </button>
                </div>
                
                {showEmailForm && (
                  <div className="mt-4">
                    <EmailInviter eventId={id as string} eventTitle={event.title} />
                  </div>
                )}
              </div>
            )}
          </div>

          {isEventOwner && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-1">Total RSVPs</h3>
                  <p className="text-3xl font-bold text-blue-700">{totalRsvps}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-green-900 mb-1">Confirmed</h3>
                  <p className="text-3xl font-bold text-green-700">{confirmedRsvps}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-red-900 mb-1">Declined</h3>
                  <p className="text-3xl font-bold text-red-700">{totalRsvps - confirmedRsvps}</p>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">RSVPs ({rsvps.length})</h2>
                
                {rsvps.length === 0 ? (
                  <p className="text-gray-600">No RSVPs yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Name</th>
                          <th className="py-3 px-6 text-left">Email</th>
                          <th className="py-3 px-6 text-center">Attending</th>
                          <th className="py-3 px-6 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {rsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{rsvp.name}</td>
                            <td className="py-3 px-6 text-left">{rsvp.email}</td>
                            <td className="py-3 px-6 text-center">
                              <span className={`py-1 px-3 rounded-full text-xs ${rsvp.attending ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                {rsvp.attending ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right whitespace-nowrap">
                              {new Date(rsvp.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            
              {invitations.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Email Invitations ({invitations.length})</h2>
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4">
                    <p className="text-sm">
                      <strong>Note:</strong> Email sending feature is currently under development. 
                      The status shown below is for demonstration purposes only.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Email</th>
                          <th className="py-3 px-6 text-center">Status</th>
                          <th className="py-3 px-6 text-right">Sent Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {invitations.map((invitation) => (
                          <tr key={invitation.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{invitation.email}</td>
                            <td className="py-3 px-6 text-center">
                              <span className={`py-1 px-3 rounded-full text-xs ${
                                invitation.status === 'sent' || invitation.status === 'opened' || invitation.status === 'clicked'
                                  ? 'bg-green-200 text-green-700'
                                  : invitation.status === 'failed'
                                  ? 'bg-red-200 text-red-700'
                                  : 'bg-yellow-200 text-yellow-700'
                              }`}>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                {invitation.status === 'pending' && ' (Feature in development)'}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right whitespace-nowrap">
                              {new Date(invitation.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Remove Email Notification Settings section for now */}
            </>
          )}

          {!isEventOwner && (
            <div className="mt-8 border-t pt-6">
              <button
                onClick={() => setShowRsvpForm(!showRsvpForm)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                {showRsvpForm ? 'Hide RSVP Form' : 'RSVP to this Event'}
              </button>
              
              {showRsvpForm && (
                <div className="mt-6">
                  <RsvpForm eventId={id as string} customFields={event.custom_fields} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
