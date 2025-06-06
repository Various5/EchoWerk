// frontend/src/utils/errorHandler.js - Enhanced Error Handling Utility
import toast from 'react-hot-toast';

/**
 * Enhanced error handler for API responses and general errors
 */
export class ErrorHandler {
  static handleApiError(error) {
    console.error('API Error:', error);

    if (!error.response) {
      const message = 'Network connection failed. Please check your internet connection.';
      toast.error(message);
      return message;
    }

    const { status, data } = error.response;

    // Handle different error formats
    let message = 'An unexpected error occurred';

    if (typeof data === 'string') {
      message = data;
    } else if (data?.detail) {
      message = String(data.detail);
    } else if (data?.message) {
      message = String(data.message);
    } else if (data?.error) {
      message = String(data.error);
    } else {
      // Status-based messages
      switch (status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Authentication failed. Please sign in again.';
          break;
        case 403:
          message = 'Access denied. Please verify your account.';
          break;
        case 404:
          message = 'Resource not found. Please try again.';
          break;
        case 409:
          message = 'Resource already exists. Please use different details.';
          break;
        case 422:
          message = 'Invalid data provided. Please check your input.';
          break;
        case 429:
          message = 'Too many requests. Please wait before trying again.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 502:
          message = 'Service temporarily unavailable. Please try again.';
          break;
        case 503:
          message = 'Service maintenance in progress. Please try again later.';
          break;
        default:
          message = `Request failed with status ${status}`;
      }
    }

    toast.error(message);
    return message;
  }

  static handleAuthError(error) {
    const message = this.handleApiError(error);

    // Special handling for auth errors
    if (error.response?.status === 401) {
      // Clear auth data
      ['access_token', 'refresh_token', 'user'].forEach(key =>
        localStorage.removeItem(key)
      );

      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    return message;
  }

  static handleValidationError(error) {
    if (error.response?.status === 422 && error.response?.data?.detail) {
      const detail = error.response.data.detail;

      if (Array.isArray(detail)) {
        // Handle Pydantic validation errors
        const messages = detail.map(err => {
          const field = err.loc?.[err.loc.length - 1] || 'field';
          return `${field}: ${err.msg}`;
        });

        const message = messages.join(', ');
        toast.error(message);
        return message;
      }
    }

    return this.handleApiError(error);
  }

  static handleFormError(error, setError) {
    const message = this.handleApiError(error);

    // Try to map error to form fields
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail.toLowerCase();

      if (detail.includes('email')) {
        setError('email', { message });
      } else if (detail.includes('username')) {
        setError('username', { message });
      } else if (detail.includes('password')) {
        setError('password', { message });
      } else {
        setError('general', { message });
      }
    }

    return message;
  }

  static handleNetworkError() {
    const message = 'Network connection failed. Please check your internet connection and try again.';
    toast.error(message);
    return message;
  }

  static handleTimeoutError() {
    const message = 'Request timed out. Please try again.';
    toast.error(message);
    return message;
  }

  static handleFileUploadError(error) {
    let message = 'File upload failed';

    if (error.response?.status === 413) {
      message = 'File too large. Please choose a smaller file.';
    } else if (error.response?.status === 415) {
      message = 'File type not supported. Please choose a different file.';
    } else {
      message = this.handleApiError(error);
    }

    return message;
  }

  static success(message) {
    toast.success(message);
  }

  static info(message) {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#3b82f6',
      },
    });
  }

  static warning(message) {
    toast(message, {
      icon: '⚠️',
      style: {
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#f59e0b',
      },
    });
  }

  static loading(message = 'Processing...') {
    return toast.loading(message, {
      style: {
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: '#8b5cf6',
      },
    });
  }

  static dismiss(toastId) {
    toast.dismiss(toastId);
  }

  static dismissAll() {
    toast.dismiss();
  }
}

/**
 * React hook for error handling
 */
export const useErrorHandler = () => {
  const handleError = (error, options = {}) => {
    const { type = 'api', setError, showToast = true } = options;

    let message;

    switch (type) {
      case 'auth':
        message = ErrorHandler.handleAuthError(error);
        break;
      case 'validation':
        message = ErrorHandler.handleValidationError(error);
        break;
      case 'form':
        message = ErrorHandler.handleFormError(error, setError);
        break;
      case 'network':
        message = ErrorHandler.handleNetworkError();
        break;
      case 'timeout':
        message = ErrorHandler.handleTimeoutError();
        break;
      case 'upload':
        message = ErrorHandler.handleFileUploadError(error);
        break;
      default:
        message = showToast ? ErrorHandler.handleApiError(error) : error.message;
    }

    return message;
  };

  return {
    handleError,
    success: ErrorHandler.success,
    info: ErrorHandler.info,
    warning: ErrorHandler.warning,
    loading: ErrorHandler.loading,
    dismiss: ErrorHandler.dismiss,
    dismissAll: ErrorHandler.dismissAll,
  };
};

export default ErrorHandler;