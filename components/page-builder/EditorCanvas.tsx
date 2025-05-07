'use client';

import React from 'react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';
import WidgetRenderer from './WidgetRenderer';

const EditorCanvas: React.FC = () => {
  const { 
    widgets, 
    selectedTemplate, 
    selectedWidget, 
    selectWidget, 
    updateWidget,
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

  const handleWidgetClick = (widgetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectWidget(widgetId);
  };

  const handleCanvasClick = () => {
    // Deselect widget when clicking on canvas
    selectWidget(null);
  };

  const handleDragStart = (widgetId: string, e: React.DragEvent) => {
    e.dataTransfer.setData('widgetId', widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData('widgetId');
    const canvas = e.currentTarget.getBoundingClientRect();
    
    // Calculate position relative to canvas
    const x = ((e.clientX - canvas.left) / canvas.width) * 100;
    const y = ((e.clientY - canvas.top) / canvas.height) * 100;
    
    updateWidget(widgetId, {
      position: { x, y }
    });
  };

  return (
    <div 
      className="flex-1 overflow-auto"
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div style={templateStyle}>
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              position: 'absolute',
              left: `${widget.position.x}%`,
              top: `${widget.position.y}%`,
              width: `${widget.size.width}px`,
              height: `${widget.size.height}px`,
              border: selectedWidget?.id === widget.id ? '2px solid blue' : 'none',
              cursor: isEditing ? 'move' : 'default',
            }}
            onClick={(e) => handleWidgetClick(widget.id, e)}
            draggable={isEditing}
            onDragStart={(e) => handleDragStart(widget.id, e)}
          >
            <WidgetRenderer widget={widget} isEditing={isEditing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
