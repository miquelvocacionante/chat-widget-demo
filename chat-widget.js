// Chat Widget Script - Versió 4.1 - ENVIAMENT ÚNIC OPTIMITZAT
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: min(380px, calc(100vw - 40px));
            height: min(600px, calc(100vh - 80px));
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        /* Responsive per mòbils - COMPLETAMENT RESPONSIVE */
        @media (max-width: 480px) {
            .n8n-chat-widget .chat-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh; /* Dynamic viewport height per iOS */
                max-width: 100vw;
                max-height: 100vh;
                max-height: 100dvh;
                border-radius: 0;
                box-shadow: none;
                border: none;
                transform: none;
                zoom: 1;
                display: none; /* Mantenim el widget flotant */
            }

            .n8n-chat-widget .chat-container.open {
                display: flex;
                flex-direction: column;
            }

            .n8n-chat-widget .chat-input {
                padding: 12px;
                padding-bottom: max(12px, env(safe-area-inset-bottom));
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
                display: flex;
                gap: 8px;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                box-sizing: border-box;
                z-index: 1001;
            }

            .n8n-chat-widget .chat-input textarea {
                flex: 1;
                padding: 10px;
                min-height: 36px;
                max-height: 72px;
                font-size: 16px;
                border: 1px solid rgba(133, 79, 255, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                resize: none;
                font-family: inherit;
                line-height: 1.4;
                overflow-y: auto;
                -webkit-appearance: none;
                appearance: none;
                box-sizing: border-box;
                width: 100%;
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }

            .n8n-chat-widget .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                padding-bottom: calc(80px + env(safe-area-inset-bottom));
                background: var(--chat--color-background);
                display: flex;
                flex-direction: column;
                -webkit-overflow-scrolling: touch;
                height: calc(100vh - 80px);
                height: calc(100dvh - 80px);
                box-sizing: border-box;
                overscroll-behavior: contain;
                scroll-behavior: smooth;
            }

            .n8n-chat-widget .chat-toggle {
                bottom: max(15px, env(safe-area-inset-bottom));
                right: 15px;
                width: 50px;
                height: 50px;
                z-index: 1000;
            }

            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 15px;
            }

            /* Millor scroll - només bloquejem el que cal */
            .n8n-chat-widget * {
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
            }

            .n8n-chat-widget .chat-message {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }

            .n8n-chat-widget .chat-messages,
            .n8n-chat-widget .navigation-container {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                touch-action: pan-y;
            }

            /* Responsive per pantalles molt petites (iPhone SE, etc.) */
            @media (max-height: 600px) {
                .n8n-chat-widget .chat-messages {
                    padding: 12px;
                    padding-bottom: calc(70px + env(safe-area-inset-bottom));
                    height: calc(100vh - 70px);
                    height: calc(100dvh - 70px);
                }

                .n8n-chat-widget .chat-input {
                    padding: 8px;
                    padding-bottom: max(8px, env(safe-area-inset-bottom));
                }

                .n8n-chat-widget .chat-input textarea {
                    min-height: 32px;
                    max-height: 64px;
                    padding: 8px;
                }

                .n8n-chat-widget .category-btn {
                    padding: 10px 16px;
                    font-size: 14px;
                }

                .n8n-chat-widget .navigation-container {
                    padding: 12px;
                }
            }

            /* Responsive per pantalles més grans (iPhone Pro Max, etc.) */
            @media (min-height: 850px) {
                .n8n-chat-widget .chat-messages {
                    padding: 20px;
                    padding-bottom: calc(90px + env(safe-area-inset-bottom));
                    height: calc(100vh - 90px);
                    height: calc(100dvh - 90px);
                }

                .n8n-chat-widget .navigation-container {
                    padding: 24px;
                }
            }
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .language-selection {
            margin-bottom: 24px;
        }

        .n8n-chat-widget .language-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin: 0 0 16px 0;
        }

        .n8n-chat-widget .language-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px;
            justify-content: center;
        }

        .n8n-chat-widget .language-btn {
            padding: 10px 12px;
            background: transparent;
            border: 2px solid var(--chat--color-primary);
            color: var(--chat--color-primary);
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s;
        }

        .n8n-chat-widget .language-btn:hover {
            background: var(--chat--color-primary);
            color: white;
            transform: scale(1.02);
        }

        .n8n-chat-widget .language-btn.selected {
            background: var(--chat--color-primary);
            color: white;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Estils per al formatat de text enriquit */
        .n8n-chat-widget .chat-message strong {
            font-weight: 600;
        }

        .n8n-chat-widget .chat-message em {
            font-style: italic;
        }

        .n8n-chat-widget .chat-message h1 {
            font-size: 18px;
            font-weight: 600;
            margin: 8px 0 2px 0;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .chat-message h2 {
            font-size: 16px;
            font-weight: 600;
            margin: 6px 0 2px 0;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .chat-message h3 {
            font-size: 15px;
            font-weight: 600;
            margin: 4px 0 2px 0;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .chat-message a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            transition: opacity 0.2s;
        }

        /* Estils per al sistema de navegació */
        .n8n-chat-widget .navigation-container {
            padding: 20px;
            background: var(--chat--color-background);
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .navigation-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .n8n-chat-widget .nav-btn {
            padding: 8px 14px;
            background: rgba(133, 79, 255, 0.1);
            border: 1px solid rgba(133, 79, 255, 0.3);
            color: var(--chat--color-primary);
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .n8n-chat-widget .nav-btn:hover {
            background: var(--chat--color-primary);
            color: white;
            transform: scale(1.05);
        }

        .n8n-chat-widget .breadcrumb {
            font-size: 13px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin-left: auto;
            font-weight: 500;
        }

        .n8n-chat-widget .category-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 16px;
        }

        .n8n-chat-widget .subcategory-buttons,
        .n8n-chat-widget .option-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .n8n-chat-widget .category-btn {
            padding: 14px 18px;
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
            border: 2px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-primary);
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            font-family: inherit;
            transition: all 0.3s ease;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            position: relative;
        }

        .n8n-chat-widget .category-btn:hover {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border-color: transparent;
        }

        .n8n-chat-widget .category-btn:active {
            transform: translateY(0px);
            box-shadow: 0 2px 8px rgba(133, 79, 255, 0.3);
        }

        .n8n-chat-widget .subcategory-btn,
        .n8n-chat-widget .option-btn {
            padding: 14px 18px;
            background: rgba(248, 249, 255, 0.8);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-primary);
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s ease;
            text-align: left;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .n8n-chat-widget .subcategory-btn:hover,
        .n8n-chat-widget .option-btn:hover {
            background: var(--chat--color-primary);
            color: white;
            transform: translateX(4px);
            box-shadow: 0 4px 15px rgba(133, 79, 255, 0.3);
            border-color: var(--chat--color-primary);
        }
        .n8n-chat-widget .chat-message .link-button {
            display: inline-block;
            padding: 8px 16px;
            margin: 8px 0;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.2s;
            border: none;
            cursor: pointer;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-message .link-button:hover {
            transform: scale(1.02);
            color: white;
        }

        .n8n-chat-widget .chat-message p {
            margin: 0 0 8px 0;
        }

        .n8n-chat-widget .chat-message p:last-child {
            margin-bottom: 0;
        }

        /* Animació de typing indicator */
        .n8n-chat-widget .typing-indicator {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .n8n-chat-widget .typing-dots {
            display: flex;
            gap: 3px;
        }

        .n8n-chat-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--chat--color-primary);
            animation: typing 1.4s infinite ease-in-out;
        }

        .n8n-chat-widget .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .n8n-chat-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            min-height: 38px;
            max-height: 76px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.4;
            overflow-y: auto;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Desenvolupat per ok-otto',
                link: 'https://www.ok-otto.com/?utm_source=chatbotaran'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let selectedLanguage = '';

    // Textos i estructura de navegació segons l'idioma
    const languageTexts = {
        ca: {
            btnText: "Envia'ns un missatge",
            placeholder: "Escriu el teu missatge aquí...",
            sendBtn: "Enviar",
            systemMessage: "[IDIOMA:català] L'usuari vol rebre respostes en català",
            greeting: "**Hola! Sóc l'assistent virtual d'ARAN RESPON.** Com puc ajudar-te?",
            poweredBy: "Desenvolupat per ok-otto",
            navigation: {
                back: "← Tornar",
                home: "🏠 Inici",
                breadcrumb: "Estàs a:"
            },
            categories: {
                "citas": {
                    title: "Cites mèdiques",
                    subcategories: {
                        "pedir": {
                            title: "Demanar cita",
                            options: {
                                "medicina-general": { title: "Medicina general", message: "Vull demanar una cita de medicina general" },
                                "pediatria": { title: "Pediatria", message: "Vull demanar una cita de pediatria" },
                                "especialistas": { title: "Especialistes", message: "Vull demanar una cita amb un especialista" }
                            }
                        },
                        "reprogramar": {
                            title: "Reprogramar cita",
                            options: {
                                "cambiar-fecha": { title: "Canviar data", message: "Vull canviar la data d'una cita existent" },
                                "cambiar-especialidad": { title: "Canviar especialitat", message: "Vull canviar l'especialitat de la meva cita" },
                                "cancelar": { title: "Cancel·lar cita", message: "Vull cancel·lar una cita mèdica" }
                            }
                        },
                        "consultar": {
                            title: "Consultar cita",
                            options: {
                                "cuando": { title: "Quan és la meva propera cita?", message: "Vull saber quan és la meva propera cita mèdica" },
                                "donde": { title: "On serà?", message: "Vull saber on serà la meva cita mèdica" }
                            }
                        }
                    }
                },
                "servicios": {
                    title: "Serveis socials",
                    subcategories: {
                        "mayores": {
                            title: "Ajuda a persones grans",
                            options: {
                                "valoracion": { title: "Sol·licitud de valoració", message: "Necessito una valoració per a serveis socials per a persona gran" },
                                "domiciliarios": { title: "Cures domiciliàries", message: "Necessito informació sobre cures domiciliàries" }
                            }
                        },
                        "salud-mental": {
                            title: "Salut mental i suport psicològic",
                            options: {
                                "visita": { title: "Demanar visita", message: "Vull demanar una visita de salut mental" },
                                "urgencia": { title: "Urgència emocional", message: "Tinc una urgència emocional i necessito ajuda" }
                            }
                        },
                        "otros": {
                            title: "Altres serveis",
                            options: {
                                "dependencia": { title: "Informació sobre dependència", message: "Necessito informació sobre la Llei de Dependència" },
                                "acompanamiento": { title: "Sol·licitud d'acompanyament", message: "Necessito serveis d'acompanyament social" }
                            }
                        }
                    }
                },
                "informacion": {
                    title: "Informació general",
                    options: {
                        "ubicacion": { title: "On som?", message: "Vull saber on es troben els centres d'Aran Salut" },
                        "horarios": { title: "Horaris de l'hospital", message: "Vull consultar els horaris de l'hospital" },
                        "contacto": { title: "Telèfons i contacte", message: "Necessito els telèfons i dades de contacte" },
                        "documentacion": { title: "Documentació necessària per tràmits", message: "Quin documentació necessito per fer tràmits?" }
                    }
                },
                "otras": {
                    title: "Altres consultes",
                    options: {
                        "duda-medica": { title: "Tinc un dubte mèdic", message: "Tinc un dubte mèdic i necessito orientació" },
                        "emergencias": { title: "Emergències", message: "És una emergència mèdica" },
                        "recetas": { title: "Receptes i farmàcia", message: "Tinc una consulta sobre receptes o farmàcia" },
                        "ayuda-app": { title: "Ajuda amb l'app o el xat", message: "Necessito ajuda amb l'aplicació o aquest xat" }
                    }
                }
            }
        },
        es: {
            btnText: "Envíanos un mensaje",
            placeholder: "Escribe tu mensaje aquí...",
            sendBtn: "Enviar", 
            systemMessage: "[IDIOMA:español] L'usuari vol rebre respostes en español",
            greeting: "**¡Hola! Soy el asistente virtual de ARAN RESPON.** ¿Cómo puedo ayudarte?",
            poweredBy: "Desarrollado por ok-otto",
            navigation: {
                back: "← Volver",
                home: "🏠 Inicio",
                breadcrumb: "Estás en:"
            },
            categories: {
                "citas": {
                    title: "Citas médicas",
                    subcategories: {
                        "pedir": {
                            title: "Pedir cita",
                            options: {
                                "medicina-general": { title: "Medicina general", message: "Quiero pedir una cita de medicina general" },
                                "pediatria": { title: "Pediatría", message: "Quiero pedir una cita de pediatría" },
                                "especialistas": { title: "Especialistas", message: "Quiero pedir una cita con un especialista" }
                            }
                        },
                        "reprogramar": {
                            title: "Reprogramar cita",
                            options: {
                                "cambiar-fecha": { title: "Cambiar fecha", message: "Quiero cambiar la fecha de una cita existente" },
                                "cambiar-especialidad": { title: "Cambiar especialidad", message: "Quiero cambiar la especialidad de mi cita" },
                                "cancelar": { title: "Cancelar cita", message: "Quiero cancelar una cita médica" }
                            }
                        },
                        "consultar": {
                            title: "Consultar cita",
                            options: {
                                "cuando": { title: "¿Cuándo es mi próxima cita?", message: "Quiero saber cuándo es mi próxima cita médica" },
                                "donde": { title: "¿Dónde será?", message: "Quiero saber dónde será mi cita médica" }
                            }
                        }
                    }
                },
                "servicios": {
                    title: "Servicios sociales",
                    subcategories: {
                        "mayores": {
                            title: "Ayuda a personas mayores",
                            options: {
                                "valoracion": { title: "Solicitud de valoración", message: "Necesito una valoración para servicios sociales para persona mayor" },
                                "domiciliarios": { title: "Cuidados domiciliarios", message: "Necesito información sobre cuidados domiciliarios" }
                            }
                        },
                        "salud-mental": {
                            title: "Salud mental y apoyo psicológico",
                            options: {
                                "visita": { title: "Pedir visita", message: "Quiero pedir una visita de salud mental" },
                                "urgencia": { title: "Urgencia emocional", message: "Tengo una urgencia emocional y necesito ayuda" }
                            }
                        },
                        "otros": {
                            title: "Otros servicios",
                            options: {
                                "dependencia": { title: "Información sobre dependencia", message: "Necesito información sobre la Ley de Dependencia" },
                                "acompanamiento": { title: "Solicitud de acompañamiento", message: "Necesito servicios de acompañamiento social" }
                            }
                        }
                    }
                },
                "informacion": {
                    title: "Información general",
                    options: {
                        "ubicacion": { title: "¿Dónde estamos?", message: "Quiero saber dónde están los centros de Aran Salut" },
                        "horarios": { title: "Horarios del hospital", message: "Quiero consultar los horarios del hospital" },
                        "contacto": { title: "Teléfonos y contacto", message: "Necesito los teléfonos y datos de contacto" },
                        "documentacion": { title: "Documentación necesaria para trámites", message: "¿Qué documentación necesito para hacer trámites?" }
                    }
                },
                "otras": {
                    title: "Otras consultas",
                    options: {
                        "duda-medica": { title: "Tengo una duda médica", message: "Tengo una duda médica y necesito orientación" },
                        "emergencias": { title: "Emergencias", message: "Es una emergencia médica" },
                        "recetas": { title: "Recetas y farmacia", message: "Tengo una consulta sobre recetas o farmacia" },
                        "ayuda-app": { title: "Ayuda con la app o el chat", message: "Necesito ayuda con la aplicación o este chat" }
                    }
                }
            }
        },
        oc: {
            btnText: "Mandatz-mos un messatge",
            placeholder: "Escrivètz eth vòstre messatge ací...",
            sendBtn: "Mandar",
            systemMessage: "[IDIOMA:aranès] L'usuari vol rebre respostes en aranès",
            greeting: "**Adiu! Sòi er assistent virtuau d'ARAN RESPON.** Com pòdi ajudar-te?",
            poweredBy: "Desvolupat per ok-otto",
            navigation: {
                back: "← Tornar",
                home: "🏠 Inici",
                breadcrumb: "Ès en:"
            },
            categories: {
                "citas": {
                    title: "Rendètz-vos medics",
                    subcategories: {
                        "pedir": {
                            title: "Demandar rendètz-vos",
                            options: {
                                "medicina-general": { title: "Medecina generau", message: "Vòli demandar un rendètz-vos de medecina generau" },
                                "pediatria": { title: "Pediatria", message: "Vòli demandar un rendètz-vos de pediatria" },
                                "especialistas": { title: "Especialistes", message: "Vòli demandar un rendètz-vos damb un especialista" }
                            }
                        },
                        "reprogramar": {
                            title: "Reprogramar rendètz-vos",
                            options: {
                                "cambiar-fecha": { title: "Cambiar data", message: "Vòli cambiar era data d'un rendètz-vos existent" },
                                "cambiar-especialidad": { title: "Cambiar especialitat", message: "Vòli cambiar era especialitat deth meu rendètz-vos" },
                                "cancelar": { title: "Anullar rendètz-vos", message: "Vòli anullar un rendètz-vos medic" }
                            }
                        },
                        "consultar": {
                            title: "Consultar rendètz-vos",
                            options: {
                                "cuando": { title: "Quan ei eth meu següent rendètz-vos?", message: "Vòli saber quan ei eth meu següent rendètz-vos medic" },
                                "donde": { title: "On serà?", message: "Vòli saber on serà eth meu rendètz-vos medic" }
                            }
                        }
                    }
                },
                "servicios": {
                    title: "Servicis socials",
                    subcategories: {
                        "mayores": {
                            title: "Ajuda a persones majors",
                            options: {
                                "valoracion": { title: "Sol·licitud de valoracion", message: "Necessiti ua valoracion entà servicis socials entà persona major" },
                                "domiciliarios": { title: "Cures domiciliaris", message: "Necessiti informacion sus cures domiciliaris" }
                            }
                        },
                        "salud-mental": {
                            title: "Salut mentau e supòrt psicologic",
                            options: {
                                "visita": { title: "Demandar visita", message: "Vòli demandar ua visita de salut mentau" },
                                "urgencia": { title: "Urgéncia emocionau", message: "Ai ua urgéncia emocionau e necessiti ajuda" }
                            }
                        },
                        "otros": {
                            title: "Auti servicis",
                            options: {
                                "dependencia": { title: "Informacion sus dependéncia", message: "Necessiti informacion sus era Lei de Dependéncia" },
                                "acompanamiento": { title: "Sol·licitud d'acompanhament", message: "Necessiti servicis d'acompanhament sociau" }
                            }
                        }
                    }
                },
                "informacion": {
                    title: "Informacion generau",
                    options: {
                        "ubicacion": { title: "On sòm?", message: "Vòli saber on se tròben es centres d'Aran Salut" },
                        "horarios": { title: "Oraris dera espitau", message: "Vòli consultar es oraris dera espitau" },
                        "contacto": { title: "Telefòns e contacte", message: "Necessiti es telefòns e dades de contacte" },
                        "documentacion": { title: "Documentacion necessària entà tramits", message: "Quina documentacion necessiti entà hèr tramits?" }
                    }
                },
                "otras": {
                    title: "Autes consultes",
                    options: {
                        "duda-medica": { title: "Ai un dobte medic", message: "Ai un dobte medic e necessiti orientacion" },
                        "emergencias": { title: "Emergéncies", message: "Ei ua emergéncia medica" },
                        "recetas": { title: "Recèptes e farmàcia", message: "Ai ua consulta sus recèptes o farmàcia" },
                        "ayuda-app": { title: "Ajuda damb era app o eth chat", message: "Necessiti ajuda damb era aplicacion o aqueth chat" }
                    }
                }
            }
        }
    };

    // Funció millorada per formatar text amb markdown
    function formatText(text) {
        // Escapem caràcters HTML bàsics per evitar injecció
        const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Convertim markdown a HTML
        let formattedText = escapedText
            // Headers: ### text -> <h3>
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Botons d'enllaç (català, espanyol i aranès): [BOTÓ:text](url), [BOTÓN:text](url), [BOTON:text](url)
            .replace(/\[BOTÓ:([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-button">$1</a>')
            .replace(/\[BOTÓN:([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-button">$1</a>')
            .replace(/\[BOTON:([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-button">$1</a>')
            // Enllaços normals: [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // Negreta: **text** o __text__
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            // Cursiva: *text* o _text_
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>');

        // Millor gestió de salts de línia i paràgrafs
        // 1. Normalitzem salts de línia
        formattedText = formattedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // 2. Dividim per dobles salts de línia per crear blocs
        const blocks = formattedText.split(/\n{2,}/);
        
        // 3. Processem cada bloc
        const processedBlocks = blocks.map(block => {
            // Si el bloc ja és un header, no l'embolicem en <p>
            if (block.match(/^<h[1-6]>/)) {
                return block;
            }
            // Si el bloc està buit o només té espais, l'ignorem
            if (block.trim() === '') {
                return '';
            }
            // Convertim salts de línia simples en <br> dins del bloc
            const processedBlock = block.replace(/\n/g, '<br>');
            return `<p>${processedBlock}</p>`;
        });

        // 4. Filtrem blocs buits i els unim
        return processedBlocks.filter(block => block.trim() !== '').join('');
    }

    // Prevent zoom and maintain fullscreen on mobile
    function preventZoom() {
        // Set viewport to prevent zoom and maintain scale
        let viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');
        } else {
            const newViewport = document.createElement('meta');
            newViewport.name = 'viewport';
            newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(newViewport);
        }

        // Prevent zoom gestures
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });

        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        });

        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        });

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent pinch zoom
        document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
    }

    // Handle mobile keyboard appearance
    function handleMobileKeyboard() {
        if (window.innerWidth <= 480) {
            const textarea = chatContainer.querySelector('textarea');
            const chatInput = chatContainer.querySelector('.chat-input');
            
            if (textarea && chatInput) {
                textarea.addEventListener('focus', () => {
                    // Ensure input area stays visible when keyboard appears
                    setTimeout(() => {
                        chatInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 300);
                });

                textarea.addEventListener('blur', () => {
                    // Reset viewport when keyboard disappears
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                    }, 100);
                });
            }
        }
    }
    function showCategories() {
        const navContainer = messagesContainer.querySelector('.navigation-container');
        if (navContainer) navContainer.remove();

        const texts = languageTexts[selectedLanguage];
        const categories = texts.categories;

        const navDiv = document.createElement('div');
        navDiv.className = 'navigation-container';
        
        navDiv.innerHTML = `
            <div class="category-buttons">
                <button class="category-btn" data-category="citas">${categories.citas.title}</button>
                <button class="category-btn" data-category="servicios">${categories.servicios.title}</button>
                <button class="category-btn" data-category="informacion">${categories.informacion.title}</button>
                <button class="category-btn" data-category="otras">${categories.otras.title}</button>
            </div>
        `;

        messagesContainer.appendChild(navDiv);
        
        // Event listeners (sense botó home)
        navDiv.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                if (categories[category].subcategories) {
                    showSubcategories(category);
                } else {
                    showOptions(category);
                }
            });
        });

        currentLevel = 'categories';
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    function showSubcategories(categoryKey) {
        const navContainer = messagesContainer.querySelector('.navigation-container');
        if (navContainer) navContainer.remove();

        const texts = languageTexts[selectedLanguage];
        const category = texts.categories[categoryKey];
        currentPath = [categoryKey];

        const navDiv = document.createElement('div');
        navDiv.className = 'navigation-container';
        
        let subcategoryButtons = '';
        Object.keys(category.subcategories).forEach(subKey => {
            const subcategory = category.subcategories[subKey];
            subcategoryButtons += `<button class="subcategory-btn" data-subcategory="${subKey}">${subcategory.title}</button>`;
        });

        navDiv.innerHTML = `
            <div class="navigation-header">
                <button class="nav-btn home-btn">${texts.navigation.home}</button>
                <button class="nav-btn back-btn">${texts.navigation.back}</button>
                <span class="breadcrumb">${texts.navigation.breadcrumb} ${category.title}</span>
            </div>
            <div class="subcategory-buttons">
                ${subcategoryButtons}
            </div>
        `;

        messagesContainer.appendChild(navDiv);
        
        // Event listeners
        navDiv.querySelector('.home-btn').addEventListener('click', resetNavigation);
        navDiv.querySelector('.back-btn').addEventListener('click', showCategories);
        navDiv.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subcategory = e.target.getAttribute('data-subcategory');
                showOptions(categoryKey, subcategory);
            });
        });

        currentLevel = 'subcategories';
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    function showOptions(categoryKey, subcategoryKey = null) {
        const navContainer = messagesContainer.querySelector('.navigation-container');
        if (navContainer) navContainer.remove();

        const texts = languageTexts[selectedLanguage];
        const category = texts.categories[categoryKey];
        let options, breadcrumbText;

        if (subcategoryKey) {
            options = category.subcategories[subcategoryKey].options;
            breadcrumbText = `${category.title} > ${category.subcategories[subcategoryKey].title}`;
            currentPath = [categoryKey, subcategoryKey];
        } else {
            options = category.options;
            breadcrumbText = category.title;
            currentPath = [categoryKey];
        }

        const navDiv = document.createElement('div');
        navDiv.className = 'navigation-container';
        
        let optionButtons = '';
        Object.keys(options).forEach(optKey => {
            const option = options[optKey];
            optionButtons += `<button class="option-btn" data-message="${option.message}">${option.title}</button>`;
        });

        navDiv.innerHTML = `
            <div class="navigation-header">
                <button class="nav-btn home-btn">${texts.navigation.home}</button>
                <button class="nav-btn back-btn">${texts.navigation.back}</button>
                <span class="breadcrumb">${texts.navigation.breadcrumb} ${breadcrumbText}</span>
            </div>
            <div class="option-buttons">
                ${optionButtons}
            </div>
        `;

        messagesContainer.appendChild(navDiv);
        
        // Event listeners
        navDiv.querySelector('.home-btn').addEventListener('click', resetNavigation);
        navDiv.querySelector('.back-btn').addEventListener('click', () => {
            if (subcategoryKey) {
                showSubcategories(categoryKey);
            } else {
                showCategories();
            }
        });
        navDiv.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const message = e.target.getAttribute('data-message');
                
                // Preparar missatge combinat amb idioma
                const texts = languageTexts[selectedLanguage];
                const combinedMessage = `${texts.systemMessage} - ${message}`;
                
                // Ara SÍ enviem el missatge combinat
                await sendFirstMessage(combinedMessage);
                
                // Eliminar navegació després d'enviar missatge
                const navContainer = messagesContainer.querySelector('.navigation-container');
                if (navContainer) navContainer.remove();
            });
        });

        currentLevel = 'options';
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    function resetNavigation() {
        const navContainer = messagesContainer.querySelector('.navigation-container');
        if (navContainer) navContainer.remove();
        
        currentLevel = 'categories';
        currentPath = [];
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    // Funció per fer scroll mostrant l'últim missatge de l'usuari
    function scrollToShowUserMessage() {
        const userMessages = messagesContainer.querySelectorAll('.chat-message.user');
        if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            // Fem scroll suau per mostrar l'últim missatge de l'usuari a la part superior
            lastUserMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }
    }

    // Funció per mostrar l'indicador de typing
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        
        // Fem scroll per mostrar l'indicador
        setTimeout(() => {
            typingDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }, 100);
    }

    // Funció per amagar l'indicador de typing
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <div class="language-selection">
                <h2 class="language-title">Selecciona idioma</h2>
                <div class="language-buttons">
                    <button class="language-btn" data-lang="ca">Català</button>
                    <button class="language-btn" data-lang="es">Español</button>
                    <button class="language-btn" data-lang="oc">Aranès</button>
                </div>
            </div>
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn" style="display: none;">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                <span class="btn-text">Envia'ns un missatge</span>
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Escriu el teu missatge aquí..." rows="1"></textarea>
                <button type="submit">Enviar</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const languageButtons = chatContainer.querySelectorAll('.language-btn');

    // Gestió de selecció d'idioma - NOMÉS LOCAL
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            selectedLanguage = lang;
            
            // Actualitzar estils dels botons
            languageButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Actualitzar textos de la interfície (sense enviar missatge)
            const texts = languageTexts[lang];
            textarea.placeholder = texts.placeholder;
            sendButton.textContent = texts.sendBtn;
            
            // Actualitzar el footer amb l'idioma seleccionat
            const footerLink = chatContainer.querySelector('.chat-footer a');
            if (footerLink) {
                footerLink.textContent = texts.poweredBy;
            }
            
            // Anar directament a la interfície de categories (sense enviar missatge)
            showChatInterface();
        });
    });

    // Initialize mobile optimizations
    preventZoom();

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Funció per mostrar la interfície de xat sense enviar missatges
    function showChatInterface() {
        // Verificar que s'hagi seleccionat un idioma
        if (!selectedLanguage) {
            alert('Selecciona un idioma primer / Selecciona un idioma primero');
            return;
        }

        // Canviar a la interfície de xat sense enviar cap missatge
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        // Mostrar categories de navegació directament
        setTimeout(() => {
            showCategories();
        }, 200);
    }

    // Funció per enviar el missatge d'idioma (invisible)
    async function sendLanguageMessage(languageMessage) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: languageMessage,
            metadata: {
                userId: ""
            }
        };

        try {
            await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            // No mostrem la resposta d'aquest missatge a l'usuari
        } catch (error) {
            console.error('Error enviando mensaje de idioma:', error);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        
        // Mostrem l'indicador de typing
        showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            // Amaguem l'indicador de typing
            hideTypingIndicator();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            // Utilitzem innerHTML amb la funció formatText per mostrar markdown
            botMessageDiv.innerHTML = formatText(Array.isArray(data) ? data[0].output : data.output);
            messagesContainer.appendChild(botMessageDiv);
            
            // Fem scroll per mostrar l'últim missatge de l'usuari
            setTimeout(scrollToShowUserMessage, 100);
        } catch (error) {
            // Amaguem l'indicador de typing en cas d'error
            hideTypingIndicator();
            console.error('Error:', error);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
