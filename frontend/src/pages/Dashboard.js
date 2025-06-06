// src/pages/Dashboard.js - Clean Professional Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeModule, setActiveModule] = useState('overview');

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
      title: "Music Player",
      description: "Play and manage your music collection",
      status: "active",
      progress: 85
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Music",
      description: "Add new tracks to your library",
      status: "ready",
      progress: 100
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Favorites",
      description: "Your liked songs and playlists",
      status: "syncing",
      progress: 92
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Discover",
      description: "Find new music recommendations",
      status: "processing",
      progress: 78
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Audio Quality",
      description: "High-quality audio processing",
      status: "active",
      progress: 95
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics",
      description: "View your listening statistics",
      status: "ready",
      progress: 88
    }
  ];

  const stats = [
    { label: "Total Tracks", value: "1,247", icon: <Music className="w-5 h-5" />, change: "+23" },
    { label: "Hours Listened", value: "42.5h", icon: <Clock className="w-5 h-5" />, change: "+5.2h" },
    { label: "Playlists", value: "18", icon: <Star className="w-5 h-5" />, change: "+3" },
    { label: "Following", value: "156", icon: <User className="w-5 h-5" />, change: "+12" }
  ];

  const recentActivity = [
    { action: "Played", track: "Bohemian Rhapsody", artist: "Queen", time: "2 min ago", type: "play" },
    { action: "Added to favorites", track: "Stairway to Heaven", artist: "Led Zeppelin", time: "5 min ago", type: "favorite" },
    { action: "Created playlist", track: "Rock Classics", artist: "", time: "12 min ago", type: "playlist" },
    { action: "Shared", track: "Hotel California", artist: "Eagles", time: "1 hour ago", type: "share" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'ready': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'syncing': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo flex items-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-2">
              <Music className="w-5 h-5 text-white" />
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
              <button className="btn btn-secondary btn-sm flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Notifications
                <span className="ml-1 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
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
                <span className="ml-2 gradient-text">{user?.first_name || user?.username}</span>
              </h1>
              <p className="text-gray-400 flex items-center mt-2">
                <Clock className="w-4 h-4 mr-2" />
                {currentTime.toLocaleString()}
                <span className="ml-4 flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-green-400" />
                  Online
                </span>
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-secondary flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Music
              </button>
              <Link to="/profile" className="btn btn-primary flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
                  <span className="text-xs text-green-400 font-mono">+{stat.change}</span>
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
            {/* Central Content */}
            <div className="main-content">
              {/* Module Selector */}
              <div className="flex space-x-1 mb-6 p-1 bg-gray-800/50 rounded-lg">
                {['overview', 'music', 'playlists', 'analytics'].map((module) => (
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
                  {/* Features Grid */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Music className="w-5 h-5 mr-2 text-neon-blue" />
                        Music Features
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {features.map((feature, index) => (
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
                              <span>Status</span>
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
                </div>
              )}

              {activeModule === 'music' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Music className="w-5 h-5 mr-2 text-neon-green" />
                      Music Library
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-accent rounded-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Music Library</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Your music collection will appear here. Start by uploading your favorite tracks.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="btn btn-primary flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Music
                      </button>
                      <button className="btn btn-secondary flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Import Library
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'playlists' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Star className="w-5 h-5 mr-2 text-neon-purple" />
                      Playlists
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <Star className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Your Playlists</h3>
                    <p className="text-gray-400 mb-8">
                      Create and manage your music playlists
                    </p>
                    <button className="btn btn-primary">Create New Playlist</button>
                  </div>
                </div>
              )}

              {activeModule === 'analytics' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-neon-blue" />
                      Listening Analytics
                    </h2>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-cyber rounded-full flex items-center justify-center">
                      <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Music Analytics</h3>
                    <p className="text-gray-400 mb-8">
                      View your listening statistics and trends
                    </p>
                    <button className="btn btn-primary">View Analytics</button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* User Profile */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </h3>
                </div>
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="avatar mb-0">
                      {getUserInitials(user)}
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">@{user?.username}</p>
                  <p className="text-gray-500 text-xs mb-4">{user?.email}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Email Status:</span>
                      <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                        {user?.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">2FA:</span>
                      <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                        {user?.is_2fa_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Member Since:</span>
                      <span className="text-sm text-white">
                        {formatDate(user?.created_at)}
                      </span>
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-secondary w-full flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Security Status */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-neon-blue" />
                    Security
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Account Security</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm">Data Encryption</span>
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>

                  {!user?.is_2fa_enabled && (
                    <Link to="/profile" className="btn btn-accent w-full text-sm flex items-center justify-center">
                      <Shield className="w-3 h-3 mr-2" />
                      Enable 2FA
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-neon-green" />
                    Recent Activity
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
                          {activity.artist && (
                            <span className="text-gray-400"> by {activity.artist}</span>
                          )}
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
                    <Calendar className="w-4 h-4 mr-2 text-neon-purple" />
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Music
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <Star className="w-4 h-4 mr-2" />
                    Create Playlist
                  </button>
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Statistics
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