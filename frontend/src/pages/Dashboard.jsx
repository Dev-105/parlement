import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    // Stage fields
    school_name: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    cv_file: null,
    motivation_letter: '',
    // Presse fields
    media_name: '',
    press_card_number: '',
    organization: '',
    supporting_document: null,
    // Bibliotheque fields
    research_topic: '',
    institution: '',
    visit_date: '',
    duration: '',
    purpose: '',
    // Visite fields
    number_of_students: '',
    grade_level: '',
    supervisor_name: '',
    phone: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Determine demande type based on user role
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
        
        // Calculate stats
        const s = { total: demandes.length, pending: 0, accepted: 0, rejected: 0 };
        demandes.forEach(d => {
          if (d.status === 'pending') s.pending++;
          if (d.status === 'accepted') s.accepted++;
          if (d.status === 'rejected') s.rejected++;
        });
        setStats(s);
        
        // Get recent 5 demandes
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
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      in_review: 'bg-blue-50 text-blue-700 border border-blue-200',
      accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border border-red-200'
    };
    const labels = {
      pending: 'En attente',
      in_review: 'En révision',
      accepted: 'Acceptée',
      rejected: 'Refusée'
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
      stage: 'Stage',
      presse: 'Presse',
      bibliotheque: 'Bibliothèque',
      visite: 'Visite'
    };
    return labels[type] || type;
  };

  // Get demande info based on user role
  const getDemandeInfo = () => {
    const info = {
      stage: {
        title: 'Demande de Stage',
        desc: 'Stage professionnel au sein du parlement',
        icon: 'bi-briefcase',
        buttonText: 'Faire une demande de stage'
      },
      presse: {
        title: 'Demande Presse',
        desc: 'Accréditation pour les médias',
        icon: 'bi-newspaper',
        buttonText: 'Faire une demande presse'
      },
      bibliotheque: {
        title: 'Demande Bibliothèque',
        desc: 'Accès aux archives et documents',
        icon: 'bi-book',
        buttonText: 'Faire une demande bibliothèque'
      },
      visite: {
        title: 'Demande de Visite',
        desc: 'Visite guidée pour groupes scolaires',
        icon: 'bi-people',
        buttonText: 'Faire une demande de visite'
      }
    };
    return info[demandeType] || { 
      title: 'Nouvelle Demande', 
      desc: '', 
      icon: 'bi-file-text',
      buttonText: 'Nouvelle demande'
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
      press_card_number: '',
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
    
    // Common fields
    formDataToSend.append('type', demandeType);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('message', formData.message);
    
    // Stage specific fields
    if (demandeType === 'stage') {
      if (formData.school_name) formDataToSend.append('school_name', formData.school_name);
      if (formData.field_of_study) formDataToSend.append('field_of_study', formData.field_of_study);
      if (formData.start_date) formDataToSend.append('start_date', formData.start_date);
      if (formData.end_date) formDataToSend.append('end_date', formData.end_date);
      if (formData.cv_file) formDataToSend.append('cv_file', formData.cv_file);
      if (formData.motivation_letter) formDataToSend.append('motivation_letter', formData.motivation_letter);
    }
    
    // Presse specific fields
    if (demandeType === 'presse') {
      if (formData.media_name) formDataToSend.append('media_name', formData.media_name);
      if (formData.press_card_number) formDataToSend.append('press_card_number', formData.press_card_number);
      if (formData.organization) formDataToSend.append('organization', formData.organization);
      if (formData.supporting_document) formDataToSend.append('supporting_document', formData.supporting_document);
    }
    
    // Bibliotheque specific fields
    if (demandeType === 'bibliotheque') {
      if (formData.research_topic) formDataToSend.append('research_topic', formData.research_topic);
      if (formData.institution) formDataToSend.append('institution', formData.institution);
      if (formData.visit_date) formDataToSend.append('visit_date', formData.visit_date);
      if (formData.duration) formDataToSend.append('duration', formData.duration);
      if (formData.purpose) formDataToSend.append('purpose', formData.purpose);
    }
    
    // Visite specific fields
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
      // Refresh data
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
        alert(Object.values(err.response.data.errors).flat().join('\n'));
      } else {
        alert('Erreur lors de la création de la demande');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render form fields based on demande type
  const renderFormFields = () => {
    switch (demandeType) {
      case 'stage':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Établissement / Université *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.school_name}
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filière d'étude *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CV (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                onChange={(e) => handleFileChange(e, 'cv_file')}
              />
              <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (Max 5MB)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lettre de motivation</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm resize-none"
                placeholder="Expliquez pourquoi vous souhaitez effectuer un stage au parlement..."
                value={formData.motivation_letter}
                onChange={(e) => setFormData({...formData, motivation_letter: e.target.value})}
              ></textarea>
            </div>
          </>
        );

      case 'presse':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du média *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.media_name}
                  onChange={(e) => setFormData({...formData, media_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° Carte de presse *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.press_card_number}
                  onChange={(e) => setFormData({...formData, press_card_number: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document justificatif</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                onChange={(e) => handleFileChange(e, 'supporting_document')}
              />
              <p className="text-xs text-gray-500 mt-1">Carte de presse, lettre d'accréditation (PDF, JPG, PNG)</p>
            </div>
          </>
        );

      case 'bibliotheque':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet de recherche *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.research_topic}
                  onChange={(e) => setFormData({...formData, research_topic: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de visite souhaitée</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.visit_date}
                  onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée prévue</label>
                <input
                  type="text"
                  placeholder="Ex: 2 heures, Demi-journée"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objectif de la recherche</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm resize-none"
                placeholder="Décrivez l'objectif de votre recherche et les documents que vous souhaitez consulter..."
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              ></textarea>
            </div>
          </>
        );

      case 'visite':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.school_name}
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'élèves/étudiants *</label>
                <input
                  required
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.number_of_students}
                  onChange={(e) => setFormData({...formData, number_of_students: e.target.value})}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Primaire, Collège, Lycée, Université"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.grade_level}
                  onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de visite souhaitée</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.visit_date}
                  onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du superviseur *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.supervisor_name}
                  onChange={(e) => setFormData({...formData, supervisor_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  required
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const statCards = [
    { label: 'Total demandes', value: stats.total, color: 'text-navy-800', bg: 'bg-navy-50', icon: 'bi-files' },
    { label: 'En attente', value: stats.pending, color: 'text-amber-700', bg: 'bg-amber-50', icon: 'bi-clock' },
    { label: 'Acceptées', value: stats.accepted, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: 'bi-check-circle' },
    { label: 'Refusées', value: stats.rejected, color: 'text-red-700', bg: 'bg-red-50', icon: 'bi-x-circle' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.first_name || user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tableau de bord • {user?.role === 'admin' ? 'Administration' : `Espace ${user?.role}`}
          </p>
        </div>
        {canCreateDemande && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors flex items-center gap-2 shadow-sm"
          >
            <i className={`${demandeInfo.icon} text-sm`}></i>
            {demandeInfo.buttonText}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                <i className={`bi ${card.icon} ${card.color} text-lg`}></i>
              </div>
            </div>
            <div className={`text-2xl font-bold text-gray-900`}>{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Demandes récentes</h2>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="text-center py-8">
                <i className="bi bi-hourglass-split text-gray-300 text-2xl animate-pulse"></i>
                <p className="text-sm text-gray-400 mt-2">Chargement...</p>
              </div>
            ) : recentDemandes.length === 0 ? (
              <div className="text-center py-8">
                <i className="bi bi-inbox text-gray-300 text-3xl"></i>
                <p className="text-sm text-gray-400 mt-2">Aucune demande pour le moment</p>
                {canCreateDemande && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="inline-block mt-3 text-sm text-navy-800 hover:text-navy-900"
                  >
                    Créer ma première demande →
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
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <i className={`${getTypeIcon(demande.type)} text-gray-600 text-sm`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{demande.title}</div>
                          <div className="text-xs text-gray-500">{getTypeLabel(demande.type)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        <i className="bi bi-chevron-right text-gray-400 text-xs"></i>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Informations personnelles</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center">
                <i className="bi bi-person-circle text-navy-800 text-3xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-gray-900">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Téléphone</span>
                  <span className="text-sm text-gray-900">{user?.phone}</span>
                </div>
              )}
              {user?.city && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Ville</span>
                  <span className="text-sm text-gray-900">{user?.city}, {user?.country}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Membre depuis</span>
                <span className="text-sm text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'Nouveau'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/profile" className="text-sm text-navy-800 hover:text-navy-900 font-medium flex items-center gap-1">
                Modifier mon profil
                <i className="bi bi-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Stats Section */}
      {user?.role === 'admin' && (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Aperçu administration</h2>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Taux de traitement</div>
                  <div className="text-xl font-bold text-gray-900">
                    {stats.total > 0 ? Math.round((stats.accepted + stats.rejected) / stats.total * 100) : 0}%
                  </div>
                </div>
                <i className="bi bi-graph-up text-gray-400 text-xl"></i>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">En révision</div>
                  <div className="text-xl font-bold text-gray-900">{stats.pending}</div>
                </div>
                <i className="bi bi-hourglass-split text-gray-400 text-xl"></i>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Taux d'acceptation</div>
                  <div className="text-xl font-bold text-gray-900">
                    {stats.total > 0 ? Math.round(stats.accepted / stats.total * 100) : 0}%
                  </div>
                </div>
                <i className="bi bi-check-circle text-gray-400 text-xl"></i>
              </div>
              <Link to="/demandes" className="flex items-center justify-between p-3 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">
                <div>
                  <div className="text-xs text-navy-700">Gérer les demandes</div>
                  <div className="text-xl font-bold text-navy-800">{stats.total}</div>
                </div>
                <i className="bi bi-arrow-right text-navy-800 text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal - Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {demandeInfo.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{demandeInfo.desc}</p>
              </div>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateDemande} className="p-6 space-y-5">
              {/* Common fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  placeholder="Ex: Demande de stage d'été 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Description *</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm resize-none"
                  placeholder="Décrivez votre demande en détail..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              {/* Dynamic fields based on user role */}
              {renderFormFields()}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors disabled:opacity-50 flex items-center gap-2"
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

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-100 { background-color: #d0d9eb; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .bg-navy-900 { background-color: #0a1e36; }
        .text-navy-700 { color: #1a4a7a; }
        .text-navy-800 { color: #0f2b4d; }
        .hover\\:bg-navy-900:hover { background-color: #0a1e36; }
        .hover\\:bg-navy-100:hover { background-color: #d0d9eb; }
        .focus\\:border-navy-800:focus { border-color: #0f2b4d; }
        .border-navy-800 { border-color: #0f2b4d; }
      `}</style>
    </div>
  );
};

export default Dashboard;