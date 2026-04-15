import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen, darkMode }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isRTL = i18n?.language === 'ar';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = () => {
    const first = user?.first_name?.charAt(0) || '';
    const last = user?.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const navLinks = [
    { to: '/dashboard', icon: 'bi-grid-3x3-gap-fill', label: t('sidebar_dashboard') },
    { to: '/notifications', icon: 'bi-bell', label: t('sidebar_notifications') },
    { to: '/demandes', icon: 'bi-file-earmark-text', label: t('sidebar_requests') },
    { to: '/profile', icon: 'bi-person', label: t('sidebar_profile') },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen transition-all duration-300 ease-in-out flex flex-col shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          darkMode 
            ? 'bg-gray-800 border-r border-gray-700' 
            : 'bg-white border-r border-gray-200'
        }`}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between px-5 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img 
              src="/royaumeDuMarocLogo.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain"
            />
            <span className={`text-lg font-bold tracking-tight ${
              darkMode ? 'text-orange-400' : 'text-orange-500'
            }`}>PARLEMENT</span>
          </div> */}
          <button 
            className={`lg:hidden transition-colors ${
              darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-400 hover:text-orange-500'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        {/* User Info Section */}
        <div className={`px-5 py-3 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-100 border border-orange-200'
            }`}>
              <span className={`text-sm font-semibold ${
                darkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>{getInitials()}</span>
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className={`text-sm font-semibold truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.first_name} {user?.last_name}
              </p>
              <p className={`text-xs capitalize ${
                darkMode ? 'text-orange-400' : 'text-orange-500'
              }`}>{user?.role || 'Utilisateur'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''} ${
                  isActive 
                    ? darkMode 
                      ? 'bg-orange-900/30 text-orange-400' 
                      : 'bg-orange-50 text-orange-600'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-orange-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                }`
              }
            >
              <i className={`${link.icon} text-lg`}></i>
              <span className="text-sm font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer - Logout Button */}
        <div className={`p-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode 
                ? 'text-gray-400 hover:bg-red-900/20 hover:text-red-400' 
                : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <i className="bi bi-box-arrow-right text-lg"></i>
            <span className="text-sm font-medium">{t('sidebar_logout')}</span>
          </button>
          <div className="mt-3 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Version 2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;