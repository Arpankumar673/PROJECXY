import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { CreateProject, ProjectDetails, TeamManagement } from './pages/ProjectPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
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
  return (
    <AuthProvider>
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
              <Route path="/dashboard" element={
                <ProtectedRoute role="student">
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute role="dept_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/projects/new" element={
                <ProtectedRoute role="student">
                  <CreateProject />
                </ProtectedRoute>
              } />
              
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/projects/:id/team" element={
                <ProtectedRoute>
                  <TeamManagement />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;