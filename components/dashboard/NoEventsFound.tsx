'use client';

import { FaCalendarPlus } from "react-icons/fa";

interface NoEventsFoundProps {
  searchTerm: string;
  showNewRsvpsOnly: boolean;
  handleCreateEvent: () => void;
}

export default function NoEventsFound({
  searchTerm,
  showNewRsvpsOnly,
  handleCreateEvent
}: NoEventsFoundProps) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
      <FaCalendarPlus className="text-4xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">No events found</h3>
      {searchTerm || showNewRsvpsOnly ? (
        <p className="text-gray-500 mb-6">
          Try adjusting your search or filters
        </p>
      ) : (
        <p className="text-gray-500 mb-6">
          Create your first event to get started
        </p>
      )}
      
      <button
        onClick={handleCreateEvent}
        className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Create New Event
      </button>
    </div>
  );
}
