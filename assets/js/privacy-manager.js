/**
 * Advanced Cookie Consent Manager
 * Gestion RGPD complète avec personnalisation
 */

class CookieConsent {
    constructor() {
        this.consentKey = 'cookie-preferences';
        this.categories = {
            necessary: true,      // Toujours activé
            analytics: false,     // Google Analytics
            marketing: false      // Pour futur usage
        };
        this.init();
    }

    init() {
        // Charger les préférences existantes
        const savedPrefs = this.loadPreferences();

        if (savedPrefs === null) {
            // Première visite - afficher le banner
            this.showBanner();
        } else {
            // Appliquer les préférences sauvegardées
            this.categories = savedPrefs;
            this.applyPreferences();
        }
    }

    loadPreferences() {
        const saved = localStorage.getItem(this.consentKey);
        if (!saved) return null;

        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Erreur chargement préférences cookies:', e);
            return null;
        }
    }

    savePreferences() {
        localStorage.setItem(this.consentKey, JSON.stringify(this.categories));
        this.applyPreferences();
    }

    applyPreferences() {
        // Émettre événement pour analytics
        window.dispatchEvent(new CustomEvent('consentChanged', {
            detail: {
                consent: this.categories.analytics,
                categories: this.categories
            }
        }));

        // Activer/désactiver selon les catégories
        if (this.categories.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        console.log('✅ Préférences cookies appliquées:', this.categories);
    }

    showBanner() {
        // Créer le banner
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Consentement aux cookies');

        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3 class="cookie-consent-title">
                        🍪 Respect de votre vie privée
                    </h3>
                    <p class="cookie-consent-description">
                        Nous utilisons des cookies pour améliorer votre expérience.
                        Les cookies analytiques nous aident à comprendre comment vous utilisez notre site.
                    </p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-accept">
                        ✓ Tout accepter
                    </button>
                    <button id="cookie-customize" class="cookie-btn cookie-btn-customize">
                        ⚙️ Personnaliser
                    </button>
                    <button id="cookie-decline-all" class="cookie-btn cookie-btn-decline">
                        ✕ Tout refuser
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Animer l'apparition
        setTimeout(() => banner.classList.add('show'), 100);

        // Attacher les événements
        this.attachBannerEvents();
    }

    showCustomizeModal() {
        // Masquer le banner
        this.hideBanner();

        // Créer le modal de personnalisation
        const modal = document.createElement('div');
        modal.id = 'cookie-customize-modal';
        modal.className = 'cookie-modal';

        modal.innerHTML = `
            <div class="cookie-modal-overlay"></div>
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h2>🍪 Personnaliser les cookies</h2>
                    <button class="cookie-modal-close" aria-label="Fermer">✕</button>
                </div>

                <div class="cookie-modal-body">
                    <p class="cookie-modal-intro">
                        Choisissez les types de cookies que vous souhaitez autoriser.
                        Vos préférences seront sauvegardées pour vos prochaines visites.
                    </p>

                    <!-- Cookies nécessaires -->
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <h3>🔒 Cookies nécessaires</h3>
                                <span class="cookie-category-badge necessary">Toujours actifs</span>
                            </div>
                            <label class="cookie-toggle disabled">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies sont essentiels au fonctionnement du site. Ils permettent les fonctionnalités de base comme la navigation et la sécurité.
                        </p>
                        <details class="cookie-category-details">
                            <summary>En savoir plus</summary>
                            <ul>
                                <li><strong>cookie-preferences</strong> - Stocke vos préférences de cookies (7 jours)</li>
                                <li><strong>theme</strong> - Mémorise votre choix de thème clair/sombre</li>
                            </ul>
                        </details>
                    </div>

                    <!-- Cookies analytiques -->
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <h3>📊 Cookies analytiques</h3>
                                <span class="cookie-category-badge optional">Optionnel</span>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="toggle-analytics" ${this.categories.analytics ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant des informations anonymes.
                        </p>
                        <details class="cookie-category-details">
                            <summary>En savoir plus</summary>
                            <ul>
                                <li><strong>Google Analytics 4</strong> - Analyse du trafic et du comportement</li>
                                <li><strong>Anonymisation IP</strong> - Votre adresse IP est anonymisée</li>
                                <li><strong>Durée</strong> - Les données sont conservées 14 mois maximum</li>
                                <li><strong>_ga</strong> - Distingue les utilisateurs (2 ans)</li>
                                <li><strong>_ga_*</strong> - Garde l'état de session (2 ans)</li>
                            </ul>
                        </details>
                    </div>

                    <!-- Cookies marketing -->
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div class="cookie-category-info">
                                <h3>🎯 Cookies marketing</h3>
                                <span class="cookie-category-badge optional">Optionnel</span>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="toggle-marketing" ${this.categories.marketing ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p class="cookie-category-description">
                            Ces cookies peuvent être placés par nos partenaires publicitaires pour créer un profil de vos intérêts.
                        </p>
                        <details class="cookie-category-details">
                            <summary>En savoir plus</summary>
                            <ul>
                                <li>Actuellement, aucun cookie marketing n'est utilisé sur ce site.</li>
                            </ul>
                        </details>
                    </div>
                </div>

                <div class="cookie-modal-footer">
                    <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">
                        Sauvegarder mes préférences
                    </button>
                    <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary">
                        Tout accepter
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animer l'apparition
        setTimeout(() => modal.classList.add('show'), 100);

        // Attacher les événements
        this.attachModalEvents();
    }

    attachBannerEvents() {
        // Bouton tout accepter
        const acceptAllBtn = document.getElementById('cookie-accept-all');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => this.acceptAll());
        }

        // Bouton tout refuser
        const declineAllBtn = document.getElementById('cookie-decline-all');
        if (declineAllBtn) {
            declineAllBtn.addEventListener('click', () => this.declineAll());
        }

        // Bouton personnaliser
        const customizeBtn = document.getElementById('cookie-customize');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => this.showCustomizeModal());
        }
    }

    attachModalEvents() {
        const modal = document.getElementById('cookie-customize-modal');
        if (!modal) return;

        // Bouton fermer
        const closeBtn = modal.querySelector('.cookie-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }

        // Overlay (clic pour fermer)
        const overlay = modal.querySelector('.cookie-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.hideModal());
        }

        // Bouton sauvegarder
        const saveBtn = document.getElementById('cookie-save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomPreferences());
        }

        // Bouton tout accepter dans le modal
        const acceptAllBtn = document.getElementById('cookie-accept-all-modal');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.acceptAll();
                this.hideModal();
            });
        }

        // Échapper pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }

    acceptAll() {
        this.categories = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        this.savePreferences();
        this.hideBanner();
        console.log('✅ Tous les cookies acceptés');
    }

    declineAll() {
        this.categories = {
            necessary: true,  // Toujours actif
            analytics: false,
            marketing: false
        };
        this.savePreferences();
        this.hideBanner();
        console.log('❌ Cookies non-essentiels refusés');
    }

    saveCustomPreferences() {
        // Récupérer les valeurs des toggles
        const analyticsToggle = document.getElementById('toggle-analytics');
        const marketingToggle = document.getElementById('toggle-marketing');

        if (analyticsToggle) {
            this.categories.analytics = analyticsToggle.checked;
        }
        if (marketingToggle) {
            this.categories.marketing = marketingToggle.checked;
        }

        this.savePreferences();
        this.hideModal();
        console.log('💾 Préférences personnalisées sauvegardées');
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    hideModal() {
        const modal = document.getElementById('cookie-customize-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    enableAnalytics() {
        window.analyticsEnabled = true;
        if (typeof window.initAnalytics === 'function') {
            window.initAnalytics();
        }
    }

    disableAnalytics() {
        window.analyticsEnabled = false;

        // Supprimer les cookies Google Analytics
        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
        this.deleteCookie('_ga_*');
    }

    deleteCookie(name) {
        // Supprimer pour le domaine actuel
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Supprimer pour tous les sous-domaines
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }

    // Méthode pour réinitialiser (exposée globalement)
    reset() {
        localStorage.removeItem(this.consentKey);
        this.categories = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        this.disableAnalytics();
        this.showBanner();
        console.log('🔄 Préférences cookies réinitialisées');
    }

    // Vérifier si analytics est autorisé
    isAnalyticsEnabled() {
        return this.categories.analytics === true;
    }
}

// Initialiser automatiquement
function initCookieConsent() {
    window.cookieConsent = new CookieConsent();
    console.log('✅ Cookie Consent Manager initialisé');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    initCookieConsent();
}

// Fonctions globales
window.resetCookieConsent = function() {
    if (window.cookieConsent) {
        window.cookieConsent.reset();
    }
};

window.showCookieSettings = function() {
    if (window.cookieConsent) {
        window.cookieConsent.showCustomizeModal();
    }
};
