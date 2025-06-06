// frontend/src/contexts/AuthContext.js - FIXED for Network and Validation Issues
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration - FIXED for different network setups
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('🌐 Using API URL:', API_BASE_URL);

// Enhanced error handler - FIXED for better error messages
const handleApiError = (error) => {
  console.error('🔥 API Error Details:');
  console.error('  Message:', error.message);
  console.error('  Response Status:', error.response?.status);
  console.error('  Response Data:', error.response?.data);

  // Handle network errors
  if (!error.response) {
    const message = `Unable to connect to the server at ${API_BASE_URL}. Please ensure the backend is running.`;
    console.error('❌ Network Error:', message);
    return message;
  }

  const { status, data } = error.response;
  let message = 'An unexpected error occurred';

  try {
    if (data && typeof data === 'object') {
      if (data.detail) {
        message = String(data.detail);
      } else if (data.message) {
        message = String(data.message);
      } else if (data.error) {
        message = String(data.error);
      } else {
        message = getStatusBasedMessage(status);
      }
    } else if (typeof data === 'string' && data.length > 0) {
      message = data;
    } else {
      message = getStatusBasedMessage(status);
    }

    // Ensure message is not too short or malformed
    if (message.length < 3 || message.trim() === '') {
      message = getStatusBasedMessage(status);
    }

  } catch (parseError) {
    console.error('Error parsing API response:', parseError);
    message = getStatusBasedMessage(status);
  }

  return message;
};

