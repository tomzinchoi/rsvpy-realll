'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';
import HeaderWidget from './widgets/HeaderWidget';
import TextWidget from './widgets/TextWidget';
import ImageWidget from './widgets/ImageWidget';
import GalleryWidget from './widgets/GalleryWidget';
import MapWidget from './widgets/MapWidget';
import RsvpFormWidget from './widgets/RsvpFormWidget';
import CountdownWidget from './widgets/CountdownWidget';
import CalendarWidget from './widgets/CalendarWidget';

interface WidgetRendererProps {
  widget: Widget;
  isEditing: boolean;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, isEditing }) => {
  // Render different widget types
  switch (widget.type) {
    case 'header':
      return <HeaderWidget widget={widget} isEditing={isEditing} />;
    case 'text':
      return <TextWidget widget={widget} isEditing={isEditing} />;
    case 'image':
      return <ImageWidget widget={widget} isEditing={isEditing} />;
    case 'gallery':
      return <GalleryWidget widget={widget} isEditing={isEditing} />;
    case 'map':
      return <MapWidget widget={widget} isEditing={isEditing} />;
    case 'rsvp-form':
      return <RsvpFormWidget widget={widget} isEditing={isEditing} />;
    case 'countdown':
      return <CountdownWidget widget={widget} isEditing={isEditing} />;
    case 'calendar':
      return <CalendarWidget widget={widget} isEditing={isEditing} />;
    default:
      return <div>Unknown widget type</div>;
  }
};

export default WidgetRenderer;
