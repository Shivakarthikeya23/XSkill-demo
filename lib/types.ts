// Database Types for XSkill

export type UserRole = 'learner' | 'teacher' | 'swapper';
export type TeacherStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type TransactionType = 'earned' | 'spent' | 'subscription' | 'bonus' | 'penalty';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type PlanType = 'monthly' | 'annual';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_role: UserRole;
  
  // Teacher verification
  is_verified_teacher: boolean;
  teacher_status: TeacherStatus;
  degree_url: string | null;
  certification_urls: string[] | null;
  verification_notes: string | null;
  
  // Credits and XScore
  credits: number;
  x_score: number;
  
  // Skills
  skills_offered: string[];
  skills_learning: string[];
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: CourseDifficulty;
  image_url: string | null;
  duration_minutes: number;
  
  // Stats
  total_enrollments: number;
  total_completions: number;
  average_rating: number;
  
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  course_id: string;
  teacher_id: string;
  learner_id: string;
  
  scheduled_at: string;
  duration_minutes: number;
  
  status: SessionStatus;
  
  meeting_link: string | null;
  notes: string | null;
  learner_notes: string | null;
  teacher_notes: string | null;
  
  // Ratings
  learner_rating: number | null;
  teacher_rating: number | null;
  learner_feedback: string | null;
  teacher_feedback: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  course?: Course;
  teacher?: User;
  learner?: User;
}

export interface Transaction {
  id: string;
  user_id: string;
  session_id: string | null;
  
  amount: number;
  type: TransactionType;
  description: string | null;
  
  created_at: string;
  
  // Joined data
  session?: Session;
}

export interface Subscription {
  id: string;
  user_id: string;
  
  status: SubscriptionStatus;
  plan_type: PlanType;
  price: number;
  
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  
  title: string;
  message: string;
  type: NotificationType;
  
  read: boolean;
  action_url: string | null;
  
  created_at: string;
}

export interface TeacherVerification {
  id: string;
  user_id: string;
  
  degree_url: string;
  certification_urls: string[];
  experience_years: number | null;
  expertise_areas: string[];
  additional_info: string | null;
  
  status: VerificationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  
  created_at: string;
  
  // Joined data
  user?: User;
  reviewer?: User;
}

export interface EarlySignup {
  id: string;
  email: string;
  created_at: string;
  notified: boolean;
  notified_at: string | null;
}

// Form types
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ProfileUpdateFormData {
  name: string;
  bio?: string;
  avatar_url?: string;
}

export interface TeacherVerificationFormData {
  degree_url: string;
  certification_urls: string[];
  experience_years: number;
  expertise_areas: string[];
  additional_info?: string;
}

export interface SessionCreateFormData {
  course_id: string;
  teacher_id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes?: string;
}

export interface SessionUpdateFormData {
  status?: SessionStatus;
  meeting_link?: string;
  notes?: string;
  learner_notes?: string;
  teacher_notes?: string;
  learner_rating?: number;
  teacher_rating?: number;
  learner_feedback?: string;
  teacher_feedback?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  totalCredits: number;
  xScore: number;
  averageRating: number;
}
