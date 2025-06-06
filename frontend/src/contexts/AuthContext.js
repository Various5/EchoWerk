// frontend/src/contexts/AuthContext.js - FIXED LOGIN ISSUE
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration - FIXED for network setup
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.0.1.10:8000';

// Enhanced error handler - FIXED to handle truncated messages
const handleApiError = (error) => {
  console.error('🔥 Full API Error:', error);
  console.error('🔥 Error Response:', error.response);
  console.error('🔥 Error Data:', error.response?.data);

  // Handle network errors
  if (!error.response) {
    const message = 'Network connection failed. Please check your internet connection and ensure the backend is running.';
    console.error('Network error - is the backend running on', API_BASE_URL, '?');
    return message;
  }

  const { status, data } = error.response;
  console.log('🔥 Error Status:', status);
  console.log('🔥 Error Data:', data);

  let message = 'An unexpected error occurred';

  try {
    if (data) {
      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object') {
        // Handle FastAPI validation errors more thoroughly
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            // Pydantic validation errors - format them properly
            const errorMessages = data.detail.map(err => {
              const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
              const msg = err.msg || 'is required';
              return `${field}: ${msg}`;
            });
            message = errorMessages.join('; ');
          } else {
            message = String(data.detail);
          }
        } else if (data.message) {
          message = String(data.message);
        } else if (data.error) {
          message = String(data.error);
        } else {
          // Fallback to status-based message
          message = getStatusBasedMessage(status);
        }
      }
    } else {
      message = getStatusBasedMessage(status);
    }

    // Additional check for truncated messages
    if (message.length < 3 || message.endsWith(':')) {
      message = getStatusBasedMessage(status);
    }

  } catch (parseError) {
    console.error('Error parsing error response:', parseError);
    message = getStatusBasedMessage(status);
  }

  return message;
};

