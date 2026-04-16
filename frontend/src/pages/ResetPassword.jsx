import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Skeleton Loader Component
const ResetPasswordSkeleton = ({ darkMode, isRTL }) => (
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
          <div className={`h-8 w-48 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 w-64 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-5">
          <div>
            <div className={`h-4 w-32 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-12 w-full rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div>
            <div className={`h-4 w-40 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-12 w-full rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`h-12 w-full rounded-xl mt-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        {/* Footer Link Skeleton */}
        <div className={`mt-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`h-4 w-32 rounded-lg mx-auto ${isRTL ? 'mr-auto' : 'ml-auto'} ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  </div>
);

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!token || !email) {
      setError('Lien de réinitialisation invalide. Veuillez refaire une demande.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError('');
    setErrors({});

    try {
      const response = await axios.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      }, {
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue. Le lien peut être expiré.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton loader on initial load
  if (initialLoading) {
    return <ResetPasswordSkeleton darkMode={darkMode} isRTL={isRTL} />;
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
              Nouveau mot de passe
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Veuillez sécuriser votre compte en choisissant un nouveau mot de passe fort.
            </p>
          </div>

          {error && !errors.password && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium text-center ${
              darkMode 
                ? 'bg-red-900/30 border border-red-800 text-red-300'
                : 'bg-red-50 border border-red-100 text-red-600'
            }`}>
              {error}
            </div>
          )}

          {success ? (
            <div className={`mb-6 p-6 rounded-xl flex flex-col items-center text-center ${
              darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50 border border-emerald-100'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'
              }`}>
                <i className={`bi bi-check-circle-fill text-3xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}></i>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                Félicitations !
              </h3>
              <p className={`text-sm font-medium mb-6 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé...
              </p>
              <Link
                to="/login"
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-center transition-all duration-200 ${
                  darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
                } shadow-md hover:shadow-lg`}
              >
                Se connecter maintenant
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nouveau mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`bi bi-lock text-lg transition-colors ${
                      darkMode ? 'text-gray-500 group-focus-within:text-orange-400' : 'text-gray-400 group-focus-within:text-orange-500'
                    }`}></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!token || !email || success}
                    className={`block w-full pl-11 pr-11 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:bg-white'
                    } ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} ${
                      darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                    } text-base transition-colors`}></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className={`bi bi-lock text-lg transition-colors ${
                      darkMode ? 'text-gray-500 group-focus-within:text-orange-400' : 'text-gray-400 group-focus-within:text-orange-500'
                    }`}></i>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    disabled={!token || !email || success}
                    className={`block w-full pl-11 pr-11 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:bg-white'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} ${
                      darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                    } text-base transition-colors`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token || !email}
                className={`w-full mt-4 py-3.5 px-4 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
                  loading || !token || !email
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Modification en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bi bi-key"></i>
                    Réinitialiser le mot de passe
                  </span>
                )}
              </button>
            </form>
          )}
          
          <div className={`mt-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
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

export default ResetPassword;