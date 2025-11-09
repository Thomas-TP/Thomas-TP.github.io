# 📁 Structure du Projet

Ce document décrit l'organisation des fichiers et dossiers du portfolio Thomas Prudhomme.

## 🎯 Philosophie d'Organisation

Le projet suit une structure moderne et maintenable :

- **📚 Documentation centralisée** : Tous les guides dans `/docs`
- **🎨 Assets organisés** : CSS, JS, images groupés logiquement dans `/assets`
- **🔧 Configuration à la racine** : Fichiers de build et config au root
- **📦 Fichiers statiques** : Ressources de déploiement dans `/public`

## 📂 Structure Complète

```
Thomas-TP.github.io/
│
├── 📁 .github/                    # GitHub configuration
│   └── workflows/                 # CI/CD (futur)
│
├── 📁 docs/                       # 📚 DOCUMENTATION
│   ├── BUILD.md                   # Guide de build avec Vite
│   ├── GOOGLE_ANALYTICS_SETUP.md  # Configuration Google Analytics
│   ├── PERFORMANCE.md             # Optimisations de performance
│   └── STRUCTURE.md               # Ce fichier
│
├── 📁 assets/                     # 🎨 RESSOURCES SOURCE
│   │
│   ├── 📁 css/                    # Feuilles de style
│   │   ├── animations.css         # Animations CSS3
│   │   ├── dark-theme.css         # Thème sombre
│   │   ├── modern-effects.css     # Effets modernes
│   │   ├── premium-effects.css    # Effets premium
│   │   ├── privacy-banner.css     # Bannière cookies
│   │   └── styles.css             # Styles principaux
│   │
│   ├── 📁 js/                     # Scripts JavaScript
│   │   ├── hero-animation.js      # Animation hero section
│   │   ├── insights.js            # Analytics insights
│   │   ├── language-manager.js    # Gestionnaire multilingue
│   │   ├── performance-monitor.js # Monitoring performance
│   │   ├── privacy-manager.js     # Gestion cookies RGPD
│   │   ├── security-monitor.js    # Monitoring sécurité
│   │   ├── svg-sprite-manager.js  # Gestion sprites SVG
│   │   ├── theme-manager.js       # Gestion thème clair/sombre
│   │   └── webp-fallbacks.js      # Fallback images WebP
│   │
│   ├── 📁 images/                 # Images et médias
│   │   ├── 📁 certifications/     # Badges de certification
│   │   │   ├── english.png/webp
│   │   │   ├── github.jpg/webp
│   │   │   ├── iot.png/webp
│   │   │   ├── linux.png/webp
│   │   │   └── machine.jpg/webp
│   │   │
│   │   ├── 📁 favicon/            # Icônes du site
│   │   │   └── favicon.png/webp
│   │   │
│   │   ├── 📁 logos/              # Logos entreprises/formations
│   │   │   ├── EPFL.png/webp
│   │   │   ├── futurplus.png/webp
│   │   │   ├── git.png/webp
│   │   │   └── grandchamp.png/webp
│   │   │
│   │   ├── 📁 projects/           # Images projets
│   │   │   ├── empire.svg
│   │   │   ├── tank.png/webp
│   │   │   ├── website.png/webp
│   │   │   └── x.gif
│   │   │
│   │   ├── apercu.png/webp        # Aperçu du site
│   │   ├── background.jpg/webp    # Fond d'écran
│   │   └── profile.jpg/webp       # Photo de profil
│   │
│   ├── 📁 icons/                  # Icônes et sprites
│   │   └── sprite.svg             # Sprite SVG d'icônes
│   │
│   └── 📁 cv/                     # Documents CV
│       └── ThomasPrudhommeCV.pdf  # CV au format PDF
│
├── 📁 public/                     # 📦 FICHIERS STATIQUES
│   ├── .htaccess                  # Config Apache (GitHub Pages)
│   ├── 404.html                   # Page d'erreur 404
│   ├── _headers                   # Headers HTTP (Netlify/Vercel)
│   ├── _redirects                 # Redirections
│   ├── manifest.json              # Manifest PWA
│   ├── robots.txt                 # SEO - Crawlers
│   └── sitemap.xml                # SEO - Sitemap
│
├── 📄 index.html                  # 🏠 PAGE PRINCIPALE
├── 📄 sw.js                       # ⚡ SERVICE WORKER (PWA)
│
├── 📄 package.json                # 📦 CONFIG NPM
├── 📄 package-lock.json           # 🔒 Lock des dépendances
├── 📄 vite.config.js              # ⚙️ CONFIG VITE BUILD
├── 📄 tailwind.config.js          # 🎨 CONFIG TAILWIND CSS
│
├── 📄 .gitignore                  # 🚫 Fichiers Git ignorés
├── 📄 CNAME                       # 🌐 Domaine personnalisé (thomastp.me)
└── 📄 README.md                   # 📖 Documentation principale
```

