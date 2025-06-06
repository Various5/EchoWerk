// src/pages/Login.js - Clean Professional Login
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Smartphone,
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginData, setLoginData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    clearErrors();

    if (requires2FA) {
      // Submit with 2FA code
      const result = await login(
        loginData.email,
        loginData.password,
        data.totpCode,
        data.backupCode
      );

      if (result.success) {
        navigate(from, { replace: true });
      } else if (result.error) {
        setError('totpCode', { message: result.error });
      }
    } else {
      // Initial login attempt
      const result = await login(data.email, data.password);

      if (result.success) {
        navigate(from, { replace: true });
      } else if (result.requires2FA) {
        setRequires2FA(true);
        setLoginData({ email: data.email, password: data.password });
      } else if (result.error) {
        setError('email', { message: result.error });
      }
    }
  };

  const handleBack = () => {
    setRequires2FA(false);
    setLoginData(null);
    clearErrors();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-container">
      {/* Main Login Card */}
      <div className="glass-card auth-card">
        {/* Header Section */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="auth-title">
            {requires2FA ? 'Two-Factor Authentication' : 'Welcome Back'}
          </h1>

          <p className="auth-subtitle">
            {requires2FA
              ? 'Please enter your authentication code to continue'
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!requires2FA ? (
            <>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={`form-input pl-12 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {errors.email && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required'
                    })}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-blue transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 2FA Code Field */}
              <div className="form-group">
                <label htmlFor="totpCode" className="form-label">
                  <Smartphone className="w-4 h-4" />
                  <span>Authentication Code</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="totpCode"
                    className={`form-input text-center text-2xl tracking-widest font-mono ${errors.totpCode ? 'border-red-500' : ''}`}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                    {...register('totpCode', {
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Please enter a 6-digit code'
                      }
                    })}
                  />
                </div>
                {errors.totpCode && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.totpCode.message}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Backup Code Field */}
              <div className="form-group">
                <label htmlFor="backupCode" className="form-label">
                  <Shield className="w-4 h-4" />
                  <span>Backup Code (Optional)</span>
                </label>
                <input
                  type="text"
                  id="backupCode"
                  className="form-input text-center font-mono"
                  placeholder="Enter backup code"
                  {...register('backupCode')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use only if you can't access your authenticator
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="form-group space-y-4">
            {requires2FA ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary w-full"
                >
                  ← Back to Login
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full group relative overflow-hidden"
              >
                <div className="flex items-center justify-center relative z-10">
                  {loading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>

          {!requires2FA && (
            <>
              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-neon-blue hover:text-neon-purple transition-colors inline-flex items-center group"
                >
                  <span>Forgot your password?</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/80 text-gray-400 backdrop-blur">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center p-4 bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-gray-300 text-sm mb-3">
                  Don't have an account?
                </p>
                <Link
                  to="/register"
                  className="btn btn-accent inline-flex items-center group"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        {!requires2FA && (
          <div className="auth-footer">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Secure Login
              </span>
              <span className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;