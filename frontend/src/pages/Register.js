// frontend/src/pages/Register.js - EMERGENCY FIX for "Field Required" Error
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
  AlertCircle,
  CheckCircle,
  Music,
  Shield,
  Zap
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
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

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
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(value)) return 'Password must contain at least one number';
    if (!/[^a-zA-Z\d]/.test(value)) return 'Password must contain at least one special character';
    return true;
  };

  const onSubmit = async (data) => {
    console.log('🚀 Form submission started');
    console.log('📝 Raw form data:', data);

    setIsSubmitting(true);
    clearErrors();

    try {
      // Validate all fields before submission
      const isFormValid = await trigger();
      if (!isFormValid) {
        console.error('❌ Form validation failed:', errors);
        setIsSubmitting(false);
        return;
      }

      // CRITICAL: Clean and validate data with exact field names backend expects
      const cleanData = {
        email: (data.email || '').trim(),
        username: (data.username || '').trim().toLowerCase(),
        password: data.password || '',
        first_name: (data.first_name || '').trim(),  // EXACT backend field name
        last_name: (data.last_name || '').trim()     // EXACT backend field name
      };

      console.log('🧹 Cleaned data for backend:', cleanData);

      // Validate all required fields are present and not empty
      const requiredFields = ['email', 'username', 'password', 'first_name', 'last_name'];
      const missingFields = requiredFields.filter(field => !cleanData[field] || cleanData[field] === '');

      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        missingFields.forEach(field => {
          setError(field, {
            type: 'manual',
            message: `${field.replace('_', ' ')} is required`
          });
        });
        setIsSubmitting(false);
        return;
      }

      // Additional email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(cleanData.email)) {
        setError('email', { type: 'manual', message: 'Please enter a valid email address' });
        setIsSubmitting(false);
        return;
      }

      // Additional username validation
      if (cleanData.username.length < 3) {
        setError('username', { type: 'manual', message: 'Username must be at least 3 characters' });
        setIsSubmitting(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(cleanData.username)) {
        setError('username', { type: 'manual', message: 'Username can only contain letters, numbers, and underscores' });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ All validations passed, sending to API...');
      console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');

      // Call registration API
      const result = await registerUser(cleanData);
      console.log('📥 API response:', result);

      if (result.success) {
        console.log('✅ Registration successful!');
        navigate('/login', {
          state: {
            message: 'Account created successfully! Please check your email to verify your account.',
            type: 'success'
          }
        });
      } else if (result.error) {
        console.error('❌ Registration failed:', result.error);
        const errorMessage = result.error;

        // Map errors to specific fields
        if (errorMessage.toLowerCase().includes('email')) {
          setError('email', { type: 'manual', message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('username')) {
          setError('username', { type: 'manual', message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setError('password', { type: 'manual', message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('first_name') || errorMessage.toLowerCase().includes('first name')) {
          setError('first_name', { type: 'manual', message: errorMessage });
        } else if (errorMessage.toLowerCase().includes('last_name') || errorMessage.toLowerCase().includes('last name')) {
          setError('last_name', { type: 'manual', message: errorMessage });
        } else {
          setError('root', { type: 'manual', message: errorMessage });
        }
      }
    } catch (error) {
      console.error('💥 Unexpected registration error:', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please check your internet connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-animated relative">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="animate-slide-in">
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center text-white hover:text-blue-400 transition-colors hover-lift"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 logo-animated">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-animated">EchoWerk</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 card-animated hover-glow">
          <form className="space-y-6 form-animated" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Fields - CRITICAL: Using exact backend field names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={`w-full px-3 py-2 bg-slate-700 border ${
                    errors.first_name ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="First name"
                  {...register('first_name', {
                    required: 'First name is required',
                    minLength: {
                      value: 1,
                      message: 'First name is required'
                    },
                    maxLength: {
                      value: 50,
                      message: 'First name must be less than 50 characters'
                    },
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return 'First name is required';
                      }
                      return true;
                    }
                  })}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-400 animate-slide-in flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={`w-full px-3 py-2 bg-slate-700 border ${
                    errors.last_name ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="Last name"
                  {...register('last_name', {
                    required: 'Last name is required',
                    minLength: {
                      value: 1,
                      message: 'Last name is required'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Last name must be less than 50 characters'
                    },
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return 'Last name is required';
                      }
                      return true;
                    }
                  })}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-400 animate-slide-in flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={`w-full px-3 py-2 pl-10 bg-slate-700 border ${
                    errors.username ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="Choose a username"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    },
                    maxLength: {
                      value: 30,
                      message: 'Username must be less than 30 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores'
                    },
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return 'Username is required';
                      }
                      return true;
                    }
                  })}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-3 py-2 pl-10 bg-slate-700 border ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    },
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return 'Email address is required';
                      }
                      return true;
                    }
                  })}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-3 py-2 pl-10 pr-10 bg-slate-700 border ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    validate: validatePassword
                  })}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 animate-slide-in">
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
                <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-3 py-2 pl-10 pr-10 bg-slate-700 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input-animated`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center mt-1 text-sm animate-slide-in">
                  {confirmPassword === password ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1 animate-pulse" />
                      <span className="text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400 mr-1" />
                      <span className="text-red-400">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 flex items-center animate-slide-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* General Error */}
            {errors.root && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 animate-slide-in">
                <p className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Debug Info (for troubleshooting) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 bg-slate-700 p-2 rounded">
                <p>🐛 Debug Info:</p>
                <p>Form Valid: {isValid ? 'Yes' : 'No'}</p>
                <p>Password Strength: {passwordStrength}%</p>
                <p>Errors Count: {Object.keys(errors).length}</p>
                <p>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || isSubmitting || passwordStrength < 60}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center btn-animated hover-glow"
              >
                {loading || isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </button>
              {passwordStrength < 60 && password && (
                <p className="text-xs text-yellow-400 mt-2 text-center animate-pulse">
                  Please create a stronger password to continue
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Security Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-green-400 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-green-400">Secured by EchoWerk</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center text-xs text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
              Email Verification
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
              2FA Support
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
              Encrypted Storage
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
              Rate Limiting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;