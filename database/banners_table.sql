-- Create banners table
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

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Active banners viewable by everyone" ON public.banners;
DROP POLICY IF EXISTS "Admin can manage all banners" ON public.banners;

-- Policy: Everyone can view active banners
CREATE POLICY "Active banners viewable by everyone" 
ON public.banners FOR SELECT 
USING (is_active = true);

-- Policy: Admin users can manage all banners
CREATE POLICY "Admin can manage all banners" 
ON public.banners FOR ALL 
USING (
  (auth.jwt()->>'email' = 'admin@admin.com') OR 
  (auth.jwt()->>'user_metadata'->>'role' = 'admin')
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_banners_active_order ON public.banners(is_active, order_position);

-- Insert sample banners
INSERT INTO public.banners (title, subtitle, cta_label, cta_link, order_position, is_active)
VALUES 
  ('Beyond the Horizon:', 'Journey Through Time', 'Read Now', '/browse', 1, true),
  ('Discover Premium Content', 'Unlock unlimited access to thousands of ebooks', 'Go Premium', '/pricing', 2, true)
ON CONFLICT DO NOTHING;
