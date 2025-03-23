-- Consolidated Schema for RSVPY
-- This file combines all migrations into a single script for easier management

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL, -- YYYY-MM-DD format
    time TEXT, -- HH:MM format
    location TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    custom_fields JSONB,
    event_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    view_count INTEGER DEFAULT 0,
    
    CONSTRAINT events_title_not_empty CHECK (char_length(title) > 0),
    CONSTRAINT events_location_not_empty CHECK (char_length(location) > 0)
);

-- RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attending BOOLEAN NOT NULL,
    custom_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT rsvps_name_not_empty CHECK (char_length(name) > 0),
    CONSTRAINT rsvps_email_not_empty CHECK (char_length(email) > 0)
);

-- Email Invitations Table
CREATE TABLE IF NOT EXISTS public.email_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT email_invitations_email_not_empty CHECK (char_length(email) > 0),
    CONSTRAINT email_invitations_status_valid CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'failed'))
);

-- Create increment_event_views function
CREATE OR REPLACE FUNCTION increment_event_views(event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.events
    SET view_count = view_count + 1
    WHERE id = event_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Events policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
ON public.events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
ON public.events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
ON public.events
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
ON public.events
FOR DELETE
USING (auth.uid() = user_id);

-- RSVPs policies
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view RSVPs for their events"
ON public.rsvps
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = rsvps.event_id
        AND events.user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can create RSVPs"
ON public.rsvps
FOR INSERT
WITH CHECK (true);

-- Email Invitations policies
ALTER TABLE public.email_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations for their events"
ON public.email_invitations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = email_invitations.event_id
        AND events.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create invitations for their events"
ON public.email_invitations
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = email_invitations.event_id
        AND events.user_id = auth.uid()
    )
);

-- Storage bucket setup
-- Create public storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view event images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Users can upload event images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their event images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their event images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'events' AND auth.role() = 'authenticated');
