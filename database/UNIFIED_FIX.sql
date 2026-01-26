-- ==========================================
-- COMPLETE SYSTEM FIX - RUN THIS ALL AT ONCE
-- ==========================================

-- 1. FIX ADMIN_USERS (Remove recursion)
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
CREATE POLICY "Admins can view all admin users"
ON public.admin_users FOR SELECT
USING (
  auth.uid() = user_id OR 
  (auth.jwt()->>'email' = 'admin@admin.com')
);

-- 2. CREATE BANNERS TABLE (In case it's missing)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_label TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Banners policies
DROP POLICY IF EXISTS "Active banners viewable by everyone" ON public.banners;
DROP POLICY IF EXISTS "Admin can manage all banners" ON public.banners;

CREATE POLICY "Active banners viewable by everyone" 
ON public.banners FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage all banners" 
ON public.banners FOR ALL 
USING (
  (auth.jwt()->>'email' = 'admin@admin.com') OR 
  (auth.jwt()->'user_metadata'->>'role' = 'admin')
);

-- 3. FIX STORAGE (Images bucket)
-- We'll just make sure the bucket is public and RLS is set up
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  (auth.jwt()->>'email' = 'admin@admin.com' OR auth.jwt()->'user_metadata'->>'role' = 'admin')
);

-- 4. RELOAD SCHEMA CACHE
-- This is critical to fix the 520 / PGRST205 errors
NOTIFY pgrst, 'reload schema';

-- 5. INSERT SAMPLE DATA
INSERT INTO public.banners (title, subtitle, cta_label, cta_link, order_position, is_active)
VALUES 
  ('Welcome to Ebookin', 'Your digital library companion', 'Explore Now', '/', 1, true)
ON CONFLICT DO NOTHING;
