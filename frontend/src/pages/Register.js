// src/pages/Register.js - Modern Futuristic Registration
import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  Shield,
  Cpu,
  Sparkles,
  Rocket,
  Brain,
  Fingerprint
} from 'lucide-react';

const Register = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isCreatingQuantumId, setIsCreatingQuantumId] = useState(false);
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    trigger
  } = useForm();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const email = watch('email', '');
  const username = watch('username', '');
  const firstName = watch('first_name', '');
  const lastName = watch('last_name', '');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Form animation on mount
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add('fade-in');
    }
  }, []);

  // Calculate password strength with futuristic metrics
  useEffect(() => {
    const calculateQuantumStrength = (pwd) => {
      let strength = 0;
      let quantumFactors = [];

      if (pwd.length >= 8) {
        strength += 20;
        quantumFactors.push('Length Matrix');
      }
      if (pwd.length >= 12) {
        strength += 10;
        quantumFactors.push('Extended Matrix');
      }
      if (/[a-z]/.test(pwd)) {
        strength += 15;
        quantumFactors.push('Alpha Lower');
      }
      if (/[A-Z]/.test(pwd)) {
        strength += 15;
        quantumFactors.push('Alpha Upper');
      }
      if (/\d/.test(pwd)) {
        strength += 15;
        quantumFactors.push('Numeric');
      }
      if (/[^a-zA-Z\d]/.test(pwd)) {
        strength += 20;
        quantumFactors.push('Special Chars');
      }
      if (pwd.length >= 16) {
        strength += 5;
        quantumFactors.push('Ultra Matrix');
      }

      return { strength: Math.min(strength, 100), factors: quantumFactors };
    };

    const result = calculateQuantumStrength(password);
    setPasswordStrength(result.strength);
  }, [password]);

  const getPasswordStrengthColor = (strength) => {
    if (strength >= 80) return 'from-green-400 to-emerald-500';
    if (strength >= 60) return 'from-yellow-400 to-orange-500';
    if (strength >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength >= 80) return 'Quantum Grade';
    if (strength >= 60) return 'Neural Compatible';
    if (strength >= 40) return 'Bio-Secure';
    if (strength >= 20) return 'Basic Matrix';
    return 'Insufficient';
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

  const calculateFormProgress = () => {
    let progress = 0;
    if (email && email.includes('@')) progress += 16.6;
    if (username && username.length >= 3) progress += 16.6;
    if (firstName && firstName.length >= 2) progress += 16.6;
    if (lastName && lastName.length >= 2) progress += 16.6;
    if (password && passwordStrength >= 60) progress += 16.6;
    if (confirmPassword && confirmPassword === password) progress += 16.6;

    return Math.min(progress, 100);
  };

  const handleQuantumIdCreation = async () => {
    setIsCreatingQuantumId(true);

    // Simulate quantum ID generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsCreatingQuantumId(false);
    setRegistrationStep(2);
  };

  const onSubmit = async (data) => {
    clearErrors();

    if (registrationStep === 1) {
      // Validate first step
      const isValid = await trigger(['first_name', 'last_name', 'username', 'email']);
      if (isValid) {
        await handleQuantumIdCreation();
      }
      return;
    }

    // Final submission
    const { confirmPassword, ...submitData } = data;
    const result = await registerUser(submitData);

    if (result.success) {
      navigate('/login', {
        state: {
          message: '🎉 Quantum identity created! Neural link activation email sent.'
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
      setRegistrationStep(1); // Go back to first step if error
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-container">
      {/* Quantum Creation Animation */}
      {isCreatingQuantumId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card p-8 text-center max-w-md">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-cyber animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 holographic-text">Creating Quantum Identity</h3>
            <p className="text-gray-400 mb-4">Initializing neural pathways...</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="fixed top-10 right-10 opacity-20">
        <Cpu className="w-24 h-24 text-neon-purple animate-pulse" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-10">
        <Rocket className="w-32 h-32 text-neon-blue float" />
      </div>

      {/* Main Registration Card */}
      <div className="glass-card auth-card" ref={formRef}>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Quantum Identity Creation</span>
            <span className="text-xs font-mono text-neon-blue">{Math.round(calculateFormProgress())}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green transition-all duration-1000 ease-out"
              style={{ width: `${calculateFormProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center">
                {registrationStep === 1 ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">{registrationStep}</span>
              </div>
            </div>
          </div>

          <h1 className="auth-title">
            <span className="holographic-text" data-text="Create Quantum Identity">
              Create Quantum Identity
            </span>
          </h1>

          <p className="auth-subtitle">
            {registrationStep === 1
              ? '🌌 Begin your journey into the musical metaverse'
              : '🔐 Secure your neural pathways with quantum encryption'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {registrationStep === 1 ? (
            <>
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neon-blue flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Personal Matrix
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      <User className="w-4 h-4" />
                      <span>First Protocol</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
                      placeholder="Your first quantum signature"
                      {...register('first_name', {
                        required: 'First protocol is required',
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
                      <span>Last Protocol</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
                      placeholder="Your last quantum signature"
                      {...register('last_name', {
                        required: 'Last protocol is required',
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

              {/* Identity Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neon-purple flex items-center">
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Quantum Identity
                </h3>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    <UserCheck className="w-4 h-4" />
                    <span>Neural Handle</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      className={`form-input pl-12 ${errors.username ? 'border-red-500' : ''}`}
                      placeholder="Your unique quantum identifier"
                      {...register('username', {
                        required: 'Neural handle is required',
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
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {username && username.length >= 3 && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  {errors.username && (
                    <div className="form-error">
                      <AlertCircle className="w-4 h-4" />
                      {errors.username.message}
                    </div>
                  )}
                </div>

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
                      placeholder="your@quantum.link"
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
                        <Check className="w-4 h-4 text-green-400" />
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
              </div>
            </>
          ) : (
            <>
              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neon-green flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Quantum Security
                </h3>

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
                      placeholder="Create your quantum passphrase"
                      {...register('password', {
                        required: 'Quantum passphrase is required',
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
                        <span className="text-xs text-gray-400">Quantum Strength</span>
                        <span className={`text-xs font-bold ${passwordStrength >= 80 ? 'text-green-400' : passwordStrength >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getPasswordStrengthColor(passwordStrength)} transition-all duration-500 relative`}
                          style={{ width: `${passwordStrength}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
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

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <Lock className="w-4 h-4" />
                    <span>Confirm Passphrase</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className={`form-input pl-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm your quantum passphrase"
                      {...register('confirmPassword', {
                        required: 'Please confirm your passphrase',
                        validate: (value) =>
                          value === password || 'Passphrases do not match'
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
                          <span className="text-green-400">Quantum sync confirmed</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-400 mr-2" />
                          <span className="text-red-400">Quantum sync failed</span>
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
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="form-group pt-4">
            <button
              type="submit"
              disabled={loading || (registrationStep === 2 && passwordStrength < 60)}
              className="btn btn-primary w-full group relative overflow-hidden"
            >
              <div className="flex items-center justify-center relative z-10">
                {loading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    <span>Creating quantum matrix...</span>
                  </>
                ) : registrationStep === 1 ? (
                  <>
                    <span>Generate Quantum ID</span>
                    <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                  </>
                ) : (
                  <>
                    <span>Activate Neural Link</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          </div>

          {/* Quantum Terms */}
          <div className="text-center p-4 bg-gradient-to-r from-gray-900/20 to-gray-800/20 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-2">
              By creating a quantum identity, you acknowledge the
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <button
                type="button"
                className="text-neon-blue hover:text-neon-purple transition-colors underline"
                onClick={() => window.open('/terms', '_blank')}
              >
                Quantum Protocols
              </button>
              <span className="text-gray-600">•</span>
              <button
                type="button"
                className="text-neon-blue hover:text-neon-purple transition-colors underline"
                onClick={() => window.open('/privacy', '_blank')}
              >
                Neural Privacy
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Already have a quantum identity?{' '}
              <Link to="/login" className="text-neon-blue hover:text-neon-purple font-medium transition-colors inline-flex items-center group">
                Access Neural Link
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>

            {/* Security Features */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Quantum Secure
              </span>
              <span className="flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                Neural Compatible
              </span>
              <span className="flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Instant Activation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="fixed top-1/4 right-1/3 w-20 h-20 bg-neon-purple/10 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-1/3 left-1/4 w-16 h-16 bg-neon-green/10 rounded-full blur-lg animate-bounce"></div>
      <div className="fixed top-3/4 right-1/4 w-12 h-12 bg-neon-blue/10 rounded-full blur-md animate-ping"></div>
    </div>
  );
};

export default Register;