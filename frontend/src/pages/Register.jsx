import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const roles = [
  { id: 'stagiaire', icon: 'bi-mortarboard', label: 'Stagiaire', desc: 'Pour les étudiants cherchant un stage' },
  { id: 'journaliste', icon: 'bi-mic', label: 'Journaliste', desc: 'Pour les professionnels de la presse' },
  { id: 'chercheur', icon: 'bi-book', label: 'Chercheur', desc: 'Accès à la bibliothèque et archives' },
  { id: 'ecole', icon: 'bi-building', label: 'École', desc: 'Organisation de visites guidées' }
];

const Register = () => {
  const { t } = useTranslation();
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', cin: '', email: '', password: '', password_confirmation: '',
    phone: '', date_of_birth: '', nationality: 'Moroccan', country: 'Morocco', city: '',
    address_line: '', school_name: '', press_info: '', research_topic: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      cin: formData.cin,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
      nationality: formData.nationality,
      country: formData.country,
      city: formData.city,
      address_line: formData.address_line,
      role: role
    };

    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      const response = err.response?.data;
      if (response?.errors) {
        const cinError = response.errors.cin?.[0];
        const emailError = response.errors.email?.[0];
        const firstError = cinError || emailError || Object.values(response.errors)[0]?.[0];
        setError(firstError || response.message || 'Erreur lors de l\'inscription');
      } else {
        setError(response?.message || 'Erreur lors de l\'inscription');
      }
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
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10 animate-pulse">
          <div className="flex justify-center mb-6"><div className="h-14 w-14 bg-gray-200 rounded-full"></div></div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-3"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-lg mx-auto"></div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl relative z-10 animate-pulse">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
            <div className="grid sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-6 border-2 border-gray-100 rounded-xl space-y-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                  <div className="h-4 w-2/3 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
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

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/royaumeDuMarocLogo.png" 
              alt="Royaume du Maroc Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Créer un compte' : 'Compléter votre profil'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {step === 1 ? 'Choisissez votre profil pour continuer' : `Inscription en tant que ${roles.find(r => r.id === role)?.label}`}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
              <i className="bi bi-exclamation-circle-fill text-orange-500 text-lg"></i>
              <span className="text-sm text-gray-700 flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg text-xs"></i>
              </button>
            </div>
          )}

          {step === 1 ? (
            // Step 1: Role Selection
            <div className="grid sm:grid-cols-2 gap-5">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className="group text-left p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <i className={`bi ${r.icon} text-orange-500 text-xl group-hover:text-white transition-colors duration-300`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{r.label}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            // Step 2: Registration Form
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Prénom *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Nom *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">CIN *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.cin}
                    onChange={e => setFormData({...formData, cin: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Mot de passe *</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Confirmer mot de passe *</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.password_confirmation}
                    onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.date_of_birth}
                    onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Nationalité</label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.nationality}
                    onChange={e => setFormData({...formData, nationality: e.target.value})}
                  >
                    <option value="Moroccan">Marocaine</option>
                    <option value="Other">Autre</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Pays</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Ville</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-2">Adresse</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={formData.address_line}
                  onChange={e => setFormData({...formData, address_line: e.target.value})}
                />
              </div>

              {(role === 'stagiaire' || role === 'ecole') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">
                    {role === 'stagiaire' ? 'Établissement / Université' : 'Nom de l\'établissement'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.school_name}
                    onChange={e => setFormData({...formData, school_name: e.target.value})}
                  />
                </div>
              )}

              {role === 'journaliste' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Organe de presse</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.press_info}
                    onChange={e => setFormData({...formData, press_info: e.target.value})}
                  />
                </div>
              )}

              {role === 'chercheur' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-2">Sujet de recherche</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all duration-200 bg-gray-50 hover:bg-white"
                    value={formData.research_topic}
                    onChange={e => setFormData({...formData, research_topic: e.target.value})}
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1 transition-colors duration-200 font-medium"
                >
                  <i className="bi bi-arrow-left text-xs"></i>
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <i className="bi bi-hourglass-split animate-spin"></i>
                      Inscription...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus"></i>
                      Créer mon compte
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200">
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;