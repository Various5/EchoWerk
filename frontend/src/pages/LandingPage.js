// src/pages/LandingPage.js - Futuristic Landing Experience
import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  Zap,
  Music,
  Lock,
  Smartphone,
  Mail,
  ArrowRight,
  Play,
  Brain,
  Cpu,
  Globe,
  Star,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Quantum Security",
      description: "Enterprise-grade authentication with neural encryption, quantum hashing, and dimensional security protocols.",
      gradient: "from-blue-400 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Neural Authentication",
      description: "TOTP-based consciousness verification with biometric patterns and quantum backup codes.",
      gradient: "from-purple-400 to-pink-500",
      delay: "200ms"
    },
    {
      icon: <Mail className="w-12 h-12" />,
      title: "Dimensional Messaging",
      description: "Secure interdimensional email verification with quantum templates and neural token management.",
      gradient: "from-green-400 to-blue-500",
      delay: "400ms"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Quantum Performance",
      description: "Built with FastAPI and async architecture for instantaneous response across all dimensions.",
      gradient: "from-yellow-400 to-orange-500",
      delay: "600ms"
    },
    {
      icon: <Music className="w-12 h-12" />,
      title: "Sonic Universe",
      description: "Designed for musical consciousness with scalable quantum database architecture and neural patterns.",
      gradient: "from-red-400 to-pink-500",
      delay: "800ms"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Metaverse Ready",
      description: "Your consciousness is protected across all realities with universe-standard encryption.",
      gradient: "from-indigo-400 to-purple-500",
      delay: "1000ms"
    }
  ];

  const stats = [
    { number: "∞", label: "Quantum Users", icon: <Star className="w-5 h-5" /> },
    { number: "99.9%", label: "Neural Uptime", icon: <Brain className="w-5 h-5" /> },
    { number: "0ms", label: "Quantum Latency", icon: <Zap className="w-5 h-5" /> },
    { number: "256-bit", label: "Dimensional Security", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="landing-page">
      {/* Quantum Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo flex items-center">
            <div className="w-8 h-8 bg-gradient-cyber rounded-lg flex items-center justify-center mr-2">
              <Music className="w-5 h-5 text-white" />
            </div>
            🎵 EchoWerk
          </Link>
          <ul className="nav-links">
            <li>
              <a href="#features" className="nav-link">Features</a>
            </li>
            <li>
              <a href="#about" className="nav-link">About</a>
            </li>
            <li>
              <Link to="/login" className="nav-link">
                Neural Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary">
                Join Quantum Realm
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero relative overflow-hidden" ref={heroRef}>
        {/* Animated Background Elements */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-neon-purple/20 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-neon-green/20 rounded-full blur-xl animate-ping"></div>
        </div>

        <div className="page-container relative z-10">
          <div className="hero-content text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full text-sm text-gray-300 mb-6">
                <Sparkles className="w-4 h-4 mr-2 text-neon-blue" />
                Welcome to the Future of Music Authentication
              </div>
            </div>

            <h1 className="hero-title mb-6">
              The Quantum Era of
              <br />
              <span className="gradient-text holographic-text" data-text="Musical Consciousness">
                Musical Consciousness
              </span>
            </h1>

            <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
              Experience the next evolution of music authentication with quantum-grade security,
              neural interfaces, and consciousness-aware technology. Built for creators, dreamers,
              and digital pioneers exploring infinite musical dimensions.
            </p>

            <div className="hero-actions mb-16">
              <Link to="/register" className="btn btn-primary btn-lg group mr-4">
                <span>Start Quantum Journey</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg group">
                <Play className="w-5 h-5 mr-2" />
                <span>Enter Neural Portal</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features py-32 relative">
        <div className="page-container">
          <div className="section-header text-center mb-20" data-animate id="features-header">
            <div className={`transition-all duration-1000 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
                Quantum-Powered
                <span className="gradient-text holographic-text block">Security Features</span>
              </h2>
              <p className="section-subtitle text-xl max-w-3xl mx-auto">
                Built with consciousness-aware technology and quantum security protocols
                for the ultimate musical authentication experience
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card glass-card group transition-all duration-700 hover:scale-105 ${
                  isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: isVisible[`feature-${index}`] ? feature.delay : '0ms'
                }}
                data-animate
                id={`feature-${index}`}
              >
                <div className={`feature-icon bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title text-xl font-bold mb-4 group-hover:text-neon-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="feature-description group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-900/30 relative">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-animate id="about-content">
              <div className={`transition-all duration-1000 ${isVisible['about-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-4xl font-bold mb-6">
                  Built for the
                  <span className="gradient-text block">Quantum Generation</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  EchoWerk represents the convergence of music, technology, and consciousness.
                  Our quantum authentication system provides unparalleled security while
                  maintaining the creative freedom that musicians and artists demand.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <Cpu className="w-6 h-6 text-neon-blue mr-3" />
                    <span>Neural-responsive authentication protocols</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-neon-green mr-3" />
                    <span>Quantum-encrypted data protection</span>
                  </div>
                  <div className="flex items-center">
                    <Music className="w-6 h-6 text-neon-purple mr-3" />
                    <span>Consciousness-aware music systems</span>
                  </div>
                </div>
                <Link to="/register" className="btn btn-accent group">
                  <span>Experience the Future</span>
                  <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform" />
                </Link>
              </div>
            </div>

            <div data-animate id="about-visual">
              <div className={`transition-all duration-1000 delay-300 ${isVisible['about-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-cyber rounded-2xl opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-24 h-24 text-neon-blue mx-auto mb-4 animate-spin" style={{ animationDuration: '20s' }} />
                      <p className="text-lg font-semibold">Quantum Realm</p>
                      <p className="text-gray-400">Infinite Possibilities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta py-32">
        <div className="page-container">
          <div className="cta-content glass-card text-center max-w-4xl mx-auto" data-animate id="cta-section">
            <div className={`transition-all duration-1000 ${isVisible['cta-section'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Enter the
                <span className="gradient-text holographic-text block">Quantum Music Dimension?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of conscious beings who trust our quantum authentication system
                to protect their musical identity across infinite dimensions.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register" className="btn btn-primary btn-lg group">
                  <span>Create Quantum Identity</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="btn btn-secondary btn-lg">
                  Explore Quantum Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-16 border-t border-gray-800">
        <div className="page-container">
          <div className="footer-content">
            <div className="footer-brand mb-8 lg:mb-0">
              <div className="nav-logo text-2xl mb-4">🎵 EchoWerk</div>
              <p className="text-gray-400 mb-4">
                Quantum authentication for the conscious musical era
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-neon-blue transition-colors cursor-pointer">
                  <span className="text-sm">⚡</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-neon-purple transition-colors cursor-pointer">
                  <span className="text-sm">🧠</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-neon-green transition-colors cursor-pointer">
                  <span className="text-sm">🌌</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="footer-section">
                <h4 className="font-semibold text-white mb-4">Quantum Product</h4>
                <div className="space-y-2">
                  <a href="#features" className="block text-gray-400 hover:text-neon-blue transition-colors">Features</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Security</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Documentation</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">API</a>
                </div>
              </div>

              <div className="footer-section">
                <h4 className="font-semibold text-white mb-4">Consciousness</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">About</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Neural Team</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Quantum Blog</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Careers</a>
                </div>
              </div>

              <div className="footer-section">
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Help Center</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Neural Support</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Contact</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Status</a>
                </div>
              </div>

              <div className="footer-section">
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link to="/privacy" className="block text-gray-400 hover:text-neon-blue transition-colors">Privacy</Link>
                  <Link to="/terms" className="block text-gray-400 hover:text-neon-blue transition-colors">Terms</Link>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Quantum Ethics</a>
                  <a href="#" className="block text-gray-400 hover:text-neon-blue transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom pt-8 mt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              &copy; 2025 EchoWerk. All rights reserved across all dimensions.
              <span className="text-neon-blue ml-2">Made with 🧠 for conscious beings</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;