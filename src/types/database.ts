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
      users: {
        Row: {
          id: string
          name: string
          username: string
          email: string | null
          password: string
          role: 'ADMIN' | 'TEACHER'
          designation: 'PGT' | 'TGT' | 'PRT' | 'OTHER'
          subject: string | null
          employee_code: string
          employment_type: 'PERMANENT' | 'CONTRACTUAL'
          date_of_birth: string | null
          date_of_joining_kv: string | null
          date_of_joining_present_post: string | null
          phone: string | null
          school_id: string
          profile_picture: string | null
          timetable: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          username: string
          email?: string | null
          password: string
          role: 'ADMIN' | 'TEACHER'
          designation: 'PGT' | 'TGT' | 'PRT' | 'OTHER'
          subject?: string | null
          employee_code: string
          employment_type: 'PERMANENT' | 'CONTRACTUAL'
          date_of_birth?: string | null
          date_of_joining_kv?: string | null
          date_of_joining_present_post?: string | null
          phone?: string | null
          school_id: string
          profile_picture?: string | null
          timetable?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          email?: string | null
          password?: string
          role?: 'ADMIN' | 'TEACHER'
          designation?: 'PGT' | 'TGT' | 'PRT' | 'OTHER'
          subject?: string | null
          employee_code?: string
          employment_type?: 'PERMANENT' | 'CONTRACTUAL'
          date_of_birth?: string | null
          date_of_joining_kv?: string | null
          date_of_joining_present_post?: string | null
          phone?: string | null
          school_id?: string
          profile_picture?: string | null
          timetable?: Json
          created_at?: string
        }
      }
      leaves: {
        Row: {
          id: string
          teacher_id: string
          teacher_name: string
          date: string
          type: 'FULL' | 'PARTIAL'
          start_time: string | null
          end_time: string | null
          reason: string
          document_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          teacher_name: string
          date: string
          type: 'FULL' | 'PARTIAL'
          start_time?: string | null
          end_time?: string | null
          reason: string
          document_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          teacher_name?: string
          date?: string
          type?: 'FULL' | 'PARTIAL'
          start_time?: string | null
          end_time?: string | null
          reason?: string
          document_url?: string | null
          created_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          teacher_id: string
          teacher_name: string
          type: 'INTERCHANGE' | 'EXTRA_CLASS'
          details: string
          status: 'PENDING' | 'APPROVED' | 'REJECTED'
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          teacher_name: string
          type: 'INTERCHANGE' | 'EXTRA_CLASS'
          details: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          teacher_name?: string
          type?: 'INTERCHANGE' | 'EXTRA_CLASS'
          details?: string
          status?: 'PENDING' | 'APPROVED' | 'REJECTED'
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          document_url: string | null
          created_by: string | null
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string
          document_url?: string | null
          created_by?: string | null
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          document_url?: string | null
          created_by?: string | null
          school_id?: string
          created_at?: string
        }
      }
      substitution_history: {
        Row: {
          id: string
          date: string
          absent_teacher_id: string
          absent_teacher_name: string
          reason: string
          substitutions: Json
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          absent_teacher_id: string
          absent_teacher_name: string
          reason: string
          substitutions: Json
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          absent_teacher_id?: string
          absent_teacher_name?: string
          reason?: string
          substitutions?: Json
          created_at?: string
        }
      }
    }
  }
}
