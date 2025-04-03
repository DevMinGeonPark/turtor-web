import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          code: string
          status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_id: string
          code: string
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_id?: string
          code?: string
          status?: 'pending' | 'completed'
          created_at?: string
        }
      }
    }
  }
} 