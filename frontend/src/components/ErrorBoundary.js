// frontend/src/components/ErrorBoundary.js - Clean Error Boundary
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo);
      // TODO: Send to error reporting service (Sentry, etc.)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.FallbackComponent) {
        return (
          <this.props.FallbackComponent
            error={this.state.error}
            resetErrorBoundary={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">
                Something went wrong
              </h1>

              <p className="text-gray-400 mb-6">
                An unexpected error occurred. Our team has been notified and is working on a fix.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 mb-2">
                    Technical Details (Development)
                  </summary>
                  <div className="p-4 bg-slate-900 rounded-lg overflow-auto max-h-40">
                    <pre className="text-xs text-red-400 whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple functional error fallback component
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h2>

          <p className="text-gray-400 mb-6">
            We're sorry for the inconvenience. Please try refreshing the page or go back to the homepage.
          </p>

          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;