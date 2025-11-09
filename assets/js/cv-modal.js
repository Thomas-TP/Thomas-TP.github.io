/**
 * Gestionnaire du modal de prévisualisation du CV
 * Permet d'afficher le PDF du CV dans un modal avec options de téléchargement et impression
 */

(function() {
    'use strict';

    const CV_PATH = 'assets/cv/ThomasPrudhommeCV.pdf';

    let modal = null;
    let modalOverlay = null;
    let modalContent = null;
    let cvViewer = null;
    let loadingIndicator = null;
    let closeBtn = null;
    let downloadBtn = null;
    let printBtn = null;
    let cvLinks = [];

    /**
     * Initialise le modal et les event listeners
     */
    function init() {
        // Récupérer les éléments du DOM
        modal = document.getElementById('cvModal');
        modalOverlay = modal?.querySelector('.cv-modal-overlay');
        modalContent = modal?.querySelector('.cv-modal-content');
        cvViewer = document.getElementById('cvViewer');
        loadingIndicator = modal?.querySelector('.cv-loading');
        closeBtn = document.getElementById('closeCvModal');
        downloadBtn = document.getElementById('downloadCvBtn');
        printBtn = document.getElementById('printCvBtn');

        if (!modal || !cvViewer) {
            console.warn('[CV Modal] Éléments du modal non trouvés');
            return;
        }

        // Récupérer tous les liens de CV
        cvLinks = document.querySelectorAll('a[href*="cv/"][href*=".pdf"]');

        // Attacher les event listeners
        attachEventListeners();

        console.log('[CV Modal] Initialisé avec succès');
    }

    /**
     * Attache tous les event listeners
     */
    function attachEventListeners() {
        // Empêcher le téléchargement direct et ouvrir le modal à la place
        cvLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });
        });

        // Fermeture du modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Empêcher la fermeture en cliquant sur le contenu
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Téléchargement
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadCV);
        }

        // Impression
        if (printBtn) {
            printBtn.addEventListener('click', printCV);
        }

        // Fermeture avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeModal();
            }
        });

        // Listener pour le chargement de l'iframe
        if (cvViewer) {
            cvViewer.addEventListener('load', function() {
                hideLoading();
            });

            cvViewer.addEventListener('error', function() {
                hideLoading();
                showError();
            });
        }
    }

    /**
     * Ouvre le modal et charge le PDF
     */
    function openModal() {
        if (!modal || !cvViewer) return;

        console.log('[CV Modal] Ouverture du modal');

        // Afficher le modal
        modal.style.display = 'block';
        document.body.classList.add('cv-modal-open');

        // Afficher l'indicateur de chargement
        showLoading();

        // Charger le PDF dans l'iframe
        // Ajouter #toolbar=0 pour masquer la barre d'outils par défaut du PDF (si supporté)
        cvViewer.src = CV_PATH + '#toolbar=0&navpanes=0&scrollbar=0';

        // Track l'événement d'ouverture (si analytics configuré)
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('cv_modal_opened', {
                action: 'open',
                category: 'CV',
            });
        }

        // Timeout de sécurité si le PDF ne charge pas
        setTimeout(function() {
            if (loadingIndicator && !loadingIndicator.classList.contains('hidden')) {
                hideLoading();
            }
        }, 5000);
    }

    /**
     * Ferme le modal avec animation
     */
    function closeModal() {
        if (!modal) return;

        console.log('[CV Modal] Fermeture du modal');

        // Ajouter la classe de fermeture pour l'animation
        modal.classList.add('closing');

        // Attendre la fin de l'animation avant de masquer
        setTimeout(function() {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.classList.remove('cv-modal-open');

            // Vider l'iframe pour économiser la mémoire
            if (cvViewer) {
                cvViewer.src = '';
            }

            // Réinitialiser l'état de chargement
            showLoading();
        }, 200);

        // Track l'événement de fermeture (si analytics configuré)
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('cv_modal_closed', {
                action: 'close',
                category: 'CV',
            });
        }
    }

    /**
     * Télécharge le CV
     */
    function downloadCV() {
        console.log('[CV Modal] Téléchargement du CV');

        // Créer un lien temporaire pour forcer le téléchargement
        const link = document.createElement('a');
        link.href = CV_PATH;
        link.download = 'ThomasPrudhommeCV.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Track l'événement de téléchargement (si analytics configuré)
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('cv_downloaded', {
                action: 'download',
                category: 'CV',
                file_name: 'ThomasPrudhommeCV.pdf',
                file_type: 'pdf',
            });
        }

        // Feedback visuel
        const originalText = downloadBtn.querySelector('span').textContent;
        downloadBtn.querySelector('span').textContent = '✓ Téléchargé';
        downloadBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        setTimeout(function() {
            downloadBtn.querySelector('span').textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);
    }

    /**
     * Imprime le CV
     */
    function printCV() {
        console.log('[CV Modal] Impression du CV');

        // Méthode 1: Tenter d'imprimer via l'iframe
        try {
            if (cvViewer && cvViewer.contentWindow) {
                cvViewer.contentWindow.focus();
                cvViewer.contentWindow.print();
            }
        } catch (e) {
            console.warn('[CV Modal] Impossible d\'imprimer via iframe:', e);

            // Méthode 2: Ouvrir dans un nouvel onglet et imprimer
            const printWindow = window.open(CV_PATH, '_blank');
            if (printWindow) {
                printWindow.addEventListener('load', function() {
                    printWindow.print();
                });
            } else {
                console.error('[CV Modal] Impossible d\'ouvrir la fenêtre d\'impression');
            }
        }

        // Track l'événement d'impression (si analytics configuré)
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('cv_printed', {
                action: 'print',
                category: 'CV',
            });
        }

        // Feedback visuel
        const originalText = printBtn.querySelector('span').textContent;
        printBtn.querySelector('span').textContent = '✓ Envoyé';

        setTimeout(function() {
            printBtn.querySelector('span').textContent = originalText;
        }, 2000);
    }

    /**
     * Affiche l'indicateur de chargement
     */
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
    }

    /**
     * Masque l'indicateur de chargement
     */
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }

    /**
     * Affiche un message d'erreur
     */
    function showError() {
        if (loadingIndicator) {
            const errorMsg = loadingIndicator.querySelector('p');
            if (errorMsg) {
                errorMsg.textContent = '❌ Erreur lors du chargement du CV';
                errorMsg.style.color = '#ef4444';
            }
        }
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposer les fonctions publiques globalement si nécessaire
    window.cvModal = {
        open: openModal,
        close: closeModal,
        download: downloadCV,
        print: printCV
    };

})();
