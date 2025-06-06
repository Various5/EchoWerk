// src/pages/Register.js - Clean Professional Registration
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
  X,
  ArrowRight,
  Shield
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

      if (pwd.length >= 8) strength += 20;
      if (pwd.length >= 12) strength += 10;
      if (/[a-z]/.test(pwd)) strength += 15;
      if (/[A-Z]/.test(pwd)) strength += 15;
      if (/\d/.test(pwd)) strength += 15;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 20;
      if (pwd.length >= 16) strength += 5;

      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getPasswordStrengthColor = (strength) => {
    if (strength >= 80) return 'from-green-400 to-emerald-500';
    if (strength >= 60) return 'from-yellow-400 to-orange-500';
    if (strength >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Medium';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  };

  const validatePassword = (value) => {
    const errors = [];
    if (value.length < 8) errors.push('Minimum 8 characters');
    if (!/[a-z]/.test(value)) errors.push('Lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('Uppercase letter');
    if (!/\d/.test(value)) errors.push('Number');
    if (!/[^a-zA-Z\d]/.test(value)) errors.push('Special character');

    return errors.length === 0 || `Missing: ${errors.join(', ')}`;
  };

  const onSubmit = async (data) => {
    clearErrors();

    const { confirmPassword, ...submitData } = data;
    const result = await registerUser(submitData);

    if (result.success) {
      navigate('/login', {
        state: {
          message: 'Account created successfully! Please check your email to verify your account.'
        }
      });
    } else if (result.error) {
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
    return null;
  }

  return (
    <div className="auth-container">
      {/* Main Registration Card */}
      <div className="glass-card auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">
            Join us today and get started with your music journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  <User className="w-4 h-4" />
                  <span>First Name</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
                  placeholder="Your first name"
                  {...register('first_name', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum 2 characters required'
                    }
                  })}
                />
                {errors.first_name && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.first_name.message}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  <User className="w-4 h-4" />
                  <span>Last Name</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
                  placeholder="Your last name"
                  {...register('last_name', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum 2 characters required'
                    }
                  })}
                />
                {errors.last_name && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.last_name.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <UserCheck className="w-4 h-4" />
              <span>Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className={`form-input pl-12 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Choose a username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Minimum 3 characters required'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Only letters, numbers, and underscores allowed'
                  }
                })}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <UserCheck className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {errors.username && (
              <div className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.username.message}
              </div>
            )}
          </div>

          {/* Email */}
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
                placeholder="your@email.com"
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

          {/* Password */}
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
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  validate: validatePassword
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Password Strength</span>
                  <span className={`text-xs font-bold ${passwordStrength >= 80 ? 'text-green-400' : passwordStrength >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getPasswordStrengthColor(passwordStrength)} transition-all duration-500`}
                    style={{ width: `${passwordStrength}%` }}
                  >
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <div className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <Lock className="w-4 h-4" />
              <span>Confirm Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input pl-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match'
                })}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-blue transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center mt-2 text-sm">
                {confirmPassword === password ? (
                  <>
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-red-400">Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            {errors.confirmPassword && (
              <div className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-group pt-4">
            <button
              type="submit"
              disabled={loading || passwordStrength < 60}
              className="btn btn-primary w-full group relative overflow-hidden"
            >
              <div className="flex items-center justify-center relative z-10">
                {loading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Terms */}
          <div className="text-center p-4 bg-gradient-to-r from-gray-900/20 to-gray-800/20 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-2">
              By creating an account, you agree to our
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <Link
                to="/terms"
                className="text-neon-blue hover:text-neon-purple transition-colors underline"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/privacy"
                className="text-neon-blue hover:text-neon-purple transition-colors underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-neon-blue hover:text-neon-purple font-medium transition-colors inline-flex items-center group">
                Sign In
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Secuare
              </span>
              <span className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;