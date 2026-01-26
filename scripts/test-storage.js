// Test Supabase Storage Bucket
// Run: node scripts/test-storage.js
// Requires: NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

console.log('🔍 Testing Supabase Storage Bucket...\n');
console.log('URL:', SUPABASE_URL);
console.log('Testing bucket: images\n');

// Test 1: List buckets
async function testListBuckets() {
  console.log('📦 Test 1: List all buckets');
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const contentType = response.headers.get('content-type');
    console.log('   Content-Type:', contentType);
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log('   ✅ Success! Found buckets:', data.length);
      console.log('   Buckets:', data.map(b => `${b.name} (${b.public ? 'public' : 'private'})`).join(', '));
      
      const imagesBucket = data.find(b => b.name === 'images');
      if (imagesBucket) {
        console.log('   ✅ Bucket "images" found!');
        console.log('   Public:', imagesBucket.public);
      } else {
        console.log('   ❌ Bucket "images" NOT FOUND!');
      }
      return true;
    } else {
      const text = await response.text();
      console.log('   ❌ Got HTML instead of JSON');
      console.log('   First 200 chars:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 2: List files in images bucket
async function testListFiles() {
  console.log('\n📁 Test 2: List files in "images" bucket');
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/images`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const contentType = response.headers.get('content-type');
    console.log('   Content-Type:', contentType);
    console.log('   Status:', response.status);
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log('   ✅ Success! Files in bucket:', data.length);
      if (data.length > 0) {
        console.log('   Files:', data.slice(0, 3).map(f => f.name).join(', '));
      }
      return true;
    } else {
      const text = await response.text();
      console.log('   ❌ Got HTML instead of JSON');
      console.log('   First 200 chars:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 3: Try to access public URL
async function testPublicAccess() {
  console.log('\n🌐 Test 3: Test public URL access');
  const testUrl = `${SUPABASE_URL}/storage/v1/object/public/images/`;
  console.log('   Testing URL:', testUrl);
  
  try {
    const response = await fetch(testUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    console.log('   Status:', response.status);
    const contentType = response.headers.get('content-type');
    console.log('   Content-Type:', contentType);
    
    if (response.status === 404) {
      console.log('   ⚠️  404 - Bucket exists but folder is empty or not accessible');
    } else if (contentType?.includes('application/json')) {
      console.log('   ✅ Public access working!');
      return true;
    } else {
      const text = await response.text();
      console.log('   ❌ Got HTML:', text.substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 4: Get bucket info
async function testGetBucket() {
  console.log('\n🔍 Test 4: Get bucket "images" info');
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket/images`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const contentType = response.headers.get('content-type');
    console.log('   Status:', response.status);
    console.log('   Content-Type:', contentType);
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log('   ✅ Bucket info retrieved!');
      console.log('   Name:', data.name);
      console.log('   Public:', data.public);
      console.log('   Created:', data.created_at);
      return true;
    } else {
      const text = await response.text();
      console.log('   ❌ Got HTML:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('═'.repeat(60));
  
  const test1 = await testListBuckets();
  const test2 = await testListFiles();
  const test3 = await testPublicAccess();
  const test4 = await testGetBucket();
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESULTS:');
  console.log(`   List Buckets: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   List Files: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Public Access: ${test3 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Get Bucket: ${test4 ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n💡 RECOMMENDATIONS:');
  if (!test1) {
    console.log('   ⚠️  Cannot list buckets - Check your Anon Key permissions');
  }
  if (!test2) {
    console.log('   ⚠️  Cannot list files - Bucket might not exist or RLS is blocking');
  }
  if (!test3) {
    console.log('   ⚠️  Public access blocked - Check if bucket.public = true');
  }
  if (!test4) {
    console.log('   ⚠️  Cannot get bucket info - Bucket might not exist');
  }
  
  if (!test1 && !test2 && !test3 && !test4) {
    console.log('\n🚨 CRITICAL: All tests failed!');
    console.log('   1. Check if NEXT_PUBLIC_SUPABASE_URL is correct');
    console.log('   2. Check if NEXT_PUBLIC_SUPABASE_ANON_KEY is correct');
    console.log('   3. Check Supabase project is active');
    console.log('   4. Try running: npm run dev and check browser console');
  }
  
  console.log('═'.repeat(60));
}

runAllTests();
