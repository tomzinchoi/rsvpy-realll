"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventCardProps {
  event: any;
  onMarkRsvpsAsRead?: (eventId: string) => void;
}

export default function EventCard({ event, onMarkRsvpsAsRead }: EventCardProps) {
  const router = useRouter();
  
  const hasNewRsvps = event.new_rsvps_count !== undefined && event.new_rsvps_count > 0;
  
  const handleCardClick = () => {
    router.push(`/event/${event.id}`);
  };
  
  const handleViewRsvps = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/event/${event.id}#rsvps`);
    if (hasNewRsvps && onMarkRsvpsAsRead) {
      onMarkRsvpsAsRead(event.id);
    }
  };
  
  const handleShareEvent = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // Create share URL
    const shareUrl = `${window.location.origin}/rsvp/${event.id}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description || 'Check out this event!',
        url: shareUrl
      }).catch(error => {
        console.error('Error sharing:', error);
        // Fallback to clipboard copy
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to clipboard copy
      copyToClipboard(shareUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link. Please try again.');
      });
  };

  // Format date without date-fns
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get event image URL from custom_fields JSON if available
  const customFields = event.custom_fields ? (
    typeof event.custom_fields === 'string' ? JSON.parse(event.custom_fields) : event.custom_fields
  ) : {};
  
  const eventImageUrl = event.event_image_url || 
    (customFields.images && customFields.images.length > 0 ? customFields.images[0] : null);

  return (
    <div 
      onClick={handleCardClick}
      className="glass-card rounded-lg overflow-hidden border border-border/20 hover:border-accent/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-40 overflow-hidden bg-gray-900">
        {eventImageUrl ? (
          <img 
            src={eventImageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-900 to-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {hasNewRsvps && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            {event.new_rsvps_count} new {event.new_rsvps_count === 1 ? 'RSVP' : 'RSVPs'}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg line-clamp-1">{event.title}</h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-300 text-sm">
              {formatDate(event.date || event.created_at)}
              {event.time && ` at ${event.time}`}
            </span>
          </div>
          
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-300 text-sm line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-300 text-sm">{event.rsvp_count || 0} RSVPs</span>
          </div>
        </div>
        
        <div className="mt-5 flex space-x-2">
          <Link 
            href={`/event/${event.id}`}
            className="flex-1 py-2 bg-accent text-white text-center text-sm rounded hover:bg-accent-light transition-colors"
            target="_blank"
          >
            View
          </Link>
          <Link
            href={`/event/${event.id}/manage`}
            className="flex-1 py-2 border border-accent text-accent text-center text-sm rounded hover:bg-accent/10 transition-colors"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}
