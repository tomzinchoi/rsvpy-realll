'use client';

import { FaCalendarPlus, FaRegClock, FaRegEye } from "react-icons/fa";

interface DashboardStatsSectionProps {
  eventsCount: number;
  totalRsvps: number;
  totalViews: number;
}

export default function DashboardStatsSection({
  eventsCount,
  totalRsvps,
  totalViews
}: DashboardStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
            <FaCalendarPlus className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold">{eventsCount}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
            <FaRegClock className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total RSVPs</p>
            <p className="text-2xl font-bold">{totalRsvps}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-100 text-amber-800 mr-4">
            <FaRegEye className="text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
