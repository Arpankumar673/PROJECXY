import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-projecxy-dark"><Loader2 className="w-12 h-12 text-projecxy-blue animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛰️ ONBOARDING HANDOFF
  // If the user is authenticated but hasn't finished onboarding, port them to the identity terminal.
  if (user && !profile?.onboarding_completed && !loading) {
    if (window.location.pathname !== '/onboarding') {
       return <Navigate to="/onboarding" replace />;
    }
  }

  // 👮 AUTHENTICATED USERS WHO FINISHED ONBOARDING SHOULD NOT GO BACK TO LOGIN
  if (user && profile?.onboarding_completed && window.location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // 👮 ROLE ENFORCEMENT
  if (role && profile?.role && profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};
