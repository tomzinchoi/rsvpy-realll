'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types for our page builder
export type WidgetType = 
  | 'header' 
  | 'text' 
  | 'image' 
  | 'gallery' 
  | 'map' 
  | 'rsvp-form' 
  | 'countdown' 
  | 'calendar';

export interface Widget {
  id: string;
  type: WidgetType;
  content: any;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  widgets: Widget[];
  style: {
    backgroundColor: string;
    fontFamily: string;
    color: string;
    // Additional template styles
  };
}

interface PageBuilderContextType {
  templates: Template[];
  selectedTemplate: Template | null;
  widgets: Widget[];
  selectedWidget: Widget | null;
  isEditing: boolean;
  
  // Template actions
  selectTemplate: (templateId: string) => void;
  updateTemplateStyle: (style: Record<string, any>) => void;
  
  // Widget actions
  addWidget: (type: WidgetType) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  removeWidget: (widgetId: string) => void;
  selectWidget: (widgetId: string | null) => void;
  
  // Editor actions
  setEditingMode: (editing: boolean) => void;
  savePageDesign: () => Promise<void>;
  loadPageDesign: (eventId: string) => Promise<void>;
}

const defaultTemplates: Template[] = [
  {
    id: 'elegant-wedding',
    name: 'Elegant Wedding',
    thumbnail: '/templates/elegant-wedding.jpg',
    widgets: [],
    style: {
      backgroundColor: '#f8f5f0',
      fontFamily: 'Playfair Display, serif',
      color: '#333333',
    },
  },
  {
    id: 'birthday-celebration',
    name: 'Birthday Celebration',
    thumbnail: '/templates/birthday-celebration.jpg',
    widgets: [],
    style: {
      backgroundColor: '#fef6e4',
      fontFamily: 'Montserrat, sans-serif',
      color: '#001858',
    },
  },
  {
    id: 'corporate-event',
    name: 'Corporate Event',
    thumbnail: '/templates/corporate-event.jpg',
    widgets: [],
    style: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      color: '#374151',
    },
  },
];

const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

export const PageBuilderProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(true);

  // Template actions
  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize with template widgets
      setWidgets(template.widgets);
    }
  };

  const updateTemplateStyle = (style: Record<string, any>) => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        style: { ...selectedTemplate.style, ...style }
      };
      setSelectedTemplate(updatedTemplate);
      
      // Update template in templates list
      setTemplates(prev => 
        prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
      );
    }
  };

  // Widget actions
  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: uuidv4(),
      type,
      content: {},
      position: { x: 0, y: widgets.length * 10 },
      size: { width: 100, height: 100 },
      style: {}
    };
    setWidgets(prev => [...prev, newWidget]);
    selectWidget(newWidget.id);
  };

  const updateWidget = (widgetId: string, updates: Partial<Widget>) => {
    setWidgets(prev => 
      prev.map(widget => widget.id === widgetId 
        ? { ...widget, ...updates } 
        : widget
      )
    );
    
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    if (selectedWidget?.id === widgetId) {
      selectWidget(null);
    }
  };

  const selectWidget = (widgetId: string | null) => {
    if (widgetId === null) {
      setSelectedWidget(null);
      return;
    }
    
    const widget = widgets.find(w => w.id === widgetId);
    setSelectedWidget(widget || null);
  };

  // Editor actions
  const setEditingMode = (editing: boolean) => {
    setIsEditing(editing);
  };

  const savePageDesign = async () => {
    // This will be implemented to save to Supabase
    console.log('Saving page design...');
    // Will save: selectedTemplate, widgets
    return Promise.resolve();
  };

  const loadPageDesign = async (eventId: string) => {
    // This will be implemented to load from Supabase
    console.log('Loading page design for event:', eventId);
    return Promise.resolve();
  };

  return (
    <PageBuilderContext.Provider value={{
      templates,
      selectedTemplate,
      widgets,
      selectedWidget,
      isEditing,
      selectTemplate,
      updateTemplateStyle,
      addWidget,
      updateWidget,
      removeWidget,
      selectWidget,
      setEditingMode,
      savePageDesign,
      loadPageDesign
    }}>
      {children}
    </PageBuilderContext.Provider>
  );
};

export const usePageBuilder = () => {
  const context = useContext(PageBuilderContext);
  if (context === undefined) {
    throw new Error('usePageBuilder must be used within a PageBuilderProvider');
  }
  return context;
};
