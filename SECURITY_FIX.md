# ⚠️ CORRECTIF DE SÉCURITÉ APPLIQUÉ

## Problème identifié

La clé `service_role` de Supabase était **exposée publiquement** dans le code côté client (`assets/js/admin-auth.js`), ce qui représente une **faille de sécurité critique**.

## Solution implémentée

### ✅ Remplacement par Supabase Auth

Le système utilise maintenant **Supabase Authentication** avec email/password :

1. **Authentification sécurisée** :
   - Connexion avec email + mot de passe
   - Token JWT généré par Supabase
   - Session stockée dans sessionStorage (temporaire)

2. **Pas de clé secrète exposée** :
   - Seule la clé `anon` publique est utilisée côté client
   - Les opérations sensibles nécessitent une authentification

3. **Politiques RLS (Row Level Security)** mises à jour :
   - Lecture publique des certifications
   - Écriture réservée aux utilisateurs authentifiés

## Configuration requise dans Supabase

### Étape 1 : Exécuter le script SQL

Dans votre dashboard Supabase :
1. Allez dans **SQL Editor**
2. Exécutez le contenu de `supabase-auth-setup.sql`

### Étape 2 : Créer un utilisateur admin

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user**
3. Remplissez :
   - **Email** : votre-email@example.com
   - **Password** : votre-mot-de-passe-sécurisé
   - **Auto Confirm User** : ✅ OUI
4. Cliquez sur **Create user**

### Étape 3 : Connexion sur le site

1. Allez dans le footer du site
2. Cliquez sur **"Admin"**
3. Entrez votre email et mot de passe
4. Vous pouvez maintenant gérer les certifications

## Corrections additionnelles

### Images de certification
- Ajout de `overflow-hidden` pour éviter que les images débordent
- Ajout de `object-center` pour centrer les images
- Ajout de `max-width: 100%; max-height: 100%;` pour contraindre les dimensions

## Sécurité

✅ Aucune clé secrète n'est exposée  
✅ Authentification standard via Supabase Auth  
✅ Tokens JWT avec expiration  
✅ Session temporaire (sessionStorage)  
✅ Politiques RLS strictes  

## ⚠️ IMPORTANT

Après ce déploiement :
1. Exécutez `supabase-auth-setup.sql` dans Supabase
2. Créez votre compte admin
3. L'ancienne clé `service_role` exposée doit être **régénérée** dans Supabase Dashboard > Settings > API pour invalider la clé compromise
