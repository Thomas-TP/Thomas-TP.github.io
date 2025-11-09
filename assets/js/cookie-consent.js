/**
 * Cookie Consent Manager
 * Gestion du consentement RGPD pour les cookies et analytics
 */

class CookieConsent {
    constructor() {
        this.consentKey = 'cookie-consent';
        this.analyticsKey = 'analytics-enabled';
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur a déjà donné son consentement
        const consent = this.getConsent();

        if (consent === null) {
            // Pas de consentement enregistré, afficher le banner
            this.showBanner();
        } else if (consent === true) {
            // Consentement donné, activer les analytics
            this.enableAnalytics();
        }

        // Écouter les événements des boutons (si le banner est dans le HTML)
        this.attachEventListeners();
    }

    getConsent() {
        const consent = localStorage.getItem(this.consentKey);
        if (consent === null) return null;
        return consent === 'true';
    }

    setConsent(value) {
        localStorage.setItem(this.consentKey, value.toString());
        localStorage.setItem(this.analyticsKey, value.toString());

        // Émettre un événement personnalisé
        window.dispatchEvent(new CustomEvent('consentChanged', {
            detail: { consent: value }
        }));
    }

    showBanner() {
        // Créer le banner de consentement
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Consentement aux cookies');
        banner.setAttribute('aria-live', 'polite');

        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3 class="cookie-consent-title" data-key="cookieConsentTitle">
                        🍪 Respect de votre vie privée
                    </h3>
                    <p class="cookie-consent-description" data-key="cookieConsentText">
                        Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic de notre site.
                        Ces données sont anonymes et nous aident à améliorer nos services.
                        Vous pouvez accepter ou refuser leur utilisation.
                    </p>
                    <p class="cookie-consent-info">
                        <small>
                            <a href="#privacy" class="cookie-consent-link" data-key="cookieConsentLearnMore">
                                En savoir plus sur notre politique de confidentialité
                            </a>
                        </small>
                    </p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-consent-accept" class="cookie-consent-btn cookie-consent-btn-accept" data-key="cookieConsentAccept">
                        Accepter
                    </button>
                    <button id="cookie-consent-decline" class="cookie-consent-btn cookie-consent-btn-decline" data-key="cookieConsentDecline">
                        Refuser
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Animer l'apparition
        setTimeout(() => {
            banner.classList.add('show');
        }, 300);

        this.attachEventListeners();
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    attachEventListeners() {
        const acceptBtn = document.getElementById('cookie-consent-accept');
        const declineBtn = document.getElementById('cookie-consent-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.accept());
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.decline());
        }
    }

    accept() {
        this.setConsent(true);
        this.hideBanner();
        this.enableAnalytics();

        console.log('✅ Consentement accepté - Analytics activés');
    }

    decline() {
        this.setConsent(false);
        this.hideBanner();
        this.disableAnalytics();

        console.log('❌ Consentement refusé - Analytics désactivés');
    }

    enableAnalytics() {
        // Cette fonction sera appelée par le script analytics
        window.analyticsEnabled = true;

        // Charger Google Analytics ou autre outil si le consentement est donné
        if (typeof window.initAnalytics === 'function') {
            window.initAnalytics();
        }
    }

    disableAnalytics() {
        window.analyticsEnabled = false;

        // Désactiver Google Analytics si présent
        if (window.ga) {
            window['ga-disable-G-XXXXXXXXXX'] = true; // Remplacer par votre ID
        }

        // Supprimer les cookies analytics existants
        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Méthode publique pour réinitialiser le consentement
    reset() {
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.analyticsKey);
        this.disableAnalytics();
        this.showBanner();
    }

    // Méthode pour vérifier si les analytics sont autorisés
    isAnalyticsEnabled() {
        return this.getConsent() === true;
    }
}

// Initialiser le gestionnaire de consentement
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});

// Exposer globalement pour permettre la réinitialisation
window.resetCookieConsent = function() {
    if (window.cookieConsent) {
        window.cookieConsent.reset();
    }
};
