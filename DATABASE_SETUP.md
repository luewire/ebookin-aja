# Database Setup Instructions

⚠️ **IMPORTANT**: Execute these SQL files in your Supabase SQL Editor to enable all features.

## Quick Setup (All-in-One)

**Fastest way**: Copy and paste this complete SQL block into Supabase SQL Editor:

```sql
-- ==========================================
-- BANNER SYSTEM COMPLETE SETUP
-- ==========================================

-- 1. Create banners table
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

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active banners viewable by everyone" ON public.banners;
DROP POLICY IF EXISTS "Admin can manage all banners" ON public.banners;

CREATE POLICY "Active banners viewable by everyone" 
ON public.banners FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all banners" 
ON public.banners FOR ALL 
USING (
  (auth.jwt()->>'email' = 'admin@admin.com') OR 
  (auth.jwt()->>'user_metadata'->>'role' = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_banners_active_order ON public.banners(is_active, order_position);

INSERT INTO public.banners (title, subtitle, cta_label, cta_link, order_position, is_active)
VALUES 
  ('Welcome to Ebookin', 'Your Digital Library', 'Get Started', '/browse', 1, true),
  ('Discover Premium', 'Unlock unlimited access', 'Go Premium', '/pricing', 2, true)
ON CONFLICT DO NOTHING;

-- 2. Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 2097152, ARRAY['image/webp', 'image/jpeg', 'image/jpg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;

CREATE POLICY "Public Access for Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND (auth.jwt()->>'email' = 'admin@admin.com' OR auth.jwt()->>'user_metadata'->>'role' = 'admin'));
CREATE POLICY "Admin can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND (auth.jwt()->>'email' = 'admin@admin.com' OR auth.jwt()->>'user_metadata'->>'role' = 'admin'));
CREATE POLICY "Admin can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND (auth.jwt()->>'email' = 'admin@admin.com' OR auth.jwt()->>'user_metadata'->>'role' = 'admin'));
```

✅ After running this, refresh `/admin/banners` and you can upload images!

---

## Individual Setup (Step-by-Step)

If you prefer to run files separately:

## 1. Create Tables

### Execute: `database/banners_table.sql`
```sql
-- Creates banners table with RLS policies
-- Creates sample banners
```

### Execute: `database/reading_sessions_table.sql`
```sql
-- Creates reading_sessions table for tracking user reading activity
-- Sets up RLS policies and triggers
```

### Execute: `database/user_stats_table.sql`
```sql
-- Creates user_stats table for user analytics
-- Sets up auto-creation trigger on user registration
```

### Execute: `database/update_ebooks_table.sql`
```sql
-- Adds view_count and read_count columns to ebooks table
-- Creates helper functions for incrementing counts
```

## 2. Verify Setup

Run these queries to verify:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('banners', 'reading_sessions', 'user_stats');

-- Check banners data
SELECT * FROM public.banners;

-- Check ebooks has new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'ebooks' 
AND column_name IN ('view_count', 'read_count');
```

## 3. Test Banners

```sql
-- Insert a test banner
INSERT INTO public.banners (title, subtitle, cta_label, cta_link, order_position, is_active)
VALUES ('Test Banner', 'This is a test', 'Learn More', '/browse', 1, true);

-- Query active banners (as website would)
SELECT * FROM public.banners 
WHERE is_active = true 
ORDER BY order_position ASC;
```

## 4. Features Now Available

✅ **Banner Management**
- Admin can create/edit/delete banners at `/admin/banners`
- Drag & drop to reorder
- Toggle active/inactive status
- Banners display on homepage in carousel

✅ **Ebook Management**
- Filter by status ('Published' only on frontend)
- Track view counts and read counts
- Sort by popularity

✅ **User Tracking**
- Reading sessions table ready
- User stats auto-created on registration
- Ready for activity tracking

## Next Steps

After running SQL files:
1. Go to http://localhost:3000/admin/banners
2. Create some banners
3. Go to homepage to see carousel
4. Test drag & drop reordering
5. Toggle banners active/inactive

## Troubleshooting

### Error: "relation banners does not exist"
**Solution**: Run `database/banners_table.sql` in Supabase SQL Editor

### Error: "permission denied for table banners"
**Solution**: Check RLS policies are created. Admin email must be `admin@admin.com`

### Banners not showing on homepage
**Check**: 
1. At least one banner has `is_active = true`
2. Run: `SELECT * FROM public.banners WHERE is_active = true;`
3. Check browser console for errors
