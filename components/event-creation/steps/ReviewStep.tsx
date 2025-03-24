'use client';

interface ReviewStepProps {
  data: {
    title: string;
    description: string;
    date: string;  // Changed from event_date
    time: string;  // Added new field
    location: string;
    images: string[];
    theme: {
      backgroundColor: string;
      buttonColor: string;
      fontFamily: string;
      buttonRadius: string;
    };
    rsvp_options: {
      allow_plus_one: boolean;
      collect_dietary_restrictions: boolean;
      deadline: string | null;
      custom_questions: Array<{
        id: string;
        question: string;
        type: string;
        options?: string[];
        required: boolean;
      }>;
    };
    notification_settings: {
      notify_on_rsvp: boolean;
      daily_summary: boolean;
      email_notifications: boolean;
    };
  };
}

export default function ReviewStep({ data }: ReviewStepProps) {
  // Format the date and time for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-6">Review Your Event</h2>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-medium">Basic Information</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-500">Event Title</div>
            <div>{data.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Description</div>
            <div className="whitespace-pre-wrap">{data.description}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Date</div>
            <div>{formatDate(data.date)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Time</div>
            <div>{data.time}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Location</div>
            <div>{data.location}</div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-medium">Design Settings</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Background Color</div>
              <div className="flex items-center mt-1">
                <div className="w-6 h-6 rounded border mr-2" style={{ backgroundColor: data.theme.backgroundColor }}></div>
                <span>{data.theme.backgroundColor}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Button Color</div>
              <div className="flex items-center mt-1">
                <div className="w-6 h-6 rounded border mr-2" style={{ backgroundColor: data.theme.buttonColor }}></div>
                <span>{data.theme.buttonColor}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Font</div>
              <div>{data.theme.fontFamily}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Button Style</div>
              <div>{data.theme.buttonRadius.replace('rounded', 'Rounded').replace('-', ' ').replace('none', 'Square')}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 mb-2">Images</div>
            {data.images.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.images.map((image, index) => (
                  <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                    <img src={image} alt={`Event ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-yellow-600">No images uploaded</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-medium">RSVP Options</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-500">Allow Plus One</div>
            <div>{data.rsvp_options.allow_plus_one ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Collect Dietary Restrictions</div>
            <div>{data.rsvp_options.collect_dietary_restrictions ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">RSVP Deadline</div>
            <div>{data.rsvp_options.deadline ? formatDate(data.rsvp_options.deadline) : 'No deadline'}</div>
          </div>
          
          {data.rsvp_options.custom_questions.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-500 mt-2">Custom Questions</div>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {data.rsvp_options.custom_questions.map((question) => (
                  <li key={question.id}>
                    {question.question}
                    {question.required && <span className="text-red-500">*</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-medium">Notification Settings</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-500">Instant RSVP Notifications</div>
            <div>{data.notification_settings.notify_on_rsvp ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Daily Summary Report</div>
            <div>{data.notification_settings.daily_summary ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Email Notifications</div>
            <div>{data.notification_settings.email_notifications ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Please review all details above. Once you click "Create Event", your event will be live and ready to share.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
