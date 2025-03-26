/**
 * CyberGuard - Multilanguage Support
 * Supports English (EN), Italian (IT), and Spanish (ES)
 */

// Define all messages for each language
const messages = {
    // English
    en: {
        // Navigation
        navHome: "Home",
        navServices: "Services",
        navGuides: "Guides",
        navNews: "News",
        navAbout: "About",
        
        // Hero Section
        heroTitle: "Welcome to CyberGuard",
        heroSubtitle: "Your cybersecurity knowledge hub",
        heroButton: "Check Your Password Security",
        
        // Password Checker
        pwdCheckerTitle: "Password Security Checker",
        pwdCheckerDesc: "Check if your password has been exposed in data breaches. We'll never store or transmit your actual password.",
        pwdInputLabel: "Enter a password to check:",
        pwdCheckButton: "Check Security",
        pwdCheckingButton: "Checking...",
        pwdEmptyMessage: "Please enter a password to check.",
        pwdCompromisedMessage: "⚠️ This password has been found in {count} data breaches. It's STRONGLY recommended not to use it.",
        pwdSafeMessage: "✅ This password hasn't been found in known data breaches. Make sure it's also strong and unique.",
        pwdErrorMessage: "An error occurred while checking the password. Please try again later.",
        
        // News Section
        latestNewsTitle: "Latest Cybersecurity News",
        viewAllNews: "View All News",
        
        // Footer
        footerTagline: "Your trusted source for cybersecurity knowledge and tools.",
        footerLinks: "Quick Links",
        footerContact: "Contact",
        footerNewsletter: "Newsletter",
        footerNewsletterText: "Subscribe to get the latest cybersecurity updates.",
        emailPlaceholder: "Your email",
        subscribeButton: "Subscribe",
        footerRights: "All rights reserved."
    },
    
    // Italian
    it: {
        // Navigation
        navHome: "Home",
        navServices: "Servizi",
        navGuides: "Guide",
        navNews: "Novità",
        navAbout: "Chi Siamo",
        
        // Hero Section
        heroTitle: "Benvenuto su CyberGuard",
        heroSubtitle: "La tua fonte di conoscenza sulla cybersicurezza",
        heroButton: "Verifica la Sicurezza della Password",
        
        // Password Checker
        pwdCheckerTitle: "Verifica Sicurezza Password",
        pwdCheckerDesc: "Controlla se la tua password è stata esposta in violazioni di dati. Non memorizziamo né trasmettiamo mai la tua password effettiva.",
        pwdInputLabel: "Inserisci una password da controllare:",
        pwdCheckButton: "Verifica Sicurezza",
        pwdCheckingButton: "Verifica in corso...",
        pwdEmptyMessage: "Inserisci una password da verificare.",
        pwdCompromisedMessage: "⚠️ Questa password è stata trovata in {count} violazioni di dati. È FORTEMENTE sconsigliato utilizzarla.",
        pwdSafeMessage: "✅ Questa password non è stata trovata in violazioni di dati note. Assicurati che sia anche robusta e unica.",
        pwdErrorMessage: "Si è verificato un errore durante il controllo della password. Riprova più tardi.",
        
        // News Section
        latestNewsTitle: "Ultime Novità sulla Cybersicurezza",
        viewAllNews: "Vedi Tutte le Novità",
        
        // Footer
        footerTagline: "La tua fonte affidabile per conoscenze e strumenti di cybersicurezza.",
        footerLinks: "Link Rapidi",
        footerContact: "Contatti",
        footerNewsletter: "Newsletter",
        footerNewsletterText: "Iscriviti per ricevere gli ultimi aggiornamenti sulla cybersicurezza.",
        emailPlaceholder: "La tua email",
        subscribeButton: "Iscriviti",
        footerRights: "Tutti i diritti riservati."
    },
    
    // Spanish
    es: {
        // Navigation
        navHome: "Inicio",
        navServices: "Servicios",
        navGuides: "Guías",
        navNews: "Noticias",
        navAbout: "Sobre Nosotros",
        
        // Hero Section
        heroTitle: "Bienvenido a CyberGuard",
        heroSubtitle: "Tu centro de conocimiento sobre ciberseguridad",
        heroButton: "Verificar la Seguridad de tu Contraseña",
        
        // Password Checker
        pwdCheckerTitle: "Verificador de Seguridad de Contraseñas",
        pwdCheckerDesc: "Comprueba si tu contraseña ha sido expuesta en filtraciones de datos. Nunca almacenamos ni transmitimos tu contraseña real.",
        pwdInputLabel: "Introduce una contraseña para verificar:",
        pwdCheckButton: "Verificar Seguridad",
        pwdCheckingButton: "Verificando...",
        pwdEmptyMessage: "Por favor, introduce una contraseña para verificar.",
        pwdCompromisedMessage: "⚠️ Esta contraseña se ha encontrado en {count} filtraciones de datos. Se recomienda ENCARECIDAMENTE no utilizarla.",
        pwdSafeMessage: "✅ Esta contraseña no se ha encontrado en filtraciones de datos conocidas. Asegúrate de que también sea fuerte y única.",
        pwdErrorMessage: "Se produjo un error al comprobar la contraseña. Por favor, inténtalo de nuevo más tarde.",
        
        // News Section
        latestNewsTitle: "Últimas Noticias sobre Ciberseguridad",
        viewAllNews: "Ver Todas las Noticias",
        
        // Footer
        footerTagline: "Tu fuente confiable para conocimientos y herramientas de ciberseguridad.",
        footerLinks: "Enlaces Rápidos",
        footerContact: "Contacto",
        footerNewsletter: "Boletín",
        footerNewsletterText: "Suscríbete para recibir las últimas actualizaciones sobre ciberseguridad.",
        emailPlaceholder: "Tu correo electrónico",
        subscribeButton: "Suscribirse",
        footerRights: "Todos los derechos reservados."
    }
};

// Set default language and initialize
let currentLang = 'en';

// Switch language function
function switchLanguage(lang) {
    if (!messages[lang]) return;
    
    currentLang = lang;
    
    // Save language preference in localStorage
    localStorage.setItem('cyberguard-lang', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (messages[lang][key]) {
            el.textContent = messages[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (messages[lang][key]) {
            el.placeholder = messages[lang][key];
        }
    });
    
    // Update any active password result
    const pwdResult = document.getElementById('pwdResult');
    const pwdInput = document.getElementById('pwdInput');
    if (pwdResult && !pwdResult.classList.contains('hidden') && pwdInput) {
        checkPassword(pwdInput.value).then(displayPasswordResult);
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has a saved language preference
    const savedLang = localStorage.getItem('cyberguard-lang');
    if (savedLang && messages[savedLang]) {
        currentLang = savedLang;
        
        // Update the language selector
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = currentLang;
        }
    }
    
    // Apply the current language
    switchLanguage(currentLang);
    
    // Add event listener to language selector
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.addEventListener('change', function() {
            switchLanguage(this.value);
        });
    }
});

// Format message with variables
function formatMessage(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}