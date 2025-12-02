import { z } from 'zod'

// Auth validations
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Profile validations
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const roleUpdateSchema = z.object({
  user_role: z.enum(['learner', 'teacher', 'swapper']),
})

// Teacher verification validations
export const teacherVerificationSchema = z.object({
  degree_url: z.string().url('Invalid degree URL'),
  certification_urls: z.array(z.string().url('Invalid certification URL')).min(1, 'At least one certification required'),
  experience_years: z.number().min(0, 'Experience years must be positive').max(50, 'Experience years seems too high'),
  expertise_areas: z.array(z.string()).min(1, 'At least one expertise area required'),
  additional_info: z.string().max(1000, 'Additional info must be less than 1000 characters').optional(),
})

// Session validations
export const sessionCreateSchema = z.object({
  course_id: z.string().uuid('Invalid course ID'),
  teacher_id: z.string().uuid('Invalid teacher ID'),
  scheduled_at: z.string().datetime('Invalid date/time'),
  duration_minutes: z.number().min(30, 'Session must be at least 30 minutes').max(180, 'Session cannot exceed 3 hours'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

export const sessionUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
  meeting_link: z.string().url('Invalid meeting link').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  learner_notes: z.string().max(500).optional(),
  teacher_notes: z.string().max(500).optional(),
  learner_rating: z.number().min(1).max(5).optional(),
  teacher_rating: z.number().min(1).max(5).optional(),
  learner_feedback: z.string().max(500).optional(),
  teacher_feedback: z.string().max(500).optional(),
})

// Course validations
export const courseCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  category: z.string().min(2, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  image_url: z.string().url('Invalid image URL').optional(),
  duration_minutes: z.number().min(30).max(180).default(60),
})

// Skill management
export const skillSchema = z.object({
  skill: z.string().min(2, 'Skill name must be at least 2 characters').max(50, 'Skill name too long'),
})

// Early access email
export const earlyAccessSchema = z.object({
  email: z.string().email('Invalid email address'),
})
