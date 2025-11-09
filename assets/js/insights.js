/**
 * Analytics Manager - Google Tag Manager
 * Gestion respectueuse de la vie privée avec consentement RGPD
 */

class AnalyticsManager {
    constructor() {
        this.gtmId = 'GTM-K8RZ9NFL'; // Votre ID Google Tag Manager
        this.initialized = false;
        this.init();
    }

    init() {
        // Initialiser dataLayer
        window.dataLayer = window.dataLayer || [];

        // Vérifier si le consentement a été donné
        window.addEventListener('consentChanged', (event) => {
            if (event.detail.consent) {
                this.enable();
            } else {
                this.disable();
            }
        });

        // Vérifier le consentement initial
        if (window.cookieConsent && window.cookieConsent.isAnalyticsEnabled()) {
            this.enable();
        }
    }

    enable() {
        if (this.initialized) {
            console.log('Analytics déjà initialisé');
            return;
        }

        console.log('🔍 Activation de Google Tag Manager');

        // Charger Google Tag Manager
        this.loadGoogleTagManager();

        this.initialized = true;
    }

    disable() {
        console.log('🚫 Désactivation des analytics');

        // Bloquer GTM de charger de nouveaux tags
        window['ga-disable-GTM'] = true;

        this.initialized = false;
    }

    loadGoogleTagManager() {
        // Injection GTM dans le <head>
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',this.gtmId);

        // Injection GTM noscript dans le <body>
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${this.gtmId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);

        console.log('✅ Google Tag Manager chargé');
    }

    // Méthodes pour tracker des événements personnalisés via dataLayer
    trackEvent(eventName, eventParams = {}) {
        if (!this.initialized || !window.dataLayer) {
            console.warn('Analytics non initialisé ou désactivé');
            return;
        }

        window.dataLayer.push({
            'event': eventName,
            ...eventParams
        });
        console.log('📊 Événement tracké:', eventName, eventParams);
    }

    trackPageView(pagePath) {
        if (!this.initialized || !window.dataLayer) {
            return;
        }

        window.dataLayer.push({
            'event': 'page_view',
            'page_path': pagePath
        });
    }

    trackOutboundLink(url) {
        this.trackEvent('outbound_link', {
            link_url: url
        });
    }

    trackDownload(fileName) {
        this.trackEvent('file_download', {
            file_name: fileName
        });
    }

    trackFormSubmit(formName) {
        this.trackEvent('form_submit', {
            form_name: formName
        });
    }

    trackProjectView(projectName) {
        this.trackEvent('project_view', {
            project_name: projectName
        });
    }

    trackLanguageChange(language) {
        this.trackEvent('language_change', {
            language: language
        });
    }

    trackThemeChange(theme) {
        this.trackEvent('theme_change', {
            theme: theme
        });
    }
}

// Initialiser le gestionnaire d'analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AnalyticsManager();

    // Fonction globale pour faciliter l'initialisation
    window.initAnalytics = function() {
        if (window.analytics) {
            window.analytics.enable();
        }
    };

    // Auto-tracker certains événements
    setupAutoTracking();
});

/**
 * Configuration du tracking automatique
 */
function setupAutoTracking() {
    // Tracker les liens externes
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');

        if (!link || !window.analytics) return;

        const href = link.getAttribute('href');

        // Lien externe
        if (href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(window.location.hostname)) {
            window.analytics.trackOutboundLink(href);
        }

        // Téléchargement de CV
        if (href && (href.includes('.pdf') || href.includes('/cv/'))) {
            window.analytics.trackDownload(href);
        }
    });

    // Tracker les soumissions de formulaire
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            if (window.analytics) {
                window.analytics.trackFormSubmit('contact');
            }
        });
    }

    // Tracker les changements de langue (à connecter avec votre système existant)
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (event) => {
            const lang = event.currentTarget.getAttribute('data-lang');
            if (window.analytics && lang) {
                window.analytics.trackLanguageChange(lang);
            }
        });
    });

    // Tracker les changements de thème (à connecter avec votre système existant)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (window.analytics) {
                const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                window.analytics.trackThemeChange(currentTheme);
            }
        });
    }

    // Tracker les vues de projets
    document.querySelectorAll('.card[data-project]').forEach(card => {
        card.addEventListener('click', (event) => {
            const projectName = event.currentTarget.getAttribute('data-project');
            if (window.analytics && projectName) {
                window.analytics.trackProjectView(projectName);
            }
        });
    });
}

// Export pour utilisation globale
window.AnalyticsManager = AnalyticsManager;
