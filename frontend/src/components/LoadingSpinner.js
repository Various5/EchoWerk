// src/components/LoadingSpinner.js
import React from 'react';
import { Loader2, Cpu, Zap } from 'lucide-react';

const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  variant = 'quantum',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerVariants = {
    simple: (
      <Loader2 className={`${sizeClasses[size]} animate-spin text-neon-blue`} />
    ),
    quantum: (
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-neon-blue/20 rounded-full animate-spin`}>
          <div className="absolute inset-1 border-4 border-neon-purple/40 rounded-full animate-spin"
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="absolute inset-1 bg-gradient-cyber rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    neural: (
      <div className="relative">
        <Cpu className={`${sizeClasses[size]} text-neon-blue animate-pulse`} />
        <div className="absolute inset-0 animate-ping">
          <Cpu className={`${sizeClasses[size]} text-neon-purple/50`} />
        </div>
      </div>
    ),
    energy: (
      <div className="relative">
        <Zap className={`${sizeClasses[size]} text-neon-green animate-bounce`} />
        <div className="absolute inset-0 animate-pulse">
          <Zap className={`${sizeClasses[size]} text-neon-yellow/60`} />
        </div>
      </div>
    )
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {spinnerVariants[variant]}
      {text && (
        <div className="text-center">
          <p className="text-gray-300 font-medium">{text}</p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Loading Screen Component
export const LoadingScreen = ({ message = 'Initializing quantum interface...' }) => (
  <div className="min-h-screen bg-void flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-spin"></div>
        {/* Middle Ring */}
        <div className="absolute inset-3 border-4 border-neon-purple/50 rounded-full animate-spin"
             style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        {/* Inner Ring */}
        <div className="absolute inset-6 border-2 border-neon-green/70 rounded-full animate-spin"
             style={{ animationDuration: '0.8s' }}></div>
        {/* Core */}
        <div className="absolute inset-8 bg-gradient-cyber rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 holographic-text">{message}</h2>
      <p className="text-gray-400 text-sm mb-6">Please wait while we establish your neural connection...</p>

      {/* Progress Simulation */}
      <div className="w-64 mx-auto">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Neural pathways</span>
          <span>∞%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Mini Loading Component for Buttons
export const ButtonSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
  );
};

// Page Loading Transition
export const PageLoader = () => (
  <div className="fixed inset-0 bg-void/90 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="glass-card p-8 text-center">
      <LoadingSpinner variant="quantum" size="lg" />
      <p className="text-gray-300 mt-4">Transitioning dimensions...</p>
    </div>
  </div>
);

export default LoadingSpinner;