// Helper function for status-based messages
const getStatusBasedMessage = (status) => {
  const messages = {
    400: 'Invalid request. Please check your input.',
    401: 'Invalid email or password. Please check your credentials.',
    403: 'Access denied. Please verify your account or contact support.',
    404: 'Service not found. Please try again later.',
    409: 'Email or username already exists. Please use different credentials.',
    422: 'Validation failed. Please check all required fields.',
    429: 'Too many requests. Please wait before trying again.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again.',
    503: 'Service maintenance in progress. Please try again later.',
  };

  return messages[status] || `Request failed (${status}). Please try again.`;
};

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
  withCredentials: false, // Don't send cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);

    // Log data but hide sensitive fields
    if (config.data && config.method !== 'get') {
      const logData = { ...config.data };
      if (logData.password) logData.password = '[HIDDEN]';
      console.log('📤 Request data:', logData);
    }

    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response ${response.status}: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`📥 Response Error ${error.response?.status}: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);

    const originalRequest = error.config;

    // Handle 401 with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          console.log('🔄 Attempting token refresh...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          console.log('✅ Token refreshed successfully');

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          // Clear auth data and redirect
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
      console.log('🔄 Initializing authentication...');
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Verify token with backend
          const response = await api.get('/auth/me');
          const currentUser = response.data;

          // Update stored user data
          localStorage.setItem('user', JSON.stringify(currentUser));
          setUser(currentUser);
          console.log('✅ Auth initialized successfully:', currentUser.email);
        } catch (error) {
          console.log('⚠️ Token verification failed, clearing auth data');
          ['access_token', 'refresh_token', 'user'].forEach(key =>
            localStorage.removeItem(key)
          );
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('ℹ️ No stored authentication found');
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function - FIXED for proper validation
  const login = async (email, password, totpCode = null, backupCode = null) => {
    try {
      setLoading(true);
      console.log('🚀 Login attempt for:', email);

      // Validate required fields
      if (!email || !email.trim()) {
        const message = 'Email address is required';
        toast.error(message);
        return { success: false, error: message };
      }

      if (!password) {
        const message = 'Password is required';
        toast.error(message);
        return { success: false, error: message };
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        const message = 'Please enter a valid email address';
        toast.error(message);
        return { success: false, error: message };
      }

      // CRITICAL: Only send fields that have actual values
      // Never send null or undefined to avoid Pydantic validation issues
      const loginData = {
        email: email.trim(),
        password: password
      };

      // Only add optional fields if they have real values
      if (totpCode && totpCode.trim() && totpCode.trim().length > 0) {
        loginData.totp_code = totpCode.trim();
      }

      if (backupCode && backupCode.trim() && backupCode.trim().length > 0) {
        loginData.backup_code = backupCode.trim();
      }

      console.log('📤 Sending clean login data:', {
        ...loginData,
        password: '[HIDDEN]'
      });

      // Make API request
      const response = await api.post('/auth/login', loginData);
      const data = response.data;

      console.log('📥 Login response:', {
        success: data.success,
        requires_2fa: data.requires_2fa,
        message: data.message
      });

      // Handle 2FA requirement
      if (data.requires_2fa) {
        console.log('🔐 2FA required');
        return {
          success: false,
          requires2FA: true,
          message: 'Two-factor authentication code required'
        };
      }

      // Handle successful login
      if (data.success && data.access_token && data.user) {
        console.log('✅ Login successful');

        // Store tokens and user data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        const welcomeMessage = `Welcome back, ${data.user.first_name || data.user.username}!`;
        toast.success(welcomeMessage);

        return { success: true, user: data.user };
      }

      // Handle failed login
      const message = data.message || 'Login failed. Please check your credentials.';
      console.log('❌ Login failed:', message);
      return { success: false, error: message };

    } catch (error) {
      console.error('💥 Login error:', error);
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function - FIXED for proper validation
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🚀 Registration attempt...');

      // Validate all required fields
      const requiredFields = ['email', 'username', 'password', 'first_name', 'last_name'];
      const missingFields = requiredFields.filter(field =>
        !userData[field] || !userData[field].toString().trim()
      );

      if (missingFields.length > 0) {
        const message = `Missing required fields: ${missingFields.join(', ')}`;
        console.error('❌ Validation error:', message);
        toast.error(message);
        return { success: false, error: message };
      }

      // Clean and validate data
      const cleanData = {
        email: userData.email.trim(),
        username: userData.username.trim(),
        password: userData.password,
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim()
      };

      // Additional validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanData.email)) {
        const message = 'Please enter a valid email address';
        toast.error(message);
        return { success: false, error: message };
      }

      if (cleanData.username.length < 3) {
        const message = 'Username must be at least 3 characters long';
        toast.error(message);
        return { success: false, error: message };
      }

      if (cleanData.password.length < 8) {
        const message = 'Password must be at least 8 characters long';
        toast.error(message);
        return { success: false, error: message };
      }

      console.log('📤 Sending registration data:', {
        ...cleanData,
        password: '[HIDDEN]'
      });

      const response = await api.post('/auth/register', cleanData);
      const data = response.data;

      if (data.success) {
        console.log('✅ Registration successful');
        toast.success('Account created successfully! Please check your email to verify your account.');
        return { success: true, message: data.message };
      }

      const message = data.message || 'Registration failed. Please try again.';
      return { success: false, error: message };

    } catch (error) {
      console.error('💥 Registration error:', error);
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Try to call logout endpoint (optional)
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.warn('Logout endpoint failed:', error.message);
      }
    } finally {
      // Always clear local data
      ['access_token', 'refresh_token', 'user'].forEach(key =>
        localStorage.removeItem(key)
      );
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Successfully signed out');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      console.log('🔄 Updating profile...');

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

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      console.log('🔄 Changing password...');

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

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      console.log('🔄 Requesting password reset...');

      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent! Please check your inbox.');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      console.log('🔄 Resetting password...');

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

  // Resend verification email
  const resendVerification = async () => {
    try {
      setLoading(true);
      console.log('🔄 Resending verification email...');

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
    } finally {
      setLoading(false);
    }
  };

  // Calculate security score
  const getSecurityScore = () => {
    if (!user) return 0;
    let score = 20; // Base score
    if (user.is_verified) score += 40;
    if (user.is_2fa_enabled) score += 40;
    return Math.min(score, 100);
  };

  // Context value
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