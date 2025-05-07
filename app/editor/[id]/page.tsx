'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageBuilderProvider } from '@/contexts/PageBuilderContext';
import PageEditor from '@/components/page-builder/PageEditor';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventEditorPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, supabase]);

  const handleSave = () => {
    router.push(`/event/${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading editor...</p>
            </div>
          ) : (
            <PageBuilderProvider>
              <PageEditor eventId={id} onSave={handleSave} />
            </PageBuilderProvider>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
