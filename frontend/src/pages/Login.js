import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Smartphone, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const LoginSystem = () => {
  const [currentView, setCurrentView] = useState('login'); // login, register, forgot, verify, twofa
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    totpCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [requires2FA, setRequires2FA] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      requirements: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate 2FA requirement for demo
      if (formData.email === 'demo@example.com') {
        setRequires2FA(true);
        setCurrentView('twofa');
      } else {
        // Successful login
        alert('Login successful! Welcome to EchoWerk.');
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!passwordValidation.isValid) newErrors.password = 'Password does not meet requirements';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentView('verify');
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FA = async () => {
    setIsLoading(true);
    setErrors({});

    if (!formData.totpCode || formData.totpCode.length !== 6) {
      setErrors({ totpCode: 'Please enter a 6-digit verification code' });
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('2FA verification successful! Welcome to EchoWerk.');
    } catch (error) {
      setErrors({ totpCode: 'Invalid verification code' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  // Base styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: '#ef4444'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    opacity: '0.5',
    cursor: 'not-allowed'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '0.5rem'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  // Login View
  if (currentView === 'login') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Lock size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: '#9ca3af' }}>Sign in to your EchoWerk account</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={errors.email ? inputErrorStyle : inputStyle}
                  placeholder="Enter your email"
                />
                <Mail style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={16} />
              </div>
              {errors.email && (
                <div style={errorStyle}>
                  <AlertCircle size={16} />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={errors.password ? inputErrorStyle : inputStyle}
                  placeholder="Enter your password"
                />
                <Lock style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div style={errorStyle}>
                  <AlertCircle size={16} />
                  {errors.password}
                </div>
              )}
            </div>

            {errors.general && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <div style={errorStyle}>
                  <AlertCircle size={16} />
                  {errors.general}
                </div>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              style={isLoading ? buttonDisabledStyle : buttonStyle}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setCurrentView('forgot')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #334155',
            textAlign: 'center'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Create one
              </button>
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Register View
  if (currentView === 'register') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setCurrentView('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create Account</h1>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Join EchoWerk today</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={errors.firstName ? inputErrorStyle : inputStyle}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <div style={{ ...errorStyle, fontSize: '0.75rem' }}>{errors.firstName}</div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={errors.lastName ? inputErrorStyle : inputStyle}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <div style={{ ...errorStyle, fontSize: '0.75rem' }}>{errors.lastName}</div>
                )}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={errors.username ? inputErrorStyle : inputStyle}
                placeholder="Choose a username"
              />
              {errors.username && (
                <div style={errorStyle}>{errors.username}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={errors.email ? inputErrorStyle : inputStyle}
                placeholder="your@email.com"
              />
              {errors.email && (
                <div style={errorStyle}>{errors.email}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={errors.password ? inputErrorStyle : inputStyle}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {formData.password && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    Password requirements:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {[
                      { key: 'minLength', text: 'At least 8 characters' },
                      { key: 'hasUpper', text: 'One uppercase letter' },
                      { key: 'hasLower', text: 'One lowercase letter' },
                      { key: 'hasNumber', text: 'One number' },
                      { key: 'hasSpecial', text: 'One special character' }
                    ].map(req => (
                      <div key={req.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: passwordValidation.requirements[req.key] ? '#22c55e' : '#9ca3af'
                      }}>
                        {passwordValidation.requirements[req.key] ? (
                          <CheckCircle size={12} style={{ marginRight: '0.5rem' }} />
                        ) : (
                          <div style={{
                            width: '12px',
                            height: '12px',
                            border: '1px solid #6b7280',
                            borderRadius: '50%',
                            marginRight: '0.5rem'
                          }} />
                        )}
                        {req.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.password && (
                <div style={errorStyle}>{errors.password}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={errors.confirmPassword ? inputErrorStyle : inputStyle}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div style={errorStyle}>{errors.confirmPassword}</div>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading || !passwordValidation.isValid}
              style={isLoading || !passwordValidation.isValid ? buttonDisabledStyle : buttonStyle}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Two-Factor Authentication View
  if (currentView === 'twofa') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #22c55e, #3b82f6)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Shield size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Two-Factor Authentication
            </h1>
            <p style={{ color: '#9ca3af' }}>
              Enter the verification code from your authenticator app
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Verification Code</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="totpCode"
                  value={formData.totpCode}
                  onChange={handleInputChange}
                  maxLength={6}
                  style={{
                    ...inputStyle,
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace',
                    borderColor: errors.totpCode ? '#ef4444' : '#475569'
                  }}
                  placeholder="000000"
                />
                <Smartphone style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={16} />
              </div>
              {errors.totpCode && (
                <div style={errorStyle}>
                  <AlertCircle size={16} />
                  {errors.totpCode}
                </div>
              )}
            </div>

            <button
              onClick={handle2FA}
              disabled={isLoading || formData.totpCode.length !== 6}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(to right, #22c55e, #3b82f6)',
                opacity: isLoading || formData.totpCode.length !== 6 ? '0.5' : '1'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setCurrentView('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <ArrowLeft size={14} />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email Verification View
  if (currentView === 'verify') {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Mail size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Check Your Email
          </h1>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            We've sent a verification link to{' '}
            <strong style={{ color: '#ffffff' }}>{formData.email}</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
            Click the link in your email to verify your account and complete registration.
          </p>
          <button
            onClick={() => setCurrentView('login')}
            style={buttonStyle}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Forgot Password View
  if (currentView === 'forgot') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setCurrentView('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Reset Password</h1>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Enter your email to reset your password
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter your email"
                />
                <Mail style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={16} />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Password reset link sent to your email!');
                setCurrentView('login');
              }}
              style={buttonStyle}
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginSystem;