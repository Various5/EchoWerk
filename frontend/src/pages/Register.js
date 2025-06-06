// frontend/src/pages/Register.js - Modern Registration with Effects
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';

const Register = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const email = watch('email', '');
  const firstName = watch('first_name', '');
  const lastName = watch('last_name', '');
  const username = watch('username', '');

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
      if (pwd.length >= 12) strength += 15;
      if (/[a-z]/.test(pwd)) strength += 15;
      if (/[A-Z]/.test(pwd)) strength += 15;
      if (/\d/.test(pwd)) strength += 15;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 15;
      if (pwd.length >= 16) strength += 5;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const getPasswordStrengthInfo = (strength) => {
    if (strength >= 80) return { level: 'Excellent', color: 'from-green-400 to-emerald-500', textColor: 'text-green-400' };
    if (strength >= 60) return { level: 'Strong', color: 'from-blue-400 to-cyan-500', textColor: 'text-blue-400' };
    if (strength >= 40) return { level: 'Medium', color: 'from-yellow-400 to-orange-500', textColor: 'text-yellow-400' };
    if (strength >= 20) return { level: 'Weak', color: 'from-orange-400 to-red-500', textColor: 'text-orange-400' };
    return { level: 'Very Weak', color: 'from-red-500 to-red-600', textColor: 'text-red-400' };
  };

  const validatePassword = (value) => {
    const errors = [];
    if (value.length < 8) errors.push('At least 8 characters');
    if (!/[a-z]/.test(value)) errors.push('Lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('Uppercase letter');
    if (!/\d/.test(value)) errors.push('Number');
    if (!/[^a-zA-Z\d]/.test(value)) errors.push('Special character');
    return errors.length === 0 || `Missing: ${errors.join(', ')}`;
  };

  const onSubmit = async (data) => {
    clearErrors();
    setIsSubmitting(true);

    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  return (
    <div className="auth-container">
      {/* Interactive Background */}
      <ParticleBackground
        particleCount={35}
        connectionDistance={100}
        particleColor="rgba(139, 92, 246, 0.5)"
        lineColor="rgba(139, 92, 246, 0.2)"
        speed={0.4}
        interactive={true}
      />

      {/* Registration Card */}
      <div className="glass-card auth-card animate-slideUp">
        {/* Header */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="auth-title">Join Our Community</h1>
          <p className="auth-subtitle">
            Create your account and start your musical journey with enhanced security and premium features
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <User className="w-4 h-4" />
                <span>First Name</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="firstName"
                  className={`form-input ${errors.first_name ? 'border-red-500' : firstName ? 'border-green-500/50' : ''}`}
                  placeholder="Your first name"
                  {...register('first_name', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum 2 characters required'
                    }
                  })}
                />
                <User className="input-icon" />
                {firstName && !errors.first_name && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
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
              <div className="input-with-icon">
                <input
                  type="text"
                  id="lastName"
                  className={`form-input ${errors.last_name ? 'border-red-500' : lastName ? 'border-green-500/50' : ''}`}
                  placeholder="Your last name"
                  {...register('last_name', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum 2 characters required'
                    }
                  })}
                />
                <User className="input-icon" />
                {lastName && !errors.last_name && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {errors.last_name && (
                <div className="form-error">
                  <AlertCircle className="w-4 h-4" />
                  {errors.last_name.message}
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <Zap className="w-4 h-4" />
              <span>Username</span>
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                id="username"
                className={`form-input ${errors.username ? 'border-red-500' : username && username.length >= 3 ? 'border-green-500/50' : ''}`}
                placeholder="Choose a unique username"
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
              <Zap className="input-icon" />
              {username && !errors.username && username.length >= 3 && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
            {errors.username && (
              <div className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.username.message}
              </div>
            )}
            {username && username.length >= 3 && !errors.username && (
              <div className="form-success">
                <CheckCircle className="w-4 h-4" />
                Username looks good!
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'border-red-500' : email && email.includes('@') ? 'border-green-500/50' : ''}`}
                placeholder="your@email.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              <Mail className="input-icon" />
              {email && !errors.email && email.includes('@') && (
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

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-input ${errors.password ? 'border-red-500' : passwordStrength >= 60 ? 'border-green-500/50' : ''}`}
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  validate: validatePassword
                })}
              />
              <Lock className="input-icon" />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors z-10"
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
                  <span className={`text-xs font-bold ${strengthInfo.textColor}`}>
                    {strengthInfo.level}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${strengthInfo.color} transition-all duration-500 relative`}
                    style={{ width: `${passwordStrength}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Weak</span>
                  <span>Strong</span>
                  <span>Excellent</span>
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
              <Shield className="w-4 h-4" />
              <span>Confirm Password</span>
            </label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : confirmPassword && confirmPassword === password ? 'border-green-500/50' : ''}`}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match'
                })}
              />
              <Shield className="input-icon" />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors z-10"
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
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-green-400">Passwords match perfectly</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
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
              disabled={loading || isSubmitting || passwordStrength < 60}
              className="btn btn-primary w-full group relative overflow-hidden"
            >
              <div className="flex items-center justify-center relative z-10">
                {loading || isSubmitting ? (
                  <>
                    <div className="spinner mr-2"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {passwordStrength < 60 && password && (
              <p className="text-xs text-yellow-400 mt-2 text-center">
                Please create a stronger password to continue
              </p>
            )}
          </div>

          {/* Terms & Privacy */}
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-2">
              By creating an account, you agree to our
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <Link
                to="/terms"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                to="/privacy"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
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
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center group">
                Sign In
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </span>
              <span className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Trusted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Register;