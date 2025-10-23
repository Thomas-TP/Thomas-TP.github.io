# Feuille de Route d'Optimisation Web Professionnelle

**Objectif :** Atteindre un niveau d'optimisation "GAFAM" pour le portfolio de Thomas P., en se concentrant sur la performance, la sécurité, le SEO technique et l'expérience utilisateur (UX).

**État Actuel (Analyse Initiale) :**
Le site est déjà très bien optimisé pour un portfolio statique. Des techniques avancées comme le Critical CSS, le lazy loading des ressources non essentielles (`Tailwind`, `Font Awesome`, CSS secondaires) et une configuration de sécurité/SEO détaillée (CSP, Open Graph, Twitter Cards) sont déjà en place. L'optimisation future se concentrera sur l'industrialisation, la robustesse et le perfectionnement des métriques Core Web Vitals.

---

## Phase 1 : Amélioration des Core Web Vitals et Industrialisation (Implémentation Immédiate)

Cette phase vise à perfectionner les métriques de performance et à établir des bases solides pour le développement futur.

| Domaine | Problème/Opportunité | Action Recommandée | Justification (Standard GAFAM) |
| :--- | :--- | :--- | :--- |
| **Performance (LCP/CLS)** | Utilisation d'un CDN pour Tailwind et Font Awesome. Le `preload` et le `lazy load` sont bons, mais le chargement asynchrone peut impacter le CLS (Cumulative Layout Shift). | **Action 1.1 :** Localiser Tailwind CSS et les polices (Poppins/Montserrat) et les intégrer dans le processus de build. **Action 1.2 :** Minifier et Purger le CSS pour ne conserver que le code utilisé. | **Réduction de la dépendance aux tiers** (moins de points de défaillance). **Garantie du CLS à zéro** en éliminant les changements de style post-chargement. |
| **Performance (TBT/FID)** | Présence de scripts dans le `head` pour le lazy loading CSS et le polyfill. | **Action 1.3 :** Déporter le JavaScript non critique (y compris les scripts de lazy load CSS) en bas de page (`</body>`) ou utiliser l'attribut `defer`. | **Priorité au thread principal.** Le JS doit être non bloquant pour le rendu initial. |
| **SEO Technique** | Le fichier `robots.txt` est présent, mais peut être optimisé. Le `sitemap.xml` est présent mais doit être validé. | **Action 1.4 :** Mettre à jour `robots.txt` pour bloquer les répertoires non pertinents (`/scripts`, `/assets/js`). **Action 1.5 :** S'assurer que le `sitemap.xml` est à jour et ne contient que des URL valides. | **Contrôle précis de l'indexation** pour concentrer le budget de crawl sur les pages importantes. |
| **Sécurité/Qualité** | Le site utilise un système de versioning basique (`?v=2.4`) dans les liens CSS. | **Action 1.6 :** Remplacer le versioning manuel par un **hachage de contenu** (e.g., `styles.f4b8d.css`) lors du déploiement. | **Cache Busting efficace.** Assure que le navigateur recharge les fichiers uniquement si le contenu a changé (caching infini). |
| **Code Qualité** | Le code HTML est long (2640 lignes) et contient des commentaires de débogage ou des blocs de code inutilisés. | **Action 1.7 :** Nettoyer le code HTML, supprimer les commentaires inutiles et les blocs de code morts. | **Réduction de la taille du transfert** et amélioration de la lisibilité pour la maintenance. |

## Phase 2 : Robustesse et Expérience Utilisateur (UX)

Cette phase se concentre sur la durabilité du code et l'amélioration de l'accessibilité.

| Domaine | Problème/Opportunité | Action Recommandée | Justification (Standard GAFAM) |
| :--- | :--- | :--- | :--- |
| **Accessibilité (A11Y)** | Non vérifié. Les standards GAFAM exigent un niveau AA minimum (WCAG 2.1). | **Action 2.1 :** Vérification et correction des problèmes d'accessibilité (contraste, `alt` des images, navigation au clavier, rôles ARIA). | **Inclusion et conformité légale.** Un site accessible est un site de qualité. |
| **Imagerie** | Les images ne sont pas servies au format de nouvelle génération (WebP, AVIF). | **Action 2.2 :** Convertir toutes les images en **WebP** et utiliser l'élément `<picture>` pour un fallback (`<picture><source type="image/webp" ...><img src="..." alt="..."></picture>`). | **Réduction de la taille des images** (jusqu'à 30% de gain) et amélioration du LCP. |
| **Gestion des Erreurs** | Pas de page d'erreur 404 personnalisée. | **Action 2.3 :** Créer une page `404.html` légère et conviviale. | **Professionnalisme et UX.** Maintenir l'utilisateur sur le site même en cas d'erreur. |

## Phase 3 : Infrastructure et Monitoring (Recommandation)

Ces actions sont des recommandations pour l'environnement de déploiement et de suivi.

| Domaine | Problème/Opportunité | Action Recommandée | Justification (Standard GAFAM) |
| :--- | :--- | :--- | :--- |
| **Monitoring** | Absence de suivi des performances réelles (RUM). | **Action 3.1 :** Intégrer un outil de suivi des Core Web Vitals (e.g., Google Analytics 4, ou un script léger de RUM). | **Data-driven decisions.** Optimiser en fonction de l'expérience réelle des utilisateurs. |
| **Développement** | Déploiement manuel ou simple push sur `master`. | **Action 3.2 :** Mettre en place un pipeline **CI/CD** (via GitHub Actions) pour automatiser la minification, la purge CSS, le hachage des assets et la conversion WebP à chaque push. | **Industrialisation et qualité logicielle.** Garantir que toutes les optimisations sont appliquées systématiquement. |

---

## Implémentation (Phase 1 du Plan)

L'implémentation immédiate se concentrera sur les **Actions 1.1 à 1.7** pour garantir un gain de performance maximal sur les Core Web Vitals.

*   **Action 1.1 & 1.2 :** Localisation et purge de Tailwind CSS.
*   **Action 1.3 :** Déplacement des scripts non critiques.
*   **Action 1.4 & 1.5 :** Optimisation de `robots.txt` et `sitemap.xml`.
*   **Action 1.6 :** Préparation au cache busting.
*   **Action 1.7 :** Nettoyage du code.

**Note :** Les actions impliquant un processus de build (`CI/CD`, hachage des assets, conversion WebP) seront simulées manuellement ou préparées pour une intégration future, car elles nécessitent une modification de l'infrastructure de déploiement (GitHub Actions) qui est hors du scope d'une simple modification de code source. Nous allons donc nous concentrer sur les gains directs dans le code HTML/CSS/JS.

