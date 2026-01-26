// lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// Ambil environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi wajib: pastikan env vars tersedia di client
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg =
    '❌ Missing Supabase environment variables!\n' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    'are set in your .env.local file, then restart the dev server with `npm run dev`.';
  
  // Hanya tampilkan di browser (client-side)
  if (typeof window !== 'undefined') {
    console.error(errorMsg);
  }
  
  // Jangan biarkan client dibuat jika env tidak valid
  throw new Error('Supabase client cannot be initialized without environment variables.');
}

// Buat instance Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Gunakan localStorage hanya di browser
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce'
  },
  // Opsional: aktifkan logging untuk debug (nonaktifkan di production)
  // global: { headers: { 'X-Client-Info': 'nextjs-app' } }
});