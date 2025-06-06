// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';

const ForgotPassword = () => {
  const { requestPasswordReset, loading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const onSubmit = async (data) => {
    clearErrors();

    const result = await requestPasswordReset(data.email);

    if (result.success) {
      setEmailSent(true);
      setSentEmail(data.email);
    } else {
      setError('email', { message: result.error });
    }
  };

  const handleResendEmail = async () => {
    if (sentEmail) {
      const result = await requestPasswordReset(sentEmail);
      if (!result.success) {
        setError('email', { message: result.error });
      }
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container fade-in">
        <div className="glass-card auth-card">
          <div className="auth-header text-center">
            <div className="text-6xl mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            </div>
            <h1 className="auth-title text-green-400">Check Your Email</h1>
            <p className="auth-subtitle">
              We've sent password reset instructions to:
            </p>
            <p className="text-blue-400 font-medium text-lg mt-2">
              {sentEmail}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-2">What to do next:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-400">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Follow the instructions to create a new password</li>
                    <li>The link will expire in 1 hour for security</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Didn't receive the email?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resend Email
                    </>
                  )}
                </button>

                <Link to="/contact" className="btn btn-ghost text-sm">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          <div className="auth-footer">
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email && (
              <p className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reset Link
                </>
              )}
            </button>
          </div>

          {/* Security Information */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-300">
                <p className="font-medium mb-1">Security Notice:</p>
                <p className="text-amber-400">
                  If an account with this email exists, you'll receive password reset instructions.
                  The reset link will expire in 1 hour for your security.
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="auth-footer space-y-4">
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center space-y-2">
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>

            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;