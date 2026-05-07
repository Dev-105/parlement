import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // DEFAULT: Light mode (false)
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference on mount, but default to false if not set
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Only set dark mode if explicitly saved as 'dark'
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else {
      // Ensure light mode is set
      setDarkMode(false);
      localStorage.setItem('theme', 'light');
    }
  }, []);

  useEffect(() => {
    // Apply RTL direction to body
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background decoration - Only show in light mode */}
      {!darkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            src="/parlement.png" 
            alt="Parlement Background" 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-5"
          />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-30"></div>
        </div>
      )}

      {/* Dark mode background decoration */}
      {darkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-900/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} darkMode={darkMode} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden relative z-10 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Top Navigation Bar */}
        <Navbar setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Scrollable Content */}
        <main className={`flex-1 overflow-y-auto p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50/50'
        }`}>
          <div className={`max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;