'use client';

import React from 'react';
import { usePageBuilder, WidgetType } from '@/contexts/PageBuilderContext';

const WidgetToolbar: React.FC = () => {
  const { addWidget } = usePageBuilder();

  const widgetOptions: Array<{ type: WidgetType; label: string; icon: string }> = [
    { type: 'header', label: 'Header', icon: '🔤' },
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'gallery', label: 'Gallery', icon: '🏞️' },
    { type: 'map', label: 'Map', icon: '🗺️' },
    { type: 'rsvp-form', label: 'RSVP Form', icon: '📋' },
    { type: 'countdown', label: 'Countdown', icon: '⏱️' },
    { type: 'calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">Widgets</h2>
      <div className="grid grid-cols-2 gap-2">
        {widgetOptions.map((widget) => (
          <button
            key={widget.type}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded hover:border-black transition-colors"
            onClick={() => addWidget(widget.type)}
          >
            <span className="text-2xl mb-1">{widget.icon}</span>
            <span className="text-sm">{widget.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WidgetToolbar;
