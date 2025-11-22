import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Lightweight auth wrapper for protecting routes during frontend development.
 * Currently uses a simple check (localStorage "isAuthenticated") and can be
 * replaced by a real auth check when backend is available.
 */
export default function AuthWrapper({ children }) {
  const isAuthenticated = (() => {
    try {
      const v = localStorage.getItem('isAuthenticated');
      return v === 'true' || false;
  } catch {
      return false;
    }
  })();

  if (!isAuthenticated) {
    // For development you can set `localStorage.setItem('isAuthenticated','true')`
    return <Navigate to="/login" replace />;
  }

  return children;
}
