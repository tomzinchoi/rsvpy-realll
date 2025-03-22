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
          created_at: string
          updated_at: string
          title: string
          description: string
          date: string
          location: string
          host_id: string
          view_count: number
          template_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          date: string
          location: string
          host_id: string
          view_count?: number
          template_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          date?: string
          location?: string
          host_id?: string
          view_count?: number
          template_id?: string | null
        }
      }
      rsvps: {
        Row: {
          id: string
          created_at: string
          event_id: string
          name: string
          email: string
          status: 'yes' | 'no' | 'maybe'
          guests: number
          message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          name: string
          email: string
          status: 'yes' | 'no' | 'maybe'
          guests?: number
          message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          name?: string
          email?: string
          status?: 'yes' | 'no' | 'maybe'
          guests?: number
          message?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          content: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          content: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          content?: Json
        }
      }
    }
  }
}
