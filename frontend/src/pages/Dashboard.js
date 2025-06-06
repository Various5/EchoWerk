import React, { useState, useEffect } from 'react';
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
  Upload,
  Download,
  Play,
  Headphones,
  Heart,
  Star,
  ChevronRight,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@echowerk.com",
    avatar: "AJ",
    plan: "Pro",
    verified: true,
    twoFAEnabled: true,
    lastLogin: "2025-01-08 14:30"
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Total Tracks",
      value: "1,247",
      change: "+23",
      icon: <Music className="w-5 h-5" />,
      color: "text-blue-400"
    },
    {
      label: "Hours Listened",
      value: "42.5",
      change: "+5.2",
      icon: <Headphones className="w-5 h-5" />,
      color: "text-green-400"
    },
    {
      label: "Playlists",
      value: "18",
      change: "+3",
      icon: <Star className="w-5 h-5" />,
      color: "text-purple-400"
    },
    {
      label: "Following",
      value: "156",
      change: "+12",
      icon: <Users className="w-5 h-5" />,
      color: "text-cyan-400"
    }
  ];

  const recentActivity = [
    {
      action: "Played",
      item: "Midnight Jazz Collection",
      time: "2 minutes ago",
      icon: <Play className="w-4 h-4" />
    },
    {
      action: "Added to favorites",
      item: "Summer Vibes Playlist",
      time: "15 minutes ago",
      icon: <Heart className="w-4 h-4" />
    },
    {
      action: "Uploaded",
      item: "New Demo Track",
      time: "1 hour ago",
      icon: <Upload className="w-4 h-4" />
    },
    {
      action: "Shared",
      item: "Electronic Mix #3",
      time: "3 hours ago",
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  const quickActions = [
    {
      title: "Upload Music",
      description: "Add new tracks to your library",
      icon: <Upload className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Create Playlist",
      description: "Organize your favorite tracks",
      icon: <Star className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Discover Music",
      description: "Find new tracks and artists",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Analytics",
      description: "View your listening statistics",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EchoWerk</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'music' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Music Library
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'analytics' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Analytics
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.avatar}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </div>

              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Online</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-400">{user.plan} Plan</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-slate-700 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="group p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="p-2 bg-slate-600 rounded-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="text-blue-400">{activity.action}</span>
                        <span className="text-white mx-1">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-400" />
                Profile
              </h2>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {user.avatar}
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <div className="flex items-center">
                    {user.verified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-xs text-yellow-400">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Two-Factor Auth</span>
                  <div className="flex items-center">
                    {user.twoFAEnabled ? (
                      <>
                        <Shield className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">Enabled</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-xs text-yellow-400">Disabled</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Last Login</span>
                  <span className="text-xs text-gray-300">{user.lastLogin}</span>
                </div>
              </div>

              <button className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Security Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm">Account Secure</span>
                  </div>
                  <span className="text-xs text-green-400 font-medium">100%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Security Score</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <button className="w-full text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    View Security Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                This Week
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tracks Played</span>
                  <span className="text-lg font-semibold">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Hours Listened</span>
                  <span className="text-lg font-semibold">12.3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">New Discoveries</span>
                  <span className="text-lg font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Playlists Created</span>
                  <span className="text-lg font-semibold">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;