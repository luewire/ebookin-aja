-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/webp', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view images bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Admin can manage images bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;

-- BUCKET POLICIES (for listing/viewing bucket info)
-- Policy: Everyone can view the images bucket
CREATE POLICY "Public can view images bucket"
ON storage.buckets FOR SELECT
USING (id = 'images');

-- Policy: Admin can manage the images bucket
CREATE POLICY "Admin can manage images bucket"
ON storage.buckets FOR ALL
USING (
  id = 'images' AND (
    auth.jwt()->>'email' = 'admin@admin.com' OR
    auth.jwt()->'user_metadata'->>'role' = 'admin'
  )
);

-- OBJECT POLICIES (for file operations)
-- Policy: Everyone can view images
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Admin can upload images
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND (
    auth.jwt()->>'email' = 'admin@admin.com' OR
    auth.jwt()->'user_metadata'->>'role' = 'admin'
  )
);

-- Policy: Admin can update images
CREATE POLICY "Admin can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND (
    auth.jwt()->>'email' = 'admin@admin.com' OR
    auth.jwt()->'user_metadata'->>'role' = 'admin'
  )
);

-- Policy: Admin can delete images
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND (
    auth.jwt()->>'email' = 'admin@admin.com' OR
    auth.jwt()->'user_metadata'->>'role' = 'admin'
  )
);
