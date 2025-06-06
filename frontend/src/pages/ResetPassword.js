// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  // Calculate password strength
  useEffect(() => {
    const calculateStrength = (pwd) => {
      let strength = 0;

      if (pwd.length >= 8) strength += 1;
      if (pwd.length >= 12) strength += 1;
      if (/[a-z]/.test(pwd)) strength += 1;
      if (/[A-Z]/.test(pwd)) strength += 1;
      if (/\d/.test(pwd)) strength += 1;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 1;

      return Math.min(strength, 4);
    };

    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 8) errors.push('At least 8 characters');
    if (!/[a-z]/.test(value)) errors.push('One lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('One uppercase letter');
    if (!/\d/.test(value)) errors.push('One number');
    if (!/[^a-zA-Z\d]/.test(value)) errors.push('One special character');

    return errors.length === 0 || errors.join(', ');
  };

  const onSubmit = async (data) => {
    clearErrors();

    if (!token) {
      setError('password', { message: 'Invalid reset token' });
      return;
    }

    const result = await resetPassword(token, data.password);

    if (result.success) {
      navigate('/login', {
        state: {
          message: 'Password reset successful! Please sign in with your new password.'
        }
      });
    } else {
      if (result.error.includes('token')) {
        setIsTokenValid(false);
      }
      setError('password', { message: result.error });
    }
  };

  if (!isTokenValid) {
    return (
      <div className="auth-container fade-in">
        <div className="glass-card auth-card text-center">
          <div className="auth-header">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="auth-title">Invalid Reset Link</h1>
            <p className="auth-subtitle">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400">
              Password reset links expire after 1 hour for security reasons.
              Please request a new password reset link.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/forgot-password" className="btn btn-primary">
                Request New Reset Link
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-subtitle">
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock className="w-4 h-4 inline mr-2" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  validate: validatePassword
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Password Strength</span>
                  <span className={`text-xs ${passwordStrength >= 3 ? 'text-green-400' : 'text-orange-400'}`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your new password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center mt-1 text-sm">
                {confirmPassword === password ? (
                  <>
                    <Check className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400">Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            {errors.confirmPassword && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button
              type="submit"
              disabled={loading || passwordStrength < 3}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Security Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-400">
                  <li>Use a unique password you haven't used elsewhere</li>
                  <li>Include a mix of letters, numbers, and symbols</li>
                  <li>Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ResetPassword;