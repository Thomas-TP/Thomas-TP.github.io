// Configuration et client Supabase
const SUPABASE_URL = 'https://emxadztexhrxurrbtikl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteGFkenRleGhyeHVycmJ0aWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzYzMTMsImV4cCI6MjA3ODg1MjMxM30.miVuIGC1pnzMvkdA8SzoAMcuPKgfoCNCkUxcaa525T4';

class SupabaseClient {
    constructor() {
        this.url = SUPABASE_URL;
        this.anonKey = SUPABASE_ANON_KEY;
        this.session = null;
        this.loadSession();
    }

    // Charger la session depuis sessionStorage
    loadSession() {
        const stored = sessionStorage.getItem('supabase_session');
        if (stored) {
            this.session = JSON.parse(stored);
        }
    }

    // Définir la session après connexion
    setSession(session) {
        this.session = session;
        sessionStorage.setItem('supabase_session', JSON.stringify(session));
    }

    // Récupérer le token d'accès
    getAccessToken() {
        return this.session?.access_token;
    }

    // Vérifier si l'utilisateur est admin
    isAdmin() {
        return !!this.session && !!this.session.access_token;
    }

    // Connexion avec email/password
    async signIn(email, password) {
        try {
            const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'apikey': this.anonKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur de connexion');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    }

    // Déconnexion
    async signOut() {
        this.session = null;
        sessionStorage.removeItem('supabase_session');
    }

    // Récupérer les en-têtes appropriés
    getHeaders(useAuth = false) {
        const token = useAuth && this.getAccessToken() ? this.getAccessToken() : this.anonKey;
        return {
            'apikey': this.anonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    // GET - Récupérer toutes les certifications
    async getCertifications() {
        try {
            const response = await fetch(`${this.url}/rest/v1/certifications?order=created_at.desc`, {
                method: 'GET',
                headers: this.getHeaders(false)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des certifications:', error);
            throw error;
        }
    }

    // POST - Créer une certification (admin uniquement)
    async createCertification(certification) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé: connexion admin requise');
        }

        try {
            const response = await fetch(`${this.url}/rest/v1/certifications`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(certification)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la création de la certification:', error);
            throw error;
        }
    }

    // PATCH - Mettre à jour une certification (admin uniquement)
    async updateCertification(id, updates) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé: connexion admin requise');
        }

        try {
            const response = await fetch(`${this.url}/rest/v1/certifications?id=eq.${id}`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la certification:', error);
            throw error;
        }
    }

    // DELETE - Supprimer une certification (admin uniquement)
    async deleteCertification(id) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé: connexion admin requise');
        }

        try {
            const response = await fetch(`${this.url}/rest/v1/certifications?id=eq.${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(true)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la certification:', error);
            throw error;
        }
    }

    // Upload d'un fichier dans le storage Supabase (admin uniquement)
    async uploadFile(file, path) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé: connexion admin requise');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.url}/storage/v1/object/certifications/${path}`, {
                method: 'POST',
                headers: {
                    'apikey': this.anonKey,
                    'Authorization': `Bearer ${this.getAccessToken()}`
                },
                body: file
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            // Retourner l'URL publique du fichier
            return `${this.url}/storage/v1/object/public/certifications/${path}`;
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
            throw error;
        }
    }

    // Supprimer un fichier du storage (admin uniquement)
    async deleteFile(path) {
        if (!this.isAdmin()) {
            throw new Error('Accès refusé: connexion admin requise');
        }

        try {
            const response = await fetch(`${this.url}/storage/v1/object/certifications/${path}`, {
                method: 'DELETE',
                headers: {
                    'apikey': this.anonKey,
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            throw error;
        }
    }
}

// Instance globale du client Supabase
const supabase = new SupabaseClient();
