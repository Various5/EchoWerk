// src/components/ErrorBoundary.js
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
        <div className="min-h-screen flex items-center justify-center bg-void">
          <div className="glass-card p-8 max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Quantum Anomaly Detected</h1>
            <p className="text-gray-400 mb-6">
              A temporal rift has occurred in the matrix. Our quantum engineers are investigating
              the dimensional instability.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restore Quantum State
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn btn-secondary w-full flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Origin
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-300">
                  Technical Quantum Data
                </summary>
                <div className="mt-3 p-4 bg-gray-900 rounded-lg overflow-auto max-h-40">
                  <pre className="text-xs text-red-400 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;