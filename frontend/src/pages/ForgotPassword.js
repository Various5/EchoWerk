// src/pages/ForgotPassword.js - Quantum Password Recovery
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, Zap, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { requestPasswordReset, loading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const email = watch('email');

  const onSubmit = async (data) => {
    const result = await requestPasswordReset(data.email);
    if (result.success) {
      setEmailSent(true);
      setSentEmail(data.email);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="glass-card auth-card text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="auth-title holographic-text">Quantum Link Sent</h1>
          <p className="auth-subtitle mb-6">
            A quantum recovery transmission has been sent to{' '}
            <span className="text-neon-blue font-semibold">{sentEmail}</span>
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                ⚡ Check your quantum inbox and follow the neural pathway to reset your passphrase.
                The link will expire in 1 hour for security.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="btn btn-primary flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Login
              </Link>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setSentEmail('');
                }}
                className="btn btn-secondary"
              >
                Send Another Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-secondary flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="auth-title">Quantum Recovery</h1>
          <p className="auth-subtitle">
            🔄 Reset your neural passphrase using quantum entanglement technology
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="w-4 h-4" />
              <span>Neural Link Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className={`form-input pl-12 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your quantum email address"
                {...register('email', {
                  required: 'Neural link address is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid quantum address'
                  }
                })}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              {email && email.includes('@') && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            {errors.email && (
              <div className="form-error">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  <span>Sending quantum transmission...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  <span>Send Recovery Link</span>
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-neon-blue hover:text-neon-purple transition-colors inline-flex items-center group"
            >
              <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
              Remember your passphrase? Return to login
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <div className="text-center p-4 bg-gray-900/20 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-2">
              🛡️ Quantum Security Protocol
            </p>
            <p className="text-xs text-gray-500">
              Recovery links are encrypted and expire in 1 hour for maximum security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;