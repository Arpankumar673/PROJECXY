import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase KEY:", supabaseKey ? "Discovered (Check Vercel for full value)" : "UNDEFINED");

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase environment variables are missing in this Vite build.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
