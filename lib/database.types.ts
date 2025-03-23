export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string | null
          location: string
          user_id: string
          custom_fields: Json | null
          created_at: string
          view_count: number
          event_image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time?: string | null
          location: string
          user_id: string
          custom_fields?: Json | null
          created_at?: string
          view_count?: number
          event_image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          location?: string
          user_id?: string
          custom_fields?: Json | null
          created_at?: string
          view_count?: number
          event_image_url?: string | null
        }
      }
      rsvps: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          attending: boolean
          custom_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          attending: boolean
          custom_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          email?: string
          attending?: boolean
          custom_data?: Json | null
          created_at?: string
        }
      }
      email_invitations: {
        Row: {
          id: string
          event_id: string
          email: string
          status: 'pending' | 'sent' | 'opened' | 'clicked' | 'failed'
          sent_at: string | null
          opened_at: string | null
          clicked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          email: string
          status?: 'pending' | 'sent' | 'opened' | 'clicked' | 'failed'
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          email?: string
          status?: 'pending' | 'sent' | 'opened' | 'clicked' | 'failed'
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_event_views: {
        Args: {
          event_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
