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
  signInWithGoogle: () => Promise<void>
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
      console.log('[PROJEXY AUTH]: Fetching profile for:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        console.warn('[PROJEXY AUTH]: Profile missing. Auto-creating baseline entry.')
        
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
           console.error('[PROJEXY AUTH]: Auto-creation failure:', createError.message)
           setProfile({ id: userId, is_onboarded: false, role: 'student' } as any)
        } else {
           setProfile(newProfile)
        }
      } else {
        console.log('[PROJEXY AUTH]: Profile sync complete. Onboarded:', data.is_onboarded, 'Role:', data.role)
        setProfile(data)
      }
    } catch (err: any) {
      console.error('[PROJEXY AUTH]: Profile fetch error:', err.message)
      setProfile({ id: userId, is_onboarded: false, role: 'student' } as any)
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

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth'
      }
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider. Ensure your component tree is wrapped in <AuthProvider> in main.tsx')
  }
  return context
}
