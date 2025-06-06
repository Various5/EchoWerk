// src/pages/Profile.js
import React, { useState } from 'react';
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
  Key
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile, changePassword, setup2FA, enable2FA, disable2FA, loading } = useAuth();
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
      email: user?.email || ''
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

  const handleProfileUpdate = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      // Update form with new data
      profileForm.reset(data);
    }
  };

  const handlePasswordChange = async (data) => {
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      passwordForm.reset();
    }
  };

  const handleSetup2FA = async () => {
    const result = await setup2FA();
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" /> }
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
              <Link to="/dashboard" className="nav-link">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link active">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={logout} className="btn btn-ghost">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile and security preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 mb-8 p-1 bg-gray-800/50 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
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
                    <h2 className="card-title">Profile Information</h2>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="profile-form">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                      <div className="avatar">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Profile Picture</h3>
                        <p className="text-gray-400 text-sm mb-3">
                          Upload a profile picture to personalize your account
                        </p>
                        <button type="button" className="btn btn-secondary btn-sm">
                          <Camera className="w-4 h-4" />
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-input"
                          {...profileForm.register('first_name', { required: 'First name is required' })}
                        />
                        {profileForm.formState.errors.first_name && (
                          <p className="form-error">
                            <AlertCircle className="w-4 h-4" />
                            {profileForm.formState.errors.first_name.message}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-input"
                          {...profileForm.register('last_name', { required: 'Last name is required' })}
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
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-input"
                        {...profileForm.register('username', { required: 'Username is required' })}
                      />
                      {profileForm.formState.errors.username && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {profileForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        {...profileForm.register('email', { required: 'Email is required' })}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Security Settings</h2>
                  </div>

                  <div className="security-settings">
                    {/* Email Verification */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Email Verification</h4>
                        <p>Your email address verification status</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`status-badge ${user?.is_verified ? 'status-verified' : 'status-unverified'}`}>
                          {user?.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                        {!user?.is_verified && (
                          <button className="btn btn-accent btn-sm">
                            <Mail className="w-4 h-4" />
                            Verify
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`status-badge ${user?.is_2fa_enabled ? 'status-2fa' : 'status-unverified'}`}>
                          {user?.is_2fa_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        {!user?.is_2fa_enabled ? (
                          <button onClick={handleSetup2FA} className="btn btn-accent btn-sm">
                            <Smartphone className="w-4 h-4" />
                            Enable 2FA
                          </button>
                        ) : (
                          <button
                            onClick={() => setShow2FASetup(true)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Shield className="w-4 h-4" />
                            Manage 2FA
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2FA Setup Modal */}
                    {show2FASetup && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="glass-card max-w-md w-full p-6">
                          <h3 className="text-xl font-semibold text-white mb-4">
                            {user?.is_2fa_enabled ? 'Manage Two-Factor Authentication' : 'Setup Two-Factor Authentication'}
                          </h3>

                          {!user?.is_2fa_enabled && qrCodeData ? (
                            <form onSubmit={twoFAForm.handleSubmit(handleEnable2FA)}>
                              <div className="text-center mb-6">
                                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                  {/* QR Code will be generated by backend and displayed here */}
                                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                                    QR Code Here
                                  </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">
                                  Scan this QR code with your authenticator app
                                </p>
                                <div className="font-mono text-xs bg-gray-800 p-2 rounded">
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
                                  {loading ? 'Enabling...' : 'Enable 2FA'}
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
                          ) : user?.is_2fa_enabled ? (
                            <form onSubmit={twoFAForm.handleSubmit(handleDisable2FA)}>
                              <div className="form-group mb-4">
                                <label className="form-label">Enter your password to disable 2FA</label>
                                <input
                                  type="password"
                                  className="form-input"
                                  placeholder="Your password"
                                  {...twoFAForm.register('password', {
                                    required: 'Password is required'
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
                                  {loading ? 'Disabling...' : 'Disable 2FA'}
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
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Change Password</h2>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="profile-form">
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="form-input pr-10"
                          placeholder="Enter current password"
                          {...passwordForm.register('currentPassword', {
                            required: 'Current password is required'
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
                      <label className="form-label">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="form-input pr-10"
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
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="form-error">
                          <AlertCircle className="w-4 h-4" />
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
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
              <div className="card">
                <div className="text-center">
                  <div className="avatar mb-4">
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
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Account Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Email Verified</span>
                    <span className={`w-2 h-2 rounded-full ${user?.is_verified ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">2FA Enabled</span>
                    <span className={`w-2 h-2 rounded-full ${user?.is_2fa_enabled ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Account Active</span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <button className="btn btn-secondary w-full text-sm">
                    <Mail className="w-4 h-4" />
                    Resend Verification
                  </button>
                  <button className="btn btn-secondary w-full text-sm">
                    <Shield className="w-4 h-4" />
                    Security Report
                  </button>
                  <button className="btn btn-secondary w-full text-sm">
                    <User className="w-4 h-4" />
                    Export Data
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

export default Profile;