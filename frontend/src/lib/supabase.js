import { createClient } from "@supabase/supabase-js";

// 🛸 PROJECXY: CRA-STANDARD CONNECTIVITY HUB
// Since the project is using 'react-scripts', we MUST use process.env.REACT_APP_
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://zwjdigzhdhbpvtpdzjzc.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3amRpZ3poZGhicHZ0cGR6anpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU1MDUsImV4cCI6MjA4OTY4MTUwNX0.CekoY69r6jmvZypr2aIhfm1Dt7PAEpEZThvP4_VHT0E";

if (!process.env.REACT_APP_SUPABASE_URL) {
  console.warn("Hub Engine Status: Missing environment configuration. Using institutional fallback bridge.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
