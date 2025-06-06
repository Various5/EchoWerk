// src/pages/Profile.js - Neural Configuration Center
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Lock,
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  AlertCircle,
  Check,
  LogOut,
  Camera,
  QrCode,
  Key,
  Settings,
  Brain,
  Zap,
  Activity,
  Download,
  Upload,
  Trash2,
  Copy,
  RefreshCw,
  Star,
  Globe,
  Cpu
} from 'lucide-react';

const Profile = () => {
  const {
    user,
    logout,
    updateProfile,
    changePassword,
    setup2FA,
    enable2FA,
    disable2FA,
    loading,
    getSecurityScore,
    resendVerification
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const profileRef = useRef(null);

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
    }
  });

  // Password form
  const passwordForm = useForm();

  // 2FA form
  const twoFAForm = useForm();

  // Animation on mount
  useEffect(() => {
    if (profileRef.current) {
      profileRef.current.classList.add('fade-in');
    }
  }, []);

  // Password strength calculation
  useEffect(() => {
    const password = passwordForm.watch('newPassword', '');
    const calculateStrength = (pwd) => {
      let strength = 0;
      if (pwd.length >= 8) strength += 25;
      if (pwd.length >= 12) strength += 15;
      if (/[a-z]/.test(pwd)) strength += 15;
      if (/[A-Z]/.test(pwd)) strength += 15;
      if (/\d/.test(pwd)) strength += 15;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 15;
      return Math.min(strength, 100);
    };
    setPasswordStrength(calculateStrength(password));
  }, [passwordForm.watch('newPassword')]);

  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'Q';
  };

  const getSecurityLevel = () => {
    const score = getSecurityScore();
    if (score >= 90) return { level: 'Quantum', color: 'text-purple-400', bgColor: 'bg-purple-400/10' };
    if (score >= 70) return { level: 'Neural', color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
    if (score >= 50) return { level: 'Bio-Secure', color: 'text-green-400', bgColor: 'bg-green-400/10' };
    return { level: 'Basic', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
  };

  const handleProfileUpdate = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      profileForm.reset(data);
    }
  };

  const handlePasswordChange = async (data) => {
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      passwordForm.reset();
    }
  };

  const handleSetup2FA = async (data) => {
    const result = await setup2FA(data.password);
    if (result.success) {
      setQRCodeData(result.data);
      setShow2FASetup(true);
    }
  };

  const handleEnable2FA = async (data) => {
    const result = await enable2FA(data.totpCode);
    if (result.success) {
      setShow2FASetup(false);
      setQRCodeData(null);
      twoFAForm.reset();
    }
  };

  const handleDisable2FA = async (data) => {
    const result = await disable2FA(data.password);
    if (result.success) {
      twoFAForm.reset();
    }
  };

  const handleResendVerification = async () => {
    await resendVerification();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const securityLevel = getSecurityLevel();
  const securityScore = getSecurityScore();

  const tabs = [
    { id: 'profile', label: 'Neural Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Quantum Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'password', label: 'Neural Key', icon: <Lock className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen" ref={profileRef}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo flex items-center">
            <div className="w-8 h-8 bg-gradient-cyber rounded-lg flex items-center justify-center mr-2">
              <User className="w-5 h-5 text-white" />
            </div>
            🎵 EchoWerk Neural
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard" className="nav-link flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Command Center
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link active flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                Neural Config
              </Link>
            </li>
            <li>
              <button onClick={logout} className="btn btn-ghost btn-sm flex items-center">
                <LogOut className="w-4 h-4 mr-1" />
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="page-container pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <span className="gradient-text">Neural Configuration</span>
              <Cpu className="w-8 h-8 ml-3 text-neon-blue animate-pulse" />
            </h1>
            <p className="text-gray-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Manage your quantum identity and consciousness settings
            </p>
          </div>

          {/* Security Score Card */}
          <div className="mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-neon-blue" />
                  Quantum Security Status
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${securityLevel.bgColor} ${securityLevel.color}`}>
                  {securityLevel.level} Level
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Security Score</span>
                <span className="text-2xl font-bold text-white">{securityScore}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-1000"
                  style={{ width: `${securityScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Basic</span>
                <span>Neural</span>
                <span>Quantum</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 mb-8 p-1 bg-gray-800/50 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'profile' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <User className="w-5 h-5 mr-2 text-neon-green" />
                      Neural Profile Matrix
                    </h2>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 p-6 bg-gray-900/30 rounded-lg border border-gray-700/50">
                      <div className="relative">
                        <div className="avatar w-20 h-20 text-2xl">
                          {getUserInitials(user)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Quantum Avatar</h3>
                        <p className="text-gray-400 text-sm mb-3">
                          Upload your consciousness representation to personalize your neural identity
                        </p>
                        <button type="button" className="btn btn-secondary btn-sm flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Neural Image
                        </button>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">
                          <Brain className="w-4 h-4" />
                          First Neural Signature
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Your first quantum identifier"
                          {...profileForm.register('first_name', { required: 'First signature is required' })}
                        />
                        {profileForm.formState.errors.first_name && (
                          <p className="form-error">
                            <AlertCircle className="w-4 h-4" />
                            {profileForm.formState.errors.first_name.message}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Brain className="w-4 h-4" />
                          Last Neural Signature
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Your last quantum identifier"
                          {...profileForm.register('last_name', { required: 'Last signature is required' })}
                        />
                        {profileForm.formState.errors.last_name && (
                          <p className="form-error">
                            <AlertCircle className="w-4 h-4" />
                            {profileForm.formState.errors.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="form-group">
                      <label className="form-label">
                        <Zap className="w-4 h-4" />
                        Quantum Handle
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Your unique neural identifier"
                        {...profileForm.register('username', { required: 'Quantum handle is required' })}
                      />
                      {profileForm.formState.errors.username && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {profileForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
                      {loading ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Updating neural matrix...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Neural Profile
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Email Verification */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-neon-blue" />
                        Neural Link Verification
                      </h2>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4 className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Dimensional Address Status
                        </h4>
                        <p>Your quantum email verification status across all dimensions</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                          {user?.is_verified ? 'Verified' : 'Pending'}
                        </span>
                        {!user?.is_verified && (
                          <button
                            onClick={handleResendVerification}
                            className="btn btn-accent btn-sm flex items-center"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Resend
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-neon-purple" />
                        Quantum Guard Protocol
                      </h2>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h4 className="flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Two-Factor Authentication
                        </h4>
                        <p>Add quantum-level security to your neural interface</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                          {user?.is_2fa_enabled ? 'Active' : 'Inactive'}
                        </span>
                        {!user?.is_2fa_enabled ? (
                          <button
                            onClick={() => setShow2FASetup(true)}
                            className="btn btn-accent btn-sm flex items-center"
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => setShow2FASetup(true)}
                            className="btn btn-secondary btn-sm flex items-center"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title flex items-center">
                      <Key className="w-5 h-5 mr-2 text-neon-green" />
                      Neural Key Configuration
                    </h2>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                    <div className="form-group">
                      <label className="form-label">
                        <Lock className="w-4 h-4" />
                        Current Neural Key
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="form-input pr-10"
                          placeholder="Enter current neural key"
                          {...passwordForm.register('currentPassword', {
                            required: 'Current neural key is required'
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Key className="w-4 h-4" />
                        New Neural Key
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="form-input pr-10"
                          placeholder="Create new neural key"
                          {...passwordForm.register('newPassword', {
                            required: 'New neural key is required',
                            minLength: {
                              value: 8,
                              message: 'Neural key must be at least 8 characters'
                            }
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {passwordForm.watch('newPassword') && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">Neural Key Strength</span>
                            <span className={`text-xs font-bold ${passwordStrength >= 80 ? 'text-green-400' : passwordStrength >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {passwordStrength >= 80 ? 'Quantum' : passwordStrength >= 60 ? 'Neural' : 'Basic'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {passwordForm.formState.errors.newPassword && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary flex items-center">
                      {loading ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Updating neural key...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Update Neural Key
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title flex items-center">
                        <Cpu className="w-5 h-5 mr-2 text-neon-red" />
                        Advanced Neural Settings
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="setting-item">
                        <div className="setting-info">
                          <h4 className="flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export Neural Data
                          </h4>
                          <p>Download your complete quantum profile for backup purposes</p>
                        </div>
                        <button className="btn btn-secondary btn-sm flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </button>
                      </div>

                      <div className="setting-item">
                        <div className="setting-info">
                          <h4 className="flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Quantum Identity Deletion
                          </h4>
                          <p>Permanently remove your consciousness from all dimensions</p>
                        </div>
                        <button className="btn btn-secondary btn-sm text-red-400 hover:bg-red-500/10 flex items-center">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Summary */}
              <div className="card">
                <div className="text-center">
                  <div className="avatar mb-4 relative">
                    {getUserInitials(user)}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-gray-400 text-sm">@{user?.username}</p>
                  <p className="text-gray-500 text-xs mt-1 flex items-center justify-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {user?.email}
                  </p>

                  <div className="mt-4 p-3 bg-gray-900/30 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Quantum ID</div>
                    <div className="font-mono text-xs text-neon-blue break-all flex items-center">
                      <span className="flex-1">{user?.id}</span>
                      <button
                        onClick={() => copyToClipboard(user?.id)}
                        className="ml-2 p-1 hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Neural Status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Email Sync</span>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${user?.is_verified ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-xs">{user?.is_verified ? 'Active' : 'Pending'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Quantum Guard</span>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${user?.is_2fa_enabled ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                      <span className="text-xs">{user?.is_2fa_enabled ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Neural Link</span>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                      <span className="text-xs">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  {!user?.is_verified && (
                    <button
                      onClick={handleResendVerification}
                      className="btn btn-secondary w-full text-sm flex items-center justify-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Verify Neural Link
                    </button>
                  )}
                  {!user?.is_2fa_enabled && (
                    <button
                      onClick={() => setShow2FASetup(true)}
                      className="btn btn-accent w-full text-sm flex items-center justify-center"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Activate Quantum Guard
                    </button>
                  )}
                  <button className="btn btn-secondary w-full text-sm flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Neural Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-neon-purple" />
                {user?.is_2fa_enabled ? 'Manage Quantum Guard' : 'Setup Quantum Guard'}
              </h3>

              {!user?.is_2fa_enabled ? (
                qrCodeData ? (
                  <form onSubmit={twoFAForm.handleSubmit(handleEnable2FA)}>
                    <div className="text-center mb-6">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        {qrCodeData.qr_code ? (
                          <img src={qrCodeData.qr_code} alt="QR Code" className="w-32 h-32" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                            QR Code Loading...
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        Scan this quantum code with your authenticator app
                      </p>
                      <div className="font-mono text-xs bg-gray-800 p-2 rounded break-all">
                        {qrCodeData.secret}
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label className="form-label">Enter verification code</label>
                      <input
                        type="text"
                        className="form-input text-center"
                        placeholder="000000"
                        maxLength={6}
                        {...twoFAForm.register('totpCode', {
                          required: 'Verification code is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: 'Please enter a 6-digit code'
                          }
                        })}
                      />
                      {twoFAForm.formState.errors.totpCode && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {twoFAForm.formState.errors.totpCode.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? 'Activating...' : 'Activate Quantum Guard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow2FASetup(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={twoFAForm.handleSubmit(handleSetup2FA)}>
                    <div className="form-group mb-4">
                      <label className="form-label">Confirm your neural key</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Your current neural key"
                        {...twoFAForm.register('password', {
                          required: 'Neural key is required'
                        })}
                      />
                      {twoFAForm.formState.errors.password && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {twoFAForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? 'Setting up...' : 'Setup Quantum Guard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow2FASetup(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <form onSubmit={twoFAForm.handleSubmit(handleDisable2FA)}>
                  <div className="form-group mb-4">
                    <label className="form-label">Enter your neural key to disable Quantum Guard</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Your neural key"
                      {...twoFAForm.register('password', {
                        required: 'Neural key is required'
                      })}
                    />
                    {twoFAForm.formState.errors.password && (
                      <p className="form-error">
                        <AlertCircle className="w-4 h-4" />
                        {twoFAForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="btn btn-accent flex-1">
                      {loading ? 'Deactivating...' : 'Deactivate Quantum Guard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShow2FASetup(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;