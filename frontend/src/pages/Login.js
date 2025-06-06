// frontend/src/pages/Login.js - Fixed Background Elements
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  Music,
  Smartphone,
  Shield
} from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.message) {
      // Message will be shown via toast in AuthContext
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    clearErrors();

    try {
      const result = await login(
        data.email,
        data.password,
        data.totpCode,
        data.backupCode
      );

      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else if (result.requires2FA) {
        setRequires2FA(true);
        setUserEmail(data.email);
      } else if (result.error) {
        // Handle specific error types
        const errorMessage = result.error;

        if (errorMessage.toLowerCase().includes('email')) {
          setError('email', { message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setError('password', { message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('2fa') || errorMessage.toLowerCase().includes('verification') || errorMessage.toLowerCase().includes('code')) {
          setError('totpCode', { message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('backup')) {
          setError('backupCode', { message: errorMessage });
        } else {
          setError('general', { message: errorMessage });
        }
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setError('general', { message: 'An unexpected error occurred. Please try again.' });
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-animated relative">
      {/* Background Animation Elements - Fixed positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content - Higher z-index */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="animate-slide-in">
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center text-white hover:text-blue-400 transition-colors hover-lift"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 logo-animated">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-animated">EchoWerk</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            {requires2FA ? (
              <span className="flex items-center justify-center">
                <Shield className="w-8 h-8 mr-2 text-blue-400 animate-pulse" />
                Two-Factor Authentication
              </span>
            ) : (
              'Sign in to your account'
            )}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {requires2FA ? (
              'Enter your verification code to complete sign in'
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 card-animated hover-glow">
          <form className="space-y-6 form-animated" onSubmit={handleSubmit(onSubmit)}>
            {!requires2FA ? (
              <>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`w-full px-3 py-2 pl-10 bg-slate-700 border ${
                        errors.email ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`w-full px-3 py-2 pl-10 pr-10 bg-slate-700 border ${
                        errors.password ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required'
                      })}
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* 2FA Code Field */}
                <div>
                  <label htmlFor="totpCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      id="totpCode"
                      type="text"
                      maxLength={6}
                      className={`w-full px-3 py-2 pl-10 bg-slate-700 border ${
                        errors.totpCode ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-400 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                      placeholder="000000"
                      {...register('totpCode', {
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Please enter a 6-digit code'
                        }
                      })}
                    />
                    <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 animate-pulse" />
                  </div>
                  {errors.totpCode && (
                    <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.totpCode.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-400">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                {/* Backup Code Field */}
                <div>
                  <label htmlFor="backupCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Or use a backup code
                  </label>
                  <input
                    id="backupCode"
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated"
                    placeholder="Enter backup code"
                    {...register('backupCode')}
                  />
                  {errors.backupCode && (
                    <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.backupCode.message}
                    </p>
                  )}
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    clearErrors();
                  }}
                  className="flex items-center text-sm text-gray-400 hover:text-white transition-colors hover-lift"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </button>
              </>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 animate-slide-in">
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.general.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center btn-animated hover-glow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {requires2FA ? 'Verifying...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {requires2FA ? (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Verify Code
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            {!requires2FA && (
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover-lift"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Additional Info for 2FA */}
        {requires2FA && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start">
              <Smartphone className="w-5 h-5 text-blue-400 mr-3 mt-0.5 animate-pulse" />
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-1">Need help with 2FA?</p>
                <ul className="text-gray-400 space-y-1">
                  <li>• Open your authenticator app</li>
                  <li>• Find the EchoWerk entry</li>
                  <li>• Enter the 6-digit code</li>
                  <li>• Or use a backup code if available</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm animate-fade-in">
          <p>
            Protected by EchoWerk Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;