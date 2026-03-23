import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { CreateProject, ProjectDetails, TeamManagement } from './pages/ProjectPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { Dashboard } from './pages/Dashboard';
import { CampusProjects as FeedPage } from './pages/CampusProjects';
import { InboxPage } from './pages/Inbox';
import { AlertsPage } from './pages/Alerts';
import { AchievementsPage } from './pages/Achievements';
import { ProfilePage } from './pages/Profile';
import { StudentsPage } from './pages/Students';
import { StudentProfilePage } from './pages/StudentProfile';
import { SettingsPage } from './pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import { UserProvider } from './context/UserContext';
import { DashboardLayout } from './layouts/DashboardLayout';

/**
 * 🏢 COLLABORATIVE WORKSPACE WRAPPER
 * Ensures the Sidebar and vertical layout are only present for authenticated modules.
 */
const InnovationLayout = () => (
  <DashboardLayout>
     <Outlet />
  </DashboardLayout>
);

function App() {
  console.log("ENVIRONMENT VERIFICATION PULSE:", {
    url: import.meta.env.VITE_SUPABASE_URL ? "IDENTIFIED (Production Safe)" : "UNDEFINED (Check Vercel Setting Name)",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? "IDENTIFIED" : "UNDEFINED"
  });

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-projecxy-bg flex items-center justify-center p-6 font-sans antialiased text-center">
        <div className="max-w-xl w-full bg-white p-12 rounded-[48px] shadow-soft border border-gray-100 space-y-8">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-projecxy-text tracking-tighter uppercase">Environment Locked</h1>
            <p className="text-projecxy-secondary font-bold text-sm uppercase tracking-widest leading-relaxed">Identity Hub secrets (VITE_SUPABASE_URL) are UNDEFINED in this build context.</p>
          </div>
          <div className="bg-gray-50 rounded-[32px] p-8 font-mono text-left text-xs text-gray-400 border border-transparent group hover:border-blue-100 transition-colors">
            <code className="block mb-2 text-projecxy-blue"># PROTOCOL DIAGNOSIS</code>
            <p className="mb-1 text-red-400 font-bold">» SYSTEM.VAR.URL: UNDEFINED</p>
            <p className="mb-4">» TARGET PATH: VERCEL-ENV-PULSE</p>
            <p className="leading-6 opacity-60 font-sans font-bold uppercase text-[10px]">Ensure you have set the VITE_ prefixed keys in your Vercel Dashboard and REDEPLOYED the app with "Clear Cache".</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-projecxy-bg text-projecxy-text font-sans flex flex-col selection:bg-blue-100 selection:text-projecxy-blue">
            <Routes>
              {/* 🌐 CLEAR VISITOR ROUTES (No Sidebar) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* 🛸 PROTECTED ONBOARDING (Centural Transition) */}
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              
              {/* 🚢 AUTHENTICATED INNOVATION HUB (Sidebar Enabled) */}
              <Route element={<InnovationLayout />}>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
                <Route path="/student/:id" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                
                <Route path="/admin" element={<ProtectedRoute role="dept_admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
                <Route path="/projects/:id/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
                
                {/* Added Legacy Compatibility Routes */}
                <Route path="/explore" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                <Route path="/workspace" element={<ProtectedRoute><div className="p-10 font-black uppercase tracking-widest text-projecxy-secondary opacity-50">Industrial Workspace Terminal</div></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/department" element={<ProtectedRoute><div className="p-10 font-black uppercase tracking-widest text-projecxy-secondary opacity-50">Department Repository Hub</div></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;