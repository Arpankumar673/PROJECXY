import { createClient } from "@supabase/supabase-js";

// 🚀 VITE STANDARD CONFIGURATION (Vercel Production Ready)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🛡️ SECURITY DIAGNOSTIC
if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL CONFIGURATION ERROR: Supabase environment variables are UNDEFINED.", {
    url: supabaseUrl ? "Defined (Check Vercel for spelling)" : "MISSING",
    key: supabaseKey ? "Defined" : "MISSING"
  });
  // During local development, this helps identify missing .env files
  // In production, this prevents the app from hanging silently
}

// Ensure createClient is only called with valid strings to avoid crash
export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
