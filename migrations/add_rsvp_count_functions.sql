-- Add functions to count RSVPs for events
-- These functions will be used by the dashboard to avoid SQL GROUP BY issues

-- Function to get RSVP counts for a list of events
CREATE OR REPLACE FUNCTION get_rsvp_counts_by_events(event_ids UUID[])
RETURNS TABLE (
  event_id UUID,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.event_id, COUNT(r.id) as count
  FROM rsvps r
  WHERE r.event_id = ANY(event_ids)
  GROUP BY r.event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get new RSVP counts (within a time period) for a list of events
CREATE OR REPLACE FUNCTION get_new_rsvp_counts_by_events(event_ids UUID[], hours_ago INT DEFAULT 24)
RETURNS TABLE (
  event_id UUID,
  count BIGINT
) AS $$
DECLARE
  cutoff_time TIMESTAMP WITH TIME ZONE := NOW() - (hours_ago * INTERVAL '1 hour');
BEGIN
  RETURN QUERY
  SELECT r.event_id, COUNT(r.id) as count
  FROM rsvps r
  WHERE r.event_id = ANY(event_ids)
  AND r.created_at >= cutoff_time
  GROUP BY r.event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute privileges to authenticated users
GRANT EXECUTE ON FUNCTION get_rsvp_counts_by_events(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_new_rsvp_counts_by_events(UUID[], INT) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_rsvp_counts_by_events(UUID[]) IS 'Gets the RSVP counts for a list of event IDs';
COMMENT ON FUNCTION get_new_rsvp_counts_by_events(UUID[], INT) IS 'Gets the new RSVP counts within the specified time window for a list of event IDs';
