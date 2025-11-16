-- Script SQL pour créer la table certifications dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- Créer la table certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    image_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur created_at pour trier les certifications
CREATE INDEX IF NOT EXISTS idx_certifications_created_at ON certifications(created_at DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique (tout le monde peut voir les certifications)
CREATE POLICY "Public read access" ON certifications
    FOR SELECT
    USING (true);

-- Politique pour permettre les opérations d'écriture uniquement avec la clé service_role
-- (Les utilisateurs authentifiés via le service_role peuvent créer/modifier/supprimer)
CREATE POLICY "Service role full access" ON certifications
    FOR ALL
    USING (auth.role() = 'service_role');

-- Créer un bucket de stockage pour les images et PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- Politique de stockage : lecture publique
CREATE POLICY "Public read access on certifications bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications');

-- Politique de stockage : upload uniquement pour les admins (via service_role)
CREATE POLICY "Service role upload access on certifications bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certifications' AND auth.role() = 'service_role');

-- Politique de stockage : suppression uniquement pour les admins
CREATE POLICY "Service role delete access on certifications bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'certifications' AND auth.role() = 'service_role');

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_certifications_updated_at
    BEFORE UPDATE ON certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
