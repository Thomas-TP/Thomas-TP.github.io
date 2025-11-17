// Gestionnaire de certifications avec Supabase
class CertificationsManager {
    constructor() {
        this.certifications = [];
        this.container = document.getElementById('certificationsContainer');
        this.adminBtn = document.getElementById('adminCertBtn');
        this.init();
    }

    async init() {
        await this.loadCertifications();
        this.setupAdminPanel();
        
        // Mettre à jour l'affichage du bouton admin
        if (adminAuth) {
            adminAuth.updateUIState();
        }

        // Écouter les changements de langue
        window.addEventListener('languageChanged', () => {
            this.refreshDisplay();
        });
    }

    refreshDisplay() {
        // Recharger les certifications pour mettre à jour les textes avec la nouvelle langue
        this.loadCertifications();
    }

    async loadCertifications() {
        try {
            console.log('🔍 Début chargement des certifications...');
            this.certifications = await supabase.getCertifications();
            console.log('✅ Certifications reçues:', this.certifications);
            console.log('📊 Nombre:', this.certifications ? this.certifications.length : 0);
            this.displayCertifications();
        } catch (error) {
            console.error('❌ Erreur chargement certifications:', error);
            this.displayError('Impossible de charger les certifications: ' + error.message);
        }
    }

    displayError(message) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <p class="text-red-500 text-lg">${message}</p>
            </div>
        `;
    }

    displayCertifications() {
        if (!this.container) return;
        
        this.container.innerHTML = '';

        if (this.certifications.length === 0) {
            this.container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-certificate text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg">${languageManager.getText('certifications.noCertifications')}</p>
                    <p class="text-gray-400 text-sm mt-2">${languageManager.getText('certifications.addFirst')}</p>
                </div>
            `;
            return;
        }

        this.certifications.forEach((cert, index) => {
            const card = this.createCertificationCard(cert, index);
            this.container.appendChild(card);
        });
    }

    createCertificationCard(cert, index) {
        const card = document.createElement('div');
        card.className = 'card bg-white rounded-xl overflow-hidden shadow-md card-hover section-reveal';
        card.dataset.certId = cert.id;
        
        // Fond sobre selon le thème
        const background = 'bg-white dark:bg-gray-800';

        // Image ou gradient
        let headerContent = '';
        if (cert.image_url) {
            headerContent = `<img src="${cert.image_url}" alt="${cert.name}" class="w-full h-full object-contain object-center" width="128" height="128" loading="lazy" style="max-width: 100%; max-height: 100%;">`;
        } else {
            headerContent = `
                <div class="text-center p-4">
                    <i class="fas fa-certificate text-4xl text-gray-600 dark:text-gray-300"></i>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="h-32 ${background} flex items-center justify-center overflow-hidden">
                ${headerContent}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${this.escapeHtml(cert.name)}</h3>
                <p class="text-gray-600 text-sm mb-2">${languageManager.getText('certifications.issuedBy')} ${this.escapeHtml(cert.issuer)}</p>
                ${cert.issue_date ? `<p class="text-gray-500 text-sm">${this.formatDate(cert.issue_date)}${cert.expiry_date ? ' - ' + this.formatDate(cert.expiry_date) : ''}</p>` : ''}
                ${cert.credential_id ? `<p class="text-gray-500 text-sm mt-2">ID: ${this.escapeHtml(cert.credential_id)}</p>` : ''}
                ${cert.credential_url ? `
                    <a href="${cert.credential_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary hover:text-primary-dark mt-3 text-sm">
                        <span>${languageManager.getText('certifications.viewDiploma')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                    </a>
                ` : ''}
                ${cert.pdf_url ? `
                    <a href="${cert.pdf_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-red-600 hover:text-red-700 mt-2 text-sm ml-4">
                        <i class="fas fa-file-pdf mr-1"></i>
                        <span>${languageManager.getText('certifications.pdf')}</span>
                    </a>
                ` : ''}
            </div>
        `;

        return card;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const locale = languageManager.getCurrentLanguage() === 'en' ? 'en-US' : 'fr-FR';
        return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupAdminPanel() {
        if (!this.adminBtn) return;

        this.adminBtn.addEventListener('click', () => {
            if (!supabase.isAdmin()) {
                adminAuth.showNotification('Vous devez être connecté en tant qu\'admin', 'error');
                adminAuth.openLoginModal();
                return;
            }
            this.openAdminModal();
        });
    }

    openAdminModal() {
        const modal = document.createElement('div');
        modal.id = 'certAdminModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-800">${languageManager.getText('certifications.manage')}</h3>
                    <button id="closeAdminModal" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-6">
                    <button id="addNewCert" class="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors mb-6">
                        <i class="fas fa-plus mr-2"></i>${languageManager.getText('certifications.addNew')}
                    </button>
                    
                    <div id="certificationsList" class="space-y-4">
                        ${this.renderCertificationsList()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeAdminModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.getElementById('addNewCert').addEventListener('click', () => {
            this.openCertificationForm();
        });

        // Delete buttons
        document.querySelectorAll('.deleteCertBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const certId = e.currentTarget.dataset.certId;
                this.deleteCertification(certId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.editCertBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const certId = e.currentTarget.dataset.certId;
                const cert = this.certifications.find(c => c.id === certId);
                this.openCertificationForm(cert);
            });
        });
    }

    renderCertificationsList() {
        if (this.certifications.length === 0) {
            return `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-certificate text-6xl text-gray-300 mb-4"></i>
                    <p>${languageManager.getText('certifications.noCertifications')}</p>
                </div>
            `;
        }

        return this.certifications.map((cert, index) => `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" data-cert-id="${cert.id}">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-start gap-4 flex-1">
                        ${cert.image_url ? `
                            <img src="${cert.image_url}" alt="${cert.name}" class="w-16 h-16 rounded object-cover flex-shrink-0">
                        ` : `
                            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded flex items-center justify-center text-white flex-shrink-0">
                                <i class="fas fa-certificate text-2xl"></i>
                            </div>
                        `}
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-800 text-lg">${this.escapeHtml(cert.name)}</h4>
                            <p class="text-gray-600 text-sm">${this.escapeHtml(cert.issuer)}</p>
                            ${cert.issue_date ? `<p class="text-gray-500 text-xs mt-1">${this.formatDate(cert.issue_date)}${cert.expiry_date ? ' - ' + this.formatDate(cert.expiry_date) : ''}</p>` : ''}
                            ${cert.credential_id ? `<p class="text-gray-500 text-xs">ID: ${this.escapeHtml(cert.credential_id)}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex gap-2 flex-shrink-0">
                        <button class="editCertBtn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" data-cert-id="${cert.id}">
                            <i class="fas fa-edit mr-1"></i>${languageManager.getText('certifications.edit')}
                        </button>
                        <button class="deleteCertBtn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" data-cert-id="${cert.id}">
                            <i class="fas fa-trash mr-1"></i>${languageManager.getText('certifications.delete')}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openCertificationForm(cert = null, index = null) {
        const isEdit = cert !== null;
        const formModal = document.createElement('div');
        formModal.id = 'certFormModal';
        formModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4';
        
        formModal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">${isEdit ? languageManager.getText('certifications.edit') + ' ' + languageManager.getText('certifications.name').toLowerCase() : languageManager.getText('certifications.addNew')}</h3>
                    <button id="closeFormModal" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="certificationForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.name')} *</label>
                        <input type="text" name="name" required value="${isEdit ? this.escapeHtml(cert.name) : ''}" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.issuer')} *</label>
                        <input type="text" name="issuer" required value="${isEdit ? this.escapeHtml(cert.issuer) : ''}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.issueDate')}</label>
                            <input type="date" name="issue_date" value="${isEdit && cert.issue_date ? cert.issue_date : ''}"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.expiryDate')}</label>
                            <input type="date" name="expiry_date" value="${isEdit && cert.expiry_date ? cert.expiry_date : ''}"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.credentialId')}</label>
                        <input type="text" name="credential_id" value="${isEdit && cert.credential_id ? this.escapeHtml(cert.credential_id) : ''}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${languageManager.getText('certifications.credentialUrl')}</label>
                        <input type="url" name="credential_url" value="${isEdit && cert.credential_url ? cert.credential_url : ''}"
                               placeholder="https://..."
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">${languageManager.getText('certifications.image')}</label>
                        <div class="space-y-2">
                            ${isEdit && cert.image_url ? `
                                <div class="mb-2">
                                    <img src="${cert.image_url}" alt="Preview" class="w-32 h-32 object-cover rounded border border-gray-300">
                                </div>
                            ` : ''}
                            <input type="file" id="imageFile" accept="image/*"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <div id="imagePreview" class="mt-2"></div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">${languageManager.getText('certifications.pdfFile')}</label>
                        <div class="space-y-2">
                            ${isEdit && cert.pdf_url ? `
                                <div class="mb-2">
                                    <a href="${cert.pdf_url}" target="_blank" class="text-primary hover:underline flex items-center">
                                        <i class="fas fa-file-pdf mr-2"></i>${languageManager.getText('certifications.currentPdf')}
                                    </a>
                                </div>
                            ` : ''}
                            <input type="file" id="pdfFile" accept=".pdf,application/pdf"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <div id="pdfPreview" class="mt-2"></div>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 pt-4 border-t border-gray-200">
                        <button type="submit" class="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                            <i class="fas fa-save mr-2"></i>${isEdit ? languageManager.getText('certifications.update') : languageManager.getText('certifications.add')}
                        </button>
                        <button type="button" id="cancelForm" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                            ${languageManager.getText('certifications.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(formModal);

        // File previews
        const imageInput = document.getElementById('imageFile');
        const imagePreview = document.getElementById('imagePreview');
        const pdfInput = document.getElementById('pdfFile');
        const pdfPreview = document.getElementById('pdfPreview');

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded border border-gray-300">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });

        pdfInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                pdfPreview.innerHTML = `
                    <div class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                        ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                    </div>
                `;
            }
        });

        // Form submission
        const form = document.getElementById('certificationForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Afficher un indicateur de chargement
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>' + languageManager.getText('certifications.saving');
            
            try {
                const formData = new FormData(form);
                const certification = {
                    name: formData.get('name'),
                    issuer: formData.get('issuer'),
                    issue_date: formData.get('issue_date') || null,
                    expiry_date: formData.get('expiry_date') || null,
                    credential_id: formData.get('credential_id') || null,
                    credential_url: formData.get('credential_url') || null,
                    image_url: null,
                    pdf_url: null
                };

                // Upload image si sélectionnée
                const imageFile = imageInput.files[0];
                if (imageFile) {
                    const imagePath = `images/${Date.now()}_${imageFile.name}`;
                    certification.image_url = await supabase.uploadFile(imageFile, imagePath);
                } else if (isEdit && cert.image_url) {
                    certification.image_url = cert.image_url;
                }

                // Upload PDF si sélectionné
                const pdfFile = pdfInput.files[0];
                if (pdfFile) {
                    const pdfPath = `pdfs/${Date.now()}_${pdfFile.name}`;
                    certification.pdf_url = await supabase.uploadFile(pdfFile, pdfPath);
                } else if (isEdit && cert.pdf_url) {
                    certification.pdf_url = cert.pdf_url;
                }

                // Créer ou mettre à jour la certification
                if (isEdit) {
                    await supabase.updateCertification(cert.id, certification);
                    adminAuth.showNotification(languageManager.getText('certifications.updateSuccess'), 'success');
                } else {
                    await supabase.createCertification(certification);
                    adminAuth.showNotification(languageManager.getText('certifications.addSuccess'), 'success');
                }

                // Recharger les certifications
                await this.loadCertifications();
                
                document.body.removeChild(formModal);
                
                // Refresh admin modal if it exists
                const adminModal = document.getElementById('certAdminModal');
                if (adminModal) {
                    const list = document.getElementById('certificationsList');
                    if (list) {
                        list.innerHTML = this.renderCertificationsList();
                        
                        // Re-attach event listeners
                        document.querySelectorAll('.deleteCertBtn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const certId = e.currentTarget.dataset.certId;
                                this.deleteCertification(certId);
                            });
                        });

                        document.querySelectorAll('.editCertBtn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const certId = e.currentTarget.dataset.certId;
                                const c = this.certifications.find(cert => cert.id === certId);
                                this.openCertificationForm(c);
                            });
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement:', error);
                adminAuth.showNotification(error.message || languageManager.getText('certifications.saveError'), 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Close buttons
        document.getElementById('closeFormModal').addEventListener('click', () => {
            document.body.removeChild(formModal);
        });

        document.getElementById('cancelForm').addEventListener('click', () => {
            document.body.removeChild(formModal);
        });

        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) {
                document.body.removeChild(formModal);
            }
        });
    }

    async deleteCertification(certId) {
        if (confirm(languageManager.getText('certifications.confirmDelete'))) {
            try {
                await supabase.deleteCertification(certId);
                adminAuth.showNotification(languageManager.getText('certifications.deleteSuccess'), 'success');
                
                // Recharger les certifications
                await this.loadCertifications();
                
                // Refresh admin modal
                const list = document.getElementById('certificationsList');
                if (list) {
                    list.innerHTML = this.renderCertificationsList();
                    
                    // Re-attach event listeners
                    document.querySelectorAll('.deleteCertBtn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.currentTarget.dataset.certId;
                            this.deleteCertification(id);
                        });
                    });

                    document.querySelectorAll('.editCertBtn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = e.currentTarget.dataset.certId;
                            const cert = this.certifications.find(c => c.id === id);
                            this.openCertificationForm(cert);
                        });
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                adminAuth.showNotification(error.message || languageManager.getText('certifications.deleteError'), 'error');
            }
        }
    }
}

// Initialiser le gestionnaire au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.certificationsManager = new CertificationsManager();
});