## 🔍 Description des Dossiers

### 📚 `/docs` - Documentation

Contient toute la documentation technique du projet :

- **BUILD.md** : Guide complet pour le système de build avec Vite
- **GOOGLE_ANALYTICS_SETUP.md** : Configuration de Google Tag Manager et Analytics
- **PERFORMANCE.md** : Détails des optimisations de performance
- **STRUCTURE.md** : Structure du projet (ce fichier)

### 🎨 `/assets` - Ressources Source

Ressources source qui seront buildées et optimisées par Vite :

- **`/css`** : Feuilles de style modulaires
- **`/js`** : Scripts JavaScript non-module
- **`/images`** : Images sources (PNG, JPG, WebP, SVG)
- **`/icons`** : Sprites SVG et icônes
- **`/cv`** : Documents téléchargeables

### 📦 `/public` - Fichiers Statiques

Fichiers copiés tels quels dans le dossier de build :

- Configuration serveur (`.htaccess`, `_headers`)
- Pages spéciales (`404.html`)
- Fichiers SEO (`robots.txt`, `sitemap.xml`)
- Configuration PWA (`manifest.json`)

### 📁 `/dist` - Build Output (non versionné)

**Note** : Ce dossier est généré automatiquement par `npm run build` et n'est **pas** versionné dans Git.

Contient la version optimisée et prête pour la production :
- HTML minifié
- CSS bundlé et minifié avec hash
- JS minifié avec hash
- Images optimisées (compression, WebP)
- Fichiers compressés (.gz, .br)

## 🚀 Workflow de Développement

### En développement

```bash
npm run dev
# Vite sert les fichiers depuis la racine
# Les assets sont accessibles via /assets/*
```

### En production

```bash
npm run build
# Génère /dist avec :
# - Assets optimisés dans /dist/assets/
# - Fichiers publics copiés à la racine de /dist
# - Fichiers avec hash pour cache busting
```

## 📋 Règles d'Organisation

### ✅ À FAIRE

- Placer les **docs** dans `/docs`
- Placer les **CSS sources** dans `/assets/css`
- Placer les **JS sources** dans `/assets/js`
- Placer les **images** dans `/assets/images` avec sous-dossiers par catégorie
- Utiliser **WebP avec fallback PNG/JPG** pour les images
- Garder les **config files** (package.json, vite.config.js, etc.) à la racine

### ❌ À ÉVITER

- ❌ **PAS de fichiers `.min.css` ou `.min.js`** dans `/assets` (Vite s'en charge)
- ❌ **PAS de duplication** d'images (garder source + WebP seulement)
- ❌ **PAS de build artifacts** versionnés (dist/, *.gz, *.br)
- ❌ **PAS de dossiers inutiles** (scripts/ supprimé)

## 🔄 Migration et Changements

### Changements Récents

**Février 2025** : Réorganisation majeure

1. ✅ Création du dossier `/docs`
2. ✅ Déplacement de BUILD.md, GOOGLE_ANALYTICS_SETUP.md, PERFORMANCE.md vers `/docs`
3. ✅ Suppression des anciens fichiers `.min.*` (Vite gère maintenant la minification)
4. ✅ Suppression du dossier `/scripts` (inutilisé)
5. ✅ Ajout de `.gitignore` pour `*.min.*`, `*.gz`, `*.br`
6. ✅ Création de `docs/STRUCTURE.md` (ce fichier)

### Impact sur les Liens

Les références internes entre docs sont préservées car elles utilisent des chemins relatifs :
- `./PERFORMANCE.md` dans BUILD.md fonctionne toujours

## 📊 Statistiques du Projet

```
Total Source Files:
- HTML: 1 fichier (index.html)
- CSS: 6 fichiers modulaires
- JS: 9 fichiers modulaires
- Images: ~30 fichiers (PNG, JPG, WebP, SVG, GIF)
- Docs: 4 fichiers Markdown
```

## 🔗 Ressources Utiles

- [Guide de Build](./BUILD.md) - Comment builder et déployer
- [Performance](./PERFORMANCE.md) - Optimisations détaillées
- [Google Analytics](./GOOGLE_ANALYTICS_SETUP.md) - Configuration analytics
- [README](../README.md) - Documentation principale du projet

---

**Dernière mise à jour** : Février 2025
**Mainteneur** : Thomas Prudhomme
