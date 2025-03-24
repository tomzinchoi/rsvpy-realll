// This file should be deployed to Supabase Edge Functions

// Follow these steps to deploy this function to Supabase:
// 1. Install Supabase CLI if you haven't already
// 2. Run 'supabase functions deploy send-rsvp-notification'
// 3. Set up environment variables in Supabase dashboard for email sending

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

// Read environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME');
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@rsvpy.com';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // Parse request body
    const { eventId, rsvpId, attendeeName, attendeeEmail, isAttending } = await req.json();
    
    // Get event details
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*, auth.users!inner(email)')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      throw new Error(`Error fetching event: ${eventError.message}`);
    }
    
    // Get event owner's email
    const ownerEmail = eventData.users.email;
    
    if (!ownerEmail) {
      throw new Error('Could not find event owner email');
    }
    
    // Create email client
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });
    
    // Format email content
    const subject = `New RSVP for your event: ${eventData.title}`;
    const attendingStatus = isAttending ? 'will attend' : 'will not attend';
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New RSVP Received</h2>
        <p>You have received a new RSVP for your event <strong>${eventData.title}</strong>.</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #000; padding: 15px; margin: 20px 0;">
          <p><strong>Attendee:</strong> ${attendeeName}</p>
          <p><strong>Email:</strong> ${attendeeEmail}</p>
          <p><strong>Status:</strong> ${attendingStatus}</p>
        </div>
        
        <p>You can view all RSVPs for this event in your dashboard.</p>
        
        <div style="margin-top: 30px;">
          <a href="${SUPABASE_URL.replace('.supabase.co', '.app')}/event/${eventId}" 
             style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            View Event
          </a>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from RSVPY. Please do not reply to this email.
        </p>
      </div>
    `;
    
    // Send email
    await client.send({
      from: FROM_EMAIL,
      to: ownerEmail,
      subject,
      content: htmlBody,
      html: htmlBody,
    });
    
    await client.close();
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Email notification sent' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
