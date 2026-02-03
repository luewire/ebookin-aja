-- Create admin_users table for role-based access control
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  permissions JSONB DEFAULT '{"manage_banners": true, "manage_users": true, "manage_ebooks": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Policy: Admins can view all admin users
CREATE POLICY "Admins can view all admin users"
ON public.admin_users FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users) OR
  auth.jwt()->>'email' = 'admin@admin.com'
);

-- Policy: Super admins can manage admin users
CREATE POLICY "Super admins can manage admin users"
ON public.admin_users FOR ALL
USING (
  auth.jwt()->>'email' = 'admin@admin.com' OR
  auth.uid() IN (
    SELECT user_id FROM public.admin_users WHERE role = 'super_admin'
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  ) OR (
    SELECT email FROM auth.users WHERE id = $1
  ) = 'admin@admin.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  IF (SELECT email FROM auth.users WHERE id = user_id) = 'admin@admin.com' THEN
    RETURN 'super_admin';
  END IF;
  
  RETURN (
    SELECT role FROM public.admin_users 
    WHERE admin_users.user_id = user_id
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- Add the default admin@admin.com to admin_users (if exists)
-- This will fail gracefully if the user doesn't exist yet
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@admin.com';
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, role, permissions)
    VALUES (
      admin_id,
      'super_admin',
      '{"manage_banners": true, "manage_users": true, "manage_ebooks": true, "manage_admins": true}'
    )
    ON CONFLICT (user_id) DO UPDATE SET 
      role = 'super_admin',
      permissions = '{"manage_banners": true, "manage_users": true, "manage_ebooks": true, "manage_admins": true}';
  END IF;
END $$;
