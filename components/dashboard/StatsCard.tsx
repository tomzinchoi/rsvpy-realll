'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="glass-card p-6 rounded-lg border border-border/20 hover:border-accent/20 transition-all duration-300">
      <div className="flex items-center">
        <div className="p-3 bg-accent/10 rounded-lg text-accent">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
