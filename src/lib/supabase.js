import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🕵️ Supabase Connection Debugging
console.log('--- Supabase Connection Status ---')
console.log('Project URL Detected:', !!supabaseUrl)
console.log('Anon Key Detected:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ FATAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  console.warn('⚡ PRO TIP: Ensure your .env file is in the root and has the VITE_ prefix.')
}

// 🏛️ Client Initialization (Standard)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
