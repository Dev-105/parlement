import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isRTL = i18n.language === 'ar';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: null,
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const isAdmin = user?.role === 'admin';

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

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications');
      const data = res.data.data || res.data;
      setNotifications(data || []);
    } catch (e) {
      console.error('Error fetching notifications:', e);
      setError(t('notifications.error_loading'));
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

  const deleteNotificationConfirmed = async (id) => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
    try {
      await api.delete(`/notifications/${id}`);
      setSelectedNotifications((prev) => prev.filter((selectedId) => selectedId !== id));
      await fetchNotifications();
    } catch (e) {
      console.error('Error deleting notification:', e.response || e);
      const message = e.response?.data?.message || t('notifications.delete_error');
      showToast(message, 'error');
    }
  };

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((notif) => notif.id));
    }
  };

  const deleteNotification = (id) => {
    setConfirmDialog({
      open: true,
      title: t('common.confirm'),
      message: t('notifications.delete_confirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onConfirm: () => deleteNotificationConfirmed(id),
    });
  };

  const deleteSelectedConfirmed = async (ids) => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
    const normalizedIds = ids
      .map((id) => parseInt(id, 10))
      .filter((id) => !Number.isNaN(id));

    if (normalizedIds.length === 0) {
      showToast(t('notifications.delete_selected_error', 'Error deleting selected notifications'), 'error');
      return;
    }

    try {
      await api.post('/notifications/bulk', { ids: normalizedIds });
      setSelectedNotifications([]);
      await fetchNotifications();
      showToast(t('notifications.delete_selected_success', 'Selected notifications deleted'), 'success');
    } catch (e) {
      console.error('Error deleting selected notifications:', e.response || e);
      const message = e.response?.data?.message || t('notifications.delete_selected_error', 'Error deleting selected notifications');
      showToast(message, 'error');
    }
  };

  const confirmDeleteSelected = () => {
    setConfirmDialog({
      open: true,
      title: t('common.confirm'),
      message: t('notifications.delete_selected_confirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onConfirm: () => deleteSelectedConfirmed(selectedNotifications),
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`p-4 rounded-xl flex gap-4 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-full shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex-1 space-y-3 py-1">
              <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-3 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        ))}
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
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        darkMode={darkMode}
        isRTL={isRTL}
      />
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('navbar_notifications')}
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {unreadCount === 0 
              ? t('notifications.all_read') 
              : t('notifications.unread_desc', { count: unreadCount })
            }
          </p>
        </div>
        
        <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {notifications.length > 0 && !isAdmin && (
            <>
              <button
                type="button"
                onClick={toggleSelectAll}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {selectedNotifications.length === notifications.length
                  ? t('notifications.deselect_all')
                  : t('notifications.select_all')}
              </button>
              {selectedNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={confirmDeleteSelected}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                >
                  {t('notifications.delete_selected', { count: selectedNotifications.length })}
                </button>
              )}
            </>
          )}
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('notifications.mark_all_read')}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className={`rounded-2xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <i className={`bi bi-bell-slash text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
            <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('notifications.empty')}</h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('notifications.empty_desc')}</p>
          </div>
        ) : (
          <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {notifications.map((notif) => {
              const isUnread = !notif.read_at;
              const notificationData = notif.data || {};
              const notificationTitle = notificationData.title || t('notifications.new');
              const notificationMessage = notificationData.message || t('notifications.no_content');
              
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
                    {!isAdmin && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notif.id)}
                          onChange={() => toggleNotificationSelection(notif.id)}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          aria-label={t('notifications.select_notification')}
                        />
                      </div>
                    )}
                    {/* Icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
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
                                  {t('common.new')}
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
                              {t('notifications.mark_read')}
                            </button>
                          )}
                          {!isAdmin && (
                            <button 
                              onClick={() => deleteNotification(notif.id)}
                              className={`text-sm font-medium transition-colors ${
                                darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                              }`}
                            >
                              Supprimer
                            </button>
                          )}
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

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-60 flex items-center px-4 py-3 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
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

export default Notifications;