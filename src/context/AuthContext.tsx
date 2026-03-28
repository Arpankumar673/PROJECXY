import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  full_name: string | null
  roll_number: string | null
  username: string | null
  branch: string | null
  department: string | null
  bio: string | null
  skills: string[]
  avatar_url: string | null
  is_onboarded: boolean
  role: 'student' | 'department'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>
  signUp: (email: string, password: string, metadata: { full_name: string; roll_number: string; role: 'student' | 'department' }) => Promise<{ data: any, error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Auth State Listeners
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      console.log('[PROJECXY AUTH]: Fetching profile for:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        console.warn('[PROJECXY AUTH]: Profile missing. Fulfilling requirement: Create profile automatically.')
        
        // AUTO-CREATE PROFILE if missing (Baseline)
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({ 
            id: userId, 
            is_onboarded: false, 
            role: 'student',
            full_name: 'New User' 
          })
          .select()
          .single()
        
        if (createError) {
           console.error('[PROJECXY AUTH]: Auto-creation blocked by RLS/Constraints:', createError.message)
           setProfile({ id: userId, is_onboarded: false, role: 'student' } as any)
        } else {
           setProfile(newProfile)
        }
      } else {
        console.log('[PROJECXY AUTH]: Profile found. Onboarded info:', data.is_onboarded)
        setProfile(data)
      }
    } catch (err: any) {
      console.error('[PROJECXY AUTH]: Profile fetch error:', err.message)
      // Fallback object to allow app to load but keep them in onboarding
      setProfile({ id: userId, is_onboarded: false } as any)
    } finally {
      setLoading(false)
    }
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  async function signUp(email: string, password: string, metadata: { full_name: string; roll_number: string; role: 'student' | 'department' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: metadata.full_name },
      }
    })
    
    if (data?.user && !error) {
       // Explicitly create the initial profile row to ensure it exists
       await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: metadata.full_name,
          role: metadata.role,
          is_onboarded: false
       })
    }
    
    return { data, error }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
