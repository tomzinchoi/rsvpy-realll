'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/ImageUploader';
import Link from 'next/link';

type CustomFieldType = 'text' | 'checkbox' | 'select' | 'slider';

interface CustomField {
  name: string;
  type: CustomFieldType;
  options?: string[];
  required: boolean;
}

export default function CreateEvent() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUploaded = (url: string) => {
    setEventImageUrl(url);
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) {
      setError('Field name is required');
      return;
    }

    const newField: CustomField = {
      name: newFieldName,
      type: newFieldType,
      required: newFieldRequired,
    };

    if (newFieldType === 'select' && newFieldOptions.trim()) {
      newField.options = newFieldOptions.split(',').map(option => option.trim());
    }

    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    setError(null);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) throw new Error('You must be logged in to create an event');

      console.log('Creating event with data:', {
        title,
        description,
        date,
        time,
        location,
        user_id: user.id,
        custom_fields: customFields,
        event_image_url: eventImageUrl
      });

      const { data, error: insertError } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            date,
            time,
            location,
            user_id: user.id,
            custom_fields: customFields,
            event_image_url: eventImageUrl,
            created_at: new Date().toISOString(),
            view_count: 0
          },
        ])
        .select('id')
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      console.log('Event created successfully:', data);
      
      // Redirect to the event page
      router.push(`/event/${data.id}`);
    } catch (error: any) {
      console.error('Error creating event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-block mb-6 text-black hover:underline">
          &larr; Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Event Title*
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            {/* Add the ImageUploader component here */}
            {user && (
              <div className="mb-6">
                <ImageUploader 
                  eventId={`temp-${user.id}-${Date.now()}`} 
                  onImageUploaded={handleImageUploaded}
                />
                {eventImageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image preview:</p>
                    <img 
                      src={eventImageUrl} 
                      alt="Event preview" 
                      className="max-h-40 rounded-md border border-gray-200" 
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date*
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location*
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div className="mb-6 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Custom RSVP Fields</h2>
              
              {customFields.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Added Fields:</h3>
                  <ul className="bg-gray-50 p-3 rounded-md">
                    {customFields.map((field, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <div>
                          <span className="font-medium">{field.name}</span>
                          <span className="ml-2 text-sm text-gray-600">({field.type})</span>
                          {field.required && <span className="ml-2 text-xs text-red-500">Required</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Add a new field:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="newFieldName">
                      Field Name
                    </label>
                    <input
                      id="newFieldName"
                      type="text"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="newFieldType">
                      Field Type
                    </label>
                    <select
                      id="newFieldType"
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="select">Dropdown</option>
                      <option value="slider">Slider</option>
                    </select>
                  </div>
                </div>
                
                {newFieldType === 'select' && (
                  <div className="mb-3">
                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="newFieldOptions">
                      Options (comma separated)
                    </label>
                    <input
                      id="newFieldOptions"
                      type="text"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
                
                <div className="flex items-center mb-3">
                  <input
                    id="newFieldRequired"
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-gray-700 text-xs" htmlFor="newFieldRequired">
                    Required field
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={addCustomField}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
                >
                  Add Field
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
