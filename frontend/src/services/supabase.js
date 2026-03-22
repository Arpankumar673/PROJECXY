import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://zwjdigzhdhbpvtpdzjzc.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3amRpZ3poZGhicHZ0cGR6anpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU1MDUsImV4cCI6MjA4OTY4MTUwNX0.CekoY69r6jmvZypr2aIhfm1Dt7PAEpEZThvP4_VHT0E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
