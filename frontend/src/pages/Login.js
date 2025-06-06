// frontend/src/pages/Login.js - Clean Login Implementation
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
  Smartphone
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
      if (result.error.includes('email')) {
        setError('email', { message: result.error });
      } else if (result.error.includes('password')) {
        setError('password', { message: result.error });
      } else if (result.error.includes('2FA') || result.error.includes('verification')) {
        setError('totpCode', { message: result.error });
      } else {
        setError('general', { message: result.error });
      }
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center text-white hover:text-blue-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EchoWerk</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            {requires2FA ? 'Two-Factor Authentication' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {requires2FA ? (
              'Enter your verification code'
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                    <p className="mt-1 text-sm text-red-400 flex items-center">
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
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required'
                      })}
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
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
                      } rounded-lg text-white placeholder-gray-400 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="000000"
                      {...register('totpCode', {
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Please enter a 6-digit code'
                        }
                      })}
                    />
                    <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.totpCode && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
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
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter backup code"
                    {...register('backupCode')}
                  />
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setRequires2FA(false)}
                  className="flex items-center text-sm text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </button>
              </>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {requires2FA ? 'Verifying...' : 'Signing in...'}
                  </>
                ) : (
                  requires2FA ? 'Verify Code' : 'Sign In'
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            {!requires2FA && (
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;