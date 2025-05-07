'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface MapWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const MapWidget: React.FC<MapWidgetProps> = ({ widget, isEditing }) => {
  const location = widget.content?.location;
  
  return (
    <div className="widget map-widget p-4 border rounded">
      {location ? (
        <>
          <div className="map-container w-full h-64 bg-gray-200 relative rounded">
            {/* 실제 지도 구현은 Google Maps API 등 외부 라이브러리 사용 필요 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p>위치: {location.address || '지정된 주소 없음'}</p>
              </div>
            </div>
          </div>
          {location.description && (
            <p className="text-sm text-gray-500 mt-2">{location.description}</p>
          )}
        </>
      ) : (
        <div className="bg-gray-200 rounded w-full h-64 flex items-center justify-center">
          {isEditing ? "위치 정보를 입력해주세요" : "위치 정보가 없습니다"}
        </div>
      )}
    </div>
  );
};

export default MapWidget;