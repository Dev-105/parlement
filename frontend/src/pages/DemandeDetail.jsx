import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DemandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const res = await api.get(`/demandes/${id}`);
        setDemande(res.data.data || res.data);
      } catch (e) {
        console.error('Error fetching demande details:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDemande();
  }, [id]);

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
      pending: 'En attente',
      in_review: 'En révision',
      accepted: 'Acceptée',
      rejected: 'Refusée'
    };
    return badges[status] || badges.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t('demandes.status.pending'),
      in_review: t('demandes.status.in_review'),
      accepted: t('demandes.status.accepted'),
      rejected: t('demandes.status.rejected')
    };
    return labels[status] || status;
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/demandes/${id}/status`, { status: newStatus });
      const res = await api.get(`/demandes/${id}`);
      setDemande(res.data.data || res.data);
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const getDownloadFilename = (fileType, fileUrl) => {
    const extension = fileUrl?.split('.').pop().split('?')[0] || 'pdf';
    if (fileType === 'cv_file') {
      return `CV.${extension}`;
    }
    return `supporting_document.${extension}`;
  };

  const downloadFile = async (fileType, fileUrl) => {
    try {
      const response = await api.get(`/demandes/${id}/download/${fileType}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getDownloadFilename(fileType, fileUrl);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert(t('demandes.download_error'));
    }
  };

  const renderFileLink = (fileUrl, fileName, fileType) => {
    if (!fileUrl) return null;

    return (
      <button
        type="button"
        onClick={() => downloadFile(fileType, fileUrl)}
        className={`flex items-center gap-2 transition-colors ${
          darkMode 
            ? 'text-orange-400 hover:text-orange-300' 
            : 'text-orange-600 hover:text-orange-800'
        }`}
      >
        <i className="bi bi-file-earmark-text"></i>
        {t('demandes.download', { file: fileName })}
      </button>
    );
  };

  const renderDetails = () => {
    if (!demande?.details) return null;
    
    const details = demande.details;
    const formattedDetails = [];
    
    if (demande.type === 'stage') {
      const stageFields = [
        { key: 'school_name', label: t('demandes.fields.school_name') },
        { key: 'field_of_study', label: t('demandes.fields.field_of_study') },
        { key: 'start_date', label: t('demandes.fields.start_date'), format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : t('demandes.not_specified') },
        { key: 'end_date', label: t('demandes.fields.end_date'), format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : t('demandes.not_specified') },
        { key: 'motivation_letter', label: t('demandes.fields.motivation_letter') },
      ];
      
      stageFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: field.format ? field.format(details[field.key]) : details[field.key]
          });
        }
      });
      
      if (details.cv_file) {
        formattedDetails.push({
          label: 'CV',
          value: renderFileLink(details.cv_file, 'CV', 'cv_file')
        });
      }
    }
    else if (demande.type === 'presse') {
      const presseFields = [
        { key: 'media_name', label: t('demandes.fields.media_name') },
        { key: 'press_card_number', label: t('demandes.fields.press_card_number') },
        { key: 'organization', label: t('demandes.fields.organization') },
      ];
      
      presseFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: details[field.key]
          });
        }
      });
      
      if (details.supporting_document) {
        formattedDetails.push({
          label: t('demandes.fields.supporting_document'),
          value: renderFileLink(details.supporting_document, t('demandes.fields.supporting_document'), 'supporting_document')
        });
      }
    }
    else if (demande.type === 'bibliotheque') {
      const bibliothequeFields = [
        { key: 'research_topic', label: t('demandes.fields.research_topic') },
        { key: 'institution', label: t('demandes.fields.institution') },
        { key: 'visit_date', label: t('demandes.fields.visit_date'), format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : t('demandes.not_specified') },
        { key: 'duration', label: t('demandes.fields.duration') },
        { key: 'purpose', label: t('demandes.fields.purpose') },
      ];
      
      bibliothequeFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: field.format ? field.format(details[field.key]) : details[field.key]
          });
        }
      });
    }
    else if (demande.type === 'visite') {
      const visiteFields = [
        { key: 'school_name', label: t('demandes.fields.school_name') },
        { key: 'number_of_students', label: t('demandes.fields.number_of_students') },
        { key: 'grade_level', label: t('demandes.fields.grade_level') },
        { key: 'visit_date', label: t('demandes.fields.visit_date'), format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : t('demandes.not_specified') },
        { key: 'supervisor_name', label: t('demandes.fields.supervisor_name') },
        { key: 'phone', label: t('demandes.fields.phone') },
      ];
      
      visiteFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: field.format ? field.format(details[field.key]) : details[field.key]
          });
        }
      });
    }
    
    return formattedDetails;
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
      stage: t('dashboard.types.stage', 'Stage'),
      presse: t('dashboard.types.presse', 'Presse'),
      bibliotheque: t('dashboard.types.bibliotheque', 'Bibliothèque'),
      visite: t('dashboard.types.visite', 'Visite')
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className={`bi bi-hourglass-split text-3xl animate-pulse ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}></i>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className={`text-center p-12 rounded-2xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <i className={`bi bi-exclamation-circle text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
        <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('demandes.not_found')}
        </h3>
        <button 
          onClick={() => navigate('/demandes')} 
          className={`mt-4 transition-colors ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'}`}
        >
          {t('demandes.back_to_list')}
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(demande.status);
  const formattedDetails = renderDetails();

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header with Back Button */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => navigate('/demandes')} 
          className={`p-2 rounded-xl transition-colors ${
            darkMode 
              ? 'text-gray-400 hover:bg-gray-700' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <i className={`bi bi-arrow-left text-lg ${isRTL ? 'rotate-180' : ''}`}></i>
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('demandes.detail_title', { id: demande.id })}
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('demandes.created_at', { date: new Date(demande.created_at).toLocaleDateString('fr-FR') })}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className={`rounded-2xl shadow-sm overflow-hidden ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        {/* Header Section */}
        <div className={`p-6 border-b flex flex-wrap justify-between items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex-1">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {demande.title}
            </h2>
            <div className={`flex flex-wrap items-center gap-2 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusBadge}`}>
                {getStatusLabel(demande.status)}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize flex items-center gap-1 ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <i className={`${getTypeIcon(demande.type)} text-xs`}></i>
                {t('demandes.type_label', { type: getTypeLabel(demande.type) })}
              </span>
            </div>
            
            {/* Enhanced user info for admin */}
            {user?.role === 'admin' && demande.user && (
              <div className={`mt-5 p-5 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-gray-50 to-gray-100'
              }`}>
                <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <i className={`bi bi-person-badge ${darkMode ? 'text-orange-400' : 'text-orange-600'} text-lg`}></i>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('demandes.applicant_info')}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <i className={`bi bi-person ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm w-5`}></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.full_name')}:</span>
                      <button
                        onClick={() => navigate(`/admin/users/${demande.user.id}`)}
                        className={`text-sm font-medium transition-colors ${
                          darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'
                        }`}
                      >
                        {demande.user.first_name} {demande.user.last_name}
                      </button>
                    </div>
                    <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <i className="bi bi-envelope text-gray-500 text-sm w-5"></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.email')}:</span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{demande.user.email}</span>
                    </div>
                    {demande.user.cin && (
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <i className="bi bi-person-badge text-gray-500 text-sm w-5"></i>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.cin')}:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{demande.user.cin}</span>
                      </div>
                    )}
                    {demande.user.phone && (
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <i className="bi bi-telephone text-gray-500 text-sm w-5"></i>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.phone')}:</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{demande.user.phone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <i className="bi bi-person-badge text-gray-500 text-sm w-5"></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.role')}:</span>
                      <span className={`capitalize text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{demande.user.role}</span>
                    </div>
                    {demande.user.city && (
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <i className="bi bi-geo-alt text-gray-500 text-sm w-5"></i>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.city')}:</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{demande.user.city}</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <i className="bi bi-calendar text-gray-500 text-sm w-5"></i>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profile.member_since')}:</span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {new Date(demande.user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Admin Actions */}
          {user?.role === 'admin' && (
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {demande.status !== 'accepted' && demande.status !== 'in_review' && (
                <button 
                  onClick={() => handleStatusChange('in_review')} 
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    darkMode 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-800'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                  title={t('demandes.actions.review')}
                >
                  <i className="bi bi-clock-history mr-1"></i>
                  {t('demandes.actions.review')}
                </button>
              )}
              {demande.status !== 'accepted' && (
                <button 
                  onClick={() => handleStatusChange('accepted')} 
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    darkMode 
                      ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                  title={t('demandes.actions.accept')}
                >
                  <i className="bi bi-check-lg mr-1"></i>
                  {t('demandes.actions.accept')}
                </button>
              )}
              {demande.status !== 'rejected' && (
                <button 
                  onClick={() => handleStatusChange('rejected')} 
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    darkMode 
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                  title={t('demandes.actions.reject')}
                >
                  <i className="bi bi-x-lg mr-1"></i>
                  {t('demandes.actions.reject')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Message Section */}
          <div className="mb-6">
            <h3 className={`text-sm font-medium uppercase tracking-wider mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <i className={`bi bi-chat-text ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}></i>
              {t('dashboard.form.message_label')}
            </h3>
            <div className={`p-5 rounded-xl border ${
              darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
              <p className={`whitespace-pre-wrap text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {demande.message}
              </p>
            </div>
          </div>

          {/* Specific Information Section */}
          {formattedDetails.length > 0 && (
            <div>
              <h3 className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <i className={`bi bi-info-circle ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}></i>
                {t('demandes.specific_info')}
              </h3>
              <div className={`grid sm:grid-cols-2 gap-y-4 gap-x-8 p-5 rounded-xl border ${
                darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
              }`}>
                {formattedDetails.map((detail, index) => (
                  <div key={index} className={`border-b pb-2 last:border-0 ${isRTL ? 'text-right' : 'text-left'} ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <dt className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detail.label}</dt>
                    <dd className={`text-sm mt-1 font-medium break-words ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {typeof detail.value === 'object' ? detail.value : detail.value}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandeDetail;