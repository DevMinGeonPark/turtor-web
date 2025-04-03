export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface HomeworkSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'payment' | 'class';
  description?: string;
}

export * from './auth'; 