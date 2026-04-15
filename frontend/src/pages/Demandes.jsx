import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Demandes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cinFilter, setCinFilter] = useState('');
  
  // Create Modal
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [bulkMessageForm, setBulkMessageForm] = useState({ title: '', message: '' });
  const [bulkMessageLoading, setBulkMessageLoading] = useState(false);
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

  // Admin Notification Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [messageForm, setMessageForm] = useState({ title: '', message: '' });
  const [messageLoading, setMessageLoading] = useState(false);

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
      setShowCreate(false);
      resetForm();
      fetchDemandes();
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

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/demandes/${id}/status`, { status });
      fetchDemandes();
    } catch (e) {
      console.error('Error updating status:', e);
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
      alert('Message envoyé avec succès');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Erreur lors de l\'envoi du message');
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
      alert('Notifications envoyées avec succès');
    } catch (err) {
      console.error('Error sending bulk message:', err);
      alert('Erreur lors de l\'envoi des notifications');
    } finally {
      setBulkMessageLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await api.delete(`/demandes/${id}`);
      fetchDemandes();
    } catch(e) {
      console.error('Error deleting demande:', e);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'En attente' },
      in_review: { class: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'En révision' },
      accepted: { class: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Acceptée' },
      rejected: { class: 'bg-red-50 text-red-700 border border-red-200', label: 'Refusée' }
    };
    return badges[status] || badges.pending;
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

  // Get title and description based on user role
  const getDemandeInfo = () => {
    const info = {
      stage: {
        title: 'Demande de Stage',
        desc: 'Stage professionnel au sein du parlement',
        icon: 'bi-briefcase'
      },
      presse: {
        title: 'Demande Presse',
        desc: 'Accréditation pour les médias',
        icon: 'bi-newspaper'
      },
      bibliotheque: {
        title: 'Demande Bibliothèque',
        desc: 'Accès aux archives et documents',
        icon: 'bi-book'
      },
      visite: {
        title: 'Demande de Visite',
        desc: 'Visite guidée pour groupes scolaires',
        icon: 'bi-people'
      }
    };
    return info[demandeType] || { title: 'Nouvelle Demande', desc: '', icon: 'bi-file-text' };
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
              <p className="text-xs text-gray-500 mt-1">Format acceptés: PDF, DOC, DOCX (Max 5MB)</p>
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

  if (!canCreateDemande && user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
          <i className="bi bi-exclamation-triangle text-gray-300 text-4xl"></i>
          <p className="text-gray-400 mt-2">Votre rôle ne permet pas de créer des demandes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos demandes parlementaires</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <select 
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-navy-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_review">En révision</option>
            <option value="accepted">Acceptées</option>
            <option value="rejected">Refusées</option>
          </select>

          {user?.role === 'admin' && (
            <>
              <input
                type="text"
                placeholder="Filtrer par CIN"
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-navy-800"
                value={cinFilter}
                onChange={(e) => setCinFilter(e.target.value)}
              />

              <select
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-navy-800"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="stage">Stage</option>
                <option value="presse">Presse</option>
                <option value="bibliotheque">Bibliothèque</option>
                <option value="visite">Visite</option>
              </select>

              {selectedUserIds.length > 0 && (
                <button
                  onClick={() => setShowBulkMessageModal(true)}
                  className="px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded hover:bg-purple-800 transition-colors flex items-center gap-2"
                >
                  <i className="bi bi-chat-dots text-sm"></i>
                  Envoyer à {selectedUserIds.length} utilisateur{selectedUserIds.length > 1 ? 's' : ''}
                </button>
              )}
            </>
          )}

          {canCreateDemande && (
            <button 
              onClick={() => setShowCreate(true)} 
              className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors flex items-center gap-2"
            >
              <i className="bi bi-plus-lg text-sm"></i>
              Nouvelle demande
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: demandes.length, color: 'text-gray-700', bg: 'bg-gray-100' },
          { label: 'En attente', value: demandes.filter(d => d.status === 'pending').length, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Acceptées', value: demandes.filter(d => d.status === 'accepted').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Refusées', value: demandes.filter(d => d.status === 'rejected').length, color: 'text-red-700', bg: 'bg-red-50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3 text-center shadow-sm">
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Demande List */}
      {loading ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
          <i className="bi bi-hourglass-split text-gray-300 text-3xl animate-pulse"></i>
          <p className="text-gray-400 text-sm mt-2">Chargement...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
          <i className="bi bi-inbox text-gray-300 text-4xl"></i>
          <p className="text-gray-400 mt-2">Aucune demande trouvée</p>
          {canCreateDemande && (
            <button 
              onClick={() => setShowCreate(true)}
              className="mt-4 text-sm text-navy-800 hover:text-navy-900 font-medium"
            >
              Créer ma première demande →
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {user?.role === 'admin' && (
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={filteredData.length > 0 && selectedUserIds.length === Array.from(new Set(filteredData.map((d) => d.user_id).filter(Boolean))).length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {user?.role === 'admin' && (
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(item.user_id)}
                            onChange={() => toggleUserSelection(item.user_id)}
                          />
                        </td>
                      )}
                      <td className="px-5 py-3 text-gray-500 font-mono text-xs">#{item.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <i className={`${getTypeIcon(item.type)} text-navy-800 text-sm`}></i>
                          <span className="text-gray-700 text-xs font-medium">{getTypeLabel(item.type)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-gray-900 text-sm font-medium max-w-xs truncate">{item.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-xs">{item.message}</div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs hidden md:table-cell">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {user?.role === 'admin' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/demandedetail/${item.id}`)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                              title="Voir les détails"
                            >
                              <i className="bi bi-eye text-sm"></i>
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedDemande(item);
                                setShowMessageModal(true);
                              }}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Envoyer un message"
                            >
                              <i className="bi bi-chat-dots text-sm"></i>
                            </button>
                            {item.status !== 'accepted' && item.status !== 'in_review' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'in_review')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Mettre en révision"
                              >
                                <i className="bi bi-clock-history text-sm"></i>
                              </button>
                            )}
                            {item.status !== 'accepted' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'accepted')}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                title="Accepter"
                              >
                                <i className="bi bi-check-lg text-sm"></i>
                              </button>
                            )}
                            {item.status !== 'rejected' && (
                              <button 
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Refuser"
                              >
                                <i className="bi bi-x-lg text-sm"></i>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/demandedetail/${item.id}`)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                              title="Voir les détails"
                            >
                              <i className="bi bi-eye text-sm"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)} 
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Supprimer"
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

      {/* Create Modal - Form */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {demandeInfo.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{demandeInfo.desc}</p>
              </div>
              <button onClick={() => { setShowCreate(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
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
                  onClick={() => { setShowCreate(false); resetForm(); }}
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

      {/* Admin Message Modal */}
      {showMessageModal && selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Envoyer un message</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la notification *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  placeholder="Ex: Document manquant"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({...messageForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm resize-none"
                  placeholder="Veuillez fournir votre message..."
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4 flex flex-col">
                <button
                  type="submit"
                  disabled={messageLoading}
                  className="w-full py-2 bg-navy-800 text-white text-sm font-medium rounded hover:bg-navy-900 transition-colors disabled:opacity-50"
                >
                  {messageLoading ? 'Envoi...' : 'Envoyer la notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Envoyer une notification groupée</h3>
              <button onClick={() => setShowBulkMessageModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendBulkMessage} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs sélectionnés : {selectedUserIds.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la notification *</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm"
                  placeholder="Ex: Mise à jour importante"
                  value={bulkMessageForm.title}
                  onChange={(e) => setBulkMessageForm({...bulkMessageForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy-800 text-sm resize-none"
                  placeholder="Entrez le message à envoyer aux utilisateurs sélectionnés..."
                  value={bulkMessageForm.message}
                  onChange={(e) => setBulkMessageForm({...bulkMessageForm, message: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4 flex flex-col">
                <button
                  type="submit"
                  disabled={bulkMessageLoading}
                  className="w-full py-2 bg-purple-700 text-white text-sm font-medium rounded hover:bg-purple-800 transition-colors disabled:opacity-50"
                >
                  {bulkMessageLoading ? 'Envoi...' : 'Envoyer la notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .bg-navy-900 { background-color: #0a1e36; }
        .text-navy-800 { color: #0f2b4d; }
        .hover\\:bg-navy-900:hover { background-color: #0a1e36; }
        .focus\\:border-navy-800:focus { border-color: #0f2b4d; }
        .border-navy-800 { border-color: #0f2b4d; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Demandes;