import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  role: 'student' | 'teacher'
  name: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: Error | null
} 