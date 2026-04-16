import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Skeleton Loader Component
const ForgotPasswordSkeleton = ({ darkMode, isRTL }) => (
  <div className={`min-h-screen flex items-center justify-center p-4 relative ${
    darkMode ? 'bg-gray-900' : 'bg-white'
  }`}>
    <div className={`max-w-md w-full rounded-2xl overflow-hidden relative z-10 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
    }`}>
      <div className="p-8 animate-pulse">
        {/* Logo Skeleton */}
        <div className="flex justify-center mb-6">
          <div className={`h-14 w-14 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        {/* Header Skeleton */}
        <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`h-8 w-56 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 w-72 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-6">
          <div>
            <div className={`h-4 w-32 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-12 w-full rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`h-12 w-full rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        {/* Footer Link Skeleton */}
        <div className={`mt-8 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`h-4 w-40 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  </div>
);

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/forgot-password', { email }, {
        baseURL: 'http://localhost:8000',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setSuccessMessage(response.data.message || 'Le lien de réinitialisation a été envoyé.');
      setCooldown(60);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton loader on initial load
  if (initialLoading) {
    return <ForgotPasswordSkeleton darkMode={darkMode} isRTL={isRTL} />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!darkMode && (
          <>
            <img 
              src="/parlement.png" 
              alt="Parlement Background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-5"
            />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40"></div>
          </>
        )}
        {darkMode && (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-900/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-900/10 rounded-full blur-3xl"></div>
          </>
        )}
      </div>

      <div className={`max-w-md w-full rounded-2xl shadow-xl overflow-hidden relative z-10 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/royaumeDuMarocLogo.png" 
              alt="Royaume du Maroc Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Mot de passe oublié ?
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Pas de soucis, nous vous enverrons des instructions de réinitialisation.
            </p>
          </div>

          {successMessage ? (
            <div className={`mb-6 p-6 rounded-xl flex flex-col items-center text-center ${
              darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50 border border-emerald-100'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}>
                <i className={`bi bi-check-circle-fill text-2xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
              </div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                Vérifiez votre e-mail
              </h3>
              <p className={`text-sm font-medium mb-4 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                {successMessage}
              </p>
              
              <button
                onClick={handleSubmit}
                disabled={loading || cooldown > 0}
                className={`mt-2 text-sm font-medium focus:outline-none transition-colors ${
                  cooldown > 0 
                    ? darkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                    : darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
                }`}
              >
                {loading ? 'Envoi...' : (cooldown > 0 ? `Renvoyer l'e-mail dans ${cooldown}s` : "Renvoyer l'e-mail")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`p-4 rounded-xl text-sm font-medium text-center ${
                  darkMode 
                    ? 'bg-red-900/30 border border-red-800 text-red-300'
                    : 'bg-red-50 border border-red-100 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Adresse e-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`bi bi-envelope text-lg transition-colors ${
                      darkMode ? 'text-gray-500 group-focus-within:text-orange-400' : 'text-gray-400 group-focus-within:text-orange-500'
                    }`}></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`block w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:bg-white'
                    }`}
                    placeholder="nom@exemple.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
                  loading
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-send"></i>
                    Envoyer le lien
                  </span>
                )}
              </button>
            </form>
          )}
          
          <div className={`mt-8 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link 
              to="/login"
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                isRTL ? 'flex-row-reverse' : ''
              } ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`bi bi-arrow-left text-sm ${isRTL ? 'rotate-180' : ''}`}></i>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;