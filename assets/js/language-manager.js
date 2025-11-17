// Gestionnaire de langues
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = {
            fr: {
                // Certifications
                'certifications.loadError': 'Impossible de charger les certifications',
                'certifications.noCertifications': 'Aucune certification pour le moment.',
                'certifications.addFirst': 'Cliquez sur "Gérer les certifications" pour en ajouter.',
                'certifications.issuedBy': 'Délivré par',
                'certifications.viewDiploma': 'Voir le diplôme',
                'certifications.pdf': 'PDF',
                'certifications.manage': 'Gérer les certifications',
                'certifications.addNew': 'Ajouter une certification',
                'certifications.edit': 'Modifier',
                'certifications.delete': 'Supprimer',
                'certifications.name': 'Nom de la certification',
                'certifications.issuer': 'Organisme de délivrance',
                'certifications.issueDate': 'Date d\'émission',
                'certifications.expiryDate': 'Date d\'expiration',
                'certifications.credentialId': 'ID du diplôme',
                'certifications.credentialUrl': 'URL du diplôme',
                'certifications.image': 'Image d\'illustration',
                'certifications.pdfFile': 'PDF du diplôme',
                'certifications.update': 'Mettre à jour',
                'certifications.add': 'Ajouter',
                'certifications.cancel': 'Annuler',
                'certifications.save': 'Sauvegarder mes préférences',
                'certifications.acceptAll': 'Tout accepter',
                'certifications.confirmDelete': 'Êtes-vous sûr de vouloir supprimer cette certification ?',
                'certifications.updateSuccess': 'Certification mise à jour avec succès',
                'certifications.addSuccess': 'Certification ajoutée avec succès',
                'certifications.deleteSuccess': 'Certification supprimée avec succès',
                'certifications.saveError': 'Erreur lors de l\'enregistrement',
                'certifications.deleteError': 'Erreur lors de la suppression'
            },
            en: {
                // Certifications
                'certifications.loadError': 'Unable to load certifications',
                'certifications.noCertifications': 'No certifications available yet.',
                'certifications.addFirst': 'Click "Manage certifications" to add some.',
                'certifications.issuedBy': 'Issued by',
                'certifications.viewDiploma': 'View diploma',
                'certifications.pdf': 'PDF',
                'certifications.manage': 'Manage certifications',
                'certifications.addNew': 'Add certification',
                'certifications.edit': 'Edit',
                'certifications.delete': 'Delete',
                'certifications.name': 'Certification name',
                'certifications.issuer': 'Issuing organization',
                'certifications.issueDate': 'Issue date',
                'certifications.expiryDate': 'Expiry date',
                'certifications.credentialId': 'Credential ID',
                'certifications.credentialUrl': 'Credential URL',
                'certifications.image': 'Illustration image',
                'certifications.pdfFile': 'Diploma PDF',
                'certifications.update': 'Update',
                'certifications.add': 'Add',
                'certifications.cancel': 'Cancel',
                'certifications.save': 'Save my preferences',
                'certifications.acceptAll': 'Accept all',
                'certifications.confirmDelete': 'Are you sure you want to delete this certification?',
                'certifications.updateSuccess': 'Certification updated successfully',
                'certifications.addSuccess': 'Certification added successfully',
                'certifications.deleteSuccess': 'Certification deleted successfully',
                'certifications.saveError': 'Error during saving',
                'certifications.deleteError': 'Error during deletion'
            }
        };
        this.init();
    }

    init() {
        // Écouter les changements de langue
        window.addEventListener('languageChanged', (e) => {
            this.setLanguage(e.detail.language);
        });
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            // Notifier les autres composants
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    getText(key, fallback = '') {
        return this.translations[this.currentLang]?.[key] || this.translations.fr[key] || fallback;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    isEnglish() {
        return this.currentLang === 'en';
    }
}

// Instance globale
window.languageManager = new LanguageManager();