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
          email: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          user_role: 'learner' | 'teacher' | 'swapper'
          is_verified_teacher: boolean
          teacher_status: 'none' | 'pending' | 'approved' | 'rejected'
          degree_url: string | null
          certification_urls: string[] | null
          verification_notes: string | null
          credits: number
          x_score: number
          skills_offered: string[]
          skills_learning: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          user_role?: 'learner' | 'teacher' | 'swapper'
          is_verified_teacher?: boolean
          teacher_status?: 'none' | 'pending' | 'approved' | 'rejected'
          degree_url?: string | null
          certification_urls?: string[] | null
          verification_notes?: string | null
          credits?: number
          x_score?: number
          skills_offered?: string[]
          skills_learning?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          user_role?: 'learner' | 'teacher' | 'swapper'
          is_verified_teacher?: boolean
          teacher_status?: 'none' | 'pending' | 'approved' | 'rejected'
          degree_url?: string | null
          certification_urls?: string[] | null
          verification_notes?: string | null
          credits?: number
          x_score?: number
          skills_offered?: string[]
          skills_learning?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          image_url: string | null
          duration_minutes: number
          total_enrollments: number
          total_completions: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          image_url?: string | null
          duration_minutes?: number
          total_enrollments?: number
          total_completions?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          image_url?: string | null
          duration_minutes?: number
          total_enrollments?: number
          total_completions?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          course_id: string
          teacher_id: string
          learner_id: string
          scheduled_at: string
          duration_minutes: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link: string | null
          notes: string | null
          learner_notes: string | null
          teacher_notes: string | null
          learner_rating: number | null
          teacher_rating: number | null
          learner_feedback: string | null
          teacher_feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          teacher_id: string
          learner_id: string
          scheduled_at: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          notes?: string | null
          learner_notes?: string | null
          teacher_notes?: string | null
          learner_rating?: number | null
          teacher_rating?: number | null
          learner_feedback?: string | null
          teacher_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          teacher_id?: string
          learner_id?: string
          scheduled_at?: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          notes?: string | null
          learner_notes?: string | null
          teacher_notes?: string | null
          learner_rating?: number | null
          teacher_rating?: number | null
          learner_feedback?: string | null
          teacher_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          amount: number
          type: 'earned' | 'spent' | 'subscription' | 'bonus' | 'penalty'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          amount: number
          type: 'earned' | 'spent' | 'subscription' | 'bonus' | 'penalty'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          amount?: number
          type?: 'earned' | 'spent' | 'subscription' | 'bonus' | 'penalty'
          description?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'cancelled' | 'expired'
          plan_type: 'monthly' | 'annual'
          price: number
          started_at: string
          expires_at: string | null
          cancelled_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'active' | 'cancelled' | 'expired'
          plan_type?: 'monthly' | 'annual'
          price: number
          started_at?: string
          expires_at?: string | null
          cancelled_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'cancelled' | 'expired'
          plan_type?: 'monthly' | 'annual'
          price?: number
          started_at?: string
          expires_at?: string | null
          cancelled_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      teacher_verifications: {
        Row: {
          id: string
          user_id: string
          degree_url: string
          certification_urls: string[]
          experience_years: number | null
          expertise_areas: string[]
          additional_info: string | null
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          degree_url: string
          certification_urls?: string[]
          experience_years?: number | null
          expertise_areas?: string[]
          additional_info?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          degree_url?: string
          certification_urls?: string[]
          experience_years?: number | null
          expertise_areas?: string[]
          additional_info?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      early_signups: {
        Row: {
          id: string
          email: string
          created_at: string
          notified: boolean
          notified_at: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          notified?: boolean
          notified_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          notified?: boolean
          notified_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_session: {
        Args: {
          session_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
