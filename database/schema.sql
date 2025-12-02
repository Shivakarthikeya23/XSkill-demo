-- XSkill Complete Database Schema
-- Run this SQL in your Supabase SQL Editor

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  user_role TEXT DEFAULT 'learner' CHECK (user_role IN ('learner', 'teacher', 'swapper')),
  
  -- Teacher verification
  is_verified_teacher BOOLEAN DEFAULT FALSE,
  teacher_status TEXT DEFAULT 'none' CHECK (teacher_status IN ('none', 'pending', 'approved', 'rejected')),
  degree_url TEXT,
  certification_urls TEXT[],
  verification_notes TEXT,
  
  -- Credits and XScore
  credits INTEGER DEFAULT 0,
  x_score INTEGER DEFAULT 0,
  
  -- Skills
  skills_offered TEXT[] DEFAULT '{}',
  skills_learning TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. COURSES/SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  image_url TEXT,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Stats
  total_enrollments INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  
  meeting_link TEXT,
  notes TEXT,
  learner_notes TEXT,
  teacher_notes TEXT,
  
  -- Ratings
  learner_rating INTEGER CHECK (learner_rating >= 1 AND learner_rating <= 5),
  teacher_rating INTEGER CHECK (teacher_rating >= 1 AND teacher_rating <= 5),
  learner_feedback TEXT,
  teacher_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'subscription', 'bonus', 'penalty')),
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  plan_type TEXT DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'annual')),
  price DECIMAL(10,2) NOT NULL,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. TEACHER VERIFICATION REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS teacher_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  degree_url TEXT NOT NULL,
  certification_urls TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  expertise_areas TEXT[] DEFAULT '{}',
  additional_info TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_role ON users(user_role);
CREATE INDEX IF NOT EXISTS idx_users_teacher_status ON users(teacher_status);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);

CREATE INDEX IF NOT EXISTS idx_sessions_teacher_id ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_learner_id ON sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_at ON sessions(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_teacher_verifications_status ON teacher_verifications(status);
CREATE INDEX IF NOT EXISTS idx_teacher_verifications_user_id ON teacher_verifications(user_id);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public user info" ON users
  FOR SELECT USING (true);

-- Courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

-- Sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

CREATE POLICY "Users can create sessions as learners" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Teachers and learners can update their sessions" ON sessions
  FOR UPDATE USING (auth.uid() = teacher_id OR auth.uid() = learner_id);

-- Transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Teacher verifications table
ALTER TABLE teacher_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verifications" ON teacher_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests" ON teacher_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle session completion
CREATE OR REPLACE FUNCTION complete_session(session_id UUID)
RETURNS void AS $$
DECLARE
  teacher UUID;
  learner UUID;
BEGIN
  SELECT teacher_id, learner_id INTO teacher, learner
  FROM sessions WHERE id = session_id;
  
  -- Give credit to teacher
  UPDATE users SET credits = credits + 1, x_score = x_score + 10
  WHERE id = teacher;
  
  -- Deduct credit from learner (if not subscription user)
  UPDATE users SET credits = credits - 1
  WHERE id = learner AND id NOT IN (
    SELECT user_id FROM subscriptions WHERE status = 'active'
  );
  
  -- Create transactions
  INSERT INTO transactions (user_id, session_id, amount, type, description)
  VALUES 
    (teacher, session_id, 1, 'earned', 'Session completed as teacher'),
    (learner, session_id, -1, 'spent', 'Session completed as learner');
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SEED DATA FOR COURSES
-- =============================================
INSERT INTO courses (title, description, category, difficulty, image_url) VALUES
('Web Development Fundamentals', 'Learn the basics of HTML, CSS, and JavaScript', 'Technology', 'beginner', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'),
('Digital Marketing Strategy', 'Master social media marketing and SEO basics', 'Marketing', 'intermediate', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'),
('Graphic Design with Figma', 'Create stunning designs using Figma', 'Design', 'beginner', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'),
('Python Programming', 'Learn Python from scratch to advanced', 'Technology', 'intermediate', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'),
('Public Speaking Mastery', 'Overcome fear and speak confidently', 'Communication', 'beginner', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400'),
('Financial Planning 101', 'Learn to manage personal finances', 'Finance', 'beginner', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400'),
('Photography Basics', 'Master camera settings and composition', 'Arts', 'beginner', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400'),
('Data Science with R', 'Analyze data and create visualizations', 'Technology', 'advanced', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'),
('Content Writing', 'Write compelling copy for web and blogs', 'Writing', 'intermediate', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'),
('Yoga for Beginners', 'Learn basic yoga poses and breathing', 'Health & Wellness', 'beginner', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400')
ON CONFLICT DO NOTHING;

-- Add some comments
COMMENT ON TABLE users IS 'Main user profiles with roles and verification status';
COMMENT ON TABLE courses IS 'Available courses/skills in the platform';
COMMENT ON TABLE sessions IS 'Scheduled learning sessions between teachers and learners';
COMMENT ON TABLE transactions IS 'Credit transaction history';
COMMENT ON TABLE subscriptions IS 'User subscription information';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE teacher_verifications IS 'Teacher verification requests and status';
