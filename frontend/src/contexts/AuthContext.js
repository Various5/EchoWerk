// frontend/src/contexts/AuthContext.js - Fixed Auth Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Enhanced error handler
const handleApiError = (error) => {
  console.error('API Error:', error);

  if (!error.response) {
    return 'Network connection failed. Please check your internet connection.';
  }

  const { status, data } = error.response;

  // Handle different error formats
  if (typeof data === 'string') return data;
  if (data?.detail) return String(data.detail);
  if (data?.message) return String(data.message);
  if (data?.error) return String(data.error);

  // Status-based messages
  switch (status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Authentication failed. Please check your credentials.';
    case 403: return 'Access denied. Please verify your account.';
    case 404: return 'Service not found. Please try again later.';
    case 409: return 'Email or username already exists.';
    case 422: return 'Invalid data provided. Please check your input.';
    case 429: return 'Too many requests. Please wait before trying again.';
    case 500: return 'Server error. Please try again later.';
    default: return `Request failed with status ${status}`;
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
        return { success: false, requires2FA: true, message: 'Two-factor authentication required' };
      }

      // Successful login
      if (data.success && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        toast.success(`Welcome back, ${data.user.first_name || data.user.username}!`);
        return { success: true, user: data.user };
      }

      // Handle error response
      const message = data.message || 'Login failed';
      return { success: false, error: message };

    } catch (error) {
      const message = handleApiError(error);
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

      if (response.data.success) {
        toast.success('Account created! Please check your email to verify your account.');
        return { success: true, message: 'Registration successful' };
      }

      return { success: false, error: response.data.message || 'Registration failed' };

    } catch (error) {
      const message = handleApiError(error);
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

      toast.success('Two-factor authentication enabled!');
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
      toast.success('Reset email sent!');
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
      toast.success('Password reset successful!');
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
        return { success: false, error: 'No email address found' };
      }

      await api.post('/auth/resend-verification', { email: user.email });
      toast.success('Verification email sent!');
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