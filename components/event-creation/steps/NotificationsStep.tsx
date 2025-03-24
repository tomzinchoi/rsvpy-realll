'use client';

interface NotificationsStepProps {
  data: {
    notification_settings: {
      notify_on_rsvp: boolean;
      daily_summary: boolean;
      email_notifications: boolean;
    };
  };
  onChange: (data: any) => void;
}

export default function NotificationsStep({ data, onChange }: NotificationsStepProps) {
  const updateNotificationSettings = (field: string, value: boolean) => {
    onChange({
      notification_settings: {
        ...data.notification_settings,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Email sending is currently in development. While you can set your preferences, actual email delivery may not be functioning yet.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="notify_on_rsvp"
              type="checkbox"
              checked={data.notification_settings.notify_on_rsvp}
              onChange={(e) => updateNotificationSettings('notify_on_rsvp', e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="notify_on_rsvp" className="font-medium text-gray-700">Instant RSVP Notifications</label>
            <p className="text-gray-500">Get notified immediately when someone RSVPs to your event</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="daily_summary"
              type="checkbox"
              checked={data.notification_settings.daily_summary}
              onChange={(e) => updateNotificationSettings('daily_summary', e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="daily_summary" className="font-medium text-gray-700">Daily Summary Report</label>
            <p className="text-gray-500">Receive a daily email with a summary of all RSVPs and activities</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="email_notifications"
              type="checkbox"
              checked={data.notification_settings.email_notifications}
              onChange={(e) => updateNotificationSettings('email_notifications', e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="email_notifications" className="font-medium text-gray-700">Email Notifications</label>
            <p className="text-gray-500">Enable or disable all email notifications</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-8">
        <h3 className="text-lg font-medium mb-4">Email Invitations</h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700 mb-4">
            You'll be able to send email invitations after creating your event. Access this feature from your event dashboard.
          </p>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Premium plan subscribers get additional invitation templates and tracking features.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
