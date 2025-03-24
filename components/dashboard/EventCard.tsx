'use client';

import Link from "next/link";
import { FaCalendarPlus, FaRegClock, FaRegEye } from "react-icons/fa";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  formatDate: (dateString?: string) => string;
}

export default function EventCard({ event, formatDate }: EventCardProps) {
  return (
    <Link href={`/event/${event.id}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
        {event.image_url ? (
          <div className="h-48 overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <FaCalendarPlus className="text-4xl text-gray-400" />
          </div>
        )}
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl line-clamp-1">{event.title}</h3>
            {event.new_rsvps_count !== undefined && event.new_rsvps_count > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {event.new_rsvps_count} new
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {event.description || "No description"}
          </p>
          
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FaRegClock className="mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center">
              <FaRegEye className="mr-1" />
              <span>{event.views_count || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
