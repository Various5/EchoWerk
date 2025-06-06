// src/pages/Dashboard.js - Futuristic Music Control Center
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Settings,
  Shield,
  Music,
  Play,
  Headphones,
  Plus,
  Search,
  Heart,
  TrendingUp,
  LogOut,
  Bell,
  Mic,
  Radio,
  Disc,
  Volume2,
  Zap,
  Brain,
  Cpu,
  Activity,
  Waves,
  BarChart3,
  Calendar,
  Clock,
  Star,
  Download,
  Upload,
  Eye,
  Sparkles,
  Rocket,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(75);
  const [activeModule, setActiveModule] = useState('overview');
  const dashboardRef = useRef(null);

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setNeuralActivity(prev => {
        const delta = (Math.random() - 0.5) * 10;
        return Math.max(20, Math.min(100, prev + delta));
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation on mount
  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.classList.add('fade-in');
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'Q';
  };

  const quantumFeatures = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Quantum Player",
      description: "Neural-responsive audio with quantum sound processing",
      status: "active",
      progress: 85
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Discovery",
      description: "Consciousness-aware music recommendations",
      status: "learning",
      progress: 65
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Quantum Waves",
      description: "Frequency-based emotion synchronization",
      status: "syncing",
      progress: 92
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Neural Engine",
      description: "Advanced audio processing and enhancement",
      status: "processing",
      progress: 78
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Spatial Audio",
      description: "3D immersive sound environments",
      status: "active",
      progress: 95
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Metaverse Hub",
      description: "Connect to musical dimensions",
      status: "connecting",
      progress: 45
    }
  ];

  const stats = [
    { label: "Tracks Synced", value: "1,337", icon: <Music className="w-5 h-5" />, change: "+23%" },
    { label: "Neural Hours", value: "42.5h", icon: <Brain className="w-5 h-5" />, change: "+12%" },
    { label: "Quantum Score", value: "9.8k", icon: <Zap className="w-5 h-5" />, change: "+8%" },
    { label: "Dimension Level", value: "∞", icon: <Sparkles className="w-5 h-5" />, change: "MAX" }
  ];

  const recentActivity = [
    { action: "Neural sync with", track: "Quantum Frequencies", time: "2 min ago", type: "sync" },
    { action: "Discovered new dimension", track: "Cosmic Beats Realm", time: "5 min ago", type: "discovery" },
    { action: "Enhanced frequency", track: "Digital Dreams", time: "12 min ago", type: "enhancement" },
    { action: "Shared neural pattern", track: "Synthetic Emotions", time: "1 hour ago", type: "share" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'learning': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'syncing': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'connecting': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen" ref={dashboardRef}>
      {/* Quantum Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo flex items-center">
            <div className="w-8 h-8 bg-gradient-cyber rounded-lg flex items-center justify-center mr-2">
              <Music className="w-5 h-5 text-white" />
            </div>
            🎵 EchoWerk Quantum
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link active flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Command Center
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link flex items-center">
                <User className="w-4 h-4 mr-1" />
                Neural Profile
              </Link>
            </li>
            <li>
              <button className="btn btn-secondary btn-sm flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Alerts
                <span className="ml-1 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm flex items-center">
                <LogOut className="w-4 h-4 mr-1" />
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="dashboard">
        <div className="page-container">
          {/* Command Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title flex items-center">
                <span>Welcome back,</span>
                <span className="ml-2 gradient-text">{user?.first_name || user?.username}</span>
                <Rocket className="w-8 h-8 ml-3 text-neon-blue animate-pulse" />
              </h1>
              <p className="text-gray-400 flex items-center mt-2">
                <Clock className="w-4 h-4 mr-2" />
                Neural Link Active • {currentTime.toLocaleTimeString()}
                <span className="ml-4 flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-green-400" />
                  Brain Activity: {neuralActivity.toFixed(1)}%
                </span>
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-secondary flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Quantum Search
              </button>
              <Link to="/profile" className="btn btn-primary flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Neural Settings
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-xs text-green-400 font-mono">{stat.change}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Central Control Panel */}
            <div className="main-content">
              {/* Module Selector */}
              <div className="flex space-x-1 mb-6 p-1 bg-gray-800/50 rounded-lg">
                {['overview', 'music', 'neural', 'quantum'].map((module) => (
                  <button
                    key={module}
                    onClick={() => setActiveModule(module)}
                    className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 capitalize ${
                      activeModule === module
                        ? 'bg-gradient-primary text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {module}
                  </button>
                ))}
              </div>

              {/* Active Module Content */}
              {activeModule === 'overview' && (
                <div className="space-y-6">
                  {/* Quantum Features Grid */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Cpu className="w-5 h-5 mr-2 text-neon-blue" />
                        Quantum Systems Status
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quantumFeatures.map((feature, index) => (
                        <div key={index} className="feature-card glass-card group">
                          <div className="feature-icon bg-gradient-secondary mb-4">
                            {feature.icon}
                          </div>
                          <h3 className="feature-title">{feature.title}</h3>
                          <p className="feature-description mb-4">{feature.description}</p>

                          {/* Status Badge */}
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(feature.status)} mb-3`}>
                            <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                            {feature.status}
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Performance</span>
                              <span>{feature.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className="h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-1000"
                                style={{ width: `${feature.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Neural Visualization */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-neon-purple" />
                        Neural Activity Monitor
                      </h2>
                    </div>
                    <div className="relative h-64 bg-gray-900/50 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full border-4 border-neon-blue/30 flex items-center justify-center mb-4 relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-cyber flex items-center justify-center">
                              <Brain className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-neon-purple opacity-50 animate-ping"></div>
                          </div>
                          <p className="text-2xl font-bold text-neon-blue mb-1">{neuralActivity.toFixed(1)}%</p>
                          <p className="text-gray-400">Active Synchronization</p>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Real-time Brainwave Sync</span>
                          <span className="text-green-400">● ONLINE</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-1000"
                            style={{ width: `${neuralActivity}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'music' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Music className="w-5 h-5 mr-2 text-neon-green" />
                      Quantum Music Center
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-accent rounded-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 holographic-text">Music Universe Loading...</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Your personal music cosmos is being generated. Neural patterns are being analyzed to create the perfect sonic experience.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="btn btn-primary flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Tracks
                      </button>
                      <button className="btn btn-secondary flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Discover Music
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'neural' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-neon-purple" />
                      Neural Interface
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-purple-500/20">
                        <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Brainwave Sync</h4>
                        <p className="text-2xl font-bold text-purple-400">Alpha</p>
                      </div>
                      <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-blue-500/20">
                        <Waves className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Frequency</h4>
                        <p className="text-2xl font-bold text-blue-400">432Hz</p>
                      </div>
                      <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-green-500/20">
                        <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Energy Level</h4>
                        <p className="text-2xl font-bold text-green-400">High</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'quantum' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-neon-blue" />
                      Quantum Dimensions
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-holographic rounded-full animate-spin opacity-75"></div>
                      <div className="relative w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                        <Globe className="w-16 h-16 text-neon-blue" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Exploring Infinite Dimensions</h3>
                    <p className="text-gray-400 mb-8">
                      Quantum entanglement with musical universes in progress...
                    </p>
                    <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-gradient-holographic animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantum Sidebar */}
            <div className="sidebar">
              {/* User Quantum Profile */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Quantum Profile
                  </h3>
                </div>
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="avatar mb-0">
                      {getUserInitials(user)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">@{user?.username}</p>
                  <p className="text-gray-500 text-xs mb-4">{user?.email}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Neural Status:</span>
                      <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                        {user?.is_verified ? 'Synced' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Quantum Guard:</span>
                      <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                        {user?.is_2fa_enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Join Date:</span>
                      <span className="text-sm text-white">
                        {formatDate(user?.created_at)}
                      </span>
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-secondary w-full flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Neural Link
                  </Link>
                </div>
              </div>

              {/* Quantum Security Status */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-neon-blue" />
                    Security Matrix
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Neural Scan</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm">Quantum Encryption</span>
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-purple-400 mr-2" />
                      <span className="text-sm">Biometric Lock</span>
                    </div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>

                  {!user?.is_2fa_enabled && (
                    <Link to="/profile" className="btn btn-accent w-full text-sm flex items-center justify-center">
                      <Shield className="w-3 h-3 mr-2" />
                      Activate Quantum Guard
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-neon-green" />
                    Neural Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/20 rounded-lg hover:bg-gray-900/40 transition-colors">
                      <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 animate-pulse"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300">
                          {activity.action}{' '}
                          <span className="font-semibold text-white">{activity.track}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Rocket className="w-4 h-4 mr-2 text-neon-purple" />
                    Quantum Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to Cloud
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Sync Neural Data
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Background Elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-gradient-radial from-neon-blue/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-48 h-48 bg-gradient-radial from-neon-purple/5 to-transparent rounded-full blur-2xl animate-bounce pointer-events-none"></div>
    </div>
  );
};

export default Dashboard;