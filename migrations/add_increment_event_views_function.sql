-- Add the increment_event_views function for tracking event views

-- Create or replace the function to increment event view counts
CREATE OR REPLACE FUNCTION increment_event_views(event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update the view count, adding 1 to the current value
    UPDATE public.events
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = event_id;
    
    -- Return true to indicate success
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute privileges to authenticated users
GRANT EXECUTE ON FUNCTION increment_event_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_event_views(UUID) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION increment_event_views(UUID) IS 'Increments the view count for an event when it is viewed';
