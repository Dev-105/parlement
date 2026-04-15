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
    supportedLngs: ['fr', 'en', 'ar', 'es'],
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
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
          "dashboard": {
            "header": {
              "subtitle": "Résumé du tableau de bord",
              "admin_area": "Administration",
              "user_area": "Espace utilisateur"
            },
            "recent_requests": "Demandes récentes",
            "loading": "Chargement...",
            "empty_requests": "Aucune demande",
            "create_first_request": "Créer ma première demande",
            "stats": {
              "total": "Total des demandes",
              "pending": "En attente",
              "accepted": "Demandes acceptées",
              "rejected": "Demandes rejetées"
            },
            "admin": {
              "title": "Administration",
              "processing_rate": "Taux de traitement",
              "acceptance_rate": "Taux d'acceptation",
              "manage": "Gérer"
            },
            "requests": {
              "stage": {
                "title": "Demande de Stage",
                "desc": "Stage professionnel au sein du parlement",
                "buttonText": "Nouvelle demande de stage"
              },
              "presse": {
                "title": "Demande Presse",
                "desc": "Accréditation pour les médias",
                "buttonText": "Nouvelle demande presse"
              },
              "bibliotheque": {
                "title": "Demande Bibliothèque",
                "desc": "Accès aux archives et documents",
                "buttonText": "Nouvelle demande bibliothèque"
              },
              "visite": {
                "title": "Demande de Visite",
                "desc": "Visite guidée pour groupes",
                "buttonText": "Nouvelle demande de visite"
              }
            },
            "types": {
              "stage": "Stage",
              "presse": "Presse",
              "bibliotheque": "Bibliothèque",
              "visite": "Visite"
            },
            "form": {
              "school_university": "Établissement / Université",
              "field_of_study": "Filière d'étude",
              "start_date": "Date de début",
              "end_date": "Date de fin",
              "cv_file": "CV (PDF, DOC, DOCX)",
              "motivation_letter": "Lettre de motivation",
              "motivation_letter_placeholder": "Expliquez pourquoi vous souhaitez effectuer un stage au parlement...",
              "media_name": "Nom du média",
              "press_card_number": "N° Carte de presse",
              "organization": "Organisation",
              "supporting_document": "Document justificatif",
              "title": "Titre",
              "title_placeholder": "Ex: Demande de stage été 2024",
              "message_label": "Message / Description",
              "message_placeholder": "Décrivez votre demande en détail...",
              "submit": "Soumettre"
            }
          },
          "profile": {
            "email": "E-mail",
            "phone": "Téléphone",
            "member_since": "Membre depuis",
            "edit_profile": "Modifier mon profil"
          },
          "common": {
            "new": "Nouveau"
          },
          "errors": {
            "create_request": "Impossible de créer la demande."
          },
          "pending": "En attente",
          "in_review": "En revue",
          "accepted": "Acceptée",
          "rejected": "Rejetée",
          "sidebar_dashboard": "Tableau de bord",
          "sidebar_notifications": "Notifications",
          "sidebar_requests": "Mes demandes",
          "sidebar_profile": "Mon profil",
          "sidebar_logout": "Déconnexion",
          "navbar_notifications": "Notifications",
          "navbar_view_all_notifications": "Voir toutes les notifications",
          "notifications_empty": "Aucune notification",
          "notification_default": "Notification",
          "navbar_theme_light": "Mode clair",
          "navbar_theme_dark": "Mode sombre"
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
          "dashboard": {
            "header": {
              "subtitle": "Dashboard summary",
              "admin_area": "Admin area",
              "user_area": "User area"
            },
            "recent_requests": "Recent requests",
            "loading": "Loading...",
            "empty_requests": "No requests yet",
            "create_first_request": "Create your first request",
            "stats": {
              "total": "Total requests",
              "pending": "Pending requests",
              "accepted": "Accepted requests",
              "rejected": "Rejected requests"
            },
            "admin": {
              "title": "Administration",
              "processing_rate": "Processing rate",
              "acceptance_rate": "Acceptance rate",
              "manage": "Manage"
            },
            "requests": {
              "stage": {
                "title": "Internship Request",
                "desc": "Professional internship within the parliament",
                "buttonText": "New internship request"
              },
              "presse": {
                "title": "Press Request",
                "desc": "Media accreditation",
                "buttonText": "New press request"
              },
              "bibliotheque": {
                "title": "Library Request",
                "desc": "Access to archives and documents",
                "buttonText": "New library request"
              },
              "visite": {
                "title": "Visit Request",
                "desc": "Guided tour for groups",
                "buttonText": "New visit request"
              }
            },
            "types": {
              "stage": "Internship",
              "presse": "Press",
              "bibliotheque": "Library",
              "visite": "Visit"
            },
            "form": {
              "school_university": "School / University",
              "field_of_study": "Field of study",
              "start_date": "Start date",
              "end_date": "End date",
              "cv_file": "CV (PDF, DOC, DOCX)",
              "motivation_letter": "Motivation letter",
              "motivation_letter_placeholder": "Explain why you want to intern at Parliament...",
              "media_name": "Media name",
              "press_card_number": "Press card number",
              "organization": "Organization",
              "supporting_document": "Supporting document",
              "title": "Title",
              "title_placeholder": "Ex: Summer internship request 2024",
              "message_label": "Message / Description",
              "message_placeholder": "Describe your request in detail...",
              "submit": "Submit"
            }
          },
          "profile": {
            "email": "Email",
            "phone": "Phone",
            "member_since": "Member since",
            "edit_profile": "Edit profile"
          },
          "common": {
            "new": "New"
          },
          "errors": {
            "create_request": "Unable to create request."
          },
          "pending": "Pending",
          "in_review": "In Review",
          "accepted": "Accepted",
          "rejected": "Rejected",
          "sidebar_dashboard": "Dashboard",
          "sidebar_notifications": "Notifications",
          "sidebar_requests": "Requests",
          "sidebar_profile": "Profile",
          "sidebar_logout": "Logout",
          "navbar_notifications": "Notifications",
          "navbar_view_all_notifications": "View all notifications",
          "notifications_empty": "No notifications",
          "notification_default": "Notification",
          "navbar_theme_light": "Light mode",
          "navbar_theme_dark": "Dark mode"
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
          "dashboard": {
            "header": {
              "subtitle": "ملخص لوحة التحكم",
              "admin_area": "مساحة المسؤول",
              "user_area": "مساحة المستخدم"
            },
            "recent_requests": "الطلبات الأخيرة",
            "loading": "جارٍ التحميل...",
            "empty_requests": "لا توجد طلبات حتى الآن",
            "create_first_request": "أنشئ طلبك الأول",
            "stats": {
              "total": "إجمالي الطلبات",
              "pending": "الطلبات المعلقة",
              "accepted": "الطلبات المقبولة",
              "rejected": "الطلبات المرفوضة"
            },
            "admin": {
              "title": "الإدارة",
              "processing_rate": "معدل المعالجة",
              "acceptance_rate": "معدل القبول",
              "manage": "إدارة"
            },
            "requests": {
              "stage": {
                "title": "طلب تدريب",
                "desc": "تدريب مهني داخل البرلمان",
                "buttonText": "طلب تدريب جديد"
              },
              "presse": {
                "title": "طلب صحفي",
                "desc": "اعتماد وسائل الإعلام",
                "buttonText": "طلب صحفي جديد"
              },
              "bibliotheque": {
                "title": "طلب مكتبة",
                "desc": "الوصول إلى الأرشيف والمستندات",
                "buttonText": "طلب مكتبة جديد"
              },
              "visite": {
                "title": "طلب زيارة",
                "desc": "جولة إرشادية للمجموعات",
                "buttonText": "طلب زيارة جديد"
              }
            },
            "types": {
              "stage": "التدريب",
              "presse": "الضغط",
              "bibliotheque": "المكتبة",
              "visite": "زيارة"
            },
            "form": {
              "school_university": "المدرسة / الجامعة",
              "field_of_study": "مجال الدراسة",
              "start_date": "تاريخ البداية",
              "end_date": "تاريخ النهاية",
              "cv_file": "السيرة الذاتية (PDF, DOC, DOCX)",
              "motivation_letter": "رسالة الدافع",
              "motivation_letter_placeholder": "اشرح لماذا تريد التدريب في البرلمان...",
              "media_name": "اسم الوسيلة الإعلامية",
              "press_card_number": "رقم بطاقة الصحافة",
              "organization": "المنظمة",
              "supporting_document": "المستند الداعم",
              "title": "العنوان",
              "title_placeholder": "مثال: طلب تدريب صيفي 2024",
              "message_label": "الرسالة / الوصف",
              "message_placeholder": "صف طلبك بالتفصيل...",
              "submit": "إرسال"
            }
          },
          "profile": {
            "email": "البريد الإلكتروني",
            "phone": "الهاتف",
            "member_since": "عضو منذ",
            "edit_profile": "تعديل الملف الشخصي"
          },
          "common": {
            "new": "جديد"
          },
          "errors": {
            "create_request": "يتعذر إنشاء الطلب."
          },
          "pending": "قيد الانتظار",
          "in_review": "قيد المراجعة",
          "accepted": "مقبول",
          "rejected": "مرفوض",
          "sidebar_dashboard": "لوحة القيادة",
          "sidebar_notifications": "الإشعارات",
          "sidebar_requests": "طلباتي",
          "sidebar_profile": "الملف الشخصي",
          "sidebar_logout": "تسجيل الخروج",
          "navbar_notifications": "الإشعارات",
          "navbar_view_all_notifications": "عرض جميع الإشعارات",
          "notifications_empty": "لا توجد إشعارات",
          "notification_default": "إشعار",
          "navbar_theme_light": "الوضع الفاتح",
          "navbar_theme_dark": "الوضع الداكن"
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
          "dashboard": {
            "header": {
              "subtitle": "Resumen del panel",
              "admin_area": "Área de administrador",
              "user_area": "Área de usuario"
            },
            "recent_requests": "Solicitudes recientes",
            "loading": "Cargando...",
            "empty_requests": "Aún no hay solicitudes",
            "create_first_request": "Crea tu primera solicitud",
            "stats": {
              "total": "Solicitudes totales",
              "pending": "Solicitudes pendientes",
              "accepted": "Solicitudes aceptadas",
              "rejected": "Solicitudes rechazadas"
            },
            "admin": {
              "title": "Administración",
              "processing_rate": "Tasa de procesamiento",
              "acceptance_rate": "Tasa de aceptación",
              "manage": "Gestionar"
            },
            "requests": {
              "stage": {
                "title": "Solicitud de prácticas",
                "desc": "Prácticas profesionales en el parlamento",
                "buttonText": "Nueva solicitud de prácticas"
              },
              "presse": {
                "title": "Solicitud de prensa",
                "desc": "Acreditación para medios",
                "buttonText": "Nueva solicitud de prensa"
              },
              "bibliotheque": {
                "title": "Solicitud de biblioteca",
                "desc": "Acceso a archivos y documentos",
                "buttonText": "Nueva solicitud de biblioteca"
              },
              "visite": {
                "title": "Solicitud de visita",
                "desc": "Visita guiada para grupos",
                "buttonText": "Nueva solicitud de visita"
              }
            },
            "types": {
              "stage": "Prácticas",
              "presse": "Prensa",
              "bibliotheque": "Biblioteca",
              "visite": "Visita"
            },
            "form": {
              "school_university": "Escuela / Universidad",
              "field_of_study": "Campo de estudio",
              "start_date": "Fecha de inicio",
              "end_date": "Fecha de fin",
              "cv_file": "CV (PDF, DOC, DOCX)",
              "motivation_letter": "Carta de motivación",
              "motivation_letter_placeholder": "Explica por qué quieres hacer una pasantía en el Parlamento...",
              "media_name": "Nombre del medio",
              "press_card_number": "Número de tarjeta de prensa",
              "organization": "Organización",
              "supporting_document": "Documento de apoyo",
              "title": "Título",
              "title_placeholder": "Ej: Solicitud de pasantía verano 2024",
              "message_label": "Mensaje / Descripción",
              "message_placeholder": "Describe tu solicitud en detalle...",
              "submit": "Enviar"
            }
          },
          "profile": {
            "email": "Correo electrónico",
            "phone": "Teléfono",
            "member_since": "Miembro desde",
            "edit_profile": "Editar perfil"
          },
          "common": {
            "new": "Nuevo"
          },
          "errors": {
            "create_request": "No se pudo crear la solicitud."
          },
          "pending": "Pendiente",
          "in_review": "En revisión",
          "accepted": "Aceptado",
          "rejected": "Rechazado",
          "sidebar_dashboard": "Tablero",
          "sidebar_notifications": "Notificaciones",
          "sidebar_requests": "Mis solicitudes",
          "sidebar_profile": "Perfil",
          "sidebar_logout": "Cerrar sesión",
          "navbar_notifications": "Notificaciones",
          "navbar_view_all_notifications": "Ver todas las notificaciones",
          "notifications_empty": "No hay notificaciones",
          "notification_default": "Notificación",
          "navbar_theme_light": "Modo claro",
          "navbar_theme_dark": "Modo oscuro"
        }
      }
    }
  });

export default i18n;
