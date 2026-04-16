import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'warning',
  darkMode: externalDarkMode,
  isRTL: externalIsRTL,
}) => {
  const { i18n } = useTranslation();
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isRTL = externalIsRTL ?? i18n.language === 'ar';

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setInternalDarkMode(isDark);
    const observer = new MutationObserver(() => {
      setInternalDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!open) {
    return null;
  }

  const effectiveDarkMode = externalDarkMode ?? internalDarkMode;
  
  // Type configurations for dark mode
  const getIconColor = () => {
    if (type === 'error') {
      return effectiveDarkMode ? 'text-red-400' : 'text-red-600';
    }
    return effectiveDarkMode ? 'text-orange-400' : 'text-orange-600';
  };
  
  const getBgColor = () => {
    if (type === 'error') {
      return effectiveDarkMode ? 'bg-red-950/30' : 'bg-red-50';
    }
    return effectiveDarkMode ? 'bg-orange-950/30' : 'bg-orange-50';
  };
  
  const getIconBgColor = () => {
    if (type === 'error') {
      return effectiveDarkMode ? 'bg-gray-800' : 'bg-white';
    }
    return effectiveDarkMode ? 'bg-gray-800' : 'bg-white';
  };
  
  const getButtonClass = () => {
    if (type === 'error') {
      return effectiveDarkMode 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-red-500 hover:bg-red-600';
    }
    return effectiveDarkMode 
      ? 'bg-orange-600 hover:bg-orange-700' 
      : 'bg-orange-500 hover:bg-orange-600';
  };
  
  const getCancelButtonClass = () => {
    return effectiveDarkMode 
      ? 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
      : 'border-gray-200 text-gray-700 hover:bg-gray-50';
  };

  const iconColor = getIconColor();
  const bgColor = getBgColor();
  const iconBgColor = getIconBgColor();
  const buttonClass = getButtonClass();
  const cancelButtonClass = getCancelButtonClass();

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
        effectiveDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className={`px-6 py-6 ${bgColor}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor} shadow-sm ${iconColor}`}>
              <i className={`bi ${type === 'error' ? 'bi-x-octagon-fill' : 'bi-exclamation-triangle-fill'} text-2xl`}></i>
            </div>
            <div>
              <h2 id="confirm-dialog-title" className={`text-xl font-bold ${effectiveDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h2>
            </div>
          </div>
          <p id="confirm-dialog-description" className={`mt-4 text-sm leading-relaxed ${effectiveDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {message}
          </p>
        </div>

        <div className={`px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end ${
          isRTL ? 'sm:flex-row-reverse' : ''
        } ${effectiveDarkMode ? 'bg-gray-900/50 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-100'}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border ${cancelButtonClass}`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;