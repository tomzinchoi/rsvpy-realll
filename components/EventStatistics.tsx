import React from 'react';

interface EventStatisticsProps {
  totalEvents: number;
  totalRsvps: number;
  confirmedRsvps: number;
  viewCount: number;
  responseRate: number;
}

const EventStatistics = ({ 
  totalEvents, 
  totalRsvps, 
  confirmedRsvps, 
  viewCount, 
  responseRate 
}: EventStatisticsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Event Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Total Events</h3>
          <p className="text-2xl font-bold text-blue-700">{totalEvents}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-green-900 mb-1">Total RSVPs</h3>
          <p className="text-2xl font-bold text-green-700">{totalRsvps}</p>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-indigo-900 mb-1">Confirmed</h3>
          <p className="text-2xl font-bold text-indigo-700">{confirmedRsvps}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-purple-900 mb-1">Total Views</h3>
          <p className="text-2xl font-bold text-purple-700">{viewCount}</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-amber-900 mb-1">Response Rate</h3>
          <p className="text-2xl font-bold text-amber-700">{responseRate}%</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Insights</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {responseRate < 30 && (
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Try sending reminder emails to increase your response rate.
            </li>
          )}
          
          {viewCount > 0 && totalRsvps === 0 && (
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Your event is getting views but no RSVPs. Consider simplifying your RSVP form.
            </li>
          )}
          
          {confirmedRsvps > 0 && confirmedRsvps < totalRsvps / 2 && (
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Less than half of your RSVPs are confirmations. Consider adjusting the event details.
            </li>
          )}
          
          {totalEvents > 0 && (
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You've created {totalEvents} event{totalEvents > 1 ? 's' : ''}. Keep it up!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventStatistics;
