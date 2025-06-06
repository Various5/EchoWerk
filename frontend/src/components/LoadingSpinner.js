// frontend/src/components/LoadingSpinner.js - Simple Loading Spinner
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500 ${className}`} />
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {spinner}
      {text && (
        <p className="text-gray-400 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Page Loading Screen
export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
      <p className="text-gray-400">Please wait...</p>
    </div>
  </div>
);

// Button Spinner for loading states
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}></div>
  );
};

export default LoadingSpinner;