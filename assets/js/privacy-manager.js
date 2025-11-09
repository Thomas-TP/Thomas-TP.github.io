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
                        <small style="color: #6b7280;">
                            Les cookies sont utilisés uniquement pour Google Analytics avec anonymisation IP.
                            Vous pouvez modifier votre choix à tout moment en appelant <code style="background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 3px;">resetCookieConsent()</code> dans la console.
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
// S'exécute immédiatement si le DOM est déjà chargé, sinon attend
function initCookieConsent() {
    window.cookieConsent = new CookieConsent();
    console.log('✅ Cookie Consent Manager initialisé');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    // DOM déjà chargé, initialiser immédiatement
    initCookieConsent();
}

// Exposer globalement pour permettre la réinitialisation
window.resetCookieConsent = function() {
    if (window.cookieConsent) {
        window.cookieConsent.reset();
        console.log('🔄 Consentement réinitialisé, rechargez la page pour voir le banner');
    } else {
        console.warn('Cookie Consent Manager pas encore initialisé');
    }
};

// Pour tester - force l'affichage du banner
window.showCookieBanner = function() {
    if (window.cookieConsent) {
        window.cookieConsent.showBanner();
        console.log('🍪 Banner de cookies affiché manuellement');
    } else {
        console.warn('Cookie Consent Manager pas encore initialisé');
    }
};
