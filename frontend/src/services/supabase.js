import { createClient } from '@supabase/supabase-js';

// 🚀 VITE STANDARD CONFIGURATION
// 🛸 CONNECTIVITY BRIDGE: Prioritizing Vercel ENV -> Falling back to Hub Defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zwjdigzhdhbpvtpdzjzc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3amRpZ3poZGhicHZ0cGR6anpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU1MDUsImV4cCI6MjA4OTY4MTUwNX0.CekoY69r6jmvZypr2aIhfm1Dt7PAEpEZThvP4_VHT0E";

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn("VITE_SUPABASE_URL is missing. Using institutional bridge fallback. Please verify Vercel Secrets.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
