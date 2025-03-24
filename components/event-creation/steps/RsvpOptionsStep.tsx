'use client';

import { useState } from 'react';

interface RsvpOptionsStepProps {
  data: {
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
  };
  onChange: (data: any) => void;
}

export default function RsvpOptionsStep({ data, onChange }: RsvpOptionsStepProps) {
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newQuestionType, setNewQuestionType] = useState<'text' | 'checkbox' | 'select'>('text');
  const [newQuestionOptions, setNewQuestionOptions] = useState<string>('');
  const [newQuestionRequired, setNewQuestionRequired] = useState<boolean>(false);

  const updateRsvpOptions = (field: string, value: any) => {
    onChange({
      rsvp_options: {
        ...data.rsvp_options,
        [field]: value
      }
    });
  };

  const addCustomQuestion = () => {
    if (!newQuestion.trim()) return;
    
    let options: string[] | undefined;
    
    if (newQuestionType === 'select') {
      options = newQuestionOptions
        .split(',')
        .map(option => option.trim())
        .filter(option => option.length > 0);
      
      if (options.length < 2) {
        alert('Please provide at least two options for a dropdown question');
        return;
      }
    }
    
    const newCustomQuestions = [...data.rsvp_options.custom_questions, {
      id: Date.now().toString(),
      question: newQuestion,
      type: newQuestionType,
      ...(options && { options }),
      required: newQuestionRequired
    }];
    
    updateRsvpOptions('custom_questions', newCustomQuestions);
    
    // Reset form
    setNewQuestion('');
    setNewQuestionType('text');
    setNewQuestionOptions('');
    setNewQuestionRequired(false);
  };

  const removeCustomQuestion = (id: string) => {
    const newCustomQuestions = data.rsvp_options.custom_questions.filter(
      question => question.id !== id
    );
    updateRsvpOptions('custom_questions', newCustomQuestions);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">RSVP Options</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow_plus_one"
            checked={data.rsvp_options.allow_plus_one}
            onChange={(e) => updateRsvpOptions('allow_plus_one', e.target.checked)}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="allow_plus_one" className="ml-2 block text-sm text-gray-700">
            Allow guests to bring a plus one
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="collect_dietary_restrictions"
            checked={data.rsvp_options.collect_dietary_restrictions}
            onChange={(e) => updateRsvpOptions('collect_dietary_restrictions', e.target.checked)}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="collect_dietary_restrictions" className="ml-2 block text-sm text-gray-700">
            Collect dietary restrictions
          </label>
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            RSVP Deadline (Optional)
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={data.rsvp_options.deadline || ''}
            onChange={(e) => updateRsvpOptions('deadline', e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            If set, guests won't be able to RSVP after this date
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-4">Custom Questions</h3>
        
        {data.rsvp_options.custom_questions.length > 0 ? (
          <div className="space-y-4 mb-6">
            {data.rsvp_options.custom_questions.map((question) => (
              <div key={question.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <p className="font-medium">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                    {question.options && (
                      <span className="ml-2">Options: {question.options.join(', ')}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => removeCustomQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No custom questions added yet.</p>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-md font-medium mb-3">Add New Question</h4>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="newQuestion" className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <input
                type="text"
                id="newQuestion"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="E.g., Will you need parking?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            
            <div>
              <label htmlFor="newQuestionType" className="block text-sm font-medium text-gray-700 mb-1">
                Question Type
              </label>
              <select
                id="newQuestionType"
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              >
                <option value="text">Text Input</option>
                <option value="checkbox">Yes/No Checkbox</option>
                <option value="select">Dropdown Select</option>
              </select>
            </div>
            
            {newQuestionType === 'select' && (
              <div>
                <label htmlFor="newQuestionOptions" className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  id="newQuestionOptions"
                  value={newQuestionOptions}
                  onChange={(e) => setNewQuestionOptions(e.target.value)}
                  placeholder="E.g., Option 1, Option 2, Option 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newQuestionRequired"
                checked={newQuestionRequired}
                onChange={(e) => setNewQuestionRequired(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="newQuestionRequired" className="ml-2 block text-sm text-gray-700">
                Required question
              </label>
            </div>
            
            <button
              onClick={addCustomQuestion}
              disabled={!newQuestion.trim()}
              className={`mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 ${
                !newQuestion.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
