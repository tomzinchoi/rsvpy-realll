import React from 'react';
import Link from 'next/link';

const NextStepsGuide = () => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Go to <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link> to create your first event</li>
        <li>Customize your event with images and details</li>
        <li>Send invitations to your guests</li>
        <li>Track RSVPs and manage your attendees</li>
      </ul>
    </div>
  );
};

export default NextStepsGuide;
