-- Add indexes to improve RSVP query performance

-- First check if the index already exists
DO $$
BEGIN
    -- Add index on rsvps.event_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'rsvps' AND indexname = 'rsvps_event_id_idx'
    ) THEN
        CREATE INDEX rsvps_event_id_idx ON public.rsvps (event_id);
    END IF;

    -- Add index on rsvps.created_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'rsvps' AND indexname = 'rsvps_created_at_idx'
    ) THEN
        CREATE INDEX rsvps_created_at_idx ON public.rsvps (created_at);
    END IF;
END $$;

-- Add a comment explaining the purpose of these indexes
COMMENT ON INDEX public.rsvps_event_id_idx IS 'Speeds up queries filtering or joining on event_id';
COMMENT ON INDEX public.rsvps_created_at_idx IS 'Speeds up queries filtering on creation date, like recent RSVPs';
