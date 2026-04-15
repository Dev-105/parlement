import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isRTL = i18n.language === 'ar';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications');
      const data = res.data.data || res.data;
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
        <i className={`bi bi-hourglass-split text-3xl animate-pulse ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl p-6 text-center ${darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
          <i className={`bi bi-exclamation-triangle text-3xl ${darkMode ? 'text-red-400' : 'text-red-500'}`}></i>
          <p className={`mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          <button 
            onClick={fetchNotifications}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('navbar_notifications')}
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {unreadCount === 0 
              ? "Toutes vos notifications sont lues" 
              : `Vous avez ${unreadCount} notification${unreadCount !== 1 ? 's' : ''} non lue${unreadCount !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className={`rounded-2xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <i className={`bi bi-bell-slash text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Aucune notification</h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Vous n'avez reçu aucune notification pour le moment.</p>
          </div>
        ) : (
          <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {notifications.map((notif) => {
              const isUnread = !notif.read_at;
              const notificationData = notif.data || {};
              const notificationTitle = notificationData.title || 'Nouvelle notification';
              const notificationMessage = notificationData.message || 'Aucun contenu';
              
              return (
                <li 
                  key={notif.id} 
                  className={`transition-all duration-200 ${
                    isUnread 
                      ? darkMode 
                        ? 'bg-orange-900/20 hover:bg-orange-900/30' 
                        : 'bg-orange-50/30 hover:bg-orange-50/50'
                      : darkMode 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-6">
                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isUnread 
                          ? darkMode 
                            ? 'bg-orange-900/50 text-orange-400' 
                            : 'bg-orange-100 text-orange-600'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-500' 
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={`bi ${isUnread ? 'bi-envelope-fill' : 'bi-envelope'}`}></i>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <h4 className={`text-base font-semibold ${
                                isUnread 
                                  ? darkMode ? 'text-white' : 'text-gray-900'
                                  : darkMode ? 'text-gray-400' : 'text-gray-700'
                              }`}>
                                {notificationTitle}
                              </h4>
                              {isUnread && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  darkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p className={`mt-2 text-sm ${
                              isUnread 
                                ? darkMode ? 'text-gray-300' : 'text-gray-700'
                                : darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {notificationMessage}
                            </p>
                          </div>
                          <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(notif.created_at).toLocaleString('fr-FR', { 
                              day: '2-digit', month: '2-digit', year: 'numeric', 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className={`mt-3 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {isUnread && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className={`text-sm font-medium transition-colors ${
                                darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'
                              }`}
                            >
                              Marquer comme lue
                            </button>
                          )}
                          {/* <button 
                            onClick={() => deleteNotification(notif.id)}
                            className={`text-sm font-medium transition-colors ${
                              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                            }`}
                          >
                            Supprimer
                          </button> */}
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