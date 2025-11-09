# Guide de Build - Portfolio Thomas P.

## Vue d'ensemble

Ce projet utilise **Vite** comme outil de build moderne pour optimiser les performances et automatiser la minification et le bundling.

> 📊 **Pour les détails complets des optimisations de performance, consultez [PERFORMANCE.md](./PERFORMANCE.md)**

## Structure du projet

```
Thomas-TP.github.io/
├── index.html              # Point d'entrée principal
├── assets/                 # Ressources sources
│   ├── css/               # Feuilles de style sources
│   ├── js/                # Scripts sources
│   ├── images/            # Images et médias
│   └── fonts/             # Polices (si applicable)
├── public/                # Fichiers statiques copiés tels quels
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.json
│   ├── _headers
│   ├── _redirects
│   ├── .htaccess
│   └── 404.html
├── sw.js                  # Service Worker (à la racine pour le scope)
├── vite.config.js         # Configuration Vite
├── package.json           # Dépendances et scripts
└── dist/                  # Sortie du build (généré)
```

## Installation

```bash
npm install
```

## Scripts disponibles

### Développement

```bash
npm run dev
# ou
npm start
```

Lance un serveur de développement Vite sur http://localhost:8000 avec:
- ✨ Hot Module Replacement (HMR)
- 🔄 Rechargement automatique
- ⚡ Temps de démarrage ultra-rapide

### Build de production

```bash
npm run build
```

Génère une version optimisée dans le dossier `dist/` avec:
- 📦 Minification JavaScript (Terser)
- 🎨 Minification CSS
- 🗜️ Compression Gzip et Brotli
- 🔑 Cache busting avec hashes de fichiers
- 🖼️ Optimisation des images
- 📊 Analyse de la taille des bundles

### Preview du build

```bash
npm run preview
```

Lance un serveur local pour prévisualiser le build de production sur http://localhost:8000

### Rebuild complet

```bash
npm run rebuild
```

Nettoie le dossier `dist/` et reconstruit depuis zéro.

### Nettoyage

```bash
npm run clean
```

Supprime le dossier `dist/`.

## Configuration Vite

### Optimisations activées

#### Images (vite-plugin-imagemin)
- **JPEG**: Compression mozjpeg (quality: 80)
- **PNG**: Optimisation optipng + pngquant (quality: 80-90%)
- **GIF**: Optimisation gifsicle
- **SVG**: Optimisation SVGO
- **WebP**: Génération automatique (quality: 85)
- **Résultats**: Réduction de 75-94% de la taille des images

#### JavaScript
- **Minification**: Terser avec compression avancée
  - Suppression des console.log et debugger
  - Optimisations unsafe activées pour taille minimale
  - 2 passes de compression
  - Mangling des noms de variables
- **Tree shaking**: Suppression du code inutilisé
- **Code splitting**: Séparation automatique des vendors
- **Plugin personnalisé**: Minification des scripts non-modules

#### CSS
- **Minification**: Compression maximale
- **Bundling**: Tous les CSS regroupés en un fichier
- **CSS Critical**: Inline du CSS critique dans le HTML
- **Lazy loading**: CSS non-critique chargé en async
- **Cache busting**: Hash dans le nom de fichier
- **PostCSS**: Support des transformations CSS modernes

#### Performance Web
- **Resource Hints**:
  - DNS Prefetch pour tous les domaines tiers
  - Preconnect pour domaines critiques (fonts, GTM)
  - Preload pour ressources critiques (CSS, images, fonts)
- **Font Optimization**:
  - Preload des fonts critiques (Poppins)
  - font-display: swap partout
- **Script Deferral**: Tous les scripts en defer
- **Image Optimization**:
  - Dimensions (width/height) pour éviter CLS
  - content-visibility: auto
  - Lazy loading natif

#### Compression
- **Gzip**: Compression .gz pour tous les fichiers > 1KB
- **Brotli**: Compression .br pour une meilleure compression (~15-20% de plus que gzip)

#### Service Worker
- **Minification**: Compression du sw.js
- **Runtime caching**: Stratégie de cache au runtime au lieu de pré-caching
- **Cache patterns**: Patterns regex pour identifier les ressources à cacher

### Fichiers générés

Après `npm run build`, le dossier `dist/` contient:

```
dist/
├── index.html                           # HTML minifié (168 KB → 34 KB gzip)
├── index.html.gz                        # Version gzip
├── index.html.br                        # Version brotli
├── sw.js                                # Service Worker minifié (3.7 KB)
├── manifest.json                        # Manifest PWA
├── assets/
│   ├── css/
│   │   ├── index.[hash].css            # CSS bundlé (43 KB → 8.5 KB gzip)
│   │   ├── index.[hash].css.gz
│   │   └── index.[hash].css.br
│   ├── js/
│   │   ├── privacy-manager.js          # Scripts minifiés
│   │   ├── insights.js
│   │   ├── hero-animation.js
│   │   └── ... (autres scripts)
│   └── images/
│       └── [fichiers avec hashes]      # Images optimisées
└── ... (autres fichiers publics)
```

## Comparaison avant/après

| Métrique | Avant (manuel) | Après (Vite + Optimisations) |
|----------|----------------|------------------------------|
| **CSS total** | ~80 KB (5 fichiers) | 43 KB (1 fichier) |
| **CSS gzip** | N/A | 8.5 KB |
| **CSS brotli** | N/A | 7.5 KB |
| **JS minification** | Manuelle | Automatique (Terser avancé) |
| **Optimisation images** | Aucune | Automatique (-75 à -94%) |
| **Taille totale** | ~5 MB | **2.4 MB (-52%)** |
| **Cache busting** | Hashes manuels | Hashes auto |
| **Compression** | Aucune | Gzip + Brotli |
| **Temps de build** | N/A | ~12.5s (avec optimisation images) |
| **Lighthouse Score** | 65-75 | **90-95 (estimé)** |

## Workflow de développement

### 1. Développement local

```bash
npm run dev
```

Modifiez vos fichiers dans `assets/` et `index.html`. Le navigateur se rafraîchit automatiquement.

### 2. Test du build

```bash
npm run build
npm run preview
```

Vérifiez que tout fonctionne correctement en production.

### 3. Déploiement

Le dossier `dist/` contient tous les fichiers optimisés prêts à être déployés.

**Pour GitHub Pages:**
```bash
# Le build doit être fait sur la branche appropriée
npm run build
# Committez le dossier dist/ si nécessaire
# Ou configurez GitHub Actions pour builder automatiquement
```

## Service Worker

Le service worker a été optimisé pour Vite:

### Changements principaux

**Avant (v2.4.2):**
- Pré-cache de 15+ ressources avec chemins fixes
- Chemins hardcodés avec hashes manuels
- Problème avec les fichiers renommés par Vite

**Après (v2.5.0):**
- Pré-cache minimal (/, /index.html, /manifest.json)
- **Runtime caching** pour toutes les autres ressources
- Patterns regex pour identifier les types de fichiers
- Compatible avec les hashes dynamiques de Vite

### Stratégies de cache

- **Cache First**: CSS, JS, images, fonts (ressources statiques)
- **Network First**: HTML, API calls (contenu dynamique)
- **Offline fallback**: Page hors ligne élégante

## Résolution des problèmes

### Le site ne se charge pas après le build

Vérifiez que le service worker a bien été mis à jour:
1. Ouvrez DevTools → Application → Service Workers
2. Cliquez sur "Unregister" si nécessaire
3. Rechargez la page

### Les fichiers CSS ne sont pas trouvés

Vite génère des hashes dynamiques. Le HTML est automatiquement mis à jour avec les bons chemins.

### Les scripts JavaScript ne fonctionnent pas

Les scripts sans `type="module"` sont copiés et minifiés par un plugin personnalisé. Les warnings Vite sont normaux.

### Le build échoue

```bash
# Nettoyez et réinstallez
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Structure des fichiers publics

Les fichiers dans `public/` sont copiés tels quels à la racine du `dist/`:

- `robots.txt` → Directives pour les robots d'indexation
- `sitemap.xml` → Plan du site pour SEO
- `manifest.json` → Configuration PWA
- `_headers` → Headers HTTP (Netlify)
- `_redirects` → Redirections (Netlify)
- `.htaccess` → Configuration Apache
- `404.html` → Page d'erreur 404

## Performance

### Optimisations appliquées

1. **Minification**
   - JavaScript: Terser avec passes multiples
   - CSS: cssnano intégré à Vite
   - HTML: Minification automatique

2. **Bundling**
   - Tous les CSS regroupés en un seul fichier
   - Code splitting automatique pour les vendors
   - Lazy loading préservé

3. **Compression**
   - Gzip pour compatibilité universelle
   - Brotli pour navigateurs modernes (meilleure compression)

4. **Cache**
   - Hashes de fichiers pour cache busting
   - Service Worker avec cache intelligent
   - Headers HTTP optimaux

### Résultats attendus

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 95+
- **Taille totale**: ~600 KB → ~200 KB (compressé)

## Commandes avancées

### Analyser le bundle

```bash
npm run analyze
```

Génère un rapport détaillé de la taille des bundles.

### Build avec sourcemaps

Modifiez `vite.config.js`:
```js
build: {
  sourcemap: true, // ou 'inline' ou 'hidden'
}
```

### Désactiver la compression

Commentez les plugins `viteCompression` dans `vite.config.js`.

## Migration depuis l'ancienne version

Si vous travaillez sur une ancienne version du projet:

1. **Supprimez les anciens fichiers minifiés**
   ```bash
   rm assets/css/*.min.css
   rm assets/js/*.min.js
   ```

2. **Déplacez les fichiers statiques**
   ```bash
   mkdir -p public
   mv robots.txt sitemap.xml manifest.json _headers _redirects .htaccess 404.html public/
   ```

3. **Installez les dépendances**
   ```bash
   npm install
   ```

4. **Mettez à jour index.html**
   Remplacez les références aux fichiers `.min.css` et `.min.js` par les versions non-minifiées.

5. **Buildez**
   ```bash
   npm run build
   ```

## Support et contribution

Pour toute question ou suggestion d'amélioration du workflow de build:
- Ouvrez une issue sur GitHub
- Consultez la documentation Vite: https://vitejs.dev/

---

**Version du guide**: 2.5.0
**Dernière mise à jour**: Novembre 2024
**Vite version**: 7.2.2
