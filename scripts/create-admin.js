// Run this script to create admin account
// Usage: node scripts/create-admin.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  try {
    console.log('Creating admin account...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
      options: {
        data: {
          username: 'admin',
        },
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.error('Error creating admin:', error.message);
      return;
    }

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('\nYou can now login at: http://localhost:3000/login');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createAdmin();
