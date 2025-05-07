'use client';

import React from 'react';
import { Widget, usePageBuilder } from '@/contexts/PageBuilderContext';

interface HeaderWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const HeaderWidget: React.FC<HeaderWidgetProps> = ({ widget, isEditing }) => {
  const { updateWidget } = usePageBuilder();
  const { content } = widget;
  
  const defaultText = "Event Title";
  const headerText = content.text || defaultText;
  
  const handleTextChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    if (isEditing) {
      updateWidget(widget.id, {
        content: { ...content, text: e.target.innerText }
      });
    }
  };

  return (
    <h1 
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleTextChange}
      className="text-3xl md:text-4xl font-bold text-center w-full"
      style={{ outline: 'none' }}
    >
      {headerText}
    </h1>
  );
};

export default HeaderWidget;
