// frontend/src/components/ProtectedRoute.js - Clean Protected Route
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to login page.
 */
const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requireVerification = false
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check email verification requirement
  if (requireVerification && !user.is_verified) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">
              Email Verification Required
            </h2>

            <p className="text-gray-400 mb-6">
              Please verify your email address to access this page.
              Check your email for a verification link.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                I've Verified My Email
              </button>

              <Navigate to="/dashboard" replace />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

// Higher-order component for wrapping components with protection
export const withAuth = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific route protectors for common use cases
export const VerifiedRoute = ({ children }) => (
  <ProtectedRoute requireVerification={true}>
    {children}
  </ProtectedRoute>
);

// Hook for programmatic navigation with auth checks
export const useAuthenticatedNavigation = () => {
  const { isAuthenticated, user } = useAuth();

  const canNavigateTo = (requirements = {}) => {
    if (!isAuthenticated) return false;

    if (requirements.requireVerification && !user?.is_verified) {
      return false;
    }

    return true;
  };

  const getRedirectPath = (requirements = {}) => {
    if (!isAuthenticated) return '/login';

    if (requirements.requireVerification && !user?.is_verified) {
      return '/verify-email';
    }

    return null;
  };

  return { canNavigateTo, getRedirectPath };
};

export default ProtectedRoute;