'use client';

import React from 'react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';

const PropertiesPanel: React.FC = () => {
  const { 
    selectedWidget, 
    updateWidget, 
    removeWidget, 
    selectedTemplate, 
    updateTemplateStyle 
  } = usePageBuilder();

  if (!selectedWidget && !selectedTemplate) {
    return <div className="w-72 bg-gray-50 border-l border-gray-200 p-4">
      <p className="text-gray-500">Select a widget or template to edit properties</p>
    </div>;
  }

  // Handle widget property changes
  const handleWidgetPropertyChange = (property: string, value: any) => {
    if (selectedWidget) {
      updateWidget(selectedWidget.id, {
        content: { ...selectedWidget.content, [property]: value }
      });
    }
  };

  // Handle template style changes
  const handleTemplateStyleChange = (property: string, value: string) => {
    if (selectedTemplate) {
      updateTemplateStyle({ [property]: value });
    }
  };

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      {selectedWidget ? (
        // Widget properties
        <>
          <h2 className="text-lg font-medium mb-4">Widget Properties</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Type
            </label>
            <div className="text-sm bg-gray-100 p-2 rounded">
              {selectedWidget.type.charAt(0).toUpperCase() + selectedWidget.type.slice(1)}
            </div>
          </div>
          
          {/* Common widget properties */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={selectedWidget.size.width}
              onChange={(e) => updateWidget(selectedWidget.id, {
                size: { ...selectedWidget.size, width: Number(e.target.value) }
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={selectedWidget.size.height}
              onChange={(e) => updateWidget(selectedWidget.id, {
                size: { ...selectedWidget.size, height: Number(e.target.value) }
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Render type-specific properties based on widget type */}
          {selectedWidget.type === 'text' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <textarea
                value={selectedWidget.content.text || ''}
                onChange={(e) => handleWidgetPropertyChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>
          )}
          
          {selectedWidget.type === 'header' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Text
              </label>
              <input
                type="text"
                value={selectedWidget.content.text || ''}
                onChange={(e) => handleWidgetPropertyChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          
          <button
            onClick={() => removeWidget(selectedWidget.id)}
            className="w-full p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Widget
          </button>
        </>
      ) : (
        // Template properties
        <>
          <h2 className="text-lg font-medium mb-4">Template Properties</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex">
              <input
                type="color"
                value={selectedTemplate?.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleTemplateStyleChange('backgroundColor', e.target.value)}
                className="p-1 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                value={selectedTemplate?.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleTemplateStyleChange('backgroundColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex">
              <input
                type="color"
                value={selectedTemplate?.style.color || '#000000'}
                onChange={(e) => handleTemplateStyleChange('color', e.target.value)}
                className="p-1 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                value={selectedTemplate?.style.color || '#000000'}
                onChange={(e) => handleTemplateStyleChange('color', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={selectedTemplate?.style.fontFamily || ''}
              onChange={(e) => handleTemplateStyleChange('fontFamily', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Garamond, serif">Garamond</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Playfair Display', serif">Playfair Display</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;
