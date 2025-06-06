// src/pages/VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  Mail,
  Loader,
  ArrowLeft,
  RefreshCw
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

      // Extract email from error or use a modal to ask for email
      // For now, we'll redirect to a resend page
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
            <div className="text-6xl mb-6">
              <Loader className="w-16 h-16 animate-spin text-blue-400 mx-auto" />
            </div>
            <h1 className="auth-title">Verifying Your Email</h1>
            <p className="auth-subtitle">
              Please wait while we verify your email address...
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            </div>
            <h1 className="auth-title text-green-400">Email Verified!</h1>
            <p className="auth-subtitle">
              {message}
            </p>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-center text-green-300">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Your account is now fully activated</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-gray-400 text-sm">
                You will be redirected to the login page in a few seconds...
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login" className="btn btn-primary">
                  Continue to Login
                </Link>
                <Link to="/dashboard" className="btn btn-secondary">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">
              <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            </div>
            <h1 className="auth-title text-red-400">Verification Failed</h1>
            <p className="auth-subtitle">
              {message}
            </p>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-6">
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

            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="btn btn-primary"
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
                  className="btn btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>

              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center mt-4"
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
    <div className="auth-container fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="text-center mb-6">
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-lg font-semibold text-blue-400">EchoWerk</div>
          </div>
        </div>

        {renderContent()}

        {/* Help Section */}
        {verificationStatus === 'error' && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-center">
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
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute -top-40 -right-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse ${
          verificationStatus === 'success' ? 'bg-green-500' : 
          verificationStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}></div>
        <div className={`absolute -bottom-40 -left-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse ${
          verificationStatus === 'success' ? 'bg-emerald-500' : 
          verificationStatus === 'error' ? 'bg-orange-500' : 'bg-purple-500'
        }`}></div>
      </div>
    </div>
  );
};

export default VerifyEmail;