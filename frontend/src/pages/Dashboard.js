// frontend/src/pages/Dashboard.js - Modern Interactive Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import {
  User,
  Settings,
  Shield,
  Music,
  Bell,
  LogOut,
  Clock,
  Activity,
  BarChart3,
  Calendar,
  Star,
  Upload,
  Download,
  Play,
  Headphones,
  TrendingUp,
  Heart,
  Zap,
  Eye,
  Volume2,
  Disc,
  Radio,
  Mic,
  Sparkles,
  Award,
  Target,
  Layers,
  Globe,
  Lock
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeModule, setActiveModule] = useState('overview');
  const [stats, setStats] = useState({
    totalTracks: 1247,
    hoursListened: 42.5,
    playlists: 18,
    following: 156
  });

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
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
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Smart Player",
      description: "AI-powered music player with intelligent recommendations",
      status: "active",
      progress: 95,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Cloud Upload",
      description: "Seamless cloud storage with automatic synchronization",
      status: "ready",
      progress: 100,
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Favorites",
      description: "Your personalized collection of loved tracks",
      status: "syncing",
      progress: 92,
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Discover",
      description: "Machine learning-powered music discovery engine",
      status: "processing",
      progress: 78,
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Audio Enhancement",
      description: "Professional-grade audio processing and enhancement",
      status: "active",
      progress: 98,
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Pro",
      description: "Advanced listening analytics and insights",
      status: "ready",
      progress: 88,
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const quickStats = [
    {
      label: "Tracks",
      value: stats.totalTracks.toLocaleString(),
      icon: <Music className="w-5 h-5" />,
      change: "+23",
      color: "text-blue-400"
    },
    {
      label: "Hours",
      value: `${stats.hoursListened}h`,
      icon: <Clock className="w-5 h-5" />,
      change: "+5.2h",
      color: "text-green-400"
    },
    {
      label: "Playlists",
      value: stats.playlists,
      icon: <Star className="w-5 h-5" />,
      change: "+3",
      color: "text-purple-400"
    },
    {
      label: "Following",
      value: stats.following,
      icon: <User className="w-5 h-5" />,
      change: "+12",
      color: "text-cyan-400"
    }
  ];

  const recentActivity = [
    {
      action: "Played",
      track: "Quantum Dreams",
      artist: "Neural Beats",
      time: "2 min ago",
      type: "play",
      icon: <Play className="w-4 h-4" />
    },
    {
      action: "Added to favorites",
      track: "Digital Symphony",
      artist: "Code Orchestra",
      time: "5 min ago",
      type: "favorite",
      icon: <Heart className="w-4 h-4" />
    },
    {
      action: "Created playlist",
      track: "Future Classics",
      artist: "",
      time: "12 min ago",
      type: "playlist",
      icon: <Disc className="w-4 h-4" />
    },
    {
      action: "Shared",
      track: "Electric Horizon",
      artist: "Synth Masters",
      time: "1 hour ago",
      type: "share",
      icon: <Globe className="w-4 h-4" />
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-green-400 bg-green-400/10 border-green-400/20',
          icon: <Zap className="w-3 h-3" />,
          pulse: true
        };
      case 'ready':
        return {
          color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
          icon: <Shield className="w-3 h-3" />,
          pulse: false
        };
      case 'syncing':
        return {
          color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
          icon: <Radio className="w-3 h-3" />,
          pulse: true
        };
      case 'processing':
        return {
          color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
          icon: <Layers className="w-3 h-3" />,
          pulse: true
        };
      default:
        return {
          color: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
          icon: <Activity className="w-3 h-3" />,
          pulse: false
        };
    }
  };

  const modules = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'music', label: 'Library', icon: <Music className="w-4 h-4" /> },
    { id: 'playlists', label: 'Playlists', icon: <Star className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Interactive Background */}
      <ParticleBackground
        particleCount={30}
        connectionDistance={100}
        particleColor="rgba(59, 130, 246, 0.4)"
        lineColor="rgba(59, 130, 246, 0.1)"
        speed={0.2}
        interactive={true}
      />

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 relative">
              <Music className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            EchoWerk
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link active flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link flex items-center">
                <User className="w-4 h-4 mr-1" />
                Profile
              </Link>
            </li>
            <li>
              <button className="btn btn-secondary btn-sm flex items-center relative">
                <Bell className="w-4 h-4 mr-1" />
                Notifications
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm flex items-center">
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="dashboard">
        <div className="page-container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title flex items-center">
                <span>Welcome back,</span>
                <span className="ml-2 text-gradient">{user?.first_name || user?.username}</span>
                <Sparkles className="w-8 h-8 ml-3 text-yellow-400 animate-pulse" />
              </h1>
              <div className="flex items-center space-x-6 mt-2">
                <p className="text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {currentTime.toLocaleString()}
                </p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Neural Network Active</span>
                </div>
              </div>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-secondary flex items-center group">
                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Upload Music
              </button>
              <Link to="/profile" className="btn btn-primary flex items-center group">
                <Settings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                Settings
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="glass-card p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg ${stat.color} shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-400 font-mono bg-green-400/10 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Central Content */}
            <div className="main-content">
              {/* Module Selector */}
              <div className="flex space-x-1 mb-6 p-1 glass rounded-xl">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      activeModule === module.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {module.icon}
                    <span className="font-medium">{module.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Module Content */}
              {activeModule === 'overview' && (
                <div className="space-y-6">
                  {/* Features Grid */}
                  <div className="glass-card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-blue-400" />
                        Neural Music Features
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {features.map((feature, index) => (
                        <div key={index} className="feature-card glass-card group relative overflow-hidden">
                          {/* Animated Background */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`}></div>
                          </div>

                          <div className="relative z-10">
                            <div className={`feature-icon bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              {feature.icon}
                            </div>
                            <h3 className="feature-title group-hover:text-white transition-colors">
                              {feature.title}
                            </h3>
                            <p className="feature-description mb-4 group-hover:text-gray-300 transition-colors">
                              {feature.description}
                            </p>

                            {/* Status Badge */}
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${getStatusInfo(feature.status).color}`}>
                              <div className={`mr-2 ${getStatusInfo(feature.status).pulse ? 'animate-pulse' : ''}`}>
                                {getStatusInfo(feature.status).icon}
                              </div>
                              {feature.status}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full">
                              <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span>Performance</span>
                                <span className="font-mono">{feature.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 bg-gradient-to-r ${feature.color} rounded-full transition-all duration-1000 relative`}
                                  style={{ width: `${feature.progress}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'music' && (
                <div className="glass-card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Music className="w-5 h-5 mr-2 text-green-400" />
                      Neural Music Library
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center relative">
                      <Music className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient">Smart Music Library</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Your AI-powered music collection with intelligent organization and discovery features.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="btn btn-primary flex items-center group">
                        <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Upload Music
                      </button>
                      <button className="btn btn-secondary flex items-center group">
                        <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Import Library
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'playlists' && (
                <div className="glass-card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Star className="w-5 h-5 mr-2 text-purple-400" />
                      Smart Playlists
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center relative">
                      <Star className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient">AI-Curated Playlists</h3>
                    <p className="text-gray-400 mb-8">
                      Create intelligent playlists with machine learning recommendations
                    </p>
                    <button className="btn btn-accent">Create Smart Playlist</button>
                  </div>
                </div>
              )}

              {activeModule === 'analytics' && (
                <div className="glass-card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                      Neural Analytics
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center relative">
                      <BarChart3 className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient">Advanced Analytics</h3>
                    <p className="text-gray-400 mb-8">
                      Deep insights into your listening patterns and preferences
                    </p>
                    <button className="btn btn-primary">View Analytics</button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* User Profile */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Neural Profile
                  </h3>
                </div>
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="avatar mb-0 relative">
                      {getUserInitials(user)}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-blue-400 text-sm mb-2 font-mono">@{user?.username}</p>
                  <p className="text-gray-500 text-xs mb-4 font-mono">{user?.email}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Email Status:</span>
                      <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                        {user?.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">2FA Shield:</span>
                      <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                        {user?.is_2fa_enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Member Since:</span>
                      <span className="text-sm text-white font-mono">
                        {formatDate(user?.created_at)}
                      </span>
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-secondary w-full flex items-center justify-center group">
                    <Settings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                    Neural Config
                  </Link>
                </div>
              </div>

              {/* Security Status */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    Quantum Security
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Neural Shield</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm">Quantum Encryption</span>
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>

                  {!user?.is_2fa_enabled && (
                    <Link to="/profile" className="btn btn-accent w-full text-sm flex items-center justify-center group">
                      <Shield className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                      Activate 2FA Shield
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-green-400" />
                    Neural Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {activity.action}{' '}
                          <span className="font-semibold text-white">{activity.track}</span>
                          {activity.artist && (
                            <span className="text-gray-400"> by {activity.artist}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center group">
                    <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Upload Neural Track
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center group">
                    <Star className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Create Smart Playlist
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center group">
                    <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    View Neural Stats
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;