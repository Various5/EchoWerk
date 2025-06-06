// frontend/src/pages/ForgotPassword.js - Clean Forgot Password
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Send,
  Music
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link
                to="/"
                className="flex items-center text-white hover:text-blue-400 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EchoWerk</span>
              </Link>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Check Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              We've sent password reset instructions to your email
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Email Sent Successfully
              </h3>

              <p className="text-gray-400 mb-4">
                We've sent password reset instructions to:
              </p>

              <p className="text-blue-400 font-medium text-lg mb-6">
                {sentEmail}
              </p>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start text-left">
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

              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Didn't receive the email?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center text-white hover:text-blue-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EchoWerk</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-3 py-2 pl-10 bg-slate-700 border ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
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
        </div>

        {/* Footer Links */}
        <div className="space-y-4">
          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;