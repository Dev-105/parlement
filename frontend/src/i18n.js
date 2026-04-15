import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = ['fr'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    detection: {
      checkWhitelist: true,
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fr: {
        translation: {
          "login": "Connexion",
          "register": "S'inscrire",
          "home": "Accueil",
          "demandes": "Demandes",
          "profile": "Profil",
          "settings": "Paramètres",
          "logout": "Déconnexion",
          "welcome": "Bienvenue",
          "about_system": "À propos du système",
          "features": "Fonctionnalités",
          "role_explain": "Nos profils",
          "status": "Statut",
          "type": "Type",
          "create_demande": "Créer une demande",
          "pending": "En attente",
          "in_review": "En revue",
          "accepted": "Acceptée",
          "rejected": "Rejetée"
        }
      },
      en: {
        translation: {
          "login": "Login",
          "register": "Register",
          "home": "Home",
          "demandes": "Requests",
          "profile": "Profile",
          "settings": "Settings",
          "logout": "Logout",
          "welcome": "Welcome",
          "about_system": "About System",
          "features": "Features",
          "role_explain": "Role Explanation",
          "status": "Status",
          "type": "Type",
          "create_demande": "Create Request",
          "pending": "Pending",
          "in_review": "In Review",
          "accepted": "Accepted",
          "rejected": "Rejected"
        }
      },
      ar: {
        translation: {
          "login": "تسجيل الدخول",
          "register": "إنشاء حساب",
          "home": "الرئيسية",
          "demandes": "الطلبات",
          "profile": "الملف الشخصي",
          "settings": "الإعدادات",
          "logout": "تسجيل الخروج",
          "welcome": "مرحباً",
          "about_system": "حول النظام",
          "features": "المميزات",
          "role_explain": "الأدوار",
          "status": "الحالة",
          "type": "النوع",
          "create_demande": "إنشاء طلب",
          "pending": "قيد الانتظار",
          "in_review": "قيد المراجعة",
          "accepted": "مقبول",
          "rejected": "مرفوض"
        }
      },
      es: {
        translation: {
          "login": "Iniciar sesión",
          "register": "Registrarse",
          "home": "Inicio",
          "demandes": "Peticiones",
          "profile": "Perfil",
          "settings": "Ajustes",
          "logout": "Cerrar sesión",
          "welcome": "Bienvenido",
          "about_system": "Acerca del sistema",
          "features": "Características",
          "role_explain": "Roles",
          "status": "Estado",
          "type": "Tipo",
          "create_demande": "Crear petición",
          "pending": "Pendiente",
          "in_review": "En revisión",
          "accepted": "Aceptado",
          "rejected": "Rechazado"
        }
      }
    }
  });

export default i18n;
