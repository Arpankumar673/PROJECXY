import { createClient } from '@supabase/supabase-js';

// ⚓ LEGACY COMPATIBILITY BRIDGE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
    console.warn("LEGACY Supabase Client Configuration is missing Vite environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
