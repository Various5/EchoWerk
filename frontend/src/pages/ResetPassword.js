// frontend/src/pages/ResetPassword.js - Clean Reset Password
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
  ArrowLeft,
  Music
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
      if (pwd.length >= 8) strength += 25;
      if (pwd.length >= 12) strength += 15;
      if (/[a-z]/.test(pwd)) strength += 15;
      if (/[A-Z]/.test(pwd)) strength += 15;
      if (/\d/.test(pwd)) strength += 15;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 15;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 60) return 'bg-blue-500';
    if (passwordStrength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return 'Strong';
    if (passwordStrength >= 60) return 'Good';
    if (passwordStrength >= 40) return 'Fair';
    return 'Weak';
  };

  const validatePassword = (value) => {
    const errors = [];
    if (value.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(value)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('one uppercase letter');
    if (!/\d/.test(value)) errors.push('one number');
    if (!/[^a-zA-Z\d]/.test(value)) errors.push('one special character');
    return errors.length === 0 || `Password must contain ${errors.join(', ')}`;
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
      if (result.error.includes('token') || result.error.includes('expired')) {
        setIsTokenValid(false);
      } else {
        setError('password', { message: result.error });
      }
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
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
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              This password reset link is invalid or has expired
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">
              Link Expired or Invalid
            </h3>

            <p className="text-gray-400 mb-6">
              Password reset links expire after 1 hour for security reasons.
              Please request a new password reset link.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/forgot-password"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create a new secure password for your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-3 py-2 pl-10 pr-10 bg-slate-700 border ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Create a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    validate: validatePassword
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Password Strength</span>
                    <span className="text-xs text-gray-300">{getPasswordStrengthText()}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-3 py-2 pl-10 pr-10 bg-slate-700 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Confirm your new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || passwordStrength < 60}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
              {passwordStrength < 60 && password && (
                <p className="text-xs text-yellow-400 mt-2 text-center">
                  Please create a stronger password to continue
                </p>
              )}
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
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;