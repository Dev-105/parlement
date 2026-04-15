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
  const { register } = useContext(AuthContext);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-navy-800 rounded flex items-center justify-center">
              <i className="bi bi-bank2 text-white text-xl"></i>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Créer un compte' : 'Compléter votre profil'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {step === 1 ? 'Choisissez votre profil pour continuer' : `Inscription en tant que ${roles.find(r => r.id === role)?.label}`}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <i className="bi bi-exclamation-circle text-red-600"></i>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {step === 1 ? (
            // Step 1: Role Selection
            <div className="grid sm:grid-cols-2 gap-5">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className="group text-left p-5 border border-gray-200 rounded-lg hover:border-navy-800 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center mb-3">
                    <i className={`bi ${r.icon} text-navy-800 text-lg`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{r.label}</h3>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            // Step 2: Registration Form
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CIN *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.cin}
                    onChange={e => setFormData({...formData, cin: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Confirmer mot de passe *</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.password_confirmation}
                    onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.date_of_birth}
                    onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nationalité</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm bg-white"
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pays</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.address_line}
                  onChange={e => setFormData({...formData, address_line: e.target.value})}
                />
              </div>

              {(role === 'stagiaire' || role === 'ecole') && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {role === 'stagiaire' ? 'Établissement / Université' : 'Nom de l\'établissement'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.school_name}
                    onChange={e => setFormData({...formData, school_name: e.target.value})}
                  />
                </div>
              )}

              {role === 'journaliste' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Organe de presse</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.press_info}
                    onChange={e => setFormData({...formData, press_info: e.target.value})}
                  />
                </div>
              )}

              {role === 'chercheur' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sujet de recherche</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                    value={formData.research_topic}
                    onChange={e => setFormData({...formData, research_topic: e.target.value})}
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-navy-800 flex items-center gap-1"
                >
                  <i className="bi bi-arrow-left text-xs"></i>
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="bi bi-hourglass-split animate-spin"></i>
                      Inscription...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-navy-800 hover:text-navy-900 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .bg-navy-900 { background-color: #0a1e36; }
        .text-navy-800 { color: #0f2b4d; }
        .hover\\:bg-navy-900:hover { background-color: #0a1e36; }
        .hover\\:text-navy-800:hover { color: #0f2b4d; }
        .focus\\:border-navy-800:focus { border-color: #0f2b4d; }
        .border-navy-800 { border-color: #0f2b4d; }
      `}</style>
    </div>
  );
};

export default Register;