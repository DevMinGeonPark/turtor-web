import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'student' | 'teacher' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
        }
      }
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
      classes: {
        Row: {
          id: string
          teacher_id: string
          title: string
          description: string
          schedule: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          title: string
          description: string
          schedule: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          title?: string
          description?: string
          schedule?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          due_date?: string
          created_at?: string
        }
      }
    }
  }
} 