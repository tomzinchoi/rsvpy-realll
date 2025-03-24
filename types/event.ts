export interface Event {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  views_count?: number;
  new_rsvps_count?: number;
  user_id: string;
  created_at: string;
}
