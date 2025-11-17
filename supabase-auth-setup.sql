-- Configuration de l'authentification admin pour Supabase
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- 1. Créer un utilisateur admin
-- Remplacez 'your-admin-email@example.com' et 'your-secure-password' par vos identifiants
-- Cette commande doit être exécutée via le dashboard Supabase > Authentication > Users > Invite user
-- OU en créant un compte via l'interface Auth de Supabase

-- 2. Mettre à jour les politiques RLS pour utiliser l'authentification
DROP POLICY IF EXISTS "Service role full access" ON certifications;

-- Politique pour permettre les opérations d'écriture uniquement aux utilisateurs authentifiés
CREATE POLICY "Authenticated users full access" ON certifications
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- 3. Pour le storage, mettre à jour les politiques
DROP POLICY IF EXISTS "Service role upload access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role delete access on certifications bucket" ON storage.objects;

-- Upload pour les utilisateurs authentifiés
CREATE POLICY "Authenticated upload access on certifications bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- Suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated delete access on certifications bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- 4. Mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated update access on certifications bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- IMPORTANT: Après avoir exécuté ce script, créez un utilisateur admin via:
-- Dashboard Supabase > Authentication > Users > Add user
-- Email: votre-email@example.com
-- Password: votre-mot-de-passe-sécurisé
-- Auto-confirm: OUI
