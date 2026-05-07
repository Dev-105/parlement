import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    school_name: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    cv_file: null,
    motivation_letter: '',
    media_name: '',
    organization: '',
    supporting_document: null,
    research_topic: '',
    institution: '',
    visit_date: '',
    duration: '',
    purpose: '',
    number_of_students: '',
    grade_level: '',
    supervisor_name: '',
    phone: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const getRoleLabel = (role) => {
    const roles = {
      stagiaire: t('dashboard.types.stage', 'Stagiaire'),
      journaliste: t('dashboard.types.presse', 'Journaliste'),
      chercheur: t('dashboard.types.bibliotheque', 'Chercheur'),
      ecole: t('dashboard.types.visite', 'Établissement scolaire'),
      admin: t('profile.roles.admin', 'Administrateur')
    };
    return roles[role] || role;
  };

  const getDemandeType = () => {
    const roleTypeMap = {
      stagiaire: 'stage',
      journaliste: 'presse',
      chercheur: 'bibliotheque',
      ecole: 'visite'
    };
    return roleTypeMap[user?.role] || null;
  };

  const demandeType = getDemandeType();
  const canCreateDemande = user?.role !== 'admin' && demandeType !== null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/demandes');
        const demandes = res.data.data || res.data;
        
        const s = { total: demandes.length, pending: 0, accepted: 0, rejected: 0 };
        demandes.forEach(d => {
          if (d.status === 'pending') s.pending++;
          if (d.status === 'accepted') s.accepted++;
          if (d.status === 'rejected') s.rejected++;
        });
        setStats(s);
        setRecentDemandes(demandes.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcome');
    if (hour < 18) return t('welcome');
    return t('welcome');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: darkMode 
        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
        : 'bg-amber-50 text-amber-700 border border-amber-200',
      in_review: darkMode
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-50 text-blue-700 border border-blue-200',
      accepted: darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      rejected: darkMode
        ? 'bg-red-900/30 text-red-400 border border-red-800'
        : 'bg-red-50 text-red-700 border border-red-200'
    };
    const labels = {
      pending: t('pending'),
      in_review: t('in_review'),
      accepted: t('accepted'),
      rejected: t('rejected')
    };
    return { className: badges[status] || badges.pending, label: labels[status] || status };
  };

  const getTypeIcon = (type) => {
    const icons = {
      stage: 'bi-briefcase',
      presse: 'bi-newspaper',
      bibliotheque: 'bi-book',
      visite: 'bi-people'
    };
    return icons[type] || 'bi-file-text';
  };

  const getTypeLabel = (type) => {
    const typeKey = `dashboard.types.${type}`;
    const label = t(typeKey);
    return label !== typeKey ? label : type;
  };

  const getDemandeInfo = () => {
    const info = {
      stage: {
        title: t('dashboard.requests.stage.title'),
        desc: t('dashboard.requests.stage.desc'),
        icon: 'bi-briefcase',
        buttonText: t('dashboard.requests.stage.buttonText')
      },
      presse: {
        title: t('dashboard.requests.presse.title'),
        desc: t('dashboard.requests.presse.desc'),
        icon: 'bi-newspaper',
        buttonText: t('dashboard.requests.presse.buttonText')
      },
      bibliotheque: {
        title: t('dashboard.requests.bibliotheque.title'),
        desc: t('dashboard.requests.bibliotheque.desc'),
        icon: 'bi-book',
        buttonText: t('dashboard.requests.bibliotheque.buttonText')
      },
      visite: {
        title: t('dashboard.requests.visite.title'),
        desc: t('dashboard.requests.visite.desc'),
        icon: 'bi-people',
        buttonText: t('dashboard.requests.visite.buttonText')
      }
    };
    return info[demandeType] || {
      title: t('create_demande'),
      desc: '',
      icon: 'bi-file-text',
      buttonText: t('create_demande')
    };
  };

  const demandeInfo = getDemandeInfo();

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      school_name: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      cv_file: null,
      motivation_letter: '',
      media_name: '',
      organization: '',
      supporting_document: null,
      research_topic: '',
      institution: '',
      visit_date: '',
      duration: '',
      purpose: '',
      number_of_students: '',
      grade_level: '',
      supervisor_name: '',
      phone: ''
    });
  };

  const handleFileChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.files[0] });
  };

  const handleCreateDemande = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('type', demandeType);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('message', formData.message);
    
    if (demandeType === 'stage') {
      if (formData.school_name) formDataToSend.append('school_name', formData.school_name);
      if (formData.field_of_study) formDataToSend.append('field_of_study', formData.field_of_study);
      if (formData.start_date) formDataToSend.append('start_date', formData.start_date);
      if (formData.end_date) formDataToSend.append('end_date', formData.end_date);
      if (formData.cv_file) formDataToSend.append('cv_file', formData.cv_file);
      if (formData.motivation_letter) formDataToSend.append('motivation_letter', formData.motivation_letter);
    }
    
    if (demandeType === 'presse') {
      if (formData.media_name) formDataToSend.append('media_name', formData.media_name);
      if (formData.organization) formDataToSend.append('organization', formData.organization);
      if (formData.supporting_document) formDataToSend.append('supporting_document', formData.supporting_document);
    }
    
    if (demandeType === 'bibliotheque') {
      if (formData.research_topic) formDataToSend.append('research_topic', formData.research_topic);
      if (formData.institution) formDataToSend.append('institution', formData.institution);
      if (formData.visit_date) formDataToSend.append('visit_date', formData.visit_date);
      if (formData.duration) formDataToSend.append('duration', formData.duration);
      if (formData.purpose) formDataToSend.append('purpose', formData.purpose);
    }
    
    if (demandeType === 'visite') {
      if (formData.school_name) formDataToSend.append('school_name', formData.school_name);
      if (formData.number_of_students) formDataToSend.append('number_of_students', parseInt(formData.number_of_students));
      if (formData.grade_level) formDataToSend.append('grade_level', formData.grade_level);
      if (formData.visit_date) formDataToSend.append('visit_date', formData.visit_date);
      if (formData.supervisor_name) formDataToSend.append('supervisor_name', formData.supervisor_name);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
    }

    try {
      await api.post('/demandes', formDataToSend);
      setShowCreateModal(false);
      resetForm();
      
      try {
        const reviewRes = await api.get('/reviews/me');
        if (!reviewRes.data.has_reviewed) {
          setShowReviewModal(true);
        }
      } catch (err) {
        console.error('Error checking review status', err);
      }

      const res = await api.get('/demandes');
      const demandes = res.data.data || res.data;
      const s = { total: demandes.length, pending: 0, accepted: 0, rejected: 0 };
      demandes.forEach(d => {
        if (d.status === 'pending') s.pending++;
        if (d.status === 'accepted') s.accepted++;
        if (d.status === 'rejected') s.rejected++;
      });
      setStats(s);
      setRecentDemandes(demandes.slice(0, 5));
    } catch (err) {
      console.error('Error creating demande:', err);
      if (err.response?.data?.errors) {
        showToast(Object.values(err.response.data.errors).flat().join('\n'), 'error');
      } else {
        showToast(t('errors.create_request'), 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const statCards = [
    { label: t('dashboard.stats.total'), value: stats.total, color: 'text-orange-600', bg: 'bg-orange-50', icon: 'bi-files', darkBg: 'bg-orange-900/20', darkColor: 'text-orange-400' },
    { label: t('dashboard.stats.pending'), value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: 'bi-clock', darkBg: 'bg-amber-900/20', darkColor: 'text-amber-400' },
    { label: t('dashboard.stats.accepted'), value: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'bi-check-circle', darkBg: 'bg-emerald-900/20', darkColor: 'text-emerald-400' },
    { label: t('dashboard.stats.rejected'), value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50', icon: 'bi-x-circle', darkBg: 'bg-red-900/20', darkColor: 'text-red-400' },
  ];

  const renderFormFields = () => {
    switch (demandeType) {
      case 'stage':
        return (
          <>
            <div className={`grid sm:grid-cols-2 gap-4 ${isRTL ? 'sm:gap-x-6' : ''}`}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.school_university')} *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.school_name}
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.field_of_study')} *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                />
              </div>
            </div>
            <div className={`grid sm:grid-cols-2 gap-4 ${isRTL ? 'sm:gap-x-6' : ''}`}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.start_date')}
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.end_date')}
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('dashboard.form.cv_file')}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:text-sm file:font-medium ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-white file:border-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 file:bg-orange-50 file:text-orange-600 file:border-orange-200'
                }`}
                onChange={(e) => handleFileChange(e, 'cv_file')}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('dashboard.form.motivation_letter')}
              </label>
              <textarea
                rows="4"
                className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
                placeholder={t('dashboard.form.motivation_letter_placeholder')}
                value={formData.motivation_letter}
                onChange={(e) => setFormData({...formData, motivation_letter: e.target.value})}
              ></textarea>
            </div>
          </>
        );

      case 'presse':
        return (
          <>
            <div className={`grid sm:grid-cols-1 gap-4 ${isRTL ? 'sm:gap-x-6' : ''}`}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.media_name')} *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.media_name}
                  onChange={(e) => setFormData({...formData, media_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('dashboard.form.organization')}
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('dashboard.form.supporting_document')}
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:text-sm file:font-medium ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 file:bg-gray-600 file:text-white file:border-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 file:bg-orange-50 file:text-orange-600 file:border-orange-200'
                }`}
                onChange={(e) => handleFileChange(e, 'supporting_document')}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {getGreeting()}, {user?.first_name || user?.name}
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('dashboard.header.subtitle')} • {user?.role === 'admin' ? t('dashboard.header.admin_area') : t('dashboard.header.user_area')}
          </p>
        </div>
        {canCreateDemande && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <i className={`${demandeInfo.icon} text-sm`}></i>
            {demandeInfo.buttonText}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? card.darkBg : card.bg
              }`}>
                <i className={`bi ${card.icon} ${darkMode ? card.darkColor : card.color} text-lg`}></i>
              </div>
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className={`rounded-2xl shadow-sm ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('dashboard.recent_requests')}
            </h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-xl animate-pulse ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                      <div className="space-y-2">
                        <div className={`h-3 w-32 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 w-20 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                      </div>
                    </div>
                    <div className={`h-5 w-16 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  </div>
                ))}
              </div>
            ) : recentDemandes.length === 0 ? (
              <div className="text-center py-8">
                <i className={`bi bi-inbox text-3xl ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}></i>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('dashboard.empty_requests')}</p>
                {canCreateDemande && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className={`inline-block mt-3 text-sm font-medium transition-colors ${
                      darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {t('dashboard.create_first_request')} →
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentDemandes.map((demande) => {
                  const status = getStatusBadge(demande.status);
                  return (
                    <Link
                      key={demande.id}
                      to={`/demandedetail/${demande.id}`}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        isRTL ? 'flex-row-reverse' : ''
                      } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <i className={`${getTypeIcon(demande.type)} ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}></i>
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{demande.title}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{getTypeLabel(demande.type)}</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        <i className={`bi bi-chevron-right ${darkMode ? 'text-gray-600' : 'text-gray-400'} text-xs ${isRTL ? 'rotate-180' : ''}`}></i>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className={`rounded-2xl shadow-sm ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('sidebar_profile')}
            </h2>
          </div>
          <div className="p-5">
            <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-orange-900/30' : 'bg-orange-50'
              }`}>
                <i className={`bi bi-person-circle ${darkMode ? 'text-orange-400' : 'text-orange-600'} text-3xl`}></i>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className={`text-sm capitalize ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={`flex justify-between items-center py-2 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.email')}</span>
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className={`flex justify-between items-center py-2 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.phone')}</span>
                  <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.phone}</span>
                </div>
              )}
              <div className={`flex justify-between items-center py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.member_since')}</span>
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : t('common.new')}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}">
              <Link to="/profile" className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                isRTL ? 'flex-row-reverse' : ''
              } ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'}`}>
                {t('profile.edit_profile')}
                <i className={`bi bi-arrow-right text-xs ${isRTL ? 'rotate-180' : ''}`}></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Stats Section */}
      {user?.role === 'admin' && (
        <div className={`rounded-2xl shadow-sm ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('dashboard.admin.title')}
            </h2>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`flex items-center justify-between p-3 rounded-xl ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dashboard.admin.processing_rate')}</div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total > 0 ? Math.round((stats.accepted + stats.rejected) / stats.total * 100) : 0}%
                  </div>
                </div>
                <i className={`bi bi-graph-up text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dashboard.stats.pending')}</div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.pending}</div>
                </div>
                <i className={`bi bi-hourglass-split text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dashboard.admin.acceptance_rate')}</div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total > 0 ? Math.round(stats.accepted / stats.total * 100) : 0}%
                  </div>
                </div>
                <i className={`bi bi-check-circle text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
              </div>
              <Link to="/demandes" className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'bg-orange-900/20 hover:bg-orange-900/30' : 'bg-orange-50 hover:bg-orange-100'
              }`}>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{t('dashboard.admin.manage')}</div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>{stats.total}</div>
                </div>
                <i className={`bi bi-arrow-right text-xl ${darkMode ? 'text-orange-400' : 'text-orange-800'} ${isRTL ? 'rotate-180' : ''}`}></i>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${
              isRTL ? 'flex-row-reverse' : ''
            } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {demandeInfo.title}
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{demandeInfo.desc}</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className={`transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateDemande} className="p-6 space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.title')} *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder={t('dashboard.form.title_placeholder')}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.message_label')} *
                </label>
                <textarea
                  required
                  rows="4"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder={t('dashboard.form.message_placeholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              {renderFormFields()}

              <div className={`flex justify-end gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className={`px-4 py-2 text-sm rounded-xl transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {submitLoading ? (
                    <>
                      <i className="bi bi-hourglass-split animate-spin"></i>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      {t('dashboard.form.submit')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewModal 
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
          toast.type === 'error' 
            ? 'bg-red-500 text-white shadow-red-500/20' 
            : 'bg-emerald-500 text-white shadow-emerald-500/20'
        }`}>
          <i className={`text-lg ${isRTL ? 'ml-3' : 'mr-3'} ${toast.type === 'error' ? 'bi bi-x-circle' : 'bi bi-check-circle'}`}></i>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;