import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img src="/parlement.png" alt="Parlement Background" className="absolute top-0 left-0 w-full h-full object-cover opacity-5" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40"></div>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-pulse">
          <div className="flex justify-center mb-6"><div className="h-16 w-16 bg-gray-200 rounded-full"></div></div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-3"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-lg mx-auto"></div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-pulse">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10 space-y-6">
            <div className="space-y-2"><div className="h-4 w-24 bg-gray-100 rounded-lg"></div><div className="h-11 w-full bg-gray-50 border border-gray-100 rounded-xl"></div></div>
            <div className="space-y-2"><div className="h-4 w-24 bg-gray-100 rounded-lg"></div><div className="h-11 w-full bg-gray-50 border border-gray-100 rounded-xl"></div></div>
            <div className="flex justify-between items-center pt-2"><div className="h-4 w-32 bg-gray-100 rounded-lg"></div><div className="h-4 w-24 bg-gray-100 rounded-lg"></div></div>
            <div className="h-12 w-full bg-orange-100 rounded-xl mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background decoration with parlement.png */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          src="/parlement.png" 
          alt="Parlement Background" 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-5"
        />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo - Using your image */}
        <div className="flex justify-center">
          <img 
            src="/royaumeDuMarocLogo.png" 
            alt="Royaume du Maroc Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Connexion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accédez à votre espace sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
          {error && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
              <i className="bi bi-exclamation-circle-fill text-orange-500 text-lg"></i>
              <span className="text-sm text-gray-700 flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg text-xs"></i>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-envelope text-gray-400 group-focus-within:text-orange-500 transition-colors text-sm"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="exemple@parlement.ma"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-lock text-gray-400 group-focus-within:text-orange-500 transition-colors text-sm"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-gray-400 text-sm hover:text-gray-600 transition-colors`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors font-medium">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <i className="bi bi-hourglass-split animate-spin"></i>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Nouveau utilisateur ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                <i className="bi bi-person-plus text-orange-500"></i>
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© 2026 Parlement du Maroc. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;