import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sendToIds, setSendToIds] = useState([]);
  const [sendToLabel, setSendToLabel] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [filters, setFilters] = useState({ email: '', cin: '' });

  const isAdmin = user?.role === 'admin';

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
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    return users.filter((userItem) => {
      const emailMatches = filters.email
        ? userItem.email.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const cinMatches = filters.cin
        ? (userItem.cin || '').toLowerCase().includes(filters.cin.toLowerCase())
        : true;
      return emailMatches && cinMatches;
    });
  }, [users, filters]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/admin/users');
      const data = res.data.data || [];
      setUsers(data);
    } catch (e) {
      console.error('Error fetching users:', e);
      setError(t('users.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    // Filters are applied locally via memoized filteredUsers
  };

  const resetFilters = () => {
    setFilters({ email: '', cin: '' });
  };

  const toggleUserSelection = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
      return;
    }
    setSelectedUserIds(filteredUsers.map((userItem) => userItem.id));
  };

  const openSendModal = (userIds, label) => {
    setSendToIds(userIds);
    setSendToLabel(label);
    setShowMessageModal(true);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (sendToIds.length === 0) {
      showToast(t('users.select_user_for_notification'), 'error');
      return;
    }

    setSending(true);

    try {
      await api.post('/admin/users/notify', {
        user_ids: sendToIds,
        title: notificationForm.title,
        message: notificationForm.message,
      });

      setShowMessageModal(false);
      setNotificationForm({ title: '', message: '' });
      setSelectedUserIds([]);
      showToast(t('users.notifications_sent'), 'success');
    } catch (e) {
      console.error('Error sending notifications:', e);
      const message = e.response?.data?.message || t('users.error_sending_notifications');
      showToast(message, 'error');
    } finally {
      setSending(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: darkMode 
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-700 border border-purple-200',
      stagiaire: darkMode
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
      journaliste: darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      chercheur: darkMode
        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
        : 'bg-amber-100 text-amber-700 border border-amber-200',
      ecole: darkMode
        ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800'
        : 'bg-cyan-100 text-cyan-700 border border-cyan-200',
    };
    return badges[role] || badges.stagiaire;
  };

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className={`rounded-2xl p-6 text-center ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <i className={`bi bi-shield-lock text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
          <h2 className={`text-xl font-semibold mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('users.access_denied')}
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('users.admin_only')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-6 mt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header Card */}
      <div className={`rounded-2xl p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('users.title')}
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('users.subtitle')}
            </p>
          </div>
          <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => openSendModal(selectedUserIds, t('users.selected_users', { count: selectedUserIds.length }))}
              disabled={selectedUserIds.length === 0}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                selectedUserIds.length === 0 
                  ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
              }`}
            >
              <i className="bi bi-send me-2"></i>
              {selectedUserIds.length === 0 ? t('users.select_users') : t('users.send_to_selected', { count: selectedUserIds.length })}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              {t('users.reset_filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className={`rounded-2xl p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <i className="bi bi-envelope me-1"></i>
              {t('users.filter_email')}
            </label>
            <input
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              type="text"
              placeholder={t('users.filter_email_placeholder')}
              className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <i className="bi bi-card-text me-1"></i>
              {t('users.filter_cin')}
            </label>
            <input
              value={filters.cin}
              onChange={(e) => handleFilterChange('cin', e.target.value)}
              type="text"
              placeholder={t('users.filter_cin_placeholder')}
              className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={applyFilters}
              className="w-full px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <i className="bi bi-search me-2"></i>
              {t('users.search')}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className={`rounded-2xl overflow-hidden shadow-sm ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={`h-16 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`} />
            ))}
          </div>
        ) : error ? (
          <div className={`p-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className={`bi bi-exclamation-triangle text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}></i>
            <p className="mt-3">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={`p-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <i className={`bi bi-people-fill text-5xl ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}></i>
            <p className="mt-4 text-base font-medium">{t('users.no_users_found')}</p>
            <p className="mt-1 text-sm">{t('users.no_users_desc')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'}>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('users.table.name')}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('users.table.email')}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('users.table.cin')}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('users.table.role')}
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('users.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {filteredUsers.map((userItem) => {
                  const roleBadge = getRoleBadge(userItem.role);
                  return (
                    <tr key={userItem.id} className={`transition-colors duration-200 ${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          checked={selectedUserIds.includes(userItem.id)}
                          onChange={() => toggleUserSelection(userItem.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {userItem.first_name} {userItem.last_name}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {userItem.email}
                      </td>
                      <td className={`px-4 py-3 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {userItem.cin || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${roleBadge}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${userItem.id}`)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode 
                                ? 'text-gray-400 hover:bg-gray-700 hover:text-orange-400'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-orange-600'
                            }`}
                            title={t('users.view_profile')}
                          >
                            <i className="bi bi-eye text-base"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => openSendModal([userItem.id], `${userItem.first_name} ${userItem.last_name}`)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode 
                                ? 'text-gray-400 hover:bg-gray-700 hover:text-orange-400'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-orange-600'
                            }`}
                            title={t('users.send_notification')}
                          >
                            <i className="bi bi-envelope-paper text-base"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl transform transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isRTL ? 'flex-row-reverse' : ''} ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('users.send_notification')}
                </h2>
                <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('users.sending_to', { count: sendToIds.length })}: {sendToLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSendNotification} className="p-6 space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('users.notification_title')}
                </label>
                <input
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  type="text"
                  placeholder={t('users.notification_title_placeholder')}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('users.notification_message')}
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  placeholder={t('users.notification_message_placeholder')}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className={`flex-1 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className={`flex-1 px-5 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 ${
                    sending 
                      ? 'bg-orange-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="bi bi-arrow-repeat animate-spin"></i>
                      {t('common.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="bi bi-send"></i>
                      {t('users.send_notification')}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
          toast.type === 'error' 
            ? darkMode ? 'bg-red-900/90 text-red-200 border border-red-800' : 'bg-red-500 text-white'
            : darkMode ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-800' : 'bg-emerald-500 text-white'
        }`}>
          <i className={`text-lg ${toast.type === 'error' ? 'bi bi-x-circle' : 'bi bi-check-circle'}`}></i>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Users;