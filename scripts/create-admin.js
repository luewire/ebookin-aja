// Run this script to create admin account and setup storage
// Usage: node scripts/create-admin.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (err) {
  console.error('Error reading .env.local:', err.message);
  process.exit(1);
}

let supabaseUrl = '';
let serviceRoleKey = '';

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (!key || valueParts.length === 0) return;

  const value = valueParts.join('=').trim();

  if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
    supabaseUrl = value;
  }
  if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
    serviceRoleKey = value;
  }
});

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setup() {
  try {
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin123';
    const adminUsername = 'admin';

    console.log(`Setting up admin account: ${adminEmail}...`);

    // 1. Create or Update User
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        username: adminUsername,
        role: 'admin'
      }
    });

    if (userError) {
      if (userError.message.toLowerCase().includes('already registered') || userError.message.toLowerCase().includes('already been registered')) {
        console.log('Admin user already exists. Updating password and metadata...');

        // Get user ID first
        const { data: listUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        const existingUser = listUsers.users.find(u => u.email === adminEmail);
        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              password: adminPassword,
              user_metadata: { username: adminUsername, role: 'admin' }
            }
          );
          if (updateError) throw updateError;
          console.log('✅ Admin user updated successfully.');
        }
      } else {
        throw userError;
      }
    } else {
      console.log('✅ Admin account created successfully!');
    }

    // 2. Setup storage bucket
    console.log('Checking storage bucket "images"...');
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    if (bucketsError) throw bucketsError;

    const imagesBucket = buckets.find(b => b.name === 'images');
    if (!imagesBucket) {
      console.log('Creating "images" bucket...');
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 2097152, // 2MB
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/jpg', 'image/png']
      });
      if (createBucketError) throw createBucketError;
      console.log('✅ "images" bucket created successfully.');
    } else {
      console.log('✅ "images" bucket already exists.');
    }

    console.log('\n--- SETUP COMPLETE ---');
    console.log('� Email: ' + adminEmail);
    console.log('�👤 Username: ' + adminUsername);
    console.log('🔑 Password: ' + adminPassword);
    console.log('\nYou can now login at: http://localhost:3000/login');
    console.log('And manage banners at: http://localhost:3000/admin/banners');

  } catch (err) {
    console.error('❌ Error during setup:', err);
  }
}

setup();
