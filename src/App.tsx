import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Projects from './pages/Projects.tsx'
import Profile from './pages/Profile.tsx'
import Applications from './pages/Applications.tsx'
import Mentorship from './pages/Mentorship.tsx'
import Notifications from './pages/Notifications.tsx'
import About from './pages/About.tsx'
import Onboarding from './pages/Onboarding.tsx'
import Auth from './pages/Auth.tsx'
import Messages from './pages/Messages.tsx'
import DeptDashboard from './pages/DeptDashboard.tsx'
import DeptProjects from './pages/DeptProjects.tsx'
import Analytics from './pages/Analytics.tsx'
import DiscoverPeople from './pages/DiscoverPeople.tsx'
import PublicProfile from './pages/PublicProfile.tsx'
import { useAuth } from './context/AuthContext.tsx'

export default function App() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F3F2EF]">
      <div className="h-10 w-10 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const role = profile?.role
  const isStudent = role === 'student'
  const isDept = role === 'department'
  const isOnboarded = profile?.is_onboarded

  const showFooter = ["/", "/dashboard"].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F2EF]">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Root */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth Flow - Role Based Landing */}
          <Route 
            path="/auth" 
            element={!user ? <Auth /> : (isDept ? <Navigate to="/dept-dashboard" /> : <Navigate to="/dashboard" />)} 
          />
          
          {/* Dashboard Hub - Hard-Gating */}
          <Route 
            path="/dashboard" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : (isStudent ? <Dashboard /> : <Navigate to="/dept-dashboard" />))} 
          />

          <Route 
            path="/dept-dashboard" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : (isDept ? <DeptDashboard /> : <Navigate to="/dashboard" />))} 
          />

          {/* Core Projects Hub - Role Specific Routing */}
          <Route 
            path="/projects" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : (isStudent ? <Projects /> : <Navigate to="/dept-projects" />))} 
          />

          <Route 
            path="/dept-projects" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : (isDept ? <DeptProjects /> : <Navigate to="/projects" />))} 
          />
          
          {/* Other Shared/Protected Routes */}
          <Route 
            path="/profile" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : <Profile />)} 
          />

          <Route 
            path="/notifications" 
            element={!user ? <Navigate to="/auth" /> : (!isOnboarded ? <Navigate to="/onboarding" /> : <Notifications />)} 
          />
          
          <Route 
            path="/onboarding" 
            element={!user ? <Navigate to="/auth" /> : (isOnboarded && role ? (isDept ? <Navigate to="/dept-dashboard" /> : <Navigate to="/dashboard" />) : <Onboarding />)} 
          />

          {/* Student Specific Routes */}
          <Route 
            path="/applications" 
            element={user && isStudent && isOnboarded ? <Applications /> : (user && isDept ? <Navigate to="/dept-dashboard" /> : <Navigate to={!user ? "/auth" : "/onboarding"} />)} 
          />

          <Route 
            path="/mentorship" 
            element={user && isStudent && isOnboarded ? <Mentorship /> : (user && isDept ? <Navigate to="/dept-dashboard" /> : <Navigate to={!user ? "/auth" : "/onboarding"} />)} 
          />

          <Route 
            path="/messages" 
            element={user && (isStudent || isDept) && isOnboarded ? <Messages /> : <Navigate to={!user ? "/auth" : "/onboarding"} />} 
          />

          <Route 
            path="/people" 
            element={user && isOnboarded ? <DiscoverPeople /> : <Navigate to={!user ? "/auth" : "/onboarding"} />} 
          />

          <Route 
            path="/profile/:id" 
            element={user && isOnboarded ? <PublicProfile /> : <Navigate to={!user ? "/auth" : "/onboarding"} />} 
          />



          {/* Department Specific Routes */}
          <Route 
            path="/analytics" 
            element={user && isDept && isOnboarded ? <Analytics /> : (user && isStudent ? <Navigate to="/dashboard" /> : <Navigate to={!user ? "/auth" : "/onboarding"} />)} 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
