import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Demandes from './pages/Demandes';
import DemandeDetail from './pages/DemandeDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  // Detect dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
  }, []);

  if (loading) {
    return (
      <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50/50'}`}>
        {/* Sidebar Skeleton */}
        <div className={`hidden md:flex w-72 flex-col animate-pulse z-20 ${
          darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-100'
        }`}>
          <div className={`h-20 border-b flex items-center px-6 ${
            darkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`ml-4 w-32 h-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex-1 p-4 space-y-3 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-12 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar Skeleton */}
          <div className={`h-20 border-b flex items-center justify-between px-6 animate-pulse z-10 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`w-10 h-10 md:hidden rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`hidden md:block w-64 h-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className={`flex-1 p-6 lg:p-8 animate-pulse space-y-6 overflow-hidden ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50/50'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <div className={`w-48 h-8 rounded-lg mb-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                <div className={`w-32 h-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              </div>
              <div className={`hidden sm:flex w-40 h-10 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-32 rounded-2xl border p-5 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
                }`}>
                  <div className={`w-10 h-10 rounded-xl mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                  <div className={`w-24 h-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className={`h-96 rounded-2xl border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}></div>
              <div className={`h-96 rounded-2xl border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="demandes" element={<Demandes />} />
        <Route path="demandedetail/:id" element={<DemandeDetail />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin/users/:id" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;