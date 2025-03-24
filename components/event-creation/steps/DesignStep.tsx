'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

interface DesignStepProps {
  data: {
    title: string;
    description: string;
    theme: {
      backgroundColor: string;
      buttonColor: string;
      fontFamily: string;
      buttonRadius: string;
    };
    images: string[];
  };
  onChange: (data: Partial<any>) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter (Default)' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
];

const buttonRadiusOptions = [
  { value: 'rounded-none', label: 'Square' },
  { value: 'rounded', label: 'Rounded (Default)' },
  { value: 'rounded-full', label: 'Pill' },
];

export default function DesignStep({ data, onChange }: DesignStepProps) {
  const handleThemeChange = (field: string, value: string) => {
    onChange({
      theme: {
        ...data.theme,
        [field]: value
      }
    });
  };

  const handleImagesChange = (images: string[]) => {
    onChange({ images });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-6">Event Design</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Theme Colors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="backgroundColor"
                  value={data.theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={data.theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700 mb-1">
                Button Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="buttonColor"
                  value={data.theme.buttonColor}
                  onChange={(e) => handleThemeChange('buttonColor', e.target.value)}
                  className="w-10 h-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={data.theme.buttonColor}
                  onChange={(e) => handleThemeChange('buttonColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Typography & Buttons</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                id="fontFamily"
                value={data.theme.fontFamily}
                onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              >
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="buttonRadius" className="block text-sm font-medium text-gray-700 mb-1">
                Button Style
              </label>
              <select
                id="buttonRadius"
                value={data.theme.buttonRadius}
                onChange={(e) => handleThemeChange('buttonRadius', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              >
                {buttonRadiusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Images</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload images for your event (maximum 5 images)
          </p>
          
          <ImageUploader
            currentImages={data.images}
            onChange={handleImagesChange}
            maxImages={5}
          />
          
          {data.images.length === 0 && (
            <p className="text-sm text-yellow-600 mt-2">
              Adding at least one image is recommended for a better looking event page.
            </p>
          )}
        </div>
      </div>
      
      <div className="border p-4 rounded-lg bg-gray-50">
        <h3 className="text-md font-medium mb-2">Preview</h3>
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: data.theme.backgroundColor,
            fontFamily: data.theme.fontFamily
          }}
        >
          <div className="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded mb-4">
            {data.images.length > 0 ? (
              <img src={data.images[0]} alt="Event" className="h-full object-contain" />
            ) : (
              <span className="text-gray-500">Event Image Preview</span>
            )}
          </div>
          <div className="text-center mb-4">
            <h4 className="font-bold">{data.title || 'Event Title'}</h4>
            <p>{data.description || 'Event description will appear here'}</p>
          </div>
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 ${data.theme.buttonRadius}`}
              style={{ backgroundColor: data.theme.buttonColor, color: 'white' }}
            >
              RSVP Button Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
