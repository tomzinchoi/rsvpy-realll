'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface GalleryWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const GalleryWidget: React.FC<GalleryWidgetProps> = ({ widget, isEditing }) => {
  const images = widget.content?.images || [] as ImageItem[];
  
  return (
    <div className="widget gallery-widget p-4 border rounded">
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image: ImageItem, index: number) => (
            <div key={index} className="gallery-item">
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-48 object-cover rounded"
              />
              {image.caption && (
                <p className="text-sm text-gray-500 mt-1">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-200 rounded w-full h-48 flex items-center justify-center">
          {isEditing ? "갤러리 이미지를 추가해주세요" : "이미지가 없습니다"}
        </div>
      )}
    </div>
  );
};

export default GalleryWidget;