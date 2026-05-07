import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = ({ setSidebarOpen, darkMode, setDarkMode }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('/notifications');
          setNotifications(res.data.data || res.data);
        } catch (e) {
          console.error('Error fetching notifications:', e);
        }
      };
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng);
    // Close any open dropdowns
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'ar', label: 'AR', name: 'العربية' }
  ];

  return (
    <header className={`sticky top-0 z-30 w-full transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-b border-gray-700' 
        : 'bg-white border-b border-gray-200'
    } shadow-sm`}>
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section - Menu button & Logo */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            className={`lg:hidden transition-colors ${
              darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
            }`}
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img 
              src="/royaumeDuMarocLogo.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain"
            />
            <span className={`text-lg font-bold tracking-tight hidden sm:inline ${
              darkMode ? 'text-orange-400' : 'text-orange-500'
            }`}>PARLEMENT</span>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language Switcher */}
          <div className={`hidden md:flex items-center gap-1 pr-3 ${isRTL ? 'border-l' : 'border-r'} ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {languages.map(lang => (
              <button 
                key={lang.code}
                onClick={() => toggleLang(lang.code)}
                className={`relative text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                  i18n.language === lang.code 
                    ? darkMode
                      ? 'text-orange-400 bg-orange-900/30'
                      : 'text-orange-600 bg-orange-50'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={lang.name}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-orange-500 hover:bg-gray-100'
            }`}
            title={darkMode ? t('navbar_theme_light') : t('navbar_theme_dark')}
          >
            {darkMode ? <i className="bi bi-sun-fill text-base"></i> : <i className="bi bi-moon-fill text-base"></i>}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors relative ${
                darkMode 
                  ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-orange-500 hover:bg-gray-100'
              }`}
              title={t('navbar_notifications')}
            >
              <i className="bi bi-bell-fill text-base"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className={`absolute ${
                  isRTL ? 'left-0' : 'right-0'
                } mt-2 w-80 rounded-xl shadow-lg border z-20 overflow-hidden ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 border-b flex justify-between items-center ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-700' 
                      : 'bg-orange-50 border-gray-200'
                  }`}>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('navbar_notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        {unreadCount} nouvelles
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('notifications_empty')}
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b transition-colors cursor-pointer ${
                            darkMode 
                              ? 'border-gray-700 hover:bg-gray-700/50'
                              : 'border-gray-100 hover:bg-orange-50'
                          } ${!notif.read_at ? (darkMode ? 'bg-orange-900/20' : 'bg-orange-50/30') : ''}`}
                          onClick={() => {
                            if (!notif.read_at) markAsRead(notif.id);
                          }}
                        >
                          <div className={`flex justify-between items-start mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notif.data?.title || t('notification_default')}
                            </span>
                            {!notif.read_at && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1"></span>}
                          </div>
                          <p className={`text-sm mb-2 truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {notif.data?.message}
                          </p>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(notif.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className={`p-2 border-t text-center ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Link
                      to="/notifications"
                      className={`text-xs font-medium transition-colors ${
                        darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      {t('navbar_view_all_notifications')}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Simple User Avatar */}
          <div className={`ml-2 pl-2 ${isRTL ? 'mr-2 pr-2 border-r' : 'ml-2 pl-2 border-l'} ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {((user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'U')).toUpperCase()}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;