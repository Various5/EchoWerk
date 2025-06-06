// src/App.js - Complete Modern Application
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

// Quantum Loading Component
const QuantumLoader = () => (
  <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-spin"></div>
        {/* Middle Ring */}
        <div className="absolute inset-2 border-4 border-neon-purple/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Inner Core */}
        <div className="absolute inset-6 bg-gradient-cyber rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <h3 className="text-lg font-semibold holographic-text mb-2">Loading Quantum Interface</h3>
      <p className="text-gray-400 text-sm">Initializing neural pathways...</p>
    </div>
  </div>
);

// Background Animation Component
const QuantumBackground = () => {
  useEffect(() => {
    // Add dynamic particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-neon-blue/30 rounded-full pointer-events-none';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 2 + 's';

      document.body.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 7000);
    };

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 2000);

    // Initial burst of particles
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 200);
    }

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  return null;
};

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
      <h2 className="text-xl font-bold text-white mb-2">Quantum Error Detected</h2>
      <p className="text-gray-400 mb-6">
        A temporal anomaly has occurred in the system matrix.
      </p>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="btn btn-primary w-full"
        >
          Restore Quantum State
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-secondary w-full"
        >
          Return to Origin
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
          <pre className="text-xs text-red-400 mt-2 overflow-auto max-h-32 bg-gray-900 p-2 rounded">
            {error.stack}
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
      // Ctrl/Cmd + K for quantum search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Open search modal
        console.log('Quantum search activated');
      }

      // Esc to close modals
      if (e.key === 'Escape') {
        // TODO: Close any open modals
        console.log('Escape pressed');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Preload critical resources
  useEffect(() => {
    const preloadImages = [
      // Add any critical images here
    ];

    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Router>
          <div className="App">
            {/* Global Background Effects */}
            <QuantumBackground />

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
            <Suspense fallback={<QuantumLoader />}>
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
                            <h2 className="text-xl font-bold text-white mb-2">Music Universe</h2>
                            <p className="text-gray-400 mb-6">
                              The quantum music dimension is currently being constructed.
                              Neural patterns are being optimized for the ultimate sonic experience.
                            </p>
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary"
                            >
                              Return to Command Center
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
                          <h1 className="text-2xl font-bold text-white mb-6">Quantum Protocols</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300">
                              By accessing the EchoWerk quantum realm, you agree to maintain neural harmony
                              and respect the cosmic music frequencies of all dimensional entities.
                            </p>
                            <p className="text-gray-300 mt-4">
                              These terms are subject to quantum superposition and may exist in multiple
                              states simultaneously until observed by conscious entities.
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
                          <h1 className="text-2xl font-bold text-white mb-6">Neural Privacy Protocols</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300">
                              Your neural patterns and quantum signatures are encrypted using advanced
                              dimensional folding techniques. No consciousness can access your data
                              without proper quantum entanglement permissions.
                            </p>
                            <p className="text-gray-300 mt-4">
                              We respect the privacy of all beings across all dimensions and parallel universes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />

                {/* 404 - Dimensional Void */}
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <div className="min-h-screen flex items-center justify-center bg-void">
                        <div className="glass-card p-8 text-center max-w-md">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-holographic rounded-full flex items-center justify-center animate-spin">
                            <div className="w-12 h-12 bg-void rounded-full flex items-center justify-center">
                              <span className="text-2xl">∅</span>
                            </div>
                          </div>
                          <h1 className="text-3xl font-bold text-white mb-2">404</h1>
                          <h2 className="text-xl font-semibold text-neon-blue mb-4">Dimensional Void</h2>
                          <p className="text-gray-400 mb-6">
                            You've discovered a rift in the space-time continuum.
                            This dimension doesn't exist in our quantum matrix.
                          </p>
                          <div className="space-y-3">
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary w-full"
                            >
                              Return to Previous Dimension
                            </button>
                            <button
                              onClick={() => window.location.href = '/'}
                              className="btn btn-secondary w-full"
                            >
                              Teleport to Origin
                            </button>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />
              </Routes>
            </Suspense>

            {/* Global Keyboard Shortcuts Display (Dev Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 left-4 text-xs text-gray-500 font-mono bg-gray-900/80 p-2 rounded border border-gray-700">
                <div>⌘/Ctrl + K: Quantum Search</div>
                <div>Esc: Close Modals</div>
              </div>
            )}

            {/* Performance Monitor (Dev Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed top-4 left-4 text-xs text-gray-500 font-mono bg-gray-900/80 p-2 rounded border border-gray-700">
                <div>React: {React.version}</div>
                <div>Build: {process.env.REACT_APP_VERSION || 'dev'}</div>
              </div>
            )}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;