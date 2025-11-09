/**
 * Analytics Manager
 * Gestion respectueuse de la vie privée avec consentement RGPD
 */

class AnalyticsManager {
    constructor() {
        this.gaId = 'G-XXXXXXXXXX'; // Remplacer par votre ID Google Analytics
        this.initialized = false;
        this.init();
    }

    init() {
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

        console.log('🔍 Activation des analytics');

        // Charger Google Analytics 4
        this.loadGoogleAnalytics();

        this.initialized = true;
    }

    disable() {
        console.log('🚫 Désactivation des analytics');

        // Désactiver le tracking Google Analytics
        if (window.gtag) {
            window[`ga-disable-${this.gaId}`] = true;
        }

        this.initialized = false;
    }

    loadGoogleAnalytics() {
        // Créer le script gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);

        // Initialiser gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());

        // Configuration avec respect de la vie privée
        window.gtag('config', this.gaId, {
            'anonymize_ip': true,           // Anonymisation de l'IP
            'cookie_flags': 'SameSite=None;Secure', // Cookies sécurisés
            'cookie_expires': 60 * 60 * 24 * 30,    // 30 jours
            'send_page_view': true
        });

        console.log('✅ Google Analytics chargé');
    }

    // Méthodes pour tracker des événements personnalisés
    trackEvent(eventName, eventParams = {}) {
        if (!this.initialized || !window.gtag) {
            console.warn('Analytics non initialisé ou désactivé');
            return;
        }

        window.gtag('event', eventName, eventParams);
        console.log('📊 Événement tracké:', eventName, eventParams);
    }

    trackPageView(pagePath) {
        if (!this.initialized || !window.gtag) {
            return;
        }

        window.gtag('event', 'page_view', {
            page_path: pagePath
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
