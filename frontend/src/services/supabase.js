import { createClient } from '@supabase/supabase-js';

// 🚀 VITE STANDARD CONFIGURATION
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in environment.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
