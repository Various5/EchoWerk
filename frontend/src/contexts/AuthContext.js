// frontend/src/contexts/AuthContext.js - Fixed Error Handling
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Enhanced error handler - FIXED to always return strings
const handleApiError = (error) => {
  console.error('API Error:', error);

  // Handle network errors
  if (!error.response) {
    return 'Network connection failed. Please check your internet connection.';
  }

  const { status, data } = error.response;

  // Ensure we always return a string
  let message = 'An unexpected error occurred';

  try {
    // Handle different data types more carefully
    if (data) {
      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object') {
        // Handle object responses
        if (data.detail) {
          // Handle both string and array details (validation errors)
          if (Array.isArray(data.detail)) {
            message = data.detail.map(err => err.msg || err).join(', ');
          } else {
            message = String(data.detail);
          }
        } else if (data.message) {
          message = String(data.message);
        } else if (data.error) {
          message = String(data.error);
        } else if (data.msg) {
          message = String(data.msg);
        } else {
          // If it's an object but no recognizable error field, use status-based message
          message = getStatusBasedMessage(status);
        }
      } else {
        // Handle any other data types
        message = String(data);
      }
    } else {
      // No data, use status-based message
      message = getStatusBasedMessage(status);
    }
  } catch (parseError) {
    console.error('Error parsing error response:', parseError);
    message = getStatusBasedMessage(status);
  }

  // Ensure message is always a string and not empty
  if (!message || typeof message !== 'string' || message === '[object Object]') {
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
      return 'Authentication failed. Please check your credentials.';
    case 403:
      return 'Access denied. Please verify your account or contact support.';
    case 404:
      return 'Service not found. Please try again later.';
    case 409:
      return 'Email or username already exists. Please try different credentials.';
    case 422:
      return 'Invalid data provided. Please check your input and try again.';
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

// Create axios instance
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
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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
          // Clear auth and redirect
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
        } catch (error) {
          // Token invalid, clear auth
          console.log('Token verification failed, clearing auth');
          ['access_token', 'refresh_token', 'user'].forEach(key =>
            localStorage.removeItem(key)
          );
          setUser(null);
          setIsAuthenticated(false);
        }
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

  // Login function
  const login = async (email, password, totpCode = null, backupCode = null) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
        totp_code: totpCode,
        backup_code: backupCode,
      });

      const data = response.data;

      // Handle 2FA requirement
      if (data.requires_2fa) {
        return {
          success: false,
          requires2FA: true,
          message: 'Two-factor authentication code required'
        };
      }

      // Successful login
      if (data.success && data.access_token) {
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
      const message = data.message || 'Login failed. Please try again.';
      return { success: false, error: message };

    } catch (error) {
      const message = handleApiError(error);
      console.error('Login error:', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/register', userData);
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
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if server request fails
    } finally {
      ['access_token', 'refresh_token', 'user'].forEach(key =>
        localStorage.removeItem(key)
      );
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Successfully signed out');
    }
  };

  // Update profile
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

  // Change password
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

  // Setup 2FA
  const setup2FA = async (password) => {
    try {
      const response = await api.post('/auth/2fa/setup', { password });
      return { success: true, data: response.data };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Enable 2FA
  const enable2FA = async (totpCode) => {
    try {
      setLoading(true);

      await api.post('/auth/2fa/enable', { totp_code: totpCode });

      const updatedUser = { ...user, is_2fa_enabled: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Two-factor authentication enabled successfully!');
      return { success: true };

    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const disable2FA = async (password) => {
    try {
      setLoading(true);

      await api.post('/auth/2fa/disable', { password });

      const updatedUser = { ...user, is_2fa_enabled: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Two-factor authentication disabled');
      return { success: true };

    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
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

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      toast.success('Password reset successful! You can now sign in with your new password.');
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Resend verification
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

  // Security score calculation
  const getSecurityScore = () => {
    if (!user) return 0;
    let score = 20; // Base score for having an account
    if (user.is_verified) score += 40; // Email verified
    if (user.is_2fa_enabled) score += 40; // 2FA enabled
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
    setup2FA,
    enable2FA,
    disable2FA,
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