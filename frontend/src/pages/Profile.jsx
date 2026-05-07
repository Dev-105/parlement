import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// Skeleton Components
const ProfileSkeleton = ({ darkMode, isRTL }) => (
  <div className={`max-w-5xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
    {/* Header Skeleton */}
    <div>
      <div className={`w-48 h-8 rounded-lg animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`w-64 h-4 rounded mt-1 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </div>

    {/* Profile Header Skeleton */}
    <div className={`rounded-2xl overflow-hidden animate-pulse ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
    }`}>
      {/* Banner Skeleton */}
      <div className={`h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      
      {/* Avatar & Info Skeleton */}
      <div className={`px-8 pb-8 relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`w-28 h-28 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-white'} ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        } shadow-lg shrink-0`}></div>
        <div className="flex-1 pb-2">
          <div className={`w-48 h-7 rounded-lg mx-auto sm:mx-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`w-32 h-5 rounded-lg mt-2 mx-auto sm:mx-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className={`w-24 h-9 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      </div>
    </div>

    {/* Two Column Grid Skeleton */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Personal Info Card Skeleton */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-6 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`w-32 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div className={`w-24 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`w-32 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Card Skeleton */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-6 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`w-24 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div>
                <div className={`w-32 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`w-48 h-3 rounded mt-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
              <div className={`w-16 h-7 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { id: profileUserId } = useParams();
  const { user, setUser, fetchUser } = useContext(AuthContext);
  const isRTL = i18n.language === 'ar';
  const isAdminViewing = Boolean(profileUserId) && user?.role === 'admin';
  const [profileUser, setProfileUser] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address_line: user?.address_line || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const getInitials = (person) => {
    const first = person?.first_name?.charAt(0) || '';
    const last = person?.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getRoleLabel = (role) => {
    const roles = {
      stagiaire: t('dashboard.types.stage', 'Stagiaire'),
      journaliste: t('dashboard.types.presse', 'Journaliste'),
      chercheur: t('dashboard.types.bibliotheque', 'Chercheur'),
      ecole: t('dashboard.types.visite', 'Établissement scolaire'),
      admin: t('profile.roles.admin', 'Administrateur')
    };
    return roles[role] || role;
  };

  const getRoleIcon = (role) => {
    const icons = {
      stagiaire: 'bi bi-mortarboard',
      journaliste: 'bi bi-newspaper',
      chercheur: 'bi bi-search',
      ecole: 'bi bi-building',
      admin: 'bi bi-shield-lock'
    };
    return icons[role] || 'bi bi-person';
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isAdminViewing) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = new FormData();
      payload.append('first_name', formData.first_name);
      payload.append('last_name', formData.last_name);
      payload.append('phone', formData.phone || '');
      payload.append('city', formData.city || '');
      payload.append('address_line', formData.address_line || '');

      if (selectedProfileImage) {
        payload.append('profile_image', selectedProfileImage);
      }

      if (selectedBannerImage) {
        payload.append('banner_image', selectedBannerImage);
      }

      const response = await api.post('/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchUser();
      
      setMessage({ type: 'success', text: t('profile.update_success') });
      setIsEditing(false);
      setSelectedProfileImage(null);
      setSelectedBannerImage(null);
    } catch (err) {
      console.error('Update error:', err);
      const response = err.response?.data;
      let errorText = t('profile.update_error');

      if (response) {
        if (response.message) {
          errorText = response.message;
        }

        if (response.errors) {
          const firstError = Object.values(response.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorText = firstError[0];
          } else if (typeof firstError === 'string') {
            errorText = firstError;
          }
        }
      }

      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: 'error', text: t('profile.password_mismatch') });
      setLoading(false);
      return;
    }

    try {
      await api.post('/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: t('profile.password_success') });
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('profile.password_error') });
    } finally {
      setLoading(false);
    }
  };

  const displayUser = isAdminViewing ? profileUser : user;
  const pageTitle = isAdminViewing ? t('profile.admin_view_title') : t('profile.my_profile');
  
  const profileImageUrl = selectedProfileImage 
    ? URL.createObjectURL(selectedProfileImage) 
    : displayUser?.profile_image;
    
  const bannerImageUrl = selectedBannerImage 
    ? URL.createObjectURL(selectedBannerImage) 
    : displayUser?.banner_image;

  useEffect(() => {
    if (!isAdminViewing && user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        city: user.city || '',
        address_line: user.address_line || ''
      });
    }
  }, [user, isAdminViewing]);

  useEffect(() => {
    const loadUser = async () => {
      if (!isAdminViewing) return;
      setIsLoadingProfile(true);

      try {
        const response = await api.get(`/admin/users/${profileUserId}`);
        setProfileUser(response.data.data);
      } catch (err) {
        setMessage({ type: 'error', text: t('profile.load_error') });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUser();
  }, [isAdminViewing, profileUserId]);

  useEffect(() => {
    return () => {
      if (selectedProfileImage) {
        URL.revokeObjectURL(profileImageUrl);
      }
      if (selectedBannerImage) {
        URL.revokeObjectURL(bannerImageUrl);
      }
    };
  }, [selectedProfileImage, selectedBannerImage]);

  // Show skeleton loading while loading profile (admin view)
  if (isAdminViewing && isLoadingProfile) {
    return <ProfileSkeleton darkMode={darkMode} isRTL={isRTL} />;
  }

  // Show skeleton loading while user is not loaded yet
  if (!displayUser && !isLoadingProfile) {
    return <ProfileSkeleton darkMode={darkMode} isRTL={isRTL} />;
  }

  if (isAdminViewing && !displayUser) {
    return (
      <div className={`text-center p-12 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <i className={`bi bi-exclamation-circle text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
        <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('profile.not_found')}
        </h3>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          isRTL ? 'flex-row-reverse' : ''
        } ${
          message.type === 'success' 
            ? darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'
            : darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <i className={`${message.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'} ${
            message.type === 'success' 
              ? darkMode ? 'text-emerald-400' : 'text-emerald-500'
              : darkMode ? 'text-red-400' : 'text-red-500'
          }`}></i>
          <span className={`text-sm ${message.type === 'success' 
            ? darkMode ? 'text-emerald-300' : 'text-emerald-700'
            : darkMode ? 'text-red-300' : 'text-red-700'
          }`}>
            {message.text}
          </span>
        </div>
      )}

      {/* Profile Header */}
      <div className={`rounded-2xl shadow-sm overflow-hidden ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        {/* Banner */}
        <div
          className="h-32 relative bg-cover bg-center"
          style={bannerImageUrl ? { backgroundImage: `url(${bannerImageUrl})` } : undefined}
        >
          {!bannerImageUrl && (
            <div className={`h-full bg-gradient-to-r ${darkMode ? 'from-orange-900 to-orange-800' : 'from-orange-500 to-orange-600'}`}></div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Avatar & Info */}
        <div className={`px-8 pb-8 relative -mt-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''} text-center sm:text-left`}>
          <div className={`w-28 h-28 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-white'} ${
            darkMode ? 'bg-orange-900/30' : 'bg-orange-100'
          } shadow-lg flex items-center justify-center shrink-0 relative z-10 overflow-hidden`}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {getInitials(displayUser)}
              </span>
            )}
          </div>
          <div className="flex-1 pb-2">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {displayUser?.first_name} {displayUser?.last_name}
            </h2>
            <div className={`flex items-center justify-center sm:justify-start gap-2 mt-1 ${isRTL ? 'sm:justify-end' : ''}`}>
              <i className={`${getRoleIcon(displayUser?.role)} ${darkMode ? 'text-orange-400' : 'text-orange-600'} text-sm`}></i>
              <p className={`font-medium text-sm capitalize ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {getRoleLabel(displayUser?.role)}
              </p>
            </div>
          </div>
          {!isEditing && !isAdminViewing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              } ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="bi bi-pencil"></i>
              {t('profile.edit_profile')}
            </button>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className={`rounded-2xl shadow-sm p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <i className={`bi bi-person ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}></i>
            {t('profile.personal_info')}
          </h3>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'sm:gap-x-6' : ''}`}>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.first_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.last_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.city')}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.address')}
                </label>
                <textarea
                  value={formData.address_line}
                  onChange={(e) => setFormData({...formData, address_line: e.target.value})}
                  rows="2"
                  className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                ></textarea>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.profile_photo')}
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setMessage({ type: 'error', text: t('profile.photo_size_error') });
                        setSelectedProfileImage(null);
                        return;
                      }
                      setMessage({ type: '', text: '' });
                      setSelectedProfileImage(file);
                    }}
                    className={`w-full text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('profile.image_format_help')}
                  </p>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.banner')}
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setMessage({ type: 'error', text: t('profile.banner_size_error') });
                        setSelectedBannerImage(null);
                        return;
                      }
                      setMessage({ type: '', text: '' });
                      setSelectedBannerImage(file);
                    }}
                    className={`w-full text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('profile.image_format_help')}
                  </p>
                </div>
              </div>
              <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  {loading ? t('common.saving') : t('common.save')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.full_name')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.first_name} {displayUser?.last_name}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.email')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {displayUser?.email}
                  <i className="bi bi-patch-check-fill text-emerald-500 text-xs" title={t('common.verified')}></i>
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.cin')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.cin || t('profile.not_provided')}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.phone')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.phone || t('profile.not_provided')}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.city')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.city || t('profile.not_provided')}
                </span>
              </div>
              <div className={`flex justify-between items-start pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.address')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-left' : 'text-right'}`}>
                  {displayUser?.address_line || t('profile.not_provided')}
                </span>
              </div>
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.member_since')}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString('fr-FR') : t('common.new')}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isAdminViewing && (
          <div className={`rounded-2xl shadow-sm p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <i className={`bi bi-shield-lock ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}></i>
              {t('profile.security')}
            </h3>

            <div className="space-y-4">
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.password')}</span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t('profile.last_modified')} {user?.password_updated_at ? new Date(user.password_updated_at).toLocaleDateString('fr-FR') : t('common.never')}
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-orange-400 border border-orange-800 hover:bg-orange-900/20'
                      : 'text-orange-600 border border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  {t('common.change')}
                </button>
              </div>

              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('profile.2fa')}
                  </span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t('profile.2fa_desc')}
                  </p>
                </div>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 border border-gray-600 hover:bg-gray-700'
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}>
                  {t('common.enable')}
                </button>
              </div>

              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.active_sessions')}</span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t('profile.sessions_desc')}
                  </p>
                </div>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 border border-gray-600 hover:bg-gray-700'
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}>
                  {t('common.view')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-xl max-w-md w-full ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex justify-between items-center p-6 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('profile.change_password')}
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.current_password')}
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.new_password')}
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('profile.confirm_password')}
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                  />
                </div>
              </div>
              <div className={`flex gap-3 p-6 border-t rounded-b-2xl ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  {loading ? t('common.loading') : t('common.confirm')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;