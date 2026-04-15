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
            "edit_profile": "Modifier mon profil",
            "update_success": "Profil mis à jour avec succès",
            "update_error": "Erreur lors de la mise à jour",
            "password_mismatch": "Les nouveaux mots de passe ne correspondent pas",
            "password_success": "Mot de passe modifié avec succès",
            "password_error": "Erreur lors du changement de mot de passe",
            "admin_view_title": "Profil utilisateur",
            "my_profile": "Mon profil",
            "load_error": "Impossible de charger le profil de l'utilisateur.",
            "not_found": "Utilisateur introuvable",
            "subtitle": "Gérez vos informations personnelles et sécurisez votre compte",
            "personal_info": "Informations personnelles",
            "first_name": "Prénom *",
            "last_name": "Nom *",
            "city": "Ville",
            "address": "Adresse",
            "profile_photo": "Photo de profil",
            "banner": "Bannière",
            "photo_size_error": "La photo de profil doit être inférieure à 5MB.",
            "banner_size_error": "La bannière doit être inférieure à 5MB.",
            "image_format_help": "JPG, JPEG ou PNG, max 5MB",
            "full_name": "Prénom et nom",
            "cin": "CIN",
            "role": "Rôle",
            "not_provided": "Non renseigné(e)",
            "security": "Sécurité",
            "password": "Mot de passe",
            "last_modified": "Dernière modification:",
            "2fa": "Authentification à deux facteurs",
            "2fa_desc": "Sécurisez votre compte",
            "active_sessions": "Sessions actives",
            "sessions_desc": "Gérer vos appareils connectés",
            "change_password": "Changer le mot de passe",
            "current_password": "Mot de passe actuel",
            "new_password": "Nouveau mot de passe",
            "confirm_password": "Confirmer le nouveau mot de passe",
            "roles": {
              "admin": "Administrateur"
            }
          },
          "common": {
            "all_types": "Tous les types",
            "all_statuses": "Tous les statuts",
            "new": "Nouveau",
            "retry": "Réessayer",
            "saving": "Enregistrement...",
            "save": "Enregistrer",
            "cancel": "Annuler",
            "never": "Jamais",
            "change": "Changer",
            "enable": "Activer",
            "view": "Voir",
            "loading": "Chargement...",
            "confirm": "Confirmer",
            "verified": "Vérifié"
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
          "navbar_theme_dark": "Mode sombre",
          "notifications": {
            "error_loading": "Impossible de charger les notifications",
            "all_read": "Toutes vos notifications sont lues",
            "unread_desc": "Vous avez {{count}} notification(s) non lue(s)",
            "mark_all_read": "Tout marquer comme lu",
            "empty": "Aucune notification",
            "empty_desc": "Vous n'avez reçu aucune notification pour le moment.",
            "new": "Nouvelle notification",
            "no_content": "Aucun contenu",
            "mark_read": "Marquer comme lue",
            "delete_confirm": "Supprimer cette notification ?",
            "delete_error": "Erreur lors de la suppression"
          },
          "demandes": {
            "title": "Demandes",
            "download_error": "Impossible de télécharger le fichier.",
            "download": "Télécharger {{file}}",
            "not_specified": "Non spécifiée",
            "not_found": "Demande introuvable",
            "back_to_list": "Retour aux demandes",
            "detail_title": "Détails de la demande #{{id}}",
            "created_at": "Créée le {{date}}",
            "type_label": "Type: {{type}}",
            "applicant_info": "Informations du demandeur",
            "actions": {
              "review": "Réviser",
              "accept": "Accepter",
              "reject": "Refuser"
            },
            "specific_info": "Informations spécifiques",
            "fields": {
              "school_name": "Établissement",
              "field_of_study": "Filière d'étude",
              "start_date": "Date de début",
              "end_date": "Date de fin",
              "motivation_letter": "Lettre de motivation",
              "media_name": "Nom du média",
              "press_card_number": "N° Carte de presse",
              "organization": "Organisation",
              "supporting_document": "Document justificatif",
              "research_topic": "Sujet de recherche",
              "institution": "Institution",
              "visit_date": "Date de visite",
              "duration": "Durée",
              "purpose": "Objectif de la recherche",
              "number_of_students": "Nombre d'élèves",
              "grade_level": "Niveau",
              "supervisor_name": "Superviseur",
              "phone": "Téléphone"
            },
            "status": {
              "pending": "En attente",
              "in_review": "En révision",
              "accepted": "Acceptée",
              "rejected": "Refusée"
            }
          }
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
            "edit_profile": "Edit profile",
            "update_success": "Profile updated successfully",
            "update_error": "Error updating profile",
            "password_mismatch": "New passwords do not match",
            "password_success": "Password changed successfully",
            "password_error": "Error changing password",
            "admin_view_title": "User profile",
            "my_profile": "My profile",
            "load_error": "Unable to load user profile.",
            "not_found": "User not found",
            "subtitle": "Manage your personal information and secure your account",
            "personal_info": "Personal information",
            "first_name": "First name *",
            "last_name": "Last name *",
            "city": "City",
            "address": "Address",
            "profile_photo": "Profile photo",
            "banner": "Banner",
            "photo_size_error": "Profile photo must be less than 5MB.",
            "banner_size_error": "Banner must be less than 5MB.",
            "image_format_help": "JPG, JPEG or PNG, max 5MB",
            "full_name": "Full name",
            "cin": "National ID (CIN)",
            "role": "Role",
            "not_provided": "Not provided",
            "security": "Security",
            "password": "Password",
            "last_modified": "Last modified:",
            "2fa": "Two-factor authentication",
            "2fa_desc": "Secure your account",
            "active_sessions": "Active sessions",
            "sessions_desc": "Manage your connected devices",
            "change_password": "Change password",
            "current_password": "Current password",
            "new_password": "New password",
            "confirm_password": "Confirm new password",
            "roles": {
              "admin": "Administrator"
            }
          },
          "common": {
            "all_types": "All types",
            "all_statuses": "All statuses",
            "new": "New",
            "retry": "Retry",
            "saving": "Saving...",
            "save": "Save",
            "cancel": "Cancel",
            "never": "Never",
            "change": "Change",
            "enable": "Enable",
            "view": "View",
            "loading": "Loading...",
            "confirm": "Confirm",
            "verified": "Verified"
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
          "navbar_theme_dark": "Dark mode",
          "notifications": {
            "error_loading": "Failed to load notifications",
            "all_read": "All your notifications are read",
            "unread_desc": "You have {{count}} unread notification(s)",
            "mark_all_read": "Mark all as read",
            "empty": "No notifications",
            "empty_desc": "You haven't received any notifications yet.",
            "new": "New notification",
            "no_content": "No content",
            "mark_read": "Mark as read",
            "delete_confirm": "Delete this notification?",
            "delete_error": "Error during deletion"
          },
          "demandes": {
            "title": "Requests",
            "download_error": "Failed to download the file.",
            "download": "Download {{file}}",
            "not_specified": "Not specified",
            "not_found": "Request not found",
            "back_to_list": "Back to requests",
            "detail_title": "Request details #{{id}}",
            "created_at": "Created on {{date}}",
            "type_label": "Type: {{type}}",
            "applicant_info": "Applicant information",
            "actions": {
              "review": "Review",
              "accept": "Accept",
              "reject": "Reject"
            },
            "specific_info": "Specific information",
            "fields": {
              "school_name": "School/University",
              "field_of_study": "Field of study",
              "start_date": "Start date",
              "end_date": "End date",
              "motivation_letter": "Motivation letter",
              "media_name": "Media name",
              "press_card_number": "Press card number",
              "organization": "Organization",
              "supporting_document": "Supporting document",
              "research_topic": "Research topic",
              "institution": "Institution",
              "visit_date": "Visit date",
              "duration": "Duration",
              "purpose": "Research purpose",
              "number_of_students": "Number of students",
              "grade_level": "Grade level",
              "supervisor_name": "Supervisor",
              "phone": "Phone"
            },
            "status": {
              "pending": "Pending",
              "in_review": "In review",
              "accepted": "Accepted",
              "rejected": "Rejected"
            }
          }
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
              "presse": "الصحافة",
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
            "edit_profile": "تعديل الملف الشخصي",
            "update_success": "تم تحديث الملف الشخصي بنجاح",
            "update_error": "خطأ في تحديث الملف الشخصي",
            "password_mismatch": "كلمتا المرور الجديدتان غير متطابقتين",
            "password_success": "تم تغيير كلمة المرور بنجاح",
            "password_error": "خطأ في تغيير كلمة المرور",
            "admin_view_title": "ملف المستخدم",
            "my_profile": "ملفي الشخصي",
            "load_error": "تعذر تحميل ملف تعريف المستخدم.",
            "not_found": "المستخدم غير موجود",
            "subtitle": "إدارة معلوماتك الشخصية وتأمين حسابك",
            "personal_info": "المعلومات الشخصية",
            "first_name": "الاسم الأول *",
            "last_name": "الاسم الأخير *",
            "city": "المدينة",
            "address": "العنوان",
            "profile_photo": "صورة الملف الشخصي",
            "banner": "صورة الغلاف",
            "photo_size_error": "يجب أن تكون صورة الملف الشخصي أقل من 5 ميغابايت.",
            "banner_size_error": "يجب أن يكون الغلاف أقل من 5 ميغابايت.",
            "image_format_help": "JPG، JPEG أو PNG، بحد أقصى 5 ميغابايت",
            "full_name": "الاسم الكامل",
            "cin": "رقم البطاقة الوطنية",
            "role": "الدور",
            "not_provided": "غير متوفر",
            "security": "الأمان",
            "password": "كلمة المرور",
            "last_modified": "آخر تعديل:",
            "2fa": "المصادقة الثنائية",
            "2fa_desc": "تأمين حسابك",
            "active_sessions": "الجلسات النشطة",
            "sessions_desc": "إدارة أجهزتك المتصلة",
            "change_password": "تغيير كلمة المرور",
            "current_password": "كلمة المرور الحالية",
            "new_password": "كلمة المرور الجديدة",
            "confirm_password": "تأكيد كلمة المرور الجديدة",
            "roles": {
              "admin": "مسؤول"
            }
          },
          "common": {
            "all_types": "جميع الأنواع",
            "all_statuses": "جميع الحالات",
            "new": "جديد",
            "retry": "إعادة المحاولة",
            "saving": "جاري الحفظ...",
            "save": "حفظ",
            "cancel": "إلغاء",
            "never": "أبداً",
            "change": "تغيير",
            "enable": "تفعيل",
            "view": "عرض",
            "loading": "جاري التحميل...",
            "confirm": "تأكيد",
            "verified": "مؤكد"
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
          "navbar_theme_dark": "الوضع الداكن",
          "notifications": {
            "error_loading": "فشل تحميل الإشعارات",
            "all_read": "تمت قراءة جميع إشعاراتك",
            "unread_desc": "لديك {{count}} إشعار(ات) غير مقروءة",
            "mark_all_read": "تحديد الكل كمقروء",
            "empty": "لا توجد إشعارات",
            "empty_desc": "لم تتلق أي إشعارات بعد.",
            "new": "إشعار جديد",
            "no_content": "لا يوجد محتوى",
            "mark_read": "تحديد كمقروء",
            "delete_confirm": "هل تريد حذف هذا الإشعار؟",
            "delete_error": "خطأ أثناء الحذف"
          },
          "demandes": {
            "title": "الطلبات",
            "download_error": "فشل تحميل الملف.",
            "download": "تحميل {{file}}",
            "not_specified": "غير محدد",
            "not_found": "الطلب غير موجود",
            "back_to_list": "العودة إلى الطلبات",
            "detail_title": "تفاصيل الطلب #{{id}}",
            "created_at": "تاريخ الإنشاء {{date}}",
            "type_label": "النوع: {{type}}",
            "applicant_info": "معلومات مقدم الطلب",
            "actions": {
              "review": "مراجعة",
              "accept": "قبول",
              "reject": "رفض"
            },
            "specific_info": "معلومات محددة",
            "fields": {
              "school_name": "المدرسة / الجامعة",
              "field_of_study": "مجال الدراسة",
              "start_date": "تاريخ البدء",
              "end_date": "تاريخ الانتهاء",
              "motivation_letter": "رسالة الدافع",
              "media_name": "اسم الوسيلة الإعلامية",
              "press_card_number": "رقم البطاقة الصحفية",
              "organization": "المنظمة",
              "supporting_document": "وثيقة داعمة",
              "research_topic": "موضوع البحث",
              "institution": "المؤسسة",
              "visit_date": "تاريخ الزيارة",
              "duration": "المدة",
              "purpose": "الغرض من البحث",
              "number_of_students": "عدد الطلاب",
              "grade_level": "المستوى الدراسي",
              "supervisor_name": "المشرف",
              "phone": "الهاتف"
            },
            "status": {
              "pending": "قيد الانتظار",
              "in_review": "قيد المراجعة",
              "accepted": "مقبول",
              "rejected": "مرفوض"
            }
          }
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
            "edit_profile": "Editar perfil",
            "update_success": "Perfil actualizado con éxito",
            "update_error": "Error al actualizar el perfil",
            "password_mismatch": "Las nuevas contraseñas no coinciden",
            "password_success": "Contraseña cambiada con éxito",
            "password_error": "Error al cambiar la contraseña",
            "admin_view_title": "Perfil de usuario",
            "my_profile": "Mi perfil",
            "load_error": "No se puede cargar el perfil de usuario.",
            "not_found": "Usuario no encontrado",
            "subtitle": "Administre su información personal y asegure su cuenta",
            "personal_info": "Información personal",
            "first_name": "Nombre *",
            "last_name": "Apellido *",
            "city": "Ciudad",
            "address": "Dirección",
            "profile_photo": "Foto de perfil",
            "banner": "Banner",
            "photo_size_error": "La foto de perfil debe ser menor a 5MB.",
            "banner_size_error": "El banner debe ser menor a 5MB.",
            "image_format_help": "JPG, JPEG o PNG, máx 5MB",
            "full_name": "Nombre completo",
            "cin": "DNI/CIN",
            "role": "Rol",
            "not_provided": "No proporcionado",
            "security": "Seguridad",
            "password": "Contraseña",
            "last_modified": "Última modificación:",
            "2fa": "Autenticación de dos factores",
            "2fa_desc": "Asegura tu cuenta",
            "active_sessions": "Sesiones activas",
            "sessions_desc": "Administra tus dispositivos conectados",
            "change_password": "Cambiar contraseña",
            "current_password": "Contraseña actual",
            "new_password": "Nueva contraseña",
            "confirm_password": "Confirmar nueva contraseña",
            "roles": {
              "admin": "Administrador"
            }
          },
          "common": {
            "all_types": "Todos los tipos",
            "all_statuses": "Todos los estados",
            "new": "Nuevo",
            "retry": "Reintentar",
            "saving": "Guardando...",
            "save": "Guardar",
            "cancel": "Cancelar",
            "never": "Nunca",
            "change": "Cambiar",
            "enable": "Habilitar",
            "view": "Ver",
            "loading": "Cargando...",
            "confirm": "Confirmar",
            "verified": "Verificado"
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
          "navbar_theme_dark": "Modo oscuro",
          "notifications": {
            "error_loading": "Error al cargar notificaciones",
            "all_read": "Todas sus notificaciones están leídas",
            "unread_desc": "Tienes {{count}} notificación(es) no leída(s)",
            "mark_all_read": "Marcar todo como leído",
            "empty": "Sin notificaciones",
            "empty_desc": "Aún no has recibido ninguna notificación.",
            "new": "Nueva notificación",
            "no_content": "Sin contenido",
            "mark_read": "Marcar como leído",
            "delete_confirm": "¿Eliminar esta notificación?",
            "delete_error": "Error durante la eliminación"
          },
          "demandes": {
            "title": "Solicitudes",
            "download_error": "Error al descargar el archivo.",
            "download": "Descargar {{file}}",
            "not_specified": "No especificado",
            "not_found": "Solicitud no encontrada",
            "back_to_list": "Volver a solicitudes",
            "detail_title": "Detalles de solicitud #{{id}}",
            "created_at": "Creado el {{date}}",
            "type_label": "Tipo: {{type}}",
            "applicant_info": "Información del solicitante",
            "actions": {
              "review": "Revisar",
              "accept": "Aceptar",
              "reject": "Rechazar"
            },
            "specific_info": "Información específica",
            "fields": {
              "school_name": "Escuela/Universidad",
              "field_of_study": "Campo de estudio",
              "start_date": "Fecha de inicio",
              "end_date": "Fecha de finalización",
              "motivation_letter": "Carta de motivación",
              "media_name": "Nombre del medio",
              "press_card_number": "Número de tarjeta de prensa",
              "organization": "Organización",
              "supporting_document": "Documento de apoyo",
              "research_topic": "Tema de investigación",
              "institution": "Institución",
              "visit_date": "Fecha de visita",
              "duration": "Duración",
              "purpose": "Propósito de investigación",
              "number_of_students": "Número de estudiantes",
              "grade_level": "Nivel de grado",
              "supervisor_name": "Supervisor",
              "phone": "Teléfono"
            },
            "status": {
              "pending": "Pendiente",
              "in_review": "En revisión",
              "accepted": "Aceptada",
              "rejected": "Rechazada"
            }
          }
        }
      }
    }
  });

export default i18n;
