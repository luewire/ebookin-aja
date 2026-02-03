-- Add username column to profiles table
-- This migration adds a username field to the profiles table

-- Add username column (nullable initially)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create unique index on username to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;

-- You can run this SQL in your Supabase SQL Editor to add the username column
