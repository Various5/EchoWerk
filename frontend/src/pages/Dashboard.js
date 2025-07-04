// frontend/src/pages/Dashboard.js - Clean Dashboard with Animations
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Settings,
  Shield,
  Music,
  Bell,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
  Star,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const getSecurityScore = () => {
    let score = 20; // Base score
    if (user?.is_verified) score += 40;
    if (user?.is_2fa_enabled) score += 40;
    return Math.min(score, 100);
  };

  const securityScore = getSecurityScore();

  const quickStats = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Account Status",
      value: "Active",
      color: "text-green-400",
      bgColor: "bg-green-600"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Security Score",
      value: `${securityScore}%`,
      color: securityScore >= 80 ? "text-green-400" : securityScore >= 60 ? "text-yellow-400" : "text-red-400",
      bgColor: securityScore >= 80 ? "bg-green-600" : securityScore >= 60 ? "bg-yellow-600" : "bg-red-600"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Status",
      value: user?.is_verified ? "Verified" : "Pending",
      color: user?.is_verified ? "text-green-400" : "text-yellow-400",
      bgColor: user?.is_verified ? "bg-green-600" : "bg-yellow-600"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      label: "2FA Status",
      value: user?.is_2fa_enabled ? "Enabled" : "Disabled",
      color: user?.is_2fa_enabled ? "text-green-400" : "text-red-400",
      bgColor: user?.is_2fa_enabled ? "bg-green-600" : "bg-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 logo-animated">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-animated">EchoWerk</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4 animate-slide-in">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover-lift">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold logo-animated">
                  {getInitials(user)}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>

              <Link
                to="/profile"
                className="p-2 text-gray-400 hover:text-white transition-colors hover-lift"
              >
                <Settings className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors hover-lift"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.first_name || user?.username}!
            <span className="animate-float inline-block ml-2">👋</span>
          </h1>
          <p className="text-gray-400 flex items-center">
            <Clock className="w-4 h-4 mr-2 animate-pulse" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center logo-animated`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400 animate-pulse" />
                Account Status
              </h2>

              <div className="space-y-4">
                {/* Email Verification */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover-lift transition-all">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-blue-400 animate-float" />
                    <div>
                      <h3 className="font-medium">Email Verification</h3>
                      <p className="text-sm text-gray-400">Secure your account with email verification</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user?.is_verified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2 animate-pulse" />
                        <span className="text-sm text-green-400 font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                        <span className="text-sm text-yellow-400 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover-lift transition-all">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-3 text-purple-400 animate-float" style={{animationDelay: '0.5s'}} />
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">Add extra security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user?.is_2fa_enabled ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2 animate-pulse" />
                        <span className="text-sm text-green-400 font-medium">Enabled</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                        <span className="text-sm text-yellow-400 font-medium">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/profile"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-animated hover-glow"
                  >
                    <Settings className="w-4 h-4 mr-2 inline" />
                    Edit Profile
                  </Link>
                  {!user?.is_verified && (
                    <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-animated">
                      <Mail className="w-4 h-4 mr-2 inline" />
                      Verify Email
                    </button>
                  )}
                  {!user?.is_2fa_enabled && (
                    <Link
                      to="/profile"
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-animated"
                    >
                      <Shield className="w-4 h-4 mr-2 inline" />
                      Enable 2FA
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400 animate-pulse" />
                Getting Started
              </h2>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Complete your profile",
                    description: "Add your personal information and preferences",
                    completed: user?.first_name && user?.last_name,
                    color: "bg-blue-600"
                  },
                  {
                    step: 2,
                    title: "Verify your email",
                    description: "Confirm your email address to secure your account",
                    completed: user?.is_verified,
                    color: "bg-green-600"
                  },
                  {
                    step: 3,
                    title: "Enable two-factor authentication",
                    description: "Add an extra layer of security to your account",
                    completed: user?.is_2fa_enabled,
                    color: "bg-purple-600"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors hover-lift"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className={`w-6 h-6 ${item.completed ? item.color : 'bg-slate-600'} rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5 transition-all`}>
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        item.step
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${item.completed ? 'text-green-400' : 'text-white'}`}>
                        {item.title}
                        {item.completed && <Star className="w-4 h-4 ml-2 inline text-yellow-400 animate-pulse" />}
                      </h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
                Profile
              </h2>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 logo-animated">
                  {getInitials(user)}
                </div>
                <h3 className="font-semibold text-lg">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-gray-400 mb-1">@{user?.username}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Member since</span>
                    <span className="text-gray-300">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last login</span>
                    <span className="text-gray-300">
                      {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="w-full mt-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 py-2 px-4 rounded-lg text-sm font-medium transition-colors block text-center btn-animated"
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Edit Profile
              </Link>
            </div>

            {/* Security Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400 animate-pulse" />
                Security Status
              </h2>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-slate-700"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                    <path
                      className={`${securityScore >= 80 ? 'stroke-green-400' : securityScore >= 60 ? 'stroke-yellow-400' : 'stroke-red-400'} security-circle`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray={`${securityScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold animate-pulse">{securityScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  {securityScore >= 80 ? (
                    <span className="text-green-400 flex items-center justify-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Excellent Security
                    </span>
                  ) : securityScore >= 60 ? (
                    <span className="text-yellow-400">Good Security</span>
                  ) : (
                    <span className="text-red-400">Needs Improvement</span>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Account Status</span>
                  <span className="text-sm text-green-400 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <span className={`text-sm ${user?.is_verified ? 'text-green-400' : 'text-yellow-400'} flex items-center`}>
                    {user?.is_verified ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {user?.is_verified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">2FA Enabled</span>
                  <span className={`text-sm ${user?.is_2fa_enabled ? 'text-green-400' : 'text-yellow-400'} flex items-center`}>
                    {user?.is_2fa_enabled ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {user?.is_2fa_enabled ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <Link
                to="/profile"
                className="w-full mt-6 text-blue-400 hover:text-blue-300 text-sm transition-colors block text-center hover-lift"
              >
                <Shield className="w-4 h-4 mr-1 inline" />
                Manage Security Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;