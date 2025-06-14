// frontend/src/pages/VerifyEmail.js - Clean Email Verification
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  Mail,
  Loader,
  ArrowLeft,
  RefreshCw,
  Music
} from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus('loading');

      const response = await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);

      if (response.status === 200) {
        setVerificationStatus('success');
        setMessage('Your email has been successfully verified!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Email verified successfully! You can now sign in.',
              type: 'success'
            }
          });
        }, 3000);
      }
    } catch (error) {
      setVerificationStatus('error');

      if (error.response?.status === 400) {
        const errorDetail = error.response.data?.detail;
        if (errorDetail?.includes('already used')) {
          setMessage('This verification link has already been used.');
        } else if (errorDetail?.includes('expired')) {
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setMessage('Invalid verification link.');
        }
      } else {
        setMessage('An error occurred during email verification. Please try again.');
      }
    }
  };

  const resendVerification = async () => {
    try {
      setIsResending(true);
      navigate('/resend-verification');
    } catch (error) {
      console.error('Failed to resend verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <Loader className="w-16 h-16 animate-spin text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Verifying Your Email
            </h2>
            <p className="text-gray-400 mb-6">
              Please wait while we verify your email address...
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-6">
              {message}
            </p>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center text-green-300">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Your account is now fully activated</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You will be redirected to the login page in a few seconds...
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continue to Login
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-6">
              {message}
            </p>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start text-left">
                <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-300">
                  <p className="font-medium mb-2">Possible reasons:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-400">
                    <li>The verification link has expired (valid for 24 hours)</li>
                    <li>The link has already been used</li>
                    <li>The link is malformed or incomplete</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isResending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Request New Link
                    </>
                  )}
                </button>

                <button
                  onClick={verifyEmail}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>

              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        </div>

        {/* Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {renderContent()}
        </div>

        {/* Help Section */}
        {verificationStatus === 'error' && (
          <div className="text-center pt-6 border-t border-slate-700">
            <p className="text-sm text-gray-400 mb-3">
              Still having trouble?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <Link
                to="/contact"
                className="text-blue-400 hover:text-blue-300"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link
                to="/help"
                className="text-blue-400 hover:text-blue-300"
              >
                Help Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;