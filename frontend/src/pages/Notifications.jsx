import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications');
      const data = res.data.data || res.data;
      
      // The data field from Laravel notifications is automatically JSON decoded
      setNotifications(data || []);
    } catch (e) {
      console.error('Error fetching notifications:', e);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read_at);
    for (const notif of unread) {
      await markAsRead(notif.id);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Supprimer cette notification ?')) return;
    try {
      // You'll need to add a delete route in your backend
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (e) {
      console.error('Error deleting notification:', e);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="bi bi-hourglass-split text-3xl animate-pulse text-gray-400"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i className="bi bi-exclamation-triangle text-3xl text-red-500"></i>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount === 0 
              ? "Toutes vos notifications sont lues" 
              : `Vous avez ${unreadCount} notification${unreadCount !== 1 ? 's' : ''} non lue${unreadCount !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <i className="bi bi-bell-slash text-5xl text-gray-300"></i>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune notification</h3>
            <p className="mt-1 text-sm text-gray-500">Vous n'avez reçu aucune notification pour le moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notif) => {
              const isUnread = !notif.read_at;
              // Access the data from the notification's data field (Laravel auto-decodes it)
              const notificationData = notif.data || {};
              const notificationTitle = notificationData.title || 'Nouvelle notification';
              const notificationMessage = notificationData.message || 'Aucun contenu';
              
              return (
                <li 
                  key={notif.id} 
                  className={`transition-colors ${isUnread ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isUnread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={`bi ${isUnread ? 'bi-envelope-fill' : 'bi-envelope'}`}></i>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`text-base font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notificationTitle}
                              </h4>
                              {isUnread && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p className={`mt-2 text-sm ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                              {notificationMessage}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleString('fr-FR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-3 flex gap-3">
                          {isUnread && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Marquer comme lue
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;