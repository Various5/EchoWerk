// frontend/src/pages/LandingPage.js - Modern Interactive Landing Page
import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import { useMousePosition } from '../hooks/useMousePosition';
import {
  Shield,
  Music,
  Lock,
  Smartphone,
  Mail,
  ArrowRight,
  Play,
  Globe,
  Star,
  ChevronDown,
  Users,
  Headphones,
  Upload,
  Heart,
  Zap,
  Brain,
  Eye,
  Sparkles,
  Cpu,
  Activity,
  Radio,
  Volume2,
  Award,
  Target,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const mousePosition = useMousePosition();
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
      icon: <Brain className="w-12 h-12" />,
      title: "Neural Authentication",
      description: "AI-powered security with advanced pattern recognition and behavioral analysis.",
      gradient: "from-blue-400 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Quantum Security",
      description: "Military-grade encryption with quantum-resistant algorithms for ultimate protection.",
      gradient: "from-purple-400 to-pink-500",
      delay: "200ms"
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Smart 2FA",
      description: "Intelligent two-factor authentication with biometric integration and smart codes.",
      gradient: "from-green-400 to-blue-500",
      delay: "400ms"
    },
    {
      icon: <Music className="w-12 h-12" />,
      title: "Neural Music Engine",
      description: "AI-powered music management with smart recommendations and audio enhancement.",
      gradient: "from-yellow-400 to-orange-500",
      delay: "600ms"
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Quantum Processing",
      description: "Lightning-fast audio processing with quantum computing acceleration.",
      gradient: "from-red-400 to-pink-500",
      delay: "800ms"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Universal Sync",
      description: "Seamless synchronization across all devices with real-time neural networks.",
      gradient: "from-indigo-400 to-purple-500",
      delay: "1000ms"
    }
  ];

  const stats = [
    { number: "50K+", label: "Neural Users", icon: <Users className="w-5 h-5" /> },
    { number: "99.99%", label: "Quantum Uptime", icon: <Shield className="w-5 h-5" /> },
    { number: "<1ms", label: "Neural Response", icon: <Zap className="w-5 h-5" /> },
    { number: "AES-256", label: "Quantum Encryption", icon: <Lock className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Music Producer",
      avatar: "AC",
      content: "EchoWerk's neural interface revolutionized my workflow. The AI recommendations are incredibly accurate.",
      rating: 5
    },
    {
      name: "Sarah Rodriguez",
      role: "Audio Engineer",
      avatar: "SR",
      content: "The quantum security gives me peace of mind. My entire music library is protected with military-grade encryption.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "DJ & Artist",
      avatar: "DK",
      content: "The neural music engine understands my style better than I do. It's like having an AI assistant for creativity.",
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Interactive Background */}
      <ParticleBackground
        particleCount={60}
        connectionDistance={120}
        particleColor="rgba(59, 130, 246, 0.4)"
        lineColor="rgba(59, 130, 246, 0.1)"
        speed={0.3}
        interactive={true}
      />

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo flex items-center group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">EchoWerk</span>
          </Link>
          <ul className="nav-links">
            <li>
              <a href="#features" className="nav-link">Neural Features</a>
            </li>
            <li>
              <a href="#about" className="nav-link">Quantum Tech</a>
            </li>
            <li>
              <a href="#testimonials" className="nav-link">Neural Reviews</a>
            </li>
            <li>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary group">
                <span>Join Neural Network</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero relative overflow-hidden" ref={heroRef}>
        {/* Mouse Follow Effect */}
        {mousePosition.x && mousePosition.y && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: mousePosition.x - 50,
              top: mousePosition.y - 50,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              transition: 'all 0.1s ease-out'
            }}
          />
        )}

        {/* Animated Background Elements */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="page-container relative z-10">
          <div className="hero-content text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 glass rounded-full text-sm text-gray-300 mb-6 animate-slideUp">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                Neural Music Platform of 2025
                <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">LIVE</span>
              </div>
            </div>

            <h1 className="hero-title mb-6 animate-slideUp">
              The Future of
              <br />
              <span className="text-gradient relative">
                Neural Music
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              </span>
            </h1>

            <p className="hero-subtitle mb-12 max-w-3xl mx-auto animate-slideUp" style={{ animationDelay: '200ms' }}>
              Experience revolutionary music management with quantum security, AI-powered recommendations,
              and neural network synchronization. Join the next evolution of digital music.
            </p>

            <div className="hero-actions mb-16 animate-slideUp" style={{ animationDelay: '400ms' }}>
              <Link to="/register" className="btn btn-primary btn-lg group mr-4">
                <Brain className="w-5 h-5 mr-2" />
                <span>Join Neural Network</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg group">
                <Play className="w-5 h-5 mr-2" />
                <span>Access Interface</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slideUp" style={{ animationDelay: '600ms' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center mb-2 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
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
      <section id="features" className="py-32 relative">
        <div className="page-container">
          <div className="section-header text-center mb-20" data-animate id="features-header">
            <div className={`transition-all duration-1000 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Neural Features
                <span className="text-gradient block">For the Future</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">
                Advanced AI-powered capabilities that redefine how you experience and manage music
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
                <div className="relative z-10">
                  <div className={`feature-icon bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative`}>
                    {feature.icon}
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="feature-title text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="feature-description group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent"></div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 relative">
        <div className="page-container">
          <div className="section-header text-center mb-20" data-animate id="testimonials-header">
            <div className={`transition-all duration-1000 ${isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Neural Reviews
                <span className="text-gradient block">From Our Community</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">
                See what creators are saying about the neural music experience
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`glass-card p-6 group hover:scale-105 transition-all duration-500 ${
                  isVisible[`testimonial-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                data-animate
                id={`testimonial-${index}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-300 group-hover:text-white transition-colors">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="page-container">
          <div className="cta-content glass-card text-center max-w-4xl mx-auto relative overflow-hidden" data-animate id="cta-section">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>

            <div className={`relative z-10 transition-all duration-1000 ${isVisible['cta-section'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Join the
                <span className="text-gradient block">Neural Revolution?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Experience the future of music with advanced AI, quantum security, and neural synchronization.
                Join thousands of creators in the next dimension of digital music.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register" className="btn btn-primary btn-xl group">
                  <Brain className="w-5 h-5 mr-2" />
                  <span>Enter Neural Network</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="btn btn-secondary btn-xl group">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>Explore Features</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="nav-logo text-2xl mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <Music className="w-5 h-5 text-white" />
                </div>
                EchoWerk
              </div>
              <p className="text-gray-400 mb-4">
                Neural music platform with quantum security and AI-powered features
              </p>
              <div className="flex space-x-4">
                {[Brain, Music, Shield].map((Icon, index) => (
                  <div key={index} className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                    <Icon className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Neural Platform</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-blue-400 transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Security</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">API</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Documentation</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quantum Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Status</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal Matrix</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-400 hover:text-blue-400 transition-colors">Privacy</Link>
                <Link to="/terms" className="block text-gray-400 hover:text-blue-400 transition-colors">Terms</Link>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Security</a>
                <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">Compliance</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-gray-500">
              &copy; 2025 EchoWerk Neural Technologies. All quantum rights reserved.
              <span className="text-blue-400 ml-2">Powered by Neural Networks ⚡</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;