import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DemandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);

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
      pending: { class: 'bg-amber-50 text-amber-700 border-amber-200', label: 'En attente' },
      in_review: { class: 'bg-blue-50 text-blue-700 border-blue-200', label: 'En révision' },
      accepted: { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Acceptée' },
      rejected: { class: 'bg-red-50 text-red-700 border-red-200', label: 'Refusée' }
    };
    return badges[status] || badges.pending;
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
      alert('Impossible de télécharger le fichier.');
    }
  };

  const renderFileLink = (fileUrl, fileName, fileType) => {
    if (!fileUrl) return null;

    return (
      <button
        type="button"
        onClick={() => downloadFile(fileType, fileUrl)}
        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
      >
        <i className="bi bi-file-earmark-text"></i>
        Télécharger {fileName}
      </button>
    );
  };

  const renderDetails = () => {
    if (!demande?.details) return null;
    
    const details = demande.details;
    const formattedDetails = [];
    
    // Format based on demande type
    if (demande.type === 'stage') {
      const stageFields = [
        { key: 'school_name', label: 'Établissement' },
        { key: 'field_of_study', label: 'Filière d\'étude' },
        { key: 'start_date', label: 'Date de début', format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : 'Non spécifiée' },
        { key: 'end_date', label: 'Date de fin', format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : 'Non spécifiée' },
        { key: 'motivation_letter', label: 'Lettre de motivation' },
      ];
      
      stageFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: field.format ? field.format(details[field.key]) : details[field.key]
          });
        }
      });
      
      // Handle CV file separately
      if (details.cv_file) {
        formattedDetails.push({
          label: 'CV',
          value: renderFileLink(details.cv_file, 'CV', 'cv_file')
        });
      }
    }
    else if (demande.type === 'presse') {
      const presseFields = [
        { key: 'media_name', label: 'Nom du média' },
        { key: 'press_card_number', label: 'N° Carte de presse' },
        { key: 'organization', label: 'Organisation' },
      ];
      
      presseFields.forEach(field => {
        if (details[field.key]) {
          formattedDetails.push({
            label: field.label,
            value: details[field.key]
          });
        }
      });
      
      // Handle supporting document separately
      if (details.supporting_document) {
        formattedDetails.push({
          label: 'Document justificatif',
          value: renderFileLink(details.supporting_document, 'document justificatif', 'supporting_document')
        });
      }
    }
    else if (demande.type === 'bibliotheque') {
      const bibliothequeFields = [
        { key: 'research_topic', label: 'Sujet de recherche' },
        { key: 'institution', label: 'Institution' },
        { key: 'visit_date', label: 'Date de visite', format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : 'Non spécifiée' },
        { key: 'duration', label: 'Durée' },
        { key: 'purpose', label: 'Objectif de la recherche' },
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
        { key: 'school_name', label: 'Établissement' },
        { key: 'number_of_students', label: 'Nombre d\'élèves' },
        { key: 'grade_level', label: 'Niveau' },
        { key: 'visit_date', label: 'Date de visite', format: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : 'Non spécifiée' },
        { key: 'supervisor_name', label: 'Superviseur' },
        { key: 'phone', label: 'Téléphone' },
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="bi bi-hourglass-split text-3xl animate-pulse text-gray-400"></i>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border border-gray-100">
        <i className="bi bi-exclamation-circle text-4xl text-gray-300"></i>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Demande introuvable</h3>
        <button onClick={() => navigate('/demandes')} className="mt-4 text-blue-600 hover:underline">
          Retour aux demandes
        </button>
      </div>
    );
  }

  const status = getStatusBadge(demande.status);
  const formattedDetails = renderDetails();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/demandes')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <i className="bi bi-arrow-left text-lg"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Détails de la demande #{demande.id}</h1>
          <p className="text-sm text-gray-500">Créée le {new Date(demande.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{demande.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.class}`}>
                {status.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                Type: {demande.type}
              </span>
            </div>
            
            {/* Enhanced user info for admin */}
            {user?.role === 'admin' && demande.user && (
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <i className="bi bi-person-badge text-navy-800 text-lg"></i>
                  <span className="font-semibold text-gray-800">Informations du demandeur</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-person text-gray-500 text-sm w-5"></i>
                      <span className="text-gray-600 text-sm">Nom complet:</span>
                      <button
                        onClick={() => navigate(`/admin/users/${demande.user.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        {demande.user.first_name} {demande.user.last_name}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <i className="bi bi-envelope text-gray-500 text-sm w-5"></i>
                      <span className="text-gray-600 text-sm">Email:</span>
                      <span className="text-gray-800 text-sm">{demande.user.email}</span>
                    </div>
                    {demande.user.cin && (
                      <div className="flex items-center gap-2 mt-2">
                        <i className="bi bi-person-badge text-gray-500 text-sm w-5"></i>
                        <span className="text-gray-600 text-sm">CIN:</span>
                        <span className="text-gray-800 text-sm font-medium">{demande.user.cin}</span>
                      </div>
                    )}
                    {demande.user.phone && (
                      <div className="flex items-center gap-2 mt-2">
                        <i className="bi bi-telephone text-gray-500 text-sm w-5"></i>
                        <span className="text-gray-600 text-sm">Téléphone:</span>
                        <span className="text-gray-800 text-sm">{demande.user.phone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-person-badge text-gray-500 text-sm w-5"></i>
                      <span className="text-gray-600 text-sm">Rôle:</span>
                      <span className="capitalize text-gray-800 text-sm font-medium">{demande.user.role}</span>
                    </div>
                    {demande.user.city && (
                      <div className="flex items-center gap-2 mt-2">
                        <i className="bi bi-geo-alt text-gray-500 text-sm w-5"></i>
                        <span className="text-gray-600 text-sm">Ville:</span>
                        <span className="text-gray-800 text-sm">{demande.user.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <i className="bi bi-calendar text-gray-500 text-sm w-5"></i>
                      <span className="text-gray-600 text-sm">Membre depuis:</span>
                      <span className="text-gray-800 text-sm">
                        {new Date(demande.user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {user?.role === 'admin' && (
            <div className="flex gap-2 ml-4">
              {demande.status !== 'accepted' && demande.status !== 'in_review' && (
                <button 
                  onClick={() => handleStatusChange('in_review')} 
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                  title="Mettre en révision"
                >
                  <i className="bi bi-clock-history mr-1"></i>
                  Réviser
                </button>
              )}
              {demande.status !== 'accepted' && (
                <button 
                  onClick={() => handleStatusChange('accepted')} 
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-sm font-medium transition-colors"
                  title="Accepter"
                >
                  <i className="bi bi-check-lg mr-1"></i>
                  Accepter
                </button>
              )}
              {demande.status !== 'rejected' && (
                <button 
                  onClick={() => handleStatusChange('rejected')} 
                  className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-medium transition-colors"
                  title="Refuser"
                >
                  <i className="bi bi-x-lg mr-1"></i>
                  Refuser
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i className="bi bi-chat-text text-navy-800"></i>
              Message
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                {demande.message}
              </p>
            </div>
          </div>

          {formattedDetails.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="bi bi-info-circle text-navy-800"></i>
                Informations spécifiques
              </h3>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {formattedDetails.map((detail, index) => (
                  <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                    <dt className="text-xs text-gray-500 font-medium">{detail.label}</dt>
                    <dd className="text-sm text-gray-900 mt-1 font-medium break-words">
                      {typeof detail.value === 'object' ? detail.value : detail.value}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .text-navy-800 { color: #0f2b4d; }
      `}</style>
    </div>
  );
};

export default DemandeDetail;