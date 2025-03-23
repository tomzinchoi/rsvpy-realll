import React, { useState } from 'react';
import { supabase, handleSupabaseError } from '@/lib/supabase';

interface RsvpFormProps {
  eventId: string;
  customFields?: any; // Define a more specific type based on your custom fields structure
  onRsvpSubmitted?: (data: any) => void;
}

const RsvpForm = ({ eventId, customFields, onRsvpSubmitted }: RsvpFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState(true);
  const [customData, setCustomData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleCustomFieldChange = (key: string, value: any) => {
    setCustomData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert([
          {
            event_id: eventId,
            name,
            email,
            attending,
            custom_data: customData,
          },
        ])
        .select();
      
      if (error) throw error;
      
      // Clear form after successful submission
      setName('');
      setEmail('');
      setAttending(true);
      setCustomData({});
      setSuccess(true);
      setSubmitCount(prev => prev + 1);
      
      // Call the callback if provided
      if (onRsvpSubmitted) {
        onRsvpSubmitted(data[0]);
      }
    } catch (error: any) {
      console.error('RSVP submission error:', error);
      setError(error.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
      
      // Reset success message after 5 seconds
      if (success) {
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    }
  };

  // Reset form for new submission
  const handleNewRsvp = () => {
    setSuccess(false);
  };

  // Render custom fields based on the event configuration
  const renderCustomFields = () => {
    if (!customFields) return null;
    
    return Object.entries(customFields).map(([key, field]: [string, any]) => (
      <div key={key} className="mb-4">
        <label htmlFor={key} className="block text-gray-700 text-sm font-bold mb-2">
          {field.label || key}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            id={key}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={customData[key] || ''}
            onChange={(e) => handleCustomFieldChange(key, e.target.value)}
            required={field.required}
          />
        )}
        
        {field.type === 'select' && (
          <select
            id={key}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={customData[key] || ''}
            onChange={(e) => handleCustomFieldChange(key, e.target.value)}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={key}
              className="mr-2"
              checked={!!customData[key]}
              onChange={(e) => handleCustomFieldChange(key, e.target.checked)}
              required={field.required}
            />
            <label htmlFor={key} className="text-gray-700">
              {field.label || key}
            </label>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">RSVP</h2>
      
      {success ? (
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <div className="flex justify-center mb-2">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800">Thank You!</h3>
            <p className="text-green-700">Your RSVP has been successfully submitted.</p>
          </div>
          <button
            onClick={handleNewRsvp}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none"
          >
            Submit Another RSVP
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Will you attend? *
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="attending-yes"
                  name="attending"
                  className="mr-2"
                  checked={attending}
                  onChange={() => setAttending(true)}
                />
                <label htmlFor="attending-yes" className="text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="attending-no"
                  name="attending"
                  className="mr-2"
                  checked={!attending}
                  onChange={() => setAttending(false)}
                />
                <label htmlFor="attending-no" className="text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>
          
          {renderCustomFields()}
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RsvpForm;
