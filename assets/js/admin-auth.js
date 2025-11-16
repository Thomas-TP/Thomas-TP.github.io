// Système d'authentification admin
class AdminAuth {
    constructor() {
        this.SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteGFkenRleGhyeHVycmJ0aWtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI3NjMxMywiZXhwIjoyMDc4ODUyMzEzfQ.TJ4mUqPZ4ha-gJctNhJzpgdKwYUKMpi_ygk5RSVG47o';
        this.init();
    }

    init() {
        // Vérifier si déjà connecté
        this.updateUIState();
        
        // Écouter les changements de session
        window.addEventListener('storage', (e) => {
            if (e.key === 'supabase_admin_key') {
                this.updateUIState();
            }
        });
    }

    // Vérifier si l'utilisateur est admin
    isAdmin() {
        return supabase.isAdmin();
    }

    // Ouvrir le modal de connexion admin
    openLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'adminLoginModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-shield-alt text-primary mr-2"></i>Connexion Admin
                    </h3>
                    <button id="closeLoginModal" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="adminLoginForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-key mr-2"></i>Clé d'administration
                        </label>
                        <input 
                            type="password" 
                            id="adminKey" 
                            required 
                            placeholder="Entrez la clé service_role"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                    </div>
                    
                    <div id="loginError" class="hidden text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span id="loginErrorMessage"></span>
                    </div>
                    
                    <button 
                        type="submit" 
                        class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                        <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
                    </button>
                </form>
                
                <div class="mt-6 text-center text-sm text-gray-500">
                    <i class="fas fa-info-circle mr-1"></i>
                    Accès réservé aux administrateurs
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const form = document.getElementById('adminLoginForm');
        const closeBtn = document.getElementById('closeLoginModal');
        const errorDiv = document.getElementById('loginError');
        const errorMsg = document.getElementById('loginErrorMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const key = document.getElementById('adminKey').value.trim();
            
            errorDiv.classList.add('hidden');
            
            try {
                await this.login(key);
                document.body.removeChild(modal);
                
                // Afficher un message de succès
                this.showNotification('Connexion réussie !', 'success');
                
                // Recharger les certifications si le manager existe
                if (window.certificationsManager) {
                    await window.certificationsManager.loadCertifications();
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Focus sur le champ de saisie
        setTimeout(() => {
            document.getElementById('adminKey').focus();
        }, 100);
    }

    // Connexion admin
    async login(key) {
        // Vérifier que la clé ressemble à un JWT
        if (!key || !key.startsWith('eyJ')) {
            throw new Error('Clé invalide');
        }

        // Vérifier la clé en tentant une opération de lecture
        try {
            const testHeaders = {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${supabase.url}/rest/v1/certifications?limit=1`, {
                method: 'GET',
                headers: testHeaders
            });

            if (!response.ok) {
                throw new Error('Clé d\'administration invalide');
            }

            // La clé est valide, la sauvegarder
            supabase.setAdminKey(key);
            this.updateUIState();
            
            return true;
        } catch (error) {
            throw new Error('Clé d\'administration invalide');
        }
    }

    // Déconnexion admin
    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            supabase.clearAdminKey();
            this.updateUIState();
            this.showNotification('Déconnexion réussie', 'info');
            
            // Fermer le modal d'administration si ouvert
            const adminModal = document.getElementById('certAdminModal');
            if (adminModal) {
                adminModal.remove();
            }
        }
    }

    // Mettre à jour l'interface selon l'état de connexion
    updateUIState() {
        const adminLinks = document.querySelectorAll('.admin-login-link');
        const adminBtn = document.getElementById('adminCertBtn');
        
        adminLinks.forEach(link => {
            if (this.isAdmin()) {
                link.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i>Admin: Déconnexion';
                link.classList.add('text-green-600', 'hover:text-green-700');
                link.classList.remove('text-gray-400');
            } else {
                link.innerHTML = '<i class="fas fa-shield-alt mr-1"></i>Admin';
                link.classList.remove('text-green-600', 'hover:text-green-700');
                link.classList.add('text-gray-400');
            }
        });

        // Cacher/Afficher le bouton de gestion
        if (adminBtn) {
            if (this.isAdmin()) {
                adminBtn.classList.remove('hidden');
            } else {
                adminBtn.classList.add('hidden');
            }
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-slideDown`;
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Instance globale de l'authentification admin
const adminAuth = new AdminAuth();

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les event listeners aux liens admin
    document.querySelectorAll('.admin-login-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (adminAuth.isAdmin()) {
                adminAuth.logout();
            } else {
                adminAuth.openLoginModal();
            }
        });
    });
});
