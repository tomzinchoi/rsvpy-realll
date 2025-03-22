'use client';

import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Event Management Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Active Events</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Total RSVPs</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">View Count</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Events</h2>
          <div className="text-center py-10 text-gray-500">
            No events yet. Click "Create New Invitation" to get started.
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