// Helper function for status-based messages
const getStatusBasedMessage = (status) => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password. Please check your credentials.';
    case 403:
      return 'Access denied. Please verify your account or contact support.';
    case 404:
      return 'Service not found. Please try again later.';
    case 409:
      return 'Email or username already exists. Please try different credentials.';
    case 422:
      return 'Validation failed. Please check all required fields and try again.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Service temporarily unavailable. Please try again in a moment.';
    case 503:
      return 'Service maintenance in progress. Please try again later.';
    default:
      return `Request failed. Please try again. (Error ${status})`;
  }
};

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🌐 Making API request:', config.method?.toUpperCase(), config.url);
    if (config.data && config.method !== 'get') {
      // Log data but hide sensitive fields
      const logData = { ...config.data };
      if (logData.password) logData.password = '[HIDDEN]';
      console.log('📤 Request data:', logData);
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 API response success:', response.status);
    return response;
  },
  async (error) => {
    console.error('📥 API response error:', error.response?.status, error.response?.data);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          ['access_token', 'refresh_token', 'user'].forEach(key =>
            localStorage.removeItem(key)
          );
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🔄 Initializing auth...');
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Verify token validity
          const response = await api.get('/auth/me');
          const currentUser = response.data;

          localStorage.setItem('user', JSON.stringify(currentUser));
          setUser(currentUser);
          console.log('✅ Auth initialized successfully:', currentUser.email);
        } catch (error) {
          console.log('⚠️ Token verification failed, clearing auth:', error.message);
          ['access_token', 'refresh_token', 'user'].forEach(key =>
            localStorage.removeItem(key)
          );
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('ℹ️ No stored auth found');
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function - FIXED for validation issues
  const login = async (email, password, totpCode = null, backupCode = null) => {
    try {
      setLoading(true);
      console.log('🚀 Attempting login for:', email);

      // Validate and clean required fields
      const cleanEmail = (email || '').trim();
      const cleanPassword = password || '';

      if (!cleanEmail) {
        const message = 'Email address is required';
        console.error('❌ Validation error:', message);
        toast.error(message);
        return { success: false, error: message };
      }

      if (!cleanPassword) {
        const message = 'Password is required';
        console.error('❌ Validation error:', message);
        toast.error(message);
        return { success: false, error: message };
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        const message = 'Please enter a valid email address';
        console.error('❌ Email validation error:', message);
        toast.error(message);
        return { success: false, error: message };
      }

      // CRITICAL FIX: Only include fields that have actual values
      // Don't send null values which can cause validation errors
      const loginData = {
        email: cleanEmail,
        password: cleanPassword
      };

      // Only add optional fields if they have actual values (not null/empty)
      if (totpCode && totpCode.trim() && totpCode.trim() !== '') {
        loginData.totp_code = totpCode.trim();
      }

      if (backupCode && backupCode.trim() && backupCode.trim() !== '') {
        loginData.backup_code = backupCode.trim();
      }

      console.log('📤 Sending login data:', {
        ...loginData,
        password: '[HIDDEN]'
      });

      // Make the API call
      const response = await api.post('/auth/login', loginData);
      console.log('📥 Login response received:', response.status);

      const data = response.data;
      console.log('📋 Response data:', { ...data, access_token: data.access_token ? '[TOKEN]' : undefined });

      // Handle 2FA requirement
      if (data.requires_2fa) {
        console.log('🔐 2FA required');
        return {
          success: false,
          requires2FA: true,
          message: 'Two-factor authentication code required'
        };
      }

      // Successful login
      if (data.success && data.access_token) {
        console.log('✅ Login successful');

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        const welcomeMessage = `Welcome back, ${data.user.first_name || data.user.username}!`;
        toast.success(welcomeMessage);

        return { success: true, user: data.user };
      }

      // Handle unsuccessful login
      const message = data.message || 'Login failed. Please check your credentials and try again.';
      console.log('❌ Login failed:', message);
      return { success: false, error: message };

    } catch (error) {
      console.error('💥 Login error occurred:', error);

      // Enhanced error logging for debugging
      if (error.response) {
        console.error('📋 Error details:');
        console.error('  Status:', error.response.status);
        console.error('  Headers:', error.response.headers);
        console.error('  Data:', error.response.data);

        // Special handling for 422 validation errors
        if (error.response.status === 422) {
          console.error('🔍 Validation error details:', error.response.data);
        }
      }

      const message = handleApiError(error);
      console.error('🔥 Final error message:', message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function - FIXED
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🚀 Attempting registration...');

      // Validate required fields before sending
      const requiredFields = ['email', 'username', 'password', 'first_name', 'last_name'];
      const missingFields = requiredFields.filter(field => !userData[field] || userData[field].trim() === '');

      if (missingFields.length > 0) {
        const message = `Missing required fields: ${missingFields.join(', ')}`;
        console.error('❌ Validation error:', message);
        toast.error(message);
        return { success: false, error: message };
      }

      // Clean the data
      const cleanData = {
        email: userData.email.trim(),
        username: userData.username.trim(),
        password: userData.password,
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim()
      };

      console.log('📤 Sending registration data:', { ...cleanData, password: '[HIDDEN]' });

      const response = await api.post('/auth/register', cleanData);
      const data = response.data;

      if (data.success) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        return { success: true, message: 'Registration successful' };
      }

      const message = data.message || 'Registration failed. Please try again.';
      return { success: false, error: message };

    } catch (error) {
      const message = handleApiError(error);
      console.error('Registration error:', message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Rest of the functions remain the same...
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      ['access_token', 'refresh_token', 'user'].forEach(key =>
        localStorage.removeItem(key)
      );
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Successfully signed out');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent! Please check your inbox.');
      return { success: true, message: 'Reset email sent' };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      if (!user?.email) {
        const message = 'No email address found. Please sign in again.';
        toast.error(message);
        return { success: false, error: message };
      }

      await api.post('/auth/resend-verification', { email: user.email });
      toast.success('Verification email sent! Please check your inbox.');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getSecurityScore = () => {
    if (!user) return 0;
    let score = 20;
    if (user.is_verified) score += 40;
    if (user.is_2fa_enabled) score += 40;
    return Math.min(score, 100);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    resendVerification,
    getSecurityScore,
    refreshUser: initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};