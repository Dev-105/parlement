import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    { to: '/dashboard', icon: 'bi-grid-3x3-gap-fill', label: 'Tableau de bord' },
    { to: '/notifications', icon: 'bi-bell', label: 'Notifications' },
    { to: '/demandes', icon: 'bi-file-earmark-text', label: 'Mes demandes' },
    { to: '/profile', icon: 'bi-person', label: 'Mon profil' },
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
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-navy-800 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <i className="bi bi-bank2 text-white text-base"></i>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">PARLEMENT</span>
          </div>
          <button 
            className="lg:hidden text-navy-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        {/* User Info Section */}
        <div className="px-5 py-4 border-b border-navy-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center border border-navy-600">
              <span className="text-sm font-semibold text-white">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-navy-300 capitalize">{user?.role || 'Utilisateur'}</p>
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-navy-300 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              <i className={`${link.icon} text-lg`}></i>
              <span className="text-sm font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer - Logout Button */}
        <div className="p-4 border-t border-navy-700">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-navy-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <i className="bi bi-box-arrow-right text-lg"></i>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
          <div className="mt-3 text-center">
            <p className="text-xs text-navy-500">Version 2.0.0</p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .bg-navy-700 { background-color: #1e3a5f; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .text-navy-300 { color: #a0b4d0; }
        .text-navy-500 { color: #5a7a9a; }
        .border-navy-600 { border-color: #2a4a6e; }
        .border-navy-700 { border-color: #1e3a5f; }
        .hover\\:bg-navy-700:hover { background-color: #1e3a5f; }
      `}</style>
    </>
  );
};

export default Sidebar;