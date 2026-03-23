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