-- This is safe to run - it only:
-- 1. Adds a new column if it doesn't exist
-- 2. Drops the temporary function used to add the column
-- 3. Creates a file type restriction policy if it doesn't exist

-- Create migration function to safely add the column
CREATE OR REPLACE FUNCTION add_notification_settings_column()
RETURNS VOID AS $$
BEGIN
    -- Add notification_settings column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'events'
        AND column_name = 'notification_settings'
    ) THEN
        ALTER TABLE public.events
        ADD COLUMN notification_settings JSONB DEFAULT '{"emails_enabled": true}'::jsonb;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_notification_settings_column();

-- Drop the function after execution - THIS IS JUST CLEANUP
-- This is what triggers the "destructive operation" warning
DROP FUNCTION add_notification_settings_column();

-- Ensure the storage.objects policy allows specific file types
DO $$
BEGIN
    -- Check if the policy already exists using pg_policies
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE policyname = 'Restrict file types' 
        AND tablename = 'objects'
        AND schemaname = 'storage'
    ) THEN
        -- Add the policy for file type restrictions
        CREATE POLICY "Restrict file types" ON storage.objects
            FOR INSERT WITH CHECK (
                bucket_id = 'events' AND 
                auth.role() = 'authenticated' AND
                (RIGHT(name, 4) = '.jpg' OR RIGHT(name, 4) = '.png' OR RIGHT(name, 5) = '.jpeg' OR RIGHT(name, 4) = '.gif')
            );
    END IF;
END $$;
