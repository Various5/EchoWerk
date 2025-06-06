// frontend/src/pages/LandingPage.js - Professional Landing Page with Animations
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Music,
  Users,
  Zap,
  Star,
  Globe,
  Database
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "Enterprise-grade security with email verification and two-factor authentication",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Data Protection",
      description: "Your data is encrypted and protected with industry-standard security measures",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Two-Factor Auth",
      description: "Add an extra layer of security with TOTP-based two-factor authentication",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Verification",
      description: "Secure email verification system to protect your account from unauthorized access",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    "Secure user authentication and authorization",
    "Email verification with customizable templates",
    "Two-factor authentication (TOTP)",
    "Password reset and recovery",
    "Session management and security",
    "Rate limiting and abuse prevention"
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "10K+", label: "Active Users" },
    { icon: <Shield className="w-6 h-6" />, number: "99.9%", label: "Security Score" },
    { icon: <Globe className="w-6 h-6" />, number: "50+", label: "Countries" },
    { icon: <Database className="w-6 h-6" />, number: "1M+", label: "Secure Sessions" }
  ];

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 logo-animated">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-animated">EchoWerk</span>
            </div>
            <div className="flex items-center space-x-4 animate-slide-in">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 transition-colors hover-lift"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors btn-animated hover-glow"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-animated">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Authentication
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-shimmer">
                for Music Applications
              </span>
            </h1>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              EchoWerk provides enterprise-grade authentication and security features
              specifically designed for music and media applications.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{animationDelay: '0.4s'}}>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center btn-animated hover-lift"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2 animate-float" />
            </Link>
            <Link
              to="/login"
              className="border border-gray-600 hover:border-gray-500 px-8 py-3 rounded-lg font-semibold text-lg transition-colors hover:bg-gray-800 hover-lift"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-in hover-lift"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 logo-animated">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Authentication Features
            </h2>
            <p className="text-xl text-gray-300">
              Built with security and developer experience in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 feature-card hover-glow animate-slide-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 logo-animated`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose EchoWerk?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get started quickly with a comprehensive authentication system
                that handles security so you can focus on building your application.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center animate-slide-in hover-lift"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 animate-pulse" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 card-animated hover-glow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 logo-animated">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Security First</h3>
                <p className="text-gray-300 mb-6">
                  Every feature is built with security as the foundation,
                  ensuring your users' data is always protected.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="animate-float">
                    <div className="text-2xl font-bold text-blue-400">256-bit</div>
                    <div className="text-xs text-gray-400">Encryption</div>
                  </div>
                  <div className="animate-float" style={{animationDelay: '0.5s'}}>
                    <div className="text-2xl font-bold text-green-400">2FA</div>
                    <div className="text-xs text-gray-400">Protected</div>
                  </div>
                  <div className="animate-float" style={{animationDelay: '1s'}}>
                    <div className="text-2xl font-bold text-purple-400">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Developers
            </h2>
            <p className="text-xl text-gray-300">
              See what developers are saying about EchoWerk
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Lead Developer",
                comment: "EchoWerk made implementing secure auth incredibly easy. The 2FA integration was seamless.",
                rating: 5
              },
              {
                name: "Sarah Johnson",
                role: "Product Manager",
                comment: "The security features are top-notch. Our users feel confident with EchoWerk protecting their accounts.",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "CTO",
                comment: "Best authentication solution we've used. The documentation and support are excellent.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-slide-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your account and experience secure authentication in minutes.
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center btn-animated hover-lift"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5 ml-2 animate-float" />
            </Link>
          </div>
        </div>

        {/* Background Animation Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="animate-fade-in">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2 logo-animated">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">EchoWerk</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure authentication platform for modern applications.
              </p>
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 animate-fade-in">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 EchoWerk. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;