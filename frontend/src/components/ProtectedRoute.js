// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication and optional permissions.
 * Redirects unauthenticated users to login page.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to render if authenticated
 * @param {string} props.requiredPermission - Optional permission requirement
 * @param {string} props.redirectTo - Custom redirect path (defaults to /login)
 * @param {boolean} props.requireVerification - Require email verification
 * @param {boolean} props.require2FA - Require 2FA setup
 */
const ProtectedRoute = ({
  children,
  requiredPermission = null,
  redirectTo = '/login',
  requireVerification = false,
  require2FA = false
}) => {
  const { isAuthenticated, user, loading, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
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
      <Navigate
        to="/verify-email"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check 2FA requirement
  if (require2FA && !user.is_2fa_enabled) {
    return (
      <Navigate
        to="/setup-2fa"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check specific permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  // Render protected content
  return <>{children}</>;
};

// Higher-order component for wrapping components with protection
export const withAuth = (
  Component,
  options = {}
) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific route protectors for common use cases
export const AdminRoute = ({ children }) => (
  <ProtectedRoute
    requiredPermission="admin"
    requireVerification={true}
    require2FA={true}
  >
    {children}
  </ProtectedRoute>
);

export const VerifiedRoute = ({ children }) => (
  <ProtectedRoute requireVerification={true}>
    {children}
  </ProtectedRoute>
);

export const SecureRoute = ({ children }) => (
  <ProtectedRoute
    requireVerification={true}
    require2FA={true}
  >
    {children}
  </ProtectedRoute>
);

// Hook for programmatic navigation with auth checks
export const useAuthenticatedNavigation = () => {
  const { isAuthenticated, user, hasPermission } = useAuth();

  const canNavigateTo = (path, requirements = {}) => {
    if (!isAuthenticated) return false;

    if (requirements.requireVerification && !user?.is_verified) {
      return false;
    }

    if (requirements.require2FA && !user?.is_2fa_enabled) {
      return false;
    }

    if (requirements.permission && !hasPermission(requirements.permission)) {
      return false;
    }

    return true;
  };

  const getRedirectPath = (requirements = {}) => {
    if (!isAuthenticated) return '/login';

    if (requirements.requireVerification && !user?.is_verified) {
      return '/verify-email';
    }

    if (requirements.require2FA && !user?.is_2fa_enabled) {
      return '/setup-2fa';
    }

    if (requirements.permission && !hasPermission(requirements.permission)) {
      return '/unauthorized';
    }

    return null;
  };

  return { canNavigateTo, getRedirectPath };
};

export default ProtectedRoute;