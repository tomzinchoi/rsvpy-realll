'use client';

import React, { useEffect, useState } from 'react';
import { Widget } from '@/contexts/PageBuilderContext';

interface CountdownWidgetProps {
  widget: Widget;
  isEditing: boolean;
}

const CountdownWidget: React.FC<CountdownWidgetProps> = ({ widget, isEditing }) => {
  const targetDate = widget.content?.targetDate || new Date().toISOString();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="widget countdown-widget p-4 border rounded text-center">
      <h3 className="text-lg font-medium mb-3">{widget.content?.title || "Event Countdown"}</h3>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-gray-500">Hours</div>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-500">Seconds</div>
        </div>
      </div>
      
      {widget.content?.description && (
        <p className="text-sm text-gray-600 mt-3">{widget.content.description}</p>
      )}
    </div>
  );
};

export default CountdownWidget;