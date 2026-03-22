import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-linkedin-bg"><Loader2 className="w-12 h-12 text-linkedin-blue animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛰️ ONBOARDING HANDOFF
  // If the user is authenticated but lacks a profile role, port them to the identity terminal.
  if (!profile?.role && !loading) {
    // Only redirect if NOT already on the onboarding path (handled by App.js)
    if (window.location.pathname !== '/onboarding') {
       return <Navigate to="/onboarding" replace />;
    }
  }

  // 👮 ROLE ENFORCEMENT
  if (role && profile?.role && profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};
