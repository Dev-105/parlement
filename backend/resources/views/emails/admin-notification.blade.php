<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9fafb;
            color: #374151;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 40px 40px 32px 40px;
            text-align: center;
        }
        .logo img {
            height: 56px;
            width: auto;
            filter: brightness(0) invert(1);
        }
        .header-title {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            margin: 16px 0 0 0;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 40px;
        }
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 8px 0;
            text-align: left;
        }
        .divider {
            width: 48px;
            height: 3px;
            background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
            border-radius: 2px;
            margin: 16px 0 24px 0;
        }
        .greeting {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .greeting strong {
            color: #111827;
        }
        .message-box {
            background-color: #fff7ed;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            border-left: 4px solid #f97316;
        }
        .message-content {
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            white-space: pre-wrap;
        }
        .button-container {
            text-align: left;
            margin-bottom: 8px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .btn i {
            font-size: 16px;
        }
        .info-box {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 16px;
            margin-top: 32px;
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .info-box i {
            font-size: 16px;
            color: #f97316;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .info-box strong {
            color: #111827;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 6px 0;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                margin: 20px auto;
                border-radius: 0;
                border: none;
            }
            .header {
                padding: 32px 24px;
            }
            .content {
                padding: 32px 24px;
            }
            .footer {
                padding: 20px 24px;
            }
            .title {
                font-size: 20px;
            }
            .btn {
                display: flex;
                justify-content: center;
                width: 100%;
            }
            .info-box {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with Orange Gradient -->
        <div class="header">
            <div class="logo">
                <img src="{{ $logoUrl }}" alt="Parlement du Maroc">
            </div>
            <div class="header-title">Système Parlementaire</div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h1 class="title">{{ $title }}</h1>
            <div class="divider"></div>
            
            <p class="greeting">Bonjour <strong>{{ $userName }}</strong>,</p>
            
            <!-- Message Box with Orange Left Border -->
            <div class="message-box">
                <p class="message-content">{{ $bodyMessage }}</p>
            </div>

            <!-- CTA Button with Bootstrap Icon -->
            <div class="button-container">
                <a href="{{ $ctaLink }}" class="btn">
                    <i class="bi bi-box-arrow-up-right"></i>
                    Consulter sur la plateforme
                </a>
            </div>
            
            <!-- Additional Info Box with Bootstrap Icon -->
            <div class="info-box">
                <i class="bi bi-info-circle-fill"></i>
                <span><strong>Information :</strong> Ce message a été envoyé automatiquement. Si vous avez des questions, veuillez vous connecter à votre espace pour contacter le support.</span>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} Parlement du Maroc. Tous droits réservés.</p>
            <p>Cet e-mail a été envoyé automatiquement pour vous informer d'une mise à jour importante.</p>
            <p><a href="{{ $settingsLink ?? '#' }}"><i class="bi bi-gear"></i> Préférences de notification</a></p>
        </div>
    </div>
</body>
</html>