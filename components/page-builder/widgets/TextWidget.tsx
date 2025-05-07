'use client';

import React from 'react';
import { Widget, usePageBuilder } from '@/contexts/PageBuilderContext';

interface TextWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const TextWidget: React.FC<TextWidgetProps> = ({ widget, isEditing }) => {
  const { updateWidget } = usePageBuilder();
  const { content } = widget;
  
  const defaultText = "Enter your text here...";
  const text = content.text || defaultText;
  
  const handleTextChange = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    if (isEditing) {
      updateWidget(widget.id, {
        content: { ...content, text: e.target.innerText }
      });
    }
  };

  return (
    <p 
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleTextChange}
      className="w-full"
      style={{ outline: 'none' }}
    >
      {text}
    </p>
  );
};

export default TextWidget;
