import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Navbar = ({ setSidebarOpen }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

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
      const interval = setInterval(fetchNotifications, 60000); // Check every minute
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng);
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
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section - Menu button & Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-gray-500 hover:text-navy-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-800 rounded flex items-center justify-center">
              <i className="bi bi-bank2 text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold text-navy-800 tracking-tight hidden sm:inline">PARLEMENT</span>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1 border-r border-gray-200 pr-3">
            {languages.map(lang => (
              <button 
                key={lang.code}
                onClick={() => toggleLang(lang.code)}
                className={`relative text-xs font-medium px-2 py-1 rounded transition-all ${
                  i18n.language === lang.code 
                    ? 'text-navy-800 bg-navy-50' 
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
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy-800 transition-colors"
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? <i className="bi bi-sun-fill text-base"></i> : <i className="bi bi-moon-fill text-base"></i>}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy-800 transition-colors relative"
              title="Notifications"
            >
              <i className="bi bi-bell-fill text-base"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} nouvelles</span>}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read_at ? 'bg-blue-50/50' : ''}`}
                          onClick={() => {
                            if (!notif.read_at) markAsRead(notif.id);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-gray-900">{notif.data?.title || 'Notification'}</span>
                            {!notif.read_at && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 truncate">{notif.data?.message}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                    <Link
                      to="/notifications"
                      className="text-xs font-medium text-navy-800 hover:text-navy-900 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 hover:opacity-80 transition-opacity"
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.first_name || user?.name || 'Utilisateur'}
                </span>
                <span className="text-xs text-gray-500 capitalize">{user?.role || 'Invité'}</span>
              </div>
              <div className="relative">
                <div className="w-9 h-9 bg-navy-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {((user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'U')).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <i className={`bi bi-chevron-down text-gray-400 text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-20">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    <p className="text-xs text-navy-800 mt-1 capitalize">
                      <span className="inline-block w-1.5 h-1.5 bg-navy-800 rounded-full mr-1"></span>
                      {user?.role}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="bi bi-grid-3x3-gap-fill text-gray-400 text-sm"></i>
                      Tableau de bord
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="bi bi-person-circle text-gray-400 text-sm"></i>
                      Mon profil
                    </Link>
                    <Link
                      to="/demandes"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="bi bi-file-text text-gray-400 text-sm"></i>
                      Mes demandes
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="bi bi-box-arrow-right text-red-500 text-sm"></i>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .text-navy-800 { color: #0f2b4d; }
        .hover\\:text-navy-800:hover { color: #0f2b4d; }
      `}</style>
    </header>
  );
};

export default Navbar;