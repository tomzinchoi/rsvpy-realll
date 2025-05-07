'use client';

import React from 'react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';
import WidgetRenderer from './WidgetRenderer';

const EditorCanvas: React.FC = () => {
  const { 
    widgets, 
    selectedTemplate, 
    selectedWidget,
    isEditing 
  } = usePageBuilder();

  if (!selectedTemplate) {
    return <div className="flex-1 bg-gray-100 flex items-center justify-center">
      Please select a template first
    </div>;
  }

  // Apply template styles to the canvas
  const templateStyle = {
    backgroundColor: selectedTemplate.style.backgroundColor,
    fontFamily: selectedTemplate.style.fontFamily,
    color: selectedTemplate.style.color,
    minHeight: '100%',
    position: 'relative' as const,
    padding: '20px',
  };

  return (
    <div className="flex-1 overflow-auto">
      <div style={templateStyle}>
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              position: 'relative', 
              margin: '10px 0',
              border: selectedWidget?.id === widget.id ? '2px solid blue' : 'none',
            }}
          >
            <WidgetRenderer widget={widget} isEditing={isEditing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
