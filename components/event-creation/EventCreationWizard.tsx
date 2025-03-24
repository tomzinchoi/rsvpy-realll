'use client';

import { useState, useEffect } from 'react';
import BasicInfoStep from './steps/BasicInfoStep';
import DesignStep from './steps/DesignStep';
import RsvpOptionsStep from './steps/RsvpOptionsStep';
import NotificationsStep from './steps/NotificationsStep';
import ReviewStep from './steps/ReviewStep';

export interface EventData {
  title: string;
  description: string;
  date: string; // changed from event_date to match database schema
  time: string; // added to match database schema
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
      type: 'text' | 'checkbox' | 'select';
      options?: string[];
      required: boolean;
    }>;
  };
  notification_settings: {
    notify_on_rsvp: boolean;
    daily_summary: boolean;
    email_notifications: boolean;
  };
}

interface EventCreationWizardProps {
  onSubmit: (eventData: EventData) => Promise<void>;
}

export default function EventCreationWizard({ onSubmit }: EventCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    date: '',  // changed from event_date
    time: '',  // added new field
    location: '',
    images: [],
    theme: {
      backgroundColor: '#000000', // Updated to black default
      buttonColor: '#005288',     // Updated to SpaceX blue
      fontFamily: 'Inter',
      buttonRadius: 'rounded',
    },
    rsvp_options: {
      allow_plus_one: false,
      collect_dietary_restrictions: false,
      deadline: null,
      custom_questions: [],
    },
    notification_settings: {
      notify_on_rsvp: true,
      daily_summary: false,
      email_notifications: true,
    }
  });
  
  const [stepValidation, setStepValidation] = useState({
    1: false,
    2: true,
    3: true,
    4: true,
    5: true
  });

  const updateEventData = (stepData: Partial<EventData>) => {
    setEventData(prev => ({ ...prev, ...stepData }));
  };

  // Validate step 1 when relevant data changes
  useEffect(() => {
    const { title, description, date, location } = eventData;
    const isStep1Valid = 
      title.trim() !== '' && 
      description.trim() !== '' && 
      date.trim() !== '' && 
      location.trim() !== '';
    
    setStepValidation(prev => ({
      ...prev,
      1: isStep1Valid
    }));
  }, [eventData.title, eventData.description, eventData.date, eventData.location]);

  const nextStep = () => {
    if (currentStep < 5 && stepValidation[currentStep as keyof typeof stepValidation]) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(eventData);
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Design' },
    { number: 3, title: 'RSVP Options' },
    { number: 4, title: 'Notifications' },
    { number: 5, title: 'Review' },
  ];

  // Render the correct step component based on currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            data={eventData} 
            onChange={updateEventData} 
          />
        );
      case 2:
        return (
          <DesignStep 
            data={eventData} 
            onChange={updateEventData} 
          />
        );
      case 3:
        return (
          <RsvpOptionsStep 
            data={eventData} 
            onChange={updateEventData} 
          />
        );
      case 4:
        return (
          <NotificationsStep 
            data={eventData} 
            onChange={updateEventData} 
          />
        );
      case 5:
        return (
          <ReviewStep 
            data={eventData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Progress Steps - Fixed the layout to remove the gray line */}
      <div className="flex mb-8 justify-between relative">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep === step.number
                  ? 'bg-accent text-white ring-4 ring-accent/20'
                  : currentStep > step.number
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > step.number ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div className="text-xs mt-2 text-center text-gray-400">{step.title}</div>
          </div>
        ))}
        
        {/* Progress line - Fixed positioning */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-800 -z-0" style={{ width: '100%' }}>
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Step Content with CSS Animations instead of framer-motion */}
      <div className="py-4">
        <div key={currentStep} className="animate-fade-in">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded ${
            currentStep === 1
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'border border-white/20 text-white hover:bg-white/10'
          }`}
        >
          Previous
        </button>
        
        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            disabled={!stepValidation[currentStep as keyof typeof stepValidation]}
            className={`spacex-button rounded ${
              !stepValidation[currentStep as keyof typeof stepValidation]
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="spacex-button rounded"
          >
            Create Event
          </button>
        )}
      </div>
    </div>
  );
}
