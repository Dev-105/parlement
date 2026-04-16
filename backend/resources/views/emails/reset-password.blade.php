<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation du mot de passe</title>
    <style>
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #f3f4f6;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 32px 40px;
            text-align: center;
        }
        .logo {
            margin-bottom: 16px;
        }
        .logo img {
            height: 48px;
            width: auto;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 40px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #4b5563;
        }
        .greeting {
            font-size: 16px;
            color: #111827;
            margin-bottom: 16px;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        }
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .info-box {
            background-color: #f3f4f6;
            border-left: 4px solid #f97316;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
            color: #4b5563;
        }
        .info-box strong {
            color: #111827;
        }
        .warning {
            font-size: 13px;
            color: #6b7280;
            background-color: #fef3c7;
            padding: 16px;
            border-radius: 8px;
            margin-top: 32px;
            border-left: 4px solid #f59e0b;
        }
        .warning strong {
            color: #92400e;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .footer p {
            margin: 0;
        }
        @media (max-width: 600px) {
            .content {
                padding: 24px;
            }
            .header {
                padding: 24px;
            }
            .btn {
                display: block;
                text-align: center;

            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <!-- Replace with your actual logo URL -->
                <img src="https://res.cloudinary.com/dbfudloiy/image/upload/v1776329323/royaumeDuMarocLogo_nk3bpl.png" alt="Parlement du Maroc">
            </div>
            <h1>Réinitialisation du mot de passe</h1>
        </div>
        <div class="content">
            <p class="greeting">Bonjour <strong>{{ $userName ?? 'Utilisateur' }}</strong>,</p>
            
            <p>Vous avez demandé une réinitialisation de mot de passe pour votre compte. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.</p>
            
            <div class="button-container">
                <a href="{{ $resetLink }}" class="btn" style="color: white;">Réinitialiser le mot de passe</a>
            </div>

            <div class="info-box">
                <p><strong>Information :</strong> Ce lien expirera dans <strong>60 minutes</strong> pour des raisons de sécurité.</p>
            </div>

            <div class="warning">
                <p><strong>Note de sécurité :</strong> Si vous n'avez pas demandé de réinitialisation de mot de passe, aucune action n'est requise. Ce lien a été envoyé de manière sécurisée.</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
                Si vous ne parvenez pas à cliquer sur le bouton, copiez et collez le lien suivant dans votre navigateur :
            </p>
            <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px;">
                {{ $resetLink }}
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Parlement du Maroc. Tous droits réservés.</p>
            <p style="margin-top: 8px;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>