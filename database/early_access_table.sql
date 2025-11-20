-- Create early_signups table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS early_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_early_signups_email ON early_signups(email);

-- Create index for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_early_signups_created_at ON early_signups(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE early_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for the API)
CREATE POLICY "Allow public inserts" ON early_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow service role to read all (for admin access)
CREATE POLICY "Allow service role read" ON early_signups
  FOR SELECT
  TO service_role
  USING (true);

-- Optional: Add a comment
COMMENT ON TABLE early_signups IS 'Stores early access signup emails';

