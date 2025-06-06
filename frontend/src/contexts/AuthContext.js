// src/contexts/AuthContext.js - Production Ready Auth Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
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

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      toast.error('🌐 Neural network connection failed. Please check your quantum link.');
      return Promise.reject(new Error('Network connection failed'));
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      toast.error('⚡ Quantum overload detected. Please wait before trying again.');
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);

        // Verify token is still valid
        await api.get('/auth/me');

        // Update user data from server
        const response = await api.get('/auth/me');
        const currentUser = response.data;

        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth on mount
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
      if (!data.success && data.requires_2fa) {
        toast('🔐 Quantum authentication required', { icon: '🛡️' });
        return { success: false, requires2FA: true };
      }

      // Successful login
      if (data.success && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        toast.success('🎉 Neural link established! Welcome to the quantum realm.');
        return { success: true };
      }

      throw new Error('Invalid response format');

    } catch (error) {
      const message = error.response?.data?.detail || 'Authentication failed';
      toast.error(`🚫 ${message}`);

      // Return specific error info for 2FA
      if (error.response?.status === 401 && message.includes('2FA')) {
        return { success: false, requires2FA: true };
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);

      await api.post('/auth/register', userData);

      toast.success('🎊 Quantum identity created! Neural activation link sent to your dimension.');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail ||
                     error.response?.data?.message ||
                     'Registration failed';

      toast.error(`❌ ${message}`);
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('🌌 Neural link disconnected. Safe travels through the cosmos.');
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

      toast.success('✨ Quantum profile updated successfully!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || 'Profile update failed';
      toast.error(`🔧 ${message}`);
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

      toast.success('🔑 Quantum passphrase updated successfully!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || 'Password change failed';
      toast.error(`🚫 ${message}`);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Setup 2FA
  const setup2FA = async (password) => {
    try {
      const response = await api.post('/auth/2fa/setup', { password });

      toast.success('🛡️ Quantum guard generator activated!');
      return { success: true, data: response.data };

    } catch (error) {
      const message = error.response?.data?.detail || '2FA setup failed';
      toast.error(`🔒 ${message}`);
      return { success: false, error: message };
    }
  };

  // Enable 2FA
  const enable2FA = async (totpCode) => {
    try {
      setLoading(true);

      await api.post('/auth/2fa/enable', {
        totp_code: totpCode,
      });

      // Update user state
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, is_2fa_enabled: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('🛡️ Quantum guard activated! Your neural link is now ultra-secure.');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || '2FA activation failed';
      toast.error(`⚠️ ${message}`);
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

      // Update user state
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, is_2fa_enabled: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('🔓 Quantum guard deactivated.');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || '2FA deactivation failed';
      toast.error(`🚫 ${message}`);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });

      toast.success('🌌 Quantum reset link sent to your dimensional address!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || 'Reset request failed';
      toast.error(`📧 ${message}`);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });

      toast.success('🔑 Quantum passphrase reset successfully!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || 'Password reset failed';
      toast.error(`⚠️ ${message}`);
      return { success: false, error: message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);

      // Update user verification status if logged in
      if (user) {
        const updatedUser = { ...user, is_verified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      toast.success('✅ Neural link verified! Welcome to the quantum realm!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.detail || 'Email verification failed';
      toast.error(`📧 ${message}`);
      return { success: false, error: message };
    }
  };

  // Resend verification email
  const resendVerification = async () => {
    try {
      await api.get(`/auth/resend-verification/${user.email}`);
      toast.success('📨 Verification transmission sent to your quantum address!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to resend verification';
      toast.error(`📧 ${message}`);
      return { success: false, error: message };
    }
  };

  // Check if user has permission for certain actions
  const hasPermission = (permission) => {
    if (!user) return false;

    switch (permission) {
      case 'verified':
        return user.is_verified;
      case '2fa':
        return user.is_2fa_enabled;
      case 'admin':
        return user.is_superuser;
      default:
        return false;
    }
  };

  // Get security score
  const getSecurityScore = () => {
    if (!user) return 0;

    let score = 20; // Base score for having an account

    if (user.is_verified) score += 30;
    if (user.is_2fa_enabled) score += 40;
    if (user.last_login) score += 10; // Active user

    return Math.min(score, 100);
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,

    // Auth methods
    login,
    register,
    logout,

    // Profile methods
    updateProfile,
    changePassword,

    // 2FA methods
    setup2FA,
    enable2FA,
    disable2FA,

    // Password reset
    requestPasswordReset,
    resetPassword,

    // Email verification
    verifyEmail,
    resendVerification,

    // Utility methods
    hasPermission,
    getSecurityScore,

    // Refresh user data
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;