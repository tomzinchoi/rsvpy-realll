'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export default function StatsCard({ title, value, icon, bgColor = 'bg-blue-50' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
