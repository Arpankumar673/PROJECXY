import { createClient } from '@supabase/supabase-js';

// 🚀 VITE STANDARD CONFIGURATION
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("LEGACY Supabase Client Configuration is missing Vite environment variables.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
