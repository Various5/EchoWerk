// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Smartphone, AlertCircle } from 'lucide-react';

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
    return null; // Will redirect via useEffect
  }

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {requires2FA ? 'Two-Factor Authentication' : 'Welcome Back'}
          </h1>
          <p className="auth-subtitle">
            {requires2FA
              ? 'Enter your authentication code to continue'
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!requires2FA ? (
            <>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 2FA Code Field */}
              <div className="form-group">
                <label htmlFor="totpCode" className="form-label">
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  Authentication Code
                </label>
                <input
                  type="text"
                  id="totpCode"
                  className={`form-input text-center text-lg tracking-widest ${errors.totpCode ? 'border-red-500' : ''}`}
                  placeholder="000000"
                  maxLength={6}
                  {...register('totpCode', {
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Please enter a 6-digit code'
                    }
                  })}
                />
                {errors.totpCode && (
                  <p className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.totpCode.message}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Backup Code Field */}
              <div className="form-group">
                <label htmlFor="backupCode" className="form-label">
                  Backup Code (Optional)
                </label>
                <input
                  type="text"
                  id="backupCode"
                  className="form-input text-center"
                  placeholder="Enter backup code if you can't access your authenticator"
                  {...register('backupCode')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use this only if you don't have access to your authenticator app
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="form-group">
            {requires2FA ? (
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary w-full"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            )}
          </div>

          {!requires2FA && (
            <>
              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>
            </>
          )}
        </form>

        {!requires2FA && (
          <div className="auth-footer">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Login;