'use client';

import React from 'react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';

const TemplateSelector: React.FC = () => {
  const { templates, selectTemplate } = usePageBuilder();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Select a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors cursor-pointer"
            onClick={() => selectTemplate(template.id)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {template.thumbnail ? (
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Preview</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium">{template.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
