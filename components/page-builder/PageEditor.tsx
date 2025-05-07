'use client';

import React, { useEffect } from 'react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';
import WidgetToolbar from './WidgetToolbar';
import EditorCanvas from './EditorCanvas';
import PropertiesPanel from './PropertiesPanel';
import TemplateSelector from './TemplateSelector';

interface PageEditorProps {
  eventId?: string;
  onSave?: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ eventId, onSave }) => {
  const { 
    selectedTemplate, 
    loadPageDesign, 
    savePageDesign,
    setEditingMode
  } = usePageBuilder();

  useEffect(() => {
    setEditingMode(true);
    
    // If eventId is provided, load the existing design
    if (eventId) {
      loadPageDesign(eventId);
    }
    
    return () => {
      setEditingMode(false);
    };
  }, [eventId, loadPageDesign, setEditingMode]);

  const handleSave = async () => {
    await savePageDesign();
    if (onSave) onSave();
  };

  if (!selectedTemplate) {
    return <TemplateSelector />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Page Editor</h1>
        <div className="space-x-2">
          <button 
            onClick={() => setEditingMode(false)} 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Preview
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save Design
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <WidgetToolbar />
        <EditorCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default PageEditor;
