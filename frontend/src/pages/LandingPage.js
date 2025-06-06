// src/pages/LandingPage.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Zap, Music, Lock, Smartphone, Mail } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Advanced authentication with Argon2 hashing, JWT tokens, and comprehensive security measures."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Two-Factor Authentication",
      description: "TOTP-based 2FA with QR codes and backup codes for ultimate account protection."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Verification",
      description: "Secure email verification system with professional templates and token management."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Performance",
      description: "Built with FastAPI and async architecture for lightning-fast response times."
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Music Ready",
      description: "Designed specifically for music applications with scalable database architecture."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data is protected with industry-standard encryption and secure session management."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            🎵 EchoWerk
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="page-container">
          <div className="hero-content text-center">
            <h1 className="hero-title">
              The Future of
              <span className="gradient-text"> Music Authentication</span>
            </h1>
            <p className="hero-subtitle">
              Experience enterprise-grade security with a futuristic interface. 
              Built for the next generation of music applications.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Your Journey
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="page-container">
          <div className="section-header text-center">
            <h2 className="section-title">Advanced Security Features</h2>
            <p className="section-subtitle">
              Built with modern security practices and cutting-edge technology
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card glass-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="page-container">
          <div className="cta-content glass-card">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of users who trust our secure authentication system
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="nav-logo">🎵 EchoWerk</div>
              <p>Secure authentication for the music era</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#security">Security</a>
                <a href="#docs">Documentation</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 EchoWerk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;