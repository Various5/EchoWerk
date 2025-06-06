// src/pages/Dashboard.js
import React from 'react';
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
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

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
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const placeholderFeatures = [
    { icon: <Play className="w-6 h-6" />, title: "Music Player", description: "Advanced audio player with queue management" },
    { icon: <Search className="w-6 h-6" />, title: "Music Discovery", description: "AI-powered music recommendations" },
    { icon: <Heart className="w-6 h-6" />, title: "Favorites", description: "Save and organize your favorite tracks" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", description: "Track your listening habits and statistics" },
    { icon: <Headphones className="w-6 h-6" />, title: "Audio Effects", description: "Custom equalizer and sound effects" },
    { icon: <Plus className="w-6 h-6" />, title: "Playlists", description: "Create and share custom playlists" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo">
            🎵 EchoWerk
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link active">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-ghost">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard">
        <div className="page-container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-gray-400">
                Ready to explore your music universe?
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-secondary">
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <Link to="/profile" className="btn btn-primary">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Main Content Area */}
            <div className="main-content">
              {/* Music App Placeholder */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Music Application
                  </h2>
                </div>

                <div className="placeholder-content">
                  <div className="placeholder-icon">
                    <Music className="w-full h-full text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-4">
                    Music Features Coming Soon
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    This is where your music application will live. Upload, organize,
                    and enjoy your favorite tracks with our advanced audio system.
                  </p>

                  {/* Feature Preview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                    {placeholderFeatures.map((feature, index) => (
                      <div key={index} className="feature-preview-card glass-card p-4 text-left">
                        <div className="feature-preview-icon mb-3">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button className="btn btn-accent">
                      <Plus className="w-4 h-4" />
                      Start Building Your Library
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* User Profile Card */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Profile</h3>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="avatar mb-4">
                    {getUserInitials(user)}
                  </div>
                  <h4 className="font-semibold text-white mb-1">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">@{user?.username}</p>
                  <p className="text-gray-500 text-xs mb-4">{user?.email}</p>

                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                        {user?.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">2FA:</span>
                      <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                        {user?.is_2fa_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Member since:</span>
                      <span className="text-sm text-white">
                        {formatDate(user?.created_at)}
                      </span>
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-secondary w-full mt-4">
                    <User className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Security Status */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="security-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verification</span>
                      <span className={`w-2 h-2 rounded-full ${user?.is_verified ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    </div>
                  </div>

                  <div className="security-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <span className={`w-2 h-2 rounded-full ${user?.is_2fa_enabled ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                    </div>
                  </div>

                  <div className="security-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Login</span>
                      <span className="text-xs text-gray-400">
                        {user?.last_login ? formatDate(user.last_login) : 'Never'}
                      </span>
                    </div>
                  </div>

                  {!user?.is_2fa_enabled && (
                    <Link to="/profile" className="btn btn-accent w-full text-sm">
                      <Shield className="w-3 h-3" />
                      Enable 2FA
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Quick Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="stat-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Songs</span>
                      <span className="text-lg font-semibold text-white">0</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Playlists</span>
                      <span className="text-lg font-semibold text-white">0</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Listen Time</span>
                      <span className="text-lg font-semibold text-white">0h</span>
                    </div>
                  </div>
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