// Create Supabase Storage Bucket
// Run: node scripts/create-storage-bucket.js
// Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

async function createBucket() {
  console.log('🚀 Creating storage bucket "images"...\n');

  try {
    // Create bucket
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'images',
        name: 'images',
        public: true,
        file_size_limit: 2097152, // 2MB
        allowed_mime_types: ['image/webp', 'image/jpeg', 'image/jpg', 'image/png']
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error?.includes('already exists')) {
        console.log('⚠️  Bucket "images" already exists!');
        console.log('   Checking if it\'s public...\n');
        await checkBucket();
        return;
      }
      throw new Error(data.message || data.error || 'Failed to create bucket');
    }

    console.log('✅ Bucket "images" created successfully!');
    console.log('   Name:', data.name);
    console.log('   Public:', data.public);
    console.log('   Size limit:', data.file_size_limit, 'bytes (2MB)');
    console.log('   Allowed types:', data.allowed_mime_types?.join(', ') || 'all');
    
    console.log('\n📝 Next steps:');
    console.log('   1. Run: node scripts/test-storage.js (to verify)');
    console.log('   2. Run SQL policies in Supabase SQL Editor:');
    console.log('      → Open: https://supabase.com/dashboard/project/goaqtueorozvgilmcdaj/sql/new');
    console.log('      → Paste contents of: database/storage_bucket.sql');
    console.log('      → Click "Run"');
    console.log('   3. Restart dev server: npm run dev');
    console.log('   4. Test upload at: http://localhost:3000/admin/banners');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Fallback: Create bucket manually in dashboard:');
    console.log('   → https://supabase.com/dashboard/project/goaqtueorozvgilmcdaj/storage/buckets');
    console.log('   → Click "New bucket"');
    console.log('   → Name: images');
    console.log('   → ✅ Check "Public bucket"');
    console.log('   → Click "Create"');
  }
}

async function checkBucket() {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket/images`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Bucket exists!');
      console.log('   Public:', data.public);
      
      if (!data.public) {
        console.log('\n   ⚠️  WARNING: Bucket is PRIVATE!');
        console.log('   To make it public, delete and recreate via dashboard.');
      }
    }
  } catch (error) {
    console.error('   ❌ Error checking bucket:', error.message);
  }
}

createBucket();
