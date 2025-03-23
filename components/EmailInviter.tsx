import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EmailInviterProps {
  eventId: string;
  eventTitle: string;
}

export const EmailInviter: React.FC<EmailInviterProps> = ({ eventId, eventTitle }) => {
  const [emails, setEmails] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }
    
    // Split and clean email addresses
    const emailList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email);
    
    // Simple validation for email format
    const invalidEmails = emailList.filter(email => !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
    
    setSending(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Create invitation records
      const invitations = emailList.map(email => ({
        event_id: eventId,
        email,
        status: 'pending'  // Default status
      }));
      
      const { error: insertError } = await supabase
        .from('email_invitations')
        .insert(invitations);
      
      if (insertError) throw insertError;
      
      // Show success message
      setSuccess(`${emailList.length} invitation${emailList.length !== 1 ? 's' : ''} queued successfully!`);
      setEmails('');
      
      // Note: In a real application with email functionality, you would trigger an
      // email sending process here
      
    } catch (err: any) {
      console.error('Error sending invitations:', err);
      setError(err.message || 'Failed to send invitations');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-lg mb-2">Send Email Invitations</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md mb-4">
        <p className="text-sm">
          <strong>Note:</strong> Email sending feature is currently under development. 
          Invitations will be saved but emails won't be sent at this time.
        </p>
      </div>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="emails" className="block text-gray-700 text-sm font-bold mb-2">
            Email Addresses (comma separated)
          </label>
          <textarea
            id="emails"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="email1@example.com, email2@example.com"
            value={emails}
            onChange={e => setEmails(e.target.value)}
            disabled={sending}
          />
        </div>
        
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          disabled={sending}
        >
          {sending ? 'Processing...' : 'Queue Invitations'}
        </button>
      </form>
    </div>
  );
};

export default EmailInviter;
