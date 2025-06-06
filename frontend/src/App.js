// frontend/src/App.js - Modern Application with Interactive Effects
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ParticleBackground from './components/ParticleBackground';
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

// Modern Loading Component with Neural Network Aesthetics
const AppLoader = () => (
  <div className="loading-screen">
    <div className="loading-content">
      {/* Neural Network Loading Animation */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full animate-spin"></div>
        {/* Middle Ring */}
        <div
          className="absolute inset-2 border-4 border-purple-400/50 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        {/* Inner Ring */}
        <div
          className="absolute inset-4 border-2 border-cyan-400/70 rounded-full animate-spin"
          style={{ animationDuration: '0.8s' }}
        ></div>
        {/* Neural Core */}
        <div className="absolute inset-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 text-gradient">Initializing Neural Interface</h3>
      <p className="text-gray-400 text-sm mb-6">Establishing quantum connections...</p>

      {/* Neural Progress Bar */}
      <div className="w-64 mx-auto">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Neural Pathways</span>
          <span className="font-mono">∞%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Page Transition Wrapper with Modern Effects
const PageTransition = ({ children }) => (
  <div className="page-transition animate-slideUp">
    {children}
  </div>
);

// Enhanced Error Fallback with Modern Design
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center relative">
    <ParticleBackground
      particleCount={20}
      connectionDistance={80}
      particleColor="rgba(239, 68, 68, 0.6)"
      lineColor="rgba(239, 68, 68, 0.2)"
      speed={0.2}
    />

    <div className="glass-card p-8 max-w-md text-center relative z-10">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Neural Anomaly Detected</h2>
      <p className="text-gray-400 mb-6">
        A quantum disruption has occurred in the neural matrix. Our engineers are investigating the dimensional instability.
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

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-300">
            Quantum Debug Data
          </summary>
          <div className="mt-3 p-4 bg-gray-900 rounded-lg overflow-auto max-h-32">
            <pre className="text-xs text-red-400 whitespace-pre-wrap">
              {error?.stack || String(error)}
            </pre>
          </div>
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
        console.log('🔍 Neural search activated');
      }

      // Ctrl/Cmd + Shift + D for dashboard
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        window.location.href = '/dashboard';
      }

      // Esc to close modals
      if (e.key === 'Escape') {
        console.log('🚪 Escape sequence initiated');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Add viewport height fix for mobile
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Router>
          <div className="App">
            {/* Enhanced Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: 'rgba(26, 26, 46, 0.95)',
                  backdropFilter: 'blur(20px)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
                  fontFamily: 'Inter, sans-serif',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                  style: {
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                  style: {
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }
                },
                loading: {
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#ffffff',
                  },
                  style: {
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }
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
                        <div className="min-h-screen flex items-center justify-center relative">
                          <ParticleBackground
                            particleCount={25}
                            connectionDistance={80}
                            particleColor="rgba(139, 92, 246, 0.5)"
                            lineColor="rgba(139, 92, 246, 0.2)"
                          />
                          <div className="glass-card p-8 text-center max-w-md relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Neural Music Interface</h2>
                            <p className="text-gray-400 mb-6">
                              Advanced music features are currently in development. Our neural engineers are crafting an extraordinary experience for your musical journey.
                            </p>
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary group"
                            >
                              <span>Return to Command Center</span>
                              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
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
                      <div className="min-h-screen flex items-center justify-center relative">
                        <ParticleBackground particleCount={20} />
                        <div className="glass-card p-8 max-w-2xl relative z-10">
                          <h1 className="text-2xl font-bold text-white mb-6 text-gradient">Terms of Service</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300 mb-4">
                              By using EchoWerk, you agree to our terms of service and privacy policy.
                              Our platform is designed to provide secure music management with respect
                              for user privacy and data protection.
                            </p>
                            <p className="text-gray-300">
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
                      <div className="min-h-screen flex items-center justify-center relative">
                        <ParticleBackground particleCount={20} />
                        <div className="glass-card p-8 max-w-2xl relative z-10">
                          <h1 className="text-2xl font-bold text-white mb-6 text-gradient">Privacy Policy</h1>
                          <div className="prose prose-invert">
                            <p className="text-gray-300 mb-4">
                              Your privacy is important to us. We use industry-standard encryption
                              and security practices to protect your personal information and music data.
                            </p>
                            <p className="text-gray-300">
                              We do not sell or share your personal information with third parties
                              without your explicit consent.
                            </p>
                          </div>
                        </div>
                      </div>
                    </PageTransition>
                  }
                />

                {/* Enhanced 404 - Page Not Found */}
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <div className="min-h-screen flex items-center justify-center relative">
                        <ParticleBackground
                          particleCount={15}
                          particleColor="rgba(245, 158, 11, 0.6)"
                          lineColor="rgba(245, 158, 11, 0.2)"
                        />
                        <div className="glass-card p-8 text-center max-w-md relative z-10">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center relative">
                            <span className="text-3xl font-bold text-white">404</span>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                              <span className="text-white text-xs">!</span>
                            </div>
                          </div>
                          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
                          <h2 className="text-xl font-semibold text-gradient mb-4">Lost in the Neural Network</h2>
                          <p className="text-gray-400 mb-6">
                            The dimensional coordinates you're seeking don't exist in our reality.
                            Let's guide you back to familiar territory.
                          </p>
                          <div className="space-y-3">
                            <button
                              onClick={() => window.history.back()}
                              className="btn btn-primary w-full group"
                            >
                              <span>Return to Previous Reality</span>
                              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                              </svg>
                            </button>
                            <button
                              onClick={() => window.location.href = '/'}
                              className="btn btn-secondary w-full group"
                            >
                              <span>Neural Home Base</span>
                              <svg className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
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
                {/* Keyboard Shortcuts Panel */}
                <div className="fixed bottom-4 left-4 text-xs font-mono glass p-3 rounded-lg border border-white/10 z-50">
                  <div className="text-blue-400 font-semibold mb-2">Neural Shortcuts:</div>
                  <div className="space-y-1 text-gray-400">
                    <div>⌘/Ctrl + K: Neural Search</div>
                    <div>⌘/Ctrl + Shift + D: Dashboard</div>
                    <div>Esc: Escape Protocol</div>
                  </div>
                </div>

                {/* Build Info Panel */}
                <div className="fixed top-4 left-4 text-xs font-mono glass p-3 rounded-lg border border-white/10 z-50">
                  <div className="text-green-400 font-semibold mb-2">System Status:</div>
                  <div className="space-y-1 text-gray-400">
                    <div>React: {React.version}</div>
                    <div>Build: {process.env.REACT_APP_VERSION || 'neural-dev'}</div>
                    <div>Mode: Development</div>
                  </div>
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