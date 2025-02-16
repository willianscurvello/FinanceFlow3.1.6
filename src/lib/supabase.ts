import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only throw error if we're not in development mode
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables');
}

// Use demo values for development if not provided
const url = supabaseUrl || 'https://demo.supabase.com';
const key = supabaseAnonKey || 'demo-key';

export const supabase = createClient(url, key);
