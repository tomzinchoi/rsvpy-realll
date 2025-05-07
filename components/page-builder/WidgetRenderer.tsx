'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface WidgetRendererProps {
  widget: Widget;
  isEditing: boolean;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, isEditing }) => {
  // 모든 위젯 타입에 대해 동일한 임시 컴포넌트 반환
  return (
    <div className="widget p-4 border rounded">
      <h3 className="font-medium">{widget.type} 위젯 {isEditing ? "(편집 모드)" : ""}</h3>
      <p className="text-sm mt-2">
        {isEditing ? "편집 기능은 현재 개발 중입니다." : "이 기능은 현재 개발 중입니다."}
      </p>
    </div>
  );
};

export default WidgetRenderer;
