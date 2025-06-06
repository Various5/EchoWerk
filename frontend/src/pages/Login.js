// src/pages/Login.js - Modern Futuristic Login
import React, { useState, useEffect, useRef } from 'react';
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
  Scan,
  Shield,
  Fingerprint,
  Zap
} from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);
  const formRef = useRef(null);

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

  // Security level calculation
  useEffect(() => {
    let level = 0;
    if (email && email.includes('@')) level += 25;
    if (password && password.length >= 8) level += 25;
    if (password && /[A-Z]/.test(password)) level += 15;
    if (password && /[0-9]/.test(password)) level += 15;
    if (password && /[^a-zA-Z0-9]/.test(password)) level += 20;

    setSecurityLevel(Math.min(level, 100));
  }, [email, password]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Form animation on mount
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add('fade-in');
    }
  }, []);

  const handleSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const onSubmit = async (data) => {
    clearErrors();
    handleSecurityScan();

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
    <div className="auth-container">
      {/* Floating Security Elements */}
      <div className="fixed top-20 right-20 opacity-20 animate-pulse">
        <Shield className="w-32 h-32 text-neon-blue" />
      </div>
      <div className="fixed bottom-20 left-20 opacity-10 animate-bounce">
        <Fingerprint className="w-24 h-24 text-neon-purple" />
      </div>

      {/* Main Login Card */}
      <div className="glass-card auth-card scan-line" ref={formRef}>
        {/* Security Scanner Animation */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse"></div>
          </div>
        )}

        {/* Header Section */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-cyber flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-neon-blue opacity-50 animate-ping"></div>
            </div>
          </div>

          <h1 className="auth-title holographic-text" data-text={requires2FA ? 'Security Verification' : 'Quantum Login'}>
            {requires2FA ? 'Security Verification' : 'Quantum Login'}
          </h1>

          <p className="auth-subtitle">
            {requires2FA
              ? '🛡️ Enter your quantum authentication code to proceed'
              : '🚀 Access your personal universe of music'
            }
          </p>

          {/* Security Level Indicator */}
          {!requires2FA && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Security Level</span>
                <span className="text-xs font-mono text-neon-blue">{securityLevel}%</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${securityLevel}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!requires2FA ? (
            <>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="w-4 h-4" />
                  <span>Neural Link Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={`form-input pl-12 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your quantum email"
                    {...register('email', {
                      required: 'Neural link address is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid quantum address'
                      }
                    })}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {email && email.includes('@') && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
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
                  <span>Quantum Passphrase</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your quantum passphrase"
                    {...register('password', {
                      required: 'Quantum passphrase is required'
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

              {/* Biometric Scanner Simulation */}
              <div className="form-group">
                <button
                  type="button"
                  onClick={handleSecurityScan}
                  className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-neon-blue transition-all duration-300 group"
                  disabled={isScanning}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Scan className={`w-5 h-5 ${isScanning ? 'text-neon-blue animate-spin' : 'text-gray-400 group-hover:text-neon-blue'}`} />
                    <span className={`text-sm ${isScanning ? 'text-neon-blue' : 'text-gray-400 group-hover:text-white'}`}>
                      {isScanning ? 'Scanning biometrics...' : 'Optional: Biometric scan'}
                    </span>
                  </div>
                  {isScanning && (
                    <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse"></div>
                    </div>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 2FA Code Field */}
              <div className="form-group">
                <label htmlFor="totpCode" className="form-label">
                  <Smartphone className="w-4 h-4" />
                  <span>Quantum Authentication Code</span>
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
                        message: 'Please enter a 6-digit quantum code'
                      }
                    })}
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="flex justify-center items-center h-full">
                      <div className="flex space-x-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-8 h-8 border-b border-gray-600"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {errors.totpCode && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.totpCode.message}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Enter the 6-digit code from your quantum authenticator
                </p>
              </div>

              {/* Backup Code Field */}
              <div className="form-group">
                <label htmlFor="backupCode" className="form-label">
                  <Shield className="w-4 h-4" />
                  <span>Emergency Backup Code</span>
                </label>
                <input
                  type="text"
                  id="backupCode"
                  className="form-input text-center font-mono"
                  placeholder="Enter emergency backup code"
                  {...register('backupCode')}
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
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
                  className="btn btn-cyber w-full group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2"></div>
                      <span>Quantum verification in progress...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Verify & Access</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary w-full"
                >
                  ← Return to Login
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={loading || securityLevel < 50}
                className="btn btn-primary w-full group relative overflow-hidden"
              >
                <div className="flex items-center justify-center relative z-10">
                  {loading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      <span>Establishing quantum connection...</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Neural Link</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                  className="text-sm text-neon-blue hover:text-neon-purple transition-colors inline-flex items-center group"
                >
                  <span>Lost your quantum passphrase?</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/80 text-gray-400 backdrop-blur">or continue with</span>
                </div>
              </div>

              {/* Quantum Registration */}
              <div className="text-center p-4 bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-gray-300 text-sm mb-3">
                  New to the quantum realm?
                </p>
                <Link
                  to="/register"
                  className="btn btn-accent inline-flex items-center group"
                >
                  <span>Create Quantum Identity</span>
                  <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
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
                Quantum Encrypted
              </span>
              <span className="flex items-center">
                <Fingerprint className="w-3 h-3 mr-1" />
                Bio-Secure
              </span>
              <span className="flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Neural Compatible
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ambient Background Effects */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-10 right-10 w-24 h-24 bg-neon-purple/10 rounded-full blur-lg animate-bounce"></div>
      <div className="fixed top-1/2 left-1/4 w-16 h-16 bg-neon-green/10 rounded-full blur-md animate-ping"></div>
    </div>
  );
};

export default Login;