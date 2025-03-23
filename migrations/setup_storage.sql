-- Complete setup for Supabase storage bucket and policies

-- Create the events bucket if it doesn't exist
DO $$
BEGIN
    -- Check if bucket exists
    IF NOT EXISTS (
        SELECT 1
        FROM storage.buckets
        WHERE id = 'events'
    ) THEN
        -- Create bucket with proper settings
        INSERT INTO storage.buckets (id, name, public, avif_autodetection)
        VALUES ('events', 'events', true, false);
    END IF;
END $$;

-- Set up storage policies
DO $$
BEGIN
    -- Public read policy
    IF NOT EXISTS (
        SELECT 1 
        FROM storage.policies 
        WHERE name = 'Public Read Policy' AND bucket_id = 'events'
    ) THEN
        CREATE POLICY "Public Read Policy" ON storage.objects
            FOR SELECT USING (bucket_id = 'events');
    END IF;
    
    -- Authenticated users can upload files
    IF NOT EXISTS (
        SELECT 1 
        FROM storage.policies 
        WHERE name = 'Auth Insert Policy' AND bucket_id = 'events'
    ) THEN
        CREATE POLICY "Auth Insert Policy" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');
    END IF;
    
    -- Authenticated users can update their files
    IF NOT EXISTS (
        SELECT 1 
        FROM storage.policies 
        WHERE name = 'Auth Update Policy' AND bucket_id = 'events'
    ) THEN
        CREATE POLICY "Auth Update Policy" ON storage.objects
            FOR UPDATE USING (bucket_id = 'events' AND auth.role() = 'authenticated');
    END IF;
    
    -- Authenticated users can delete their files
    IF NOT EXISTS (
        SELECT 1 
        FROM storage.policies 
        WHERE name = 'Auth Delete Policy' AND bucket_id = 'events'
    ) THEN
        CREATE POLICY "Auth Delete Policy" ON storage.objects
            FOR DELETE USING (bucket_id = 'events' AND auth.role() = 'authenticated');
    END IF;
END $$;
