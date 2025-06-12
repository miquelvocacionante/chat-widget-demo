// Chat Widget Script - Versió 1.5
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
            width: 380px;
            height: 600px;
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

        /* Estils per als botons de selecció ràpida */
        .n8n-chat-widget .quick-buttons {
            margin: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .n8n-chat-widget .quick-btn {
            padding: 12px 16px;
            background: transparent;
            border: 1px solid var(--chat--color-primary);
            color: var(--chat--color-primary);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s;
            text-align: center;
        }

        .n8n-chat-widget .quick-btn:hover {
            background: var(--chat--color-primary);
            color: white;
            transform: scale(1.02);
        }

        /* Estils per categories principals */
        .n8n-chat-widget .category-buttons {
            margin: 16px 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .n8n-chat-widget .category-btn {
            padding: 16px 12px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            font-family: inherit;
            transition: all 0.3s;
            text-align: center;
            line-height: 1.3;
        }

        .n8n-chat-widget .category-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
        }

        /* Estils per sub-botons */
        .n8n-chat-widget .sub-buttons {
            margin: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .n8n-chat-widget .sub-btn {
            padding: 10px 14px;
            background: transparent;
            border: 1px solid var(--chat--color-primary);
            color: var(--chat--color-primary);
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s;
            text-align: left;
        }

        .n8n-chat-widget .sub-btn:hover {
            background: var(--chat--color-primary);
            color: white;
            transform: translateX(4px);
        }

        /* Botó de tornar */
        .n8n-chat-widget .back-btn {
            padding: 8px 12px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            color: #666;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            font-family: inherit;
            transition: all 0.3s;
            margin-bottom: 8px;
            text-align: center;
        }

        .n8n-chat-widget .back-btn:hover {
            background: #e8e8e8;
            transform: scale(1.02);
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
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
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
    let currentView = 'main'; // 'main', 'category', 'subcategory'
    let currentCategory = null;

    // Textos segons l'idioma
    const languageTexts = {
        ca: {
            btnText: "Envia'ns un missatge",
            placeholder: "Escriu el teu missatge aquí...",
            sendBtn: "Enviar",
            systemMessage: "[IDIOMA:català] L'usuari vol rebre respostes en català",
            greeting: "Hola! Sóc l'assistent virtual d'ARAN RESPON. Com puc ajudar-te?",
            poweredBy: "Desenvolupat per ok-otto",
            backBtn: "← Tornar",
            categories: {
                medical: {
                    title: "Cites mèdiques",
                    buttons: [
                        {
                            text: "Demanar cita",
                            subButtons: [
                                { text: "Medicina general", message: "Vull demanar una cita de medicina general" },
                                { text: "Pediatria", message: "Vull demanar una cita de pediatria" },
                                { text: "Especialistes", message: "Vull demanar una cita amb un especialista" }
                            ]
                        },
                        {
                            text: "Reprogramar cita",
                            subButtons: [
                                { text: "Canviar data", message: "Vull canviar la data d'una cita" },
                                { text: "Canviar especialitat", message: "Vull canviar l'especialitat d'una cita" },
                                { text: "Cancel·lar cita", message: "Vull cancel·lar una cita" }
                            ]
                        },
                        {
                            text: "Consultar cita",
                            subButtons: [
                                { text: "Quan és la meva propera cita?", message: "Quan és la meva propera cita?" },
                                { text: "On serà?", message: "On serà la meva cita?" }
                            ]
                        }
                    ]
                },
                social: {
                    title: "Serveis socials",
                    buttons: [
                        {
                            text: "Ajuda a persones grans",
                            subButtons: [
                                { text: "Sol·licitud de valoració", message: "Necessito sol·licitar una valoració per persona gran" },
                                { text: "Cures domiciliàries", message: "Necessito informació sobre cures domiciliàries" }
                            ]
                        },
                        {
                            text: "Salut mental i suport psicològic",
                            subButtons: [
                                { text: "Demanar visita", message: "Vull demanar una visita de salut mental" },
                                { text: "Urgència emocional", message: "Tinc una urgència emocional" }
                            ]
                        },
                        {
                            text: "Altres serveis",
                            subButtons: [
                                { text: "Informació sobre dependència", message: "Necessito informació sobre dependència" },
                                { text: "Sol·licitud d'acompanyament", message: "Necessito sol·licitar un servei d'acompanyament" }
                            ]
                        }
                    ]
                },
                info: {
                    title: "Informació general",
                    buttons: [
                        { text: "On som?", message: "On està ubicat l'hospital?" },
                        { text: "Horaris de l'hospital", message: "Quins són els horaris de l'hospital?" },
                        { text: "Telèfons i contacte", message: "Quins són els telèfons de contacte?" },
                        { text: "Documentació necessària", message: "Quina documentació necessito per als tràmits?" }
                    ]
                },
                other: {
                    title: "Altres consultes",
                    buttons: [
                        { text: "Tinc un dubte mèdic", message: "Tinc un dubte mèdic" },
                        { text: "Emergències", message: "Tinc una emergència" },
                        { text: "Receptes i farmàcia", message: "Necessito informació sobre receptes i farmàcia" },
                        { text: "Ajuda amb l'app o el xat", message: "Necessito ajuda amb l'aplicació o el xat" }
                    ]
                }
            }
        },
        es: {
            btnText: "Envíanos un mensaje",
            placeholder: "Escribe tu mensaje aquí...",
            sendBtn: "Enviar",
            systemMessage: "[IDIOMA:español] L'usuari vol rebre respostes en español",
            greeting: "¡Hola! Soy el asistente virtual de ARAN RESPON. ¿Cómo puedo ayudarte?",
            poweredBy: "Desarrollado por ok-otto",
            backBtn: "← Volver",
            categories: {
                medical: {
                    title: "Citas médicas",
                    buttons: [
                        {
                            text: "Pedir cita",
                            subButtons: [
                                { text: "Medicina general", message: "Quiero pedir una cita de medicina general" },
                                { text: "Pediatría", message: "Quiero pedir una cita de pediatría" },
                                { text: "Especialistas", message: "Quiero pedir una cita con un especialista" }
                            ]
                        },
                        {
                            text: "Reprogramar cita",
                            subButtons: [
                                { text: "Cambiar fecha", message: "Quiero cambiar la fecha de una cita" },
                                { text: "Cambiar especialidad", message: "Quiero cambiar la especialidad de una cita" },
                                { text: "Cancelar cita", message: "Quiero cancelar una cita" }
                            ]
                        },
                        {
                            text: "Consultar cita",
                            subButtons: [
                                { text: "¿Cuándo es mi próxima cita?", message: "¿Cuándo es mi próxima cita?" },
                                { text: "¿Dónde será?", message: "¿Dónde será mi cita?" }
                            ]
                        }
                    ]
                },
                social: {
                    title: "Servicios sociales",
                    buttons: [
                        {
                            text: "Ayuda a personas mayores",
                            subButtons: [
                                { text: "Solicitud de valoración", message: "Necesito solicitar una valoración para persona mayor" },
                                { text: "Cuidados domiciliarios", message: "Necesito información sobre cuidados domiciliarios" }
                            ]
                        },
                        {
                            text: "Salud mental y apoyo psicológico",
                            subButtons: [
                                { text: "Pedir visita", message: "Quiero pedir una visita de salud mental" },
                                { text: "Urgencia emocional", message: "Tengo una urgencia emocional" }
                            ]
                        },
                        {
                            text: "Otros servicios",
                            subButtons: [
                                { text: "Información sobre dependencia", message: "Necesito información sobre dependencia" },
                                { text: "Solicitud de acompañamiento", message: "Necesito solicitar un servicio de acompañamiento" }
                            ]
                        }
                    ]
                },
                info: {
                    title: "Información general",
                    buttons: [
                        { text: "¿Dónde estamos?", message: "¿Dónde está ubicado el hospital?" },
                        { text: "Horarios del hospital", message: "¿Cuáles son los horarios del hospital?" },
                        { text: "Teléfonos y contacto", message: "¿Cuáles son los teléfonos de contacto?" },
                        { text: "Documentación necesaria", message: "¿Qué documentación necesito para los trámites?" }
                    ]
                },
                other: {
                    title: "Otras consultas",
                    buttons: [
                        { text: "Tengo una duda médica", message: "Tengo una duda médica" },
                        { text: "Emergencias", message: "Tengo una emergencia" },
                        { text: "Recetas y farmacia", message: "Necesito información sobre recetas y farmacia" },
                        { text: "Ayuda con la app o el chat", message: "Necesito ayuda con la aplicación o el chat" }
                    ]
                }
            }
        },
        oc: {
            btnText: "Mandatz-mos un messatge",
            placeholder: "Escrivètz eth vòstre messatge ací...",
            sendBtn: "Mandar",
            systemMessage: "[IDIOMA:aranès] L'usuari vol rebre respostes en aranès",
            greeting: "Adiu! Sòi er assistent virtuau d'ARAN RESPON. Com pòdi ajudar-te?",
            poweredBy: "Desvolupat per ok-otto",
            backBtn: "← Tornar",
            categories: {
                medical: {
                    title: "Rendètz-vos medics",
                    buttons: [
                        {
                            text: "Demandar rendètz-vos",
                            subButtons: [
                                { text: "Medicina generau", message: "Vòli demandar un rendètz-vos de medicina generau" },
                                { text: "Pediatria", message: "Vòli demandar un rendètz-vos de pediatria" },
                                { text: "Especialistes", message: "Vòli demandar un rendètz-vos damb un especialista" }
                            ]
                        },
                        {
                            text: "Reprogramar rendètz-vos",
                            subButtons: [
                                { text: "Cambiar data", message: "Vòli cambiar era data d'un rendètz-vos" },
                                { text: "Cambiar especialitat", message: "Vòli cambiar era especialitat d'un rendètz-vos" },
                                { text: "Anullar rendètz-vos", message: "Vòli anullar un rendètz-vos" }
                            ]
                        },
                        {
                            text: "Consultar rendètz-vos",
                            subButtons: [
                                { text: "Quan ei eth mèn seguent rendètz-vos?", message: "Quan ei eth mèn seguent rendètz-vos?" },
                                { text: "A on serà?", message: "A on serà eth mèn rendètz-vos?" }
                            ]
                        }
                    ]
                },
                social: {
                    title: "Servicis socials",
                    buttons: [
                        {
                            text: "Ajuda a persones ancianes",
                            subButtons: [
                                { text: "Sollicitut de valoracion", message: "Necessiti sollicitar ua valoracion entà persòna anciana" },
                                { text: "Cures domiciliaris", message: "Necessiti informacion sus es cures domiciliaris" }
                            ]
                        },
                        {
                            text: "Salut mentau e supòrt psicologic",
                            subButtons: [
                                { text: "Demandar visita", message: "Vòli demandar ua visita de salut mentau" },
                                { text: "Urgéncia emocionau", message: "Ai ua urgéncia emocionau" }
                            ]
                        },
                        {
                            text: "Auti servicis",
                            subButtons: [
                                { text: "Informacion sus era dependéncia", message: "Necessiti informacion sus era dependéncia" },
                                { text: "Sollicitut d'acompanhament", message: "Necessiti sollicitar un servici d'acompanhament" }
                            ]
                        }
                    ]
                },
                info: {
                    title: "Informacion generau",
                    buttons: [
                        { text: "A on èm?", message: "A on ei localizat er espitau?" },
                        { text: "Oraris der espitau", message: "Quins son es oraris der espitau?" },
                        { text: "Telefòns e contacte", message: "Quins son es telefòns de contacte?" },
                        { text: "Documentacion necessària", message: "Quina documentacion necessiti entàs tramits?" }
                    ]
                },
                other: {
                    title: "Autes consultes",
                    buttons: [
                        { text: "Ai un dubte medic", message: "Ai un dubte medic" },
                        { text: "Emergéncies", message: "Ai ua emergéncia" },
                        { text: "Recèptes e farmàcia", message: "Necessiti informacion sus recèptes e farmàcia" },
                        { text: "Ajuda damb era app o eth xat", message: "Necessiti ajuda damb era aplicacion o eth xat" }
                    ]
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

    // Funció per fer scroll mostrant l'últim missatge de l'usuari
    function scrollToShowUserMessage() {
        const userMessages = messagesContainer.querySelectorAll('.chat-message.user');
        if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            // Fem scroll suau per mostrar l'últim missatge de l'usuari
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

    // Gestió de selecció d'idioma
    languageButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            selectedLanguage = lang;
            
            // Actualitzar estils dels botons
            languageButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Actualitzar textos de la interfície
            const texts = languageTexts[lang];
            textarea.placeholder = texts.placeholder;
            sendButton.textContent = texts.sendBtn;
            
            // Actualitzar el footer amb l'idioma seleccionat
            const footerLink = chatContainer.querySelector('.chat-footer a');
            if (footerLink) {
                footerLink.textContent = texts.poweredBy;
            }
            
            // Iniciar xat automàticament després de seleccionar idioma
            await startNewConversation();
        });
    });

    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        // Verificar que s'hagi seleccionat un idioma
        if (!selectedLanguage) {
            alert('Selecciona un idioma primer / Selecciona un idioma primero');
            return;
        }

        currentSessionId = generateUUID();
        
        // Canviar a la interfície de xat immediatament
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        try {
            // Enviar missatge d'idioma automàticament (invisible per l'usuari)
            const languageMessage = languageTexts[selectedLanguage].systemMessage;
            await sendLanguageMessage(languageMessage);

            // Mostrar missatge de salutació amb botons de categories principals
            const greetingMessage = languageTexts[selectedLanguage].greeting;
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `${formatText(greetingMessage)}${createCategoryButtons()}`;
            messagesContainer.appendChild(botMessageDiv);
            
            // Afegir event listeners als botons de categories
            addCategoryEventListeners(botMessageDiv);
            
            setTimeout(() => {
                botMessageDiv.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Crear botons de categories principals
    function createCategoryButtons() {
        const texts = languageTexts[selectedLanguage];
        return `
            <div class="category-buttons">
                <button class="category-btn" data-category="medical">${texts.categories.medical.title}</button>
                <button class="category-btn" data-category="social">${texts.categories.social.title}</button>
                <button class="category-btn" data-category="info">${texts.categories.info.title}</button>
                <button class="category-btn" data-category="other">${texts.categories.other.title}</button>
            </div>
        `;
    }

    // Crear botons de subcategoria
    function createSubCategoryButtons(categoryKey) {
        const texts = languageTexts[selectedLanguage];
        const category = texts.categories[categoryKey];
        
        let buttonsHTML = `<button class="back-btn">${texts.backBtn}</button>`;
        buttonsHTML += '<div class="sub-buttons">';
        
        category.buttons.forEach(button => {
            if (button.subButtons) {
                buttonsHTML += `<button class="sub-btn" data-has-sub="true" data-text="${button.text}">${button.text} ➤</button>`;
            } else {
                buttonsHTML += `<button class="sub-btn" data-message="${button.message}">${button.text}</button>`;
            }
        });
        
        buttonsHTML += '</div>';
        return buttonsHTML;
    }

    // Crear botons finals (tercer nivell)
    function createFinalButtons(categoryKey, buttonText) {
        const texts = languageTexts[selectedLanguage];
        const category = texts.categories[categoryKey];
        const parentButton = category.buttons.find(b => b.text === buttonText);
        
        if (!parentButton || !parentButton.subButtons) return '';
        
        let buttonsHTML = `<button class="back-btn">${texts.backBtn}</button>`;
        buttonsHTML += '<div class="sub-buttons">';
        
        parentButton.subButtons.forEach(subButton => {
            buttonsHTML += `<button class="sub-btn" data-message="${subButton.message}">${subButton.text}</button>`;
        });
        
        buttonsHTML += '</div>';
        return buttonsHTML;
    }

    // Afegir event listeners als botons
    function addCategoryEventListeners(container) {
        // Botons de categories principals
        const categoryBtns = container.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                currentCategory = category;
                currentView = 'category';
                
                const newButtons = createSubCategoryButtons(category);
                const buttonsContainer = container.querySelector('.category-buttons');
                buttonsContainer.outerHTML = newButtons;
                
                addSubCategoryEventListeners(container);
            });
        });
    }

    function addSubCategoryEventListeners(container) {
        // Botó de tornar
        const backBtn = container.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (currentView === 'subcategory') {
                    // Tornar a subcategoria
                    currentView = 'category';
                    const newButtons = createSubCategoryButtons(currentCategory);
                    container.querySelector('.back-btn').parentNode.outerHTML = newButtons;
                    addSubCategoryEventListeners(container);
                } else {
                    // Tornar a categories principals
                    currentView = 'main';
                    const newButtons = createCategoryButtons();
                    container.querySelector('.back-btn').parentNode.outerHTML = newButtons;
                    addCategoryEventListeners(container);
                }
            });
        }

        // Botons de subcategoria
        const subBtns = container.querySelectorAll('.sub-btn');
        subBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                const hasSub = btn.getAttribute('data-has-sub');
                const buttonText = btn.getAttribute('data-text');
                
                if (hasSub === 'true') {
                    // Mostrar botons finals
                    currentView = 'subcategory';
                    const newButtons = createFinalButtons(currentCategory, buttonText);
                    container.querySelector('.back-btn').parentNode.outerHTML = newButtons;
                    addSubCategoryEventListeners(container);
                } else if (message) {
                    // Enviar missatge
                    sendMessage(message);
                }
            });
        });
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
