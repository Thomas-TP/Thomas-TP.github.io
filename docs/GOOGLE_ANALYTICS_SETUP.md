# 📊 Guide Complet : Configuration Google Analytics 4 avec GTM

## Table des matières
1. [Créer une propriété Google Analytics 4](#1-créer-une-propriété-google-analytics-4)
2. [Configurer GA4 dans Google Tag Manager](#2-configurer-ga4-dans-google-tag-manager)
3. [Événements recommandés pour un portfolio](#3-événements-recommandés-pour-un-portfolio)
4. [Paramètres RGPD et vie privée](#4-paramètres-rgpd-et-vie-privée)
5. [Conversions et objectifs](#5-conversions-et-objectifs)
6. [Rapports personnalisés](#6-rapports-personnalisés)
7. [Test et validation](#7-test-et-validation)

---

## 1. Créer une propriété Google Analytics 4

### Étape 1.1 : Accéder à Google Analytics
1. Allez sur https://analytics.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Créer une propriété"** ou **"Admin"** → **"Créer une propriété"**

### Étape 1.2 : Configurer la propriété

**Nom de la propriété** :
```
Thomas P. Portfolio
```

**Fuseau horaire** :
```
(GMT+01:00) Paris
```

**Devise** :
```
EUR - Euro (€)
```

### Étape 1.3 : À propos de votre entreprise

**Secteur d'activité** :
```
Technologie > Services informatiques et logiciels
```

**Taille de l'entreprise** :
```
Petite (1-10 employés)
```

**Utilisation prévue** (cochez) :
- ✅ Mesurer l'engagement des utilisateurs
- ✅ Examiner le comportement des utilisateurs
- ☐ Optimiser les performances publicitaires (optionnel)

### Étape 1.4 : Créer un flux de données Web

1. Sélectionnez **"Web"**
2. **URL du site Web** : `https://thomastp.me`
3. **Nom du flux** : `thomastp.me - Production`
4. Cochez **"Mesure améliorée"** (recommandé)

### Étape 1.5 : Récupérer l'ID de mesure

Après création, vous verrez votre **ID de mesure** :
```
G-XXXXXXXXXX
```

**⚠️ Important** : Notez cet ID, vous en aurez besoin pour GTM !

---

## 2. Configurer GA4 dans Google Tag Manager

### Étape 2.1 : Accéder à GTM
1. Allez sur https://tagmanager.google.com/
2. Ouvrez votre conteneur `GTM-K8RZ9NFL`

### Étape 2.2 : Créer une balise de configuration GA4

1. **Balises** → **Nouvelle**
2. **Nom** : `GA4 - Configuration`

**Configuration de la balise** :
- Type : **Google Analytics: Configuration GA4**
- **ID de mesure** : `G-XXXXXXXXXX` (votre ID)

**Paramètres de configuration avancés** (cliquez sur "Afficher plus") :

```
Nom du paramètre        | Valeur
------------------------|---------------------------
anonymize_ip            | true
allow_google_signals    | false (RGPD)
allow_ad_personalization| false (RGPD)
cookie_expires          | 7776000 (90 jours)
```

**Propriétés de configuration GA4** :
```
user_properties.portfolio_visitor = true
```

**Déclencheur** : `All Pages`

**💾 Enregistrer**

### Étape 2.3 : Créer un déclencheur de consentement

1. **Déclencheurs** → **Nouveau**
2. **Nom** : `Consent - Analytics Enabled`

**Configuration** :
- Type : **Événement personnalisé**
- Nom de l'événement : `consentChanged`
- Ce déclencheur se déclenche sur : **Certains événements personnalisés**
- Condition : `Event > consent > equals > true`

**💾 Enregistrer**

### Étape 2.4 : Modifier le déclencheur de la balise GA4

Retournez dans votre balise `GA4 - Configuration` :
- **Déclencheurs** → Remplacez `All Pages` par `Consent - Analytics Enabled`

**💾 Enregistrer**

---

## 3. Événements recommandés pour un portfolio

### Événement 1 : Téléchargement de CV

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - CV Download`
- **Type** : Google Analytics: Événement GA4
- **ID de mesure** : Sélectionner la balise de configuration GA4
- **Nom de l'événement** : `cv_download`

**Paramètres d'événement** :
```
file_name   → {{Click URL}}
file_type   → pdf
action_type → download
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Click - CV Download`
- **Type** : Clic - Tous les éléments
- **Condition** : `Click URL > contains > /cv/`

---

### Événement 2 : Clic sur lien externe

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Outbound Link`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `click`

**Paramètres** :
```
link_url    → {{Click URL}}
link_domain → {{Click Element}} ▶ hostname
outbound    → true
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Click - Outbound Links`
- **Type** : Clic - Tous les éléments
- **Condition 1** : `Click URL > does not contain > thomastp.me`
- **Condition 2** : `Click URL > starts with > http`

---

### Événement 3 : Soumission formulaire contact

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Form Submit`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `generate_lead`

**Paramètres** :
```
form_name     → contact_form
value         → 10
currency      → EUR
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Form - Contact Submit`
- **Type** : Formulaire
- **Ce déclencheur se déclenche sur** : Soumission du formulaire
- **Condition** : `Form ID > equals > contactForm`

---

### Événement 4 : Scroll profondeur

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Scroll Depth`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `scroll`

**Paramètres** :
```
percent_scrolled → {{Scroll Depth Threshold}}
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Scroll - 25%, 50%, 75%, 90%`
- **Type** : Profondeur de défilement
- **Seuils en pourcentage** : `25, 50, 75, 90`

---

### Événement 5 : Temps d'engagement

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Engaged Time`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `user_engagement`

**Paramètres** :
```
engagement_time_msec → {{Timer Interval}}
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Timer - 30s Engagement`
- **Type** : Minuterie
- **Intervalle** : `30000` (30 secondes)
- **Limite** : `1` (déclenche une seule fois)

---

### Événement 6 : Clic sur projet

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Project Click`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `select_content`

**Paramètres** :
```
content_type → project
item_id      → {{Click Element}} ▶ data-project
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Click - Project Card`
- **Type** : Clic - Tous les éléments
- **Condition** : `Click Classes > contains > card`

---

### Événement 7 : Changement de langue

Déjà géré automatiquement par `assets/js/insights.js` via dataLayer :
```javascript
window.dataLayer.push({
    'event': 'language_change',
    'language': 'fr' ou 'en'
});
```

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Language Change`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `language_change`

**Paramètres** :
```
language → {{dlv - language}}
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Custom Event - Language Change`
- **Type** : Événement personnalisé
- **Nom** : `language_change`

---

### Événement 8 : Changement de thème

Déjà géré automatiquement par `assets/js/insights.js` :
```javascript
window.dataLayer.push({
    'event': 'theme_change',
    'theme': 'dark' ou 'light'
});
```

**Balises** → **Nouvelle**
- **Nom** : `GA4 - Event - Theme Change`
- **Type** : Google Analytics: Événement GA4
- **Nom de l'événement** : `theme_change`

**Paramètres** :
```
theme → {{dlv - theme}}
```

**Déclencheur** → **Nouveau** :
- **Nom** : `Custom Event - Theme Change`
- **Type** : Événement personnalisé
- **Nom** : `theme_change`

---

## 4. Paramètres RGPD et vie privée

### Étape 4.1 : Configurer les paramètres de conservation

Dans Google Analytics :
1. **Admin** → **Paramètres de la propriété**
2. **Paramètres de conservation des données**

**Durée de conservation** :
```
14 mois (recommandé RGPD)
```

Cochez :
- ✅ **Réinitialiser les données utilisateur lors d'une nouvelle activité**

### Étape 4.2 : Anonymisation IP

Déjà configuré dans GTM :
```
anonymize_ip: true
```

### Étape 4.3 : Désactiver Google Signals

Dans GA4 :
1. **Admin** → **Collecte de données**
2. **Google Signals** → **Désactiver**

**Pourquoi ?** RGPD - évite le tracking inter-sites

### Étape 4.4 : Paramètres de publicité

Dans GA4 :
1. **Admin** → **Paramètres de la propriété**
2. **Paramètres de publicité**

Désactivez tout :
- ☐ Personnalisation des annonces
- ☐ Rapports démographiques
- ☐ Remarketing

### Étape 4.5 : Liste d'exclusion d'IP (optionnel)

Pour exclure votre propre trafic :
1. **Admin** → **Flux de données** → **Votre flux**
2. **Filtres** → **Créer un filtre**
3. **Type** : Exclure le trafic depuis les adresses IP
4. **Nom** : `Exclude My IP`
5. **Type de correspondance** : L'adresse IP est égale à
6. **Valeur** : Votre IP (trouvable sur https://whatismyipaddress.com/)

---

## 5. Conversions et objectifs

### Conversion 1 : Téléchargement CV

Dans GA4 :
1. **Admin** → **Événements**
2. Trouvez `cv_download` → Cliquez sur **Marquer comme conversion**

**Valeur** : 10 EUR (configurable dans GTM)

### Conversion 2 : Soumission formulaire

1. **Admin** → **Événements**
2. Trouvez `generate_lead` → **Marquer comme conversion**

**Valeur** : 10 EUR

### Conversion 3 : Engagement significatif (90% scroll)

Créez un événement personnalisé :
1. **Admin** → **Événements** → **Créer un événement**
2. **Nom** : `engaged_user`

**Conditions** :
- `event_name = scroll`
- `percent_scrolled ≥ 90`

Marquez comme conversion.

---

## 6. Rapports personnalisés

### Rapport 1 : Vue d'ensemble du portfolio

1. **Explorer** → **Exploration vierge**
2. **Nom** : `Portfolio Overview`

**Dimensions** :
- Page path
- Event name
- Language
- Device category

**Métriques** :
- Active users
- Engaged sessions
- Average engagement time
- Event count
- Conversions

**Technique** : Tableau libre

### Rapport 2 : Entonnoir de conversion

1. **Explorer** → **Exploration en entonnoir**
2. **Nom** : `Visitor to Lead Funnel`

**Étapes** :
1. Visite de la page
2. Scroll > 50%
3. Visite section Contact
4. Soumission formulaire

---

## 7. Test et validation

### Étape 7.1 : Mode aperçu GTM

1. Dans GTM, cliquez sur **Aperçu**
2. Entrez l'URL : `https://thomastp.me`
3. Cliquez sur **Connect**

**Vérifications** :
- ✅ La balise GA4 Configuration se déclenche après consentement
- ✅ Les événements se déclenchent correctement
- ✅ Le dataLayer contient les bonnes données

### Étape 7.2 : DebugView GA4

Dans GA4 :
1. **Admin** → **DebugView**
2. Naviguez sur votre site
3. Vérifiez que les événements arrivent en temps réel

### Étape 7.3 : Vue en temps réel

1. **Rapports** → **Temps réel**
2. Vérifiez :
   - ✅ Utilisateurs actifs
   - ✅ Événements en temps réel
   - ✅ Conversions

### Étape 7.4 : Tester le consentement

1. Ouvrez le site en navigation privée
2. **Refusez** les cookies → Vérifiez qu'aucun événement GA4 n'est envoyé
3. Appelez `showCookieSettings()` dans la console
4. **Acceptez** Analytics → Vérifiez que les événements sont envoyés

---

## 📊 Résumé : Ce que vous aurez

### Événements automatiques (Mesure améliorée) :
- ✅ `page_view` - Vues de pages
- ✅ `scroll` - Défilement
- ✅ `click` - Clics sortants
- ✅ `file_download` - Téléchargements
- ✅ `video_start` - Vidéos (si applicable)
- ✅ `session_start` - Début de session

### Événements personnalisés :
- ✅ `cv_download` - Téléchargement CV
- ✅ `generate_lead` - Formulaire contact
- ✅ `language_change` - Changement de langue
- ✅ `theme_change` - Changement de thème
- ✅ `project_view` - Vue de projet
- ✅ `outbound_link` - Liens externes

### Conversions :
- ✅ Téléchargement CV (valeur: 10€)
- ✅ Contact (valeur: 10€)
- ✅ Engagement fort (90% scroll)

### Conformité RGPD :
- ✅ Consentement explicite requis
- ✅ Anonymisation IP
- ✅ Désactivation Google Signals
- ✅ Conservation 14 mois
- ✅ Pas de publicité personnalisée
- ✅ Opt-out facile

---

## 🎯 Métriques clés à surveiller

### Acquisition :
- Nombre de visiteurs uniques
- Sources de trafic (Direct, Organic, Referral, Social)
- Pays et langue des visiteurs

### Engagement :
- Durée moyenne de session
- Pages par session
- Taux de rebond
- Scroll depth moyen

### Conversions :
- Nombre de téléchargements CV
- Nombre de formulaires soumis
- Taux de conversion global

### Contenu :
- Pages les plus visitées
- Projets les plus consultés
- Sections les plus engageantes

---

## 📚 Ressources utiles

- [Documentation GA4](https://support.google.com/analytics/answer/9304153)
- [GTM Documentation](https://support.google.com/tagmanager)
- [RGPD et Analytics](https://support.google.com/analytics/answer/9019185)
- [Événements recommandés GA4](https://support.google.com/analytics/answer/9267735)

---

## ✅ Checklist finale

Avant de publier :
- [ ] ID de mesure GA4 ajouté dans GTM
- [ ] Balise GA4 Configuration créée
- [ ] Déclencheur de consentement configuré
- [ ] Tous les événements personnalisés créés
- [ ] Conversions marquées dans GA4
- [ ] Paramètres RGPD vérifiés
- [ ] Tests en mode aperçu GTM
- [ ] Validation dans DebugView GA4
- [ ] Test du refus de consentement
- [ ] Version GTM publiée

---

**💡 Conseil final** : Publiez votre conteneur GTM avec un nom de version clair :

**Nom de version** : `v1.0 - GA4 Initial Setup with GDPR`

**Description** :
```
- Configuration GA4 avec consentement
- 8 événements personnalisés
- 3 conversions
- Conformité RGPD complète
```

---

**🎉 Félicitations !** Votre Google Analytics 4 est maintenant configuré avec les meilleures pratiques et en totale conformité RGPD !
