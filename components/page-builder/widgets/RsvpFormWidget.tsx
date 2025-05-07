'use client';

import React from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface RsvpFormWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const RsvpFormWidget: React.FC<RsvpFormWidgetProps> = ({ widget, isEditing }) => {
  return (
    <div className="widget rsvp-form-widget p-4 border rounded">
      <h3 className="text-xl font-bold mb-4">RSVP</h3>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">이름</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded"
            placeholder="Type your name"
            disabled={isEditing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded"
            placeholder="이메일을 입력하세요"
            disabled={isEditing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">참석 여부</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="attendance" 
                value="yes"
                className="mr-2"
                disabled={isEditing}
              />
              참석
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="attendance" 
                value="no"
                className="mr-2"
                disabled={isEditing}
              />
              불참
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="attendance" 
                value="maybe"
                className="mr-2"
                disabled={isEditing}
              />
              미정
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">메시지 (선택사항)</label>
          <textarea 
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="메시지를 입력하세요"
            disabled={isEditing}
          ></textarea>
        </div>
        
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={isEditing}
        >
          {isEditing ? "편집 모드에서는 제출할 수 없습니다" : "RSVP 제출하기"}
        </button>
      </form>
    </div>
  );
};

export default RsvpFormWidget;