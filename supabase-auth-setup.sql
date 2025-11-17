-- Configuration de l'authentification admin pour Supabase
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- 1. Créer un utilisateur admin
-- Remplacez 'your-admin-email@example.com' et 'your-secure-password' par vos identifiants
-- Cette commande doit être exécutée via le dashboard Supabase > Authentication > Users > Invite user
-- OU en créant un compte via l'interface Auth de Supabase

-- 2. Mettre à jour les politiques RLS pour la table certifications
DROP POLICY IF EXISTS "Service role full access" ON certifications;
DROP POLICY IF EXISTS "Public read access" ON certifications;
DROP POLICY IF EXISTS "Authenticated users write access" ON certifications;
DROP POLICY IF EXISTS "Authenticated users update access" ON certifications;
DROP POLICY IF EXISTS "Authenticated users delete access" ON certifications;
DROP POLICY IF EXISTS "Authenticated users full access" ON certifications;

-- IMPORTANT: Politique pour la lecture publique (tout le monde peut voir les certifications)
CREATE POLICY "Public read access" ON certifications
    FOR SELECT
    USING (true);

-- Politique pour permettre les opérations d'écriture uniquement aux utilisateurs authentifiés
CREATE POLICY "Authenticated users write access" ON certifications
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users update access" ON certifications
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users delete access" ON certifications
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- 3. Pour le storage, supprimer TOUTES les anciennes politiques
DROP POLICY IF EXISTS "Service role upload access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Service role delete access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access on certifications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access on certifications bucket" ON storage.objects;

-- IMPORTANT: Lecture publique pour le storage (voir les images)
CREATE POLICY "Public read access on certifications bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications');

-- Upload pour les utilisateurs authentifiés
CREATE POLICY "Authenticated upload access on certifications bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- Suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated delete access on certifications bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- Mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated update access on certifications bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certifications' AND auth.uid() IS NOT NULL);

-- IMPORTANT: Après avoir exécuté ce script, créez un utilisateur admin via:
-- Dashboard Supabase > Authentication > Users > Add user
-- Email: votre-email@example.com
-- Password: votre-mot-de-passe-sécurisé
-- Auto-confirm: OUI
