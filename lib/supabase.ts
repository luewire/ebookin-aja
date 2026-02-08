import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Create Supabase client with Service Role Key for server-side operations
// Only initialize if credentials are available
export const supabaseAdmin = 
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : null;

if (!supabaseAdmin) {
  console.warn('Supabase credentials are missing in environment variables. Supabase features will be disabled.');
}
