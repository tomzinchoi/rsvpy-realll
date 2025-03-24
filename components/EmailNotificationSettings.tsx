import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface EmailNotificationSettingsProps {
  eventId: string;
}

const EmailNotificationSettings = ({ eventId }: EmailNotificationSettingsProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch current notification settings
  useEffect(() => {
    const getNotificationSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('notification_settings')
          .eq('id', eventId)
          .single();
        
        if (error) throw error;
        
        if (data?.notification_settings) {
          setIsEnabled(data.notification_settings.emails_enabled !== false);
        }
      } catch (err) {
        console.error('Error fetching notification settings:', err);
        // Default to enabled if we can't fetch settings
      }
    };
    
    getNotificationSettings();
  }, [eventId]);

  // Update notification settings
  const updateNotificationSettings = async (enabled: boolean) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('events')
        .update({
          notification_settings: { emails_enabled: enabled }
        })
        .eq('id', eventId);
      
      if (error) throw error;
      
      setIsEnabled(enabled);
      setMessage(`Email notifications ${enabled ? 'enabled' : 'disabled'} successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating notification settings:', err);
      setError(err.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle change
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNotificationSettings(e.target.checked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Email Notification Settings</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
          {message}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Receive email notifications for new RSVPs</p>
          <p className="text-sm text-gray-600">
            You'll get an email when someone responds to your event invitation
          </p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEnabled}
            onChange={handleToggleChange}
            disabled={loading}
          />
          <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black ${loading ? 'opacity-50' : ''}`}></div>
        </label>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Note: Make sure your email provider doesn't filter these notifications as spam.
          Add noreply@rsvpy.com to your contacts to ensure delivery.
        </p>
      </div>
    </div>
  );
};

export default EmailNotificationSettings;
