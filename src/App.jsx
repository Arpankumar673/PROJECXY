// App.jsx - v1.2.3 Ultra-Resilient Edition
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { supabase } from './lib/supabase'

// Components
import Layout from './components/Layout'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Messages from './pages/Messages'

// 🛡️ Global Route Guard
function ProtectedRoute({ session, loading, profile }) {
  if (loading) return null; // Wait for resolving

  if (!session) return <Navigate to="/auth" replace />

  // Mandatory Onboarding Check
  const isOnboardingComplete = profile?.username && profile?.department && profile?.branch
  if (!isOnboardingComplete && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet context={{ profile, session }} />
}

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initSession = async () => {
      console.log("🔒 App: Initializing Handshake...")
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        if (currentSession) {
          await fetchProfile(currentSession.user.id)
        }
      } catch (err) {
        console.error("🔒 App: Initialization Error", err)
      } finally {
        setLoading(false)
        console.log("🔒 App: Finalizing Handshake (Loading: false)")
      }
    }

    initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("🔒 App: Auth State Changed ->", _event)
      setSession(newSession)
      if (newSession) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    if (!userId) return
    console.log(`🔍 App: Fetching profile for ${userId}...`)
    try {
      // 🚀 SWAP: Using .limit(1) instead of .single() to prevent 406 errors
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)

      if (error) {
        console.error("🔍 App: Profile Sync Failure", error.message)
      }

      const userProfile = data?.[0] || null
      console.log("🔍 App: Profile Data Sync ->", userProfile ? "SUCCESS" : "NOT FOUND")
      setProfile(userProfile)
    } catch (err) {
      console.error("🔍 App: Profile Fetch Logic Error", err)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase font-black tracking-widest text-[#0a66c2] animate-pulse">Syncing v1.2 Identity...</p>
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={
          !session ? <Auth /> :
            (profile?.username ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />)
        } />

        <Route element={<ProtectedRoute session={session} loading={loading} profile={profile} />}>
          <Route element={<Layout profile={profile} fetchProfile={() => fetchProfile(session?.user?.id)} />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}
