'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface ImageWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ widget, isEditing }) => {
  return (
    <div className="widget image-widget p-4 border rounded">
      <div className="image-container relative w-full">
        {widget.content?.imageUrl ? (
          <img
            src={widget.content.imageUrl}
            alt={widget.content?.altText || "Image"}
            className="w-full h-auto rounded"
          />
        ) : (
          <div className="bg-gray-200 rounded w-full h-48 flex items-center justify-center">
            {isEditing ? "이미지를 선택해주세요" : "이미지가 없습니다"}
          </div>
        )}
      </div>
      {widget.content?.caption && (
        <p className="text-sm text-gray-500 mt-2">{widget.content.caption}</p>
      )}
    </div>
  );
};

export default ImageWidget;