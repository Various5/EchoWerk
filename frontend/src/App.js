// src/App.js - Clean Professional Application
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

// Loading Component
const AppLoader = () => (
  <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-spin"></div>
        {/* Middle Ring */}
        <div className="absolute inset-2 border-4 border-neon-purple/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Inner Core */}
        <div className="absolute inset-6 bg-gradient-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Loading Application</h3>
      <p className="text-gray-400 text-sm">Please wait...</p>
    </div>
  </div>
);

// Custom Route Transition Wrapper
const PageTransition = ({ children }) => (
  <div className="page-transition">
    {children}
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-void">
    <div className="glass-card p-8 max-w-md text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Application Error</h2>
      <p className="text-gray-400 mb-6">
        Something went wrong. Please try refreshing the page.
      </p>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="btn btn-primary w-full"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-secondary w-full"
        >
          Go Home
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
          <pre className="text-xs text-red-400 mt-2 overflow-auto max-h-32 bg-gray-900 p-2 rounded">
            {error?.stack || String(error)}
          </pre>
        </details>
      )}
    </div>
  </div>
);

// Main App Component
function App() {
  // Add global keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Search activated');
      }

      // Esc to close modals
      if (e.key === 'Escape') {
        console.log('Escape pressed');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Router>
          <div className="App">
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: 'rgba(26, 26, 46, 0.9)',
                  backdropFilter: 'blur(20px)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

            {/* Route Definitions */}
            <Suspense fallback={<AppLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <LandingPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PageTransition>
                      <Register />
                    </PageTransition>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PageTransition>
                      <ForgotPassword />
                    </PageTransition>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <PageTransition>
                      <ResetPassword />
                    </PageTransition>
                  }
                />
                <Route
                  path="/verify-email/:token"
                  element={
                    <PageTransition>
                      <VerifyEmail />
                    </PageTransition>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Profile />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />

                {/* Music App Routes (Future Implementation) */}
                <Route
                  path="/music/*"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="glass-card p-8 text-center max-w-md">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Music Features</h2>
                            <p className="text-gray-400 mb-6">
                              Music features are coming soon. We're working on an amazing
                              experience for managing and playing your music collection.
                            </p>
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary"
                            >
                              Back to Dashboard
                            </button>
                          </div>
                        </div>
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />

                {/* Legal Pages */}
                <Route
                  path="/terms"
                  element={
                    <PageTransition>
                      <div className="min-h-screen flex items-center justify-center bg-void">
                        <div className="glass-card p-8 max-w-2xl">
                          <h1 className="text-2xl font-bold text-white mb-6">Terms of Service</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300">
                              By using EchoWerk, you agree to our terms of service and privacy policy.
                              Our platform is designed to provide secure music management with respect
                              for user privacy and data protection.
                            </p>
                            <p className="text-gray-300 mt-4">
                              These terms are subject to updates and changes. Users will be notified
                              of any significant changes to the terms of service.
                            </p>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <PageTransition>
                      <div className="min-h-screen flex items-center justify-center bg-void">
                        <div className="glass-card p-8 max-w-2xl">
                          <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300">
                              Your privacy is important to us. We use industry-standard encryption
                              and security practices to protect your personal information and music data.
                            </p>
                            <p className="text-gray-300 mt-4">
                              We do not sell or share your personal information with third parties
                              without your explicit consent.
                            </p>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />

                {/* 404 - Page Not Found */}
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <div className="min-h-screen flex items-center justify-center bg-void">
                        <div className="glass-card p-8 text-center max-w-md">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-3xl">404</span>
                          </div>
                          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
                          <h2 className="text-xl font-semibold text-neon-blue mb-4">Lost in the Music</h2>
                          <p className="text-gray-400 mb-6">
                            The page you're looking for doesn't exist.
                            Let's get you back on track.
                          </p>
                          <div className="space-y-3">
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary w-full"
                            >
                              Go Back
                            </button>
                            <button
                              onClick={() => window.location.href = '/'}
                              className="btn btn-secondary w-full"
                            >
                              Go Home
                            </button>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />
              </Routes>
            </Suspense>

            {/* Development Tools */}
            {process.env.NODE_ENV === 'development' && (
              <>
                {/* Keyboard Shortcuts */}
                <div className="fixed bottom-4 left-4 text-xs text-gray-500 font-mono bg-gray-900/80 p-2 rounded border border-gray-700">
                  <div>⌘/Ctrl + K: Search</div>
                  <div>Esc: Close Modals</div>
                </div>

                {/* Build Info */}
                <div className="fixed top-4 left-4 text-xs text-gray-500 font-mono bg-gray-900/80 p-2 rounded border border-gray-700">
                  <div>React: {React.version}</div>
                  <div>Build: {process.env.REACT_APP_VERSION || 'dev'}</div>
                </div>
              </>
            )}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;