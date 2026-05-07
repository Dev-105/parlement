import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const ReviewModal = ({ onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    try {
      await api.post('/reviews', { rating, comment });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error submitting review', err);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Safe fallback translations mapping object
  const translations = {
    title: {
      fr: 'Comment était votre expérience ?',
      en: 'How was your experience?',
      ar: 'كيف كانت تجربتك؟',
      es: '¿Cómo fue tu experiencia?'
    },
    subtitle: {
      fr: 'Votre avis nous aide à améliorer nos services. Il ne vous prendra qu\'un instant.',
      en: 'Your feedback helps us improve our services. It only takes a moment.',
      ar: 'رأيك يساعدنا على تحسين خدماتنا. لن يستغرق الأمر سوى لحظة.',
      es: 'Tu opinión nos ayuda a mejorar nuestros servicios. Solo tomará un momento.'
    },
    placeholder: {
      fr: 'Votre commentaire (optionnel)...',
      en: 'Your comment (optional)...',
      ar: 'تعليقك (اختياري)...',
      es: 'Tu comentario (opcional)...'
    },
    later: {
      fr: 'Plus tard',
      en: 'Later',
      ar: 'لاحقا',
      es: 'Más tarde'
    },
    submit: {
      fr: 'Envoyer',
      en: 'Submit',
      ar: 'إرسال',
      es: 'Enviar'
    }
  };

  const getText = (key) => {
    const lang = i18n.language || 'fr';
    return translations[key][lang] || translations[key]['fr'];
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`rounded-2xl w-full max-w-md shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            darkMode ? 'bg-orange-900/30' : 'bg-orange-100'
          }`}>
            <i className="bi bi-star flex items-center justify-center text-3xl text-orange-500"></i>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {getText('title')}
          </h2>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getText('subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className={`flex justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <i 
                    className={`bi ${
                      star <= (hoverRating || rating) 
                        ? 'bi-star-fill text-orange-400' 
                        : darkMode ? 'bi-star text-gray-600' : 'bi-star text-gray-300'
                    } text-4xl transition-colors duration-200`}
                  ></i>
                </button>
              ))}
            </div>

            {/* Comment Area */}
            <div>
              <textarea
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none placeholder-gray-400 ${
                  darkMode 
                    ? 'border-gray-700 bg-gray-900 text-white focus:border-orange-500' 
                    : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-500'
                }`}
                placeholder={getText('placeholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  darkMode 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {getText('later')}
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600"
              >
                {loading ? <i className="bi bi-arrow-repeat animate-spin"></i> : getText('submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;