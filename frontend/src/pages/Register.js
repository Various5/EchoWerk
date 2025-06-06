// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserCheck,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

const Register = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

    // Remove confirmPassword from submission data
    const { confirmPassword, ...submitData } = data;

    const result = await registerUser(submitData);

    if (result.success) {
      navigate('/login', {
        state: {
          message: 'Registration successful! Please check your email to verify your account.'
        }
      });
    } else if (result.error) {
      // Handle specific errors
      if (result.error.includes('email')) {
        setError('email', { message: result.error });
      } else if (result.error.includes('username')) {
        setError('username', { message: result.error });
      } else {
        setError('email', { message: result.error });
      }
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join EchoWerk and experience the future of music authentication
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <User className="w-4 h-4 inline mr-2" />
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
                placeholder="John"
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
              {errors.first_name && (
                <p className="form-error">
                  <AlertCircle className="w-4 h-4" />
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <User className="w-4 h-4 inline mr-2" />
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
                placeholder="Doe"
                {...register('last_name', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
              {errors.last_name && (
                <p className="form-error">
                  <AlertCircle className="w-4 h-4" />
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <UserCheck className="w-4 h-4 inline mr-2" />
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="johndoe"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
            />
            {errors.username && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.username.message}
              </p>
            )}
          </div>

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
              placeholder="john@example.com"
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
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              By creating an account, you agree to our{' '}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                onClick={() => window.open('/terms', '_blank')}
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                onClick={() => window.open('/privacy', '_blank')}
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </form>

        <div className="auth-footer">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Register;