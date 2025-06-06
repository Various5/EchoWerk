// frontend/src/pages/Profile.js - Clean Profile Page with Animations
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CheckCircle,
  LogOut,
  Music,
  Settings,
  Star,
  Zap,
  Key,
  Clock
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

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);

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

  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileUpdate = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        profileForm.reset(data);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const handleSetup2FA = async (data) => {
    try {
      const result = await setup2FA(data.password);
      if (result.success) {
        setQRCodeData(result.data);
        setShow2FASetup(true);
      }
    } catch (error) {
      console.error('2FA setup error:', error);
    }
  };

  const handleEnable2FA = async (data) => {
    try {
      const result = await enable2FA(data.totpCode);
      if (result.success) {
        setShow2FASetup(false);
        setQRCodeData(null);
        twoFAForm.reset();
      }
    } catch (error) {
      console.error('2FA enable error:', error);
    }
  };

  const handleDisable2FA = async (data) => {
    try {
      const result = await disable2FA(data.password);
      if (result.success) {
        twoFAForm.reset();
      }
    } catch (error) {
      console.error('2FA disable error:', error);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
    } catch (error) {
      console.error('Resend verification error:', error);
    }
  };

  const securityScore = getSecurityScore();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900 bg-animated">
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
                to="/dashboard"
                className="text-gray-400 hover:text-white px-3 py-2 transition-colors flex items-center hover-lift"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 p-2 transition-colors hover-lift"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-blue-400 animate-pulse" />
            Account Settings
          </h1>
          <p className="text-gray-400">Manage your account and security settings</p>
        </div>

        {/* Security Score */}
        <div className="mb-8 animate-slide-in">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400 animate-pulse" />
                Security Score
              </h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white mr-2 animate-pulse">{securityScore}%</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  securityScore >= 80 ? 'bg-green-900 text-green-400' :
                  securityScore >= 60 ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {securityScore >= 80 ? (
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Excellent
                    </span>
                  ) : securityScore >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  securityScore >= 80 ? 'bg-green-500' :
                  securityScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-lg animate-slide-in">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover-lift ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
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
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400 animate-pulse" />
                  Profile Information
                </h2>

                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                        {...profileForm.register('first_name', { required: 'First name is required' })}
                      />
                      {profileForm.formState.errors.first_name && (
                        <p className="mt-1 text-sm text-red-400 animate-slide-in">
                          {profileForm.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                        {...profileForm.register('last_name', { required: 'Last name is required' })}
                      />
                      {profileForm.formState.errors.last_name && (
                        <p className="mt-1 text-sm text-red-400 animate-slide-in">
                          {profileForm.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                      {...profileForm.register('username', { required: 'Username is required' })}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="mt-1 text-sm text-red-400 animate-slide-in">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center btn-animated hover-glow"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Email Verification */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-400 animate-pulse" />
                    Email Verification
                  </h2>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-blue-400 animate-float" />
                      <div>
                        <h4 className="font-medium text-white">Email Status</h4>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.is_verified 
                          ? 'bg-green-900 text-green-400' 
                          : 'bg-yellow-900 text-yellow-400'
                      }`}>
                        {user?.is_verified ? (
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 animate-pulse" />
                            Pending
                          </span>
                        )}
                      </span>
                      {!user?.is_verified && (
                        <button
                          onClick={handleResendVerification}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg transition-colors btn-animated"
                        >
                          <Mail className="w-3 h-3 mr-1 inline" />
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
                    Two-Factor Authentication
                  </h2>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-3 text-purple-400 animate-float" />
                      <div>
                        <h4 className="font-medium text-white">2FA Status</h4>
                        <p className="text-sm text-gray-400">Add extra security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.is_2fa_enabled 
                          ? 'bg-green-900 text-green-400' 
                          : 'bg-red-900 text-red-400'
                      }`}>
                        {user?.is_2fa_enabled ? (
                          <span className="flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Enabled
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Disabled
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => setShow2FASetup(true)}
                        className={`text-white text-sm px-3 py-1 rounded-lg transition-colors btn-animated ${
                          user?.is_2fa_enabled
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {user?.is_2fa_enabled ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1 inline" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 mr-1 inline" />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-green-400 animate-pulse" />
                  Change Password
                </h2>

                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                        placeholder="Enter current password"
                        {...passwordForm.register('currentPassword', {
                          required: 'Current password is required'
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-400 animate-slide-in">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                        placeholder="Enter new password"
                        {...passwordForm.register('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300 transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-400 animate-slide-in">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center btn-animated hover-glow"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 logo-animated">
                  {getUserInitials(user)}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-400 text-sm">@{user?.username}</p>
                <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 card-animated hover-glow">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400 animate-pulse" />
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <div className="flex items-center">
                    {user?.is_verified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400 mr-1 animate-pulse" />
                        <span className="text-xs text-green-400">Yes</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-1 animate-pulse" />
                        <span className="text-xs text-yellow-400">No</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">2FA Enabled</span>
                  <div className="flex items-center">
                    {user?.is_2fa_enabled ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400 mr-1 animate-pulse" />
                        <span className="text-xs text-green-400">Yes</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-1 animate-pulse" />
                        <span className="text-xs text-yellow-400">No</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Member Since</span>
                  <span className="text-xs text-gray-300">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6 card-animated">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
                {user?.is_2fa_enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </h3>

              {!user?.is_2fa_enabled ? (
                qrCodeData ? (
                  <form onSubmit={twoFAForm.handleSubmit(handleEnable2FA)}>
                    <div className="text-center mb-6">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4 animate-float">
                        {qrCodeData.qr_code ? (
                          <img src={qrCodeData.qr_code} alt="QR Code" className="w-32 h-32" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-600 text-sm animate-pulse">
                            Loading QR Code...
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        Scan this code with your authenticator app
                      </p>
                      <div className="font-mono text-xs bg-slate-700 p-2 rounded break-all">
                        {qrCodeData.secret}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enter verification code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
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
                        <p className="mt-1 text-sm text-red-400 animate-slide-in">
                          {twoFAForm.formState.errors.totpCode.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg btn-animated"
                      >
                        {loading ? 'Enabling...' : 'Enable 2FA'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow2FASetup(false)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={twoFAForm.handleSubmit(handleSetup2FA)}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm your password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                        placeholder="Your current password"
                        {...twoFAForm.register('password', {
                          required: 'Password is required'
                        })}
                      />
                      {twoFAForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-400 animate-slide-in">
                          {twoFAForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg btn-animated"
                      >
                        {loading ? 'Setting up...' : 'Setup 2FA'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow2FASetup(false)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <form onSubmit={twoFAForm.handleSubmit(handleDisable2FA)}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter your password to disable 2FA
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-animated"
                      placeholder="Your password"
                      {...twoFAForm.register('password', {
                        required: 'Password is required'
                      })}
                    />
                    {twoFAForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-400 animate-slide-in">
                        {twoFAForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg btn-animated"
                    >
                      {loading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShow2FASetup(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
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

      {/* Background Animation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full animate-float blur-xl" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

export default Profile;