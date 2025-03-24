'use client';

import { useState } from 'react';

interface BasicInfoStepProps {
  data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
  };
  onChange: (data: Partial<BasicInfoStepProps['data']>) => void;
}

export default function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
    validate(name, value);
  };

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-xl font-semibold mb-6 text-gradient">Event Details</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            onBlur={(e) => validate('title', e.target.value)}
            placeholder="Enter event title"
            className="w-full px-4 py-2 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            onBlur={(e) => validate('description', e.target.value)}
            placeholder="Describe your event"
            rows={4}
            className="w-full px-4 py-2 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
          />
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              onBlur={(e) => validate('date', e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
            />
            {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
              Event Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={data.time}
              onChange={handleChange}
              onBlur={(e) => validate('time', e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
            />
            {errors.time && <p className="mt-1 text-sm text-red-400">{errors.time}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={data.location}
            onChange={handleChange}
            onBlur={(e) => validate('location', e.target.value)}
            placeholder="Enter event location"
            className="w-full px-4 py-2 bg-input border border-border/30 text-white rounded-md focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
          />
          {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-4">
        * Required fields
      </div>
      
      <div className="p-4 rounded-md mt-6" style={{ backgroundColor: 'rgba(0, 82, 136, 0.1)', border: '1px solid rgba(0, 82, 136, 0.2)' }}>
        <h3 className="text-accent font-medium text-sm mb-2">Pro Tips</h3>
        <ul className="text-xs text-gray-300 space-y-1 ml-4 list-disc">
          <li>Be descriptive with your event title to attract attendees</li>
          <li>Include specific details like parking information in your description</li>
          <li>Set realistic event times that work for your target audience</li>
          <li>For virtual events, include meeting link details in the location field</li>
        </ul>
      </div>
    </div>
  );
}
