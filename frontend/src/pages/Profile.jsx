import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

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
      stagiaire: 'Stagiaire',
      journaliste: 'Journaliste',
      chercheur: 'Chercheur',
      ecole: 'Établissement scolaire',
      admin: 'Administrateur'
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
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setIsEditing(false);
      setSelectedProfileImage(null);
      setSelectedBannerImage(null);
    } catch (err) {
      console.error('Update error:', err);
      const response = err.response?.data;
      let errorText = 'Erreur lors de la mise à jour';

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
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    try {
      await api.post('/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const displayUser = isAdminViewing ? profileUser : user;
  const pageTitle = isAdminViewing ? 'Profil utilisateur' : 'Mon profil';
  
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
        setMessage({ type: 'error', text: 'Impossible de charger le profil de l\'utilisateur.' });
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

  if (isAdminViewing && isLoadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <i className="bi bi-arrow-repeat animate-spin text-3xl text-orange-500"></i>
      </div>
    );
  }

  if (isAdminViewing && !displayUser) {
    return (
      <div className={`text-center p-12 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <i className={`bi bi-exclamation-circle text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
        <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Utilisateur introuvable
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
          Gérez vos informations personnelles et sécurisez votre compte
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
              Modifier
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
            Informations personnelles
          </h3>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'sm:gap-x-6' : ''}`}>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prénom *
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
                    Nom *
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
                  Téléphone
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
                  Ville
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
                  Adresse
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
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setMessage({ type: 'error', text: 'La photo de profil doit être inférieure à 5MB.' });
                        setSelectedProfileImage(null);
                        return;
                      }
                      setMessage({ type: '', text: '' });
                      setSelectedProfileImage(file);
                    }}
                    className={`w-full text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    JPG, JPEG ou PNG, max 5MB
                  </p>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bannière
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setMessage({ type: 'error', text: 'La bannière doit être inférieure à 5MB.' });
                        setSelectedBannerImage(null);
                        return;
                      }
                      setMessage({ type: '', text: '' });
                      setSelectedBannerImage(file);
                    }}
                    className={`w-full text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    JPG, JPEG ou PNG, max 5MB
                  </p>
                </div>
              </div>
              <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
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
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prénom et nom</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.first_name} {displayUser?.last_name}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adresse email</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {displayUser?.email}
                  <i className="bi bi-patch-check-fill text-emerald-500 text-xs" title="Vérifié"></i>
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CIN</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.cin || 'Non renseigné'}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.phone || 'Non renseigné'}
                </span>
              </div>
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ville</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.city || 'Non renseignée'}
                </span>
              </div>
              <div className={`flex justify-between items-start pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adresse</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-left' : 'text-right'}`}>
                  {displayUser?.address_line || 'Non renseignée'}
                </span>
              </div>
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Membre depuis</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString('fr-FR') : 'Nouveau'}
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
              Sécurité
            </h3>

            <div className="space-y-4">
              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mot de passe</span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Dernière modification: {user?.password_updated_at ? new Date(user.password_updated_at).toLocaleDateString('fr-FR') : 'Jamais'}
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
                  Changer
                </button>
              </div>

              <div className={`flex justify-between items-center pb-3 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Authentification à deux facteurs
                  </span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Sécurisez votre compte
                  </p>
                </div>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 border border-gray-600 hover:bg-gray-700'
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}>
                  Activer
                </button>
              </div>

              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sessions actives</span>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Gérer vos appareils connectés
                  </p>
                </div>
                <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 border border-gray-600 hover:bg-gray-700'
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}>
                  Voir
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
                Changer le mot de passe
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
                    Mot de passe actuel
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
                    Nouveau mot de passe
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
                    Confirmer le nouveau mot de passe
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
                  {loading ? 'Chargement...' : 'Confirmer'}
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
                  Annuler
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