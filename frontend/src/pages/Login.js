// frontend/src/pages/Login.js - Modern Login with Interactive Effects
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Smartphone,
  AlertCircle,
  ArrowRight,
  Shield,
  CheckCircle,
  Key,
  Sparkles
} from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';
  const email = watch('email');
  const password = watch('password');
  const totpCode = watch('totpCode');

  // Show success message if redirected from registration or email verification
  useEffect(() => {
    if (location.state?.message) {
      // toast.success(location.state.message);
    }
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    clearErrors();
    setIsSubmitting(true);

    try {
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
    } finally {
      setIsSubmitting(false);
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
      {/* Interactive Background */}
      <ParticleBackground
        particleCount={40}
        connectionDistance={120}
        particleColor="rgba(59, 130, 246, 0.6)"
        lineColor="rgba(59, 130, 246, 0.2)"
        speed={0.3}
        interactive={true}
      />

      {/* Login Card */}
      <div className="glass-card auth-card animate-slideUp">
        {/* Header */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                {requires2FA ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <Key className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="auth-title">
            {requires2FA ? 'Secure Access' : 'Welcome Back'}
          </h1>

          <p className="auth-subtitle">
            {requires2FA
              ? 'Enter your authentication code to complete secure login'
              : 'Sign in to your account to access your music dashboard'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!requires2FA ? (
            <>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'border-red-500' : email ? 'border-green-500/50' : ''}`}
                    placeholder="Enter your email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  <Mail className="input-icon" />
                  {email && !errors.email && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
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
                <div className="input-with-icon">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'border-red-500' : password && password.length >= 8 ? 'border-green-500/50' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <Lock className="input-icon" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
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
              {/* 2FA Section */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Your account is protected with 2FA</p>
                  </div>
                </div>
                <p className="text-sm text-blue-300">
                  Logging in as: <span className="font-mono font-medium">{loginData?.email}</span>
                </p>
              </div>

              {/* 2FA Code Field */}
              <div className="form-group">
                <label htmlFor="totpCode" className="form-label">
                  <Smartphone className="w-4 h-4" />
                  <span>Authentication Code</span>
                </label>
                <input
                  type="text"
                  id="totpCode"
                  className={`form-input text-center text-2xl tracking-widest font-mono ${errors.totpCode ? 'border-red-500' : totpCode && totpCode.length === 6 ? 'border-green-500/50' : ''}`}
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
                {errors.totpCode && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.totpCode.message}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Backup Code Field */}
              <div className="form-group">
                <label htmlFor="backupCode" className="form-label">
                  <Key className="w-4 h-4" />
                  <span>Backup Code (Optional)</span>
                </label>
                <input
                  type="text"
                  id="backupCode"
                  className="form-input text-center font-mono"
                  placeholder="Use if authenticator unavailable"
                  {...register('backupCode')}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Only use if you can't access your authenticator app
                </p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="form-group pt-4">
            {requires2FA ? (
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="btn btn-primary w-full group relative overflow-hidden"
                >
                  <div className="flex items-center justify-center relative z-10">
                    {loading || isSubmitting ? (
                      <>
                        <div className="spinner mr-2"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Verify & Access</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary w-full"
                >
                  ← Back to Login
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="btn btn-primary w-full group relative overflow-hidden"
              >
                <div className="flex items-center justify-center relative z-10">
                  {loading || isSubmitting ? (
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
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center group"
                >
                  <span>Forgot your password?</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/80 text-gray-400 backdrop-blur">or</span>
                </div>
              </div>

              {/* Register Section */}
              <div className="glass rounded-xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-300">New to our platform?</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Join thousands of users enjoying secure music management
                </p>
                <Link
                  to="/register"
                  className="btn btn-accent w-full group"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </form>

        {/* Security Features */}
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
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Login;