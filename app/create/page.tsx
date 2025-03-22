'use client';

import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

export default function Create() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase.from('events').insert({
        title,
        date,
        location,
        description,
        host_id: user.id,
        view_count: 0
      });
      
      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Invitation</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">Event Title</label>
            <input 
              type="text" 
              id="title" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 font-medium">Event Date</label>
            <input 
              type="date" 
              id="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block mb-2 font-medium">Location</label>
            <input 
              type="text" 
              id="location" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">Description</label>
            <textarea 
              id="description" 
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Describe your event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Invitation'}
            </button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}
