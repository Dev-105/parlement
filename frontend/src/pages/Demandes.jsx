import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const Demandes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isRTL = i18n.language === 'ar';
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cinFilter, setCinFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  const [showCreate, setShowCreate] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [bulkMessageForm, setBulkMessageForm] = useState({ title: '', message: '' });
  const [bulkMessageLoading, setBulkMessageLoading] = useState(false);
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
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [messageForm, setMessageForm] = useState({ title: '', message: '' });
  const [messageLoading, setMessageLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
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

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/demandes');
      setDemandes(res.data.data || res.data);
    } catch (e) {
      console.error('Error fetching demandes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    setSelectedUserIds([]);
  }, [filter, typeFilter, cinFilter]);

  const handleCreate = async (e) => {
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
      setShowCreate(false);
      resetForm();
      
      try {
        const reviewRes = await api.get('/reviews/me');
        if (!reviewRes.data.has_reviewed) {
          setShowReviewModal(true);
        }
      } catch (err) {
        console.error('Error checking review status', err);
      }

      fetchDemandes();
    } catch (err) {
      console.error('Error creating demande:', err);
      if (err.response?.data?.errors) {
        showToast(Object.values(err.response.data.errors).flat().join('\n'), 'error');
      } else {
        showToast('Erreur lors de la création de la demande', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

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

  const handleStatusChange = async (id, status) => {
    try {
      // Optimistic UI update to preserve scroll position
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      await api.patch(`/demandes/${id}/status`, { status });
      showToast(t('demandes.status_updated', 'Statut mis à jour avec succès'), 'success');
    } catch (e) {
      console.error('Error updating status:', e);
      showToast(t('demandes.error_updating_status', 'Erreur lors de la mise à jour'), 'error');
      // Rollback on error
      fetchDemandes();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedDemande) return;
    
    setMessageLoading(true);
    try {
      await api.post(`/admin/users/${selectedDemande.user_id}/notify`, messageForm);
      setShowMessageModal(false);
      setMessageForm({ title: '', message: '' });
      showToast(t('demandes.message_sent'), 'success');
    } catch (err) {
      console.error('Error sending message:', err);
      showToast(t('demandes.error_sending_message'), 'error');
    } finally {
      setMessageLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((current) => {
      const newSelection = new Set(current);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return Array.from(newSelection);
    });
  };

  const toggleSelectAll = () => {
    const visibleUserIds = Array.from(new Set(filteredData.map((d) => d.user_id).filter(Boolean)));
    const allSelected = visibleUserIds.every((id) => selectedUserIds.includes(id));
    setSelectedUserIds(allSelected ? [] : visibleUserIds);
  };

  const handleSendBulkMessage = async (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) return;

    setBulkMessageLoading(true);
    try {
      await api.post('/admin/users/notify', {
        user_ids: selectedUserIds,
        title: bulkMessageForm.title,
        message: bulkMessageForm.message
      });
      setShowBulkMessageModal(false);
      setBulkMessageForm({ title: '', message: '' });
      setSelectedUserIds([]);
      showToast(t('demandes.notifications_sent'), 'success');
    } catch (err) {
      console.error('Error sending bulk message:', err);
      showToast(t('demandes.error_sending_notifications'), 'error');
    } finally {
      setBulkMessageLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('demandes.confirm_delete'))) return;
    try {
      // Optimistic UI update to prevent scroll reset
      setDemandes(prev => prev.filter(d => d.id !== id));
      await api.delete(`/demandes/${id}`);
      showToast(t('demandes.deleted_success', 'Demande supprimée avec succès'), 'success');
    } catch(e) {
      console.error('Error deleting demande:', e);
      showToast(t('demandes.error_deleting', 'Erreur lors de la suppression'), 'error');
      fetchDemandes();
    }
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
    const labels = {
      stage: t('dashboard.types.stage'),
      presse: t('dashboard.types.presse'),
      bibliotheque: t('dashboard.types.bibliotheque'),
      visite: t('dashboard.types.visite')
    };
    return labels[type] || type;
  };

  const getDemandeInfo = () => {
    const info = {
      stage: {
        title: t('dashboard.requests.stage.title'),
        desc: t('dashboard.requests.stage.desc'),
        icon: 'bi-briefcase'
      },
      presse: {
        title: t('dashboard.requests.presse.title'),
        desc: t('dashboard.requests.presse.desc'),
        icon: 'bi-newspaper'
      },
      bibliotheque: {
        title: t('dashboard.requests.bibliotheque.title'),
        desc: t('dashboard.requests.bibliotheque.desc'),
        icon: 'bi-book'
      },
      visite: {
        title: t('dashboard.requests.visite.title'),
        desc: t('dashboard.requests.visite.desc'),
        icon: 'bi-people'
      }
    };
    return info[demandeType] || { title: t('create_demande'), desc: '', icon: 'bi-file-text' };
  };

  const demandeInfo = getDemandeInfo();

  const filteredData = useMemo(() => {
    return demandes.filter(d => {
      const statusMatch = filter === 'all' ? true : d.status === filter;
      const typeMatch = typeFilter === 'all' ? true : d.type === typeFilter;
      const cinMatch = cinFilter.trim() === ''
        ? true
        : d.user?.cin?.toLowerCase().includes(cinFilter.trim().toLowerCase());
      return statusMatch && typeMatch && cinMatch;
    });
  }, [demandes, filter, typeFilter, cinFilter]);

  const renderFormFields = () => {
    switch (demandeType) {
      case 'stage':
        return (
          <>
            <div className={`grid sm:grid-cols-2 gap-4 ${isRTL ? 'sm:gap-x-6' : ''}`}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.school_name')}
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  value={formData.school_name}
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('dashboard.form.field_of_study')}
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
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('dashboard.form.accepted_formats')}
              </p>
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
                  {t('dashboard.form.media_name')}
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
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('dashboard.form.supporting_document_help')}
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const statCards = [
    { label: t('dashboard.stats.total'), value: demandes.length, color: 'text-orange-600', bg: 'bg-orange-50', darkBg: 'bg-orange-900/20', darkColor: 'text-orange-400' },
    { label: t('pending'), value: demandes.filter(d => d.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50', darkBg: 'bg-amber-900/20', darkColor: 'text-amber-400' },
    { label: t('accepted'), value: demandes.filter(d => d.status === 'accepted').length, color: 'text-emerald-600', bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/20', darkColor: 'text-emerald-400' },
    { label: t('rejected'), value: demandes.filter(d => d.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50', darkBg: 'bg-red-900/20', darkColor: 'text-red-400' }
  ];

  if (!canCreateDemande && user?.role !== 'admin') {
    return (
      <div className={`rounded-2xl p-12 text-center ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        <i className={`bi bi-exclamation-triangle text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          {t('demandes.role_not_allowed')}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('sidebar_requests')}
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('demandes.subtitle')}
          </p>
        </div>
        
        <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <select 
            className={`px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 border border-gray-600 text-gray-200'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('common.all_statuses')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="in_review">{t('in_review')}</option>
            <option value="accepted">{t('accepted')}</option>
            <option value="rejected">{t('rejected')}</option>
          </select>

          {user?.role === 'admin' && (
            <>
              <input
                type="text"
                placeholder='CIN'
                className={`px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
                value={cinFilter}
                onChange={(e) => setCinFilter(e.target.value)}
              />

              <select
                className={`px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border border-gray-600 text-gray-200'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">{t('common.all_types')}</option>
                <option value="stage">{t('dashboard.types.stage')}</option>
                <option value="presse">{t('dashboard.types.presse')}</option>
                <option value="bibliotheque">{t('dashboard.types.bibliotheque')}</option>
                <option value="visite">{t('dashboard.types.visite')}</option>
              </select>

              {selectedUserIds.length > 0 && (
                <button
                  onClick={() => setShowBulkMessageModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md"
                >
                  <i className="bi bi-chat-dots text-sm"></i>
                  {t('demandes.send_to_users', { count: selectedUserIds.length })}
                </button>
              )}
            </>
          )}

          {canCreateDemande && (
            <button 
              onClick={() => setShowCreate(true)} 
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <i className="bi bi-plus-lg text-sm"></i>
              {t('create_demande')}
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-2xl p-3 text-center shadow-sm transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          }`}>
            <div className={`text-xl font-bold ${darkMode ? stat.darkColor : stat.color}`}>{stat.value}</div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Demande List */}
      {loading ? (
        <div className={`rounded-2xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex justify-between items-center p-3 animate-pulse rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  <div className="space-y-2">
                    <div className={`h-4 w-48 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <div className={`h-3 w-32 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
                <div className={`h-8 w-24 rounded-full flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <i className={`bi bi-inbox text-4xl ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}></i>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{t('demandes.no_requests_found')}</p>
          {canCreateDemande && (
            <button 
              onClick={() => setShowCreate(true)}
              className={`mt-4 text-sm font-medium transition-colors ${
                darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-500 hover:text-orange-600'
              }`}
            >
              {t('demandes.create_first_request')}
            </button>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl overflow-hidden shadow-sm ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'}>
                  {user?.role === 'admin' && (
                    <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={filteredData.length > 0 && selectedUserIds.length === Array.from(new Set(filteredData.map((d) => d.user_id).filter(Boolean))).length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.id')}</th>
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.type')}</th>
                  {user?.role === 'admin' && (
                    <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.email')}</th>
                  )}
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.title')}</th>
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider hidden md:table-cell ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.date')}</th>
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.status')}</th>
                  <th className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('demandes.table.actions')}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {filteredData.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                      {user?.role === 'admin' && (
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedUserIds.includes(item.user_id)}
                            onChange={() => toggleUserSelection(item.user_id)}
                          />
                        </td>
                      )}
                      <td className={`px-5 py-3 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{item.id}</td>
                      <td className="px-5 py-3">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <i className={`${getTypeIcon(item.type)} ${darkMode ? 'text-orange-400' : 'text-orange-600'} text-sm`}></i>
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{getTypeLabel(item.type)}</span>
                        </div>
                      </td>
                      {user?.role === 'admin' && (
                        <td className={`px-5 py-3 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.user?.email || '-'}
                        </td>
                      )}
                      <td className="px-5 py-3">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} max-w-xs truncate`}>{item.title}</div>
                        <div className={`text-xs mt-0.5 line-clamp-1 max-w-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.message}</div>
                      </td>
                      <td className={`px-5 py-3 text-xs hidden md:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {user?.role === 'admin' ? (
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
                            <button 
                              onClick={() => navigate(`/demandedetail/${item.id}`)}
                              className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                              title="Voir les détails"
                            >
                              <i className="bi bi-eye text-sm"></i>
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedDemande(item);
                                setShowMessageModal(true);
                              }}
                              className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-orange-400 hover:bg-orange-900/20' : 'text-orange-600 hover:bg-orange-50'}`}
                              title={t('demandes.send_message')}
                            >
                              <i className="bi bi-chat-dots text-sm"></i>
                            </button>
                            {item.status !== 'accepted' && item.status !== 'in_review' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'in_review')}
                                className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'}`}
                                title={t('demandes.review')}
                              >
                                <i className="bi bi-clock-history text-sm"></i>
                              </button>
                            )}
                            {item.status !== 'accepted' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'accepted')}
                                className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                title={t('accepted')}
                              >
                                <i className="bi bi-check-lg text-sm"></i>
                              </button>
                            )}
                            {item.status !== 'rejected' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                                title={t('rejected')}
                              >
                                <i className="bi bi-x-lg text-sm"></i>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
                            <button 
                              onClick={() => navigate(`/demandedetail/${item.id}`)}
                              className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                              title="Voir les détails"
                            >
                              <i className="bi bi-eye text-sm"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)} 
                              className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-600'}`}
                              title={t('common.delete')}
                            >
                              <i className="bi bi-trash text-sm"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {demandeInfo.title}
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{demandeInfo.desc}</p>
              </div>
              <button onClick={() => { setShowCreate(false); resetForm(); }} className={`transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Ex: Demande de stage d'été 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message / Description *
                </label>
                <textarea
                  required
                  rows="4"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Décrivez votre demande en détail..."
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
                  onClick={() => { setShowCreate(false); resetForm(); }}
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
                      Envoi...
                    </>
                  ) : (
                    'Soumettre la demande'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Message Modal */}
      {showMessageModal && selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`rounded-2xl w-full max-w-md ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Envoyer un message
              </h3>
              <button onClick={() => setShowMessageModal(false)} className={`transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre de la notification *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Ex: Document manquant"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({...messageForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Veuillez fournir votre message..."
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={messageLoading}
                  className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  {messageLoading ? t('common.sending') : t('demandes.send_notification')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Message Modal */}
      {showBulkMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`rounded-2xl w-full max-w-md ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Envoyer une notification groupée
              </h3>
              <button onClick={() => setShowBulkMessageModal(false)} className={`transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendBulkMessage} className="p-6 space-y-4">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Utilisateurs sélectionnés : {selectedUserIds.length}
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre de la notification *
                </label>
                <input
                  required
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Ex: Mise à jour importante"
                  value={bulkMessageForm.title}
                  onChange={(e) => setBulkMessageForm({...bulkMessageForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Entrez le message à envoyer aux utilisateurs sélectionnés..."
                  value={bulkMessageForm.message}
                  onChange={(e) => setBulkMessageForm({...bulkMessageForm, message: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={bulkMessageLoading}
                  className="w-full py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 shadow-md"
                >
                  {bulkMessageLoading ? t('common.sending') : t('demandes.send_notification')}
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
        <div className={`fixed bottom-6 left-1/2 z-[60] flex max-w-xl w-[min(100%,420px)] items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 ease-out translate-x-[-50%] ${
          toast.type === 'error'
            ? 'bg-red-600 text-white shadow-red-700/20 ring-1 ring-red-400/20'
            : 'bg-emerald-600 text-white shadow-emerald-700/20 ring-1 ring-emerald-400/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toast.type === 'error' ? 'bg-red-700/20 text-red-100' : 'bg-emerald-700/20 text-emerald-100'}`}>
              <i className={`text-xl ${toast.type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill'}`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">{toast.type === 'error' ? t('common.error') : t('common.success')}</p>
              <p className="text-sm leading-5 text-white/90 truncate">{toast.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="text-white/80 hover:text-white transition-colors"
            aria-label={t('common.close')}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Demandes;