# Intégration Botpress - Chatbot Personnalisé

## 🎯 Vue d'ensemble

Ton chatbot utilise maintenant **Botpress en arrière-plan** tout en gardant ton interface Material 3 personnalisée ! L'IA de Botpress génère les réponses intelligentes, mais l'apparence reste exactement la même.

## ⚙️ Configuration Requise

### 1. **Configurer ton instance Botpress**

1. Va sur [Botpress Studio](https://studio.botpress.cloud)
2. Crée un nouveau bot ou utilise un bot existant
3. Dans les paramètres du bot, récupère :
   - **Bot ID** (visible dans l'URL : `botId=abc123`)
   - **Host URL** (ton instance Botpress)

### 2. **Modifier la configuration**

Édite le fichier `js/botpress-config.js` :

```javascript
const BOTPRESS_CONFIG = {
  botId: 'ton-vrai-bot-id', // Remplace par ton Bot ID
  hostUrl: 'https://ton-instance.botpress.cloud', // Remplace par ton URL
  clientId: 'ton-client-id', // Si nécessaire
  debugMode: false // Active pour les logs de debug
};
```

### 3. **Ajouter ta Knowledge Base**

Dans Botpress Studio :
1. Crée une **Knowledge Base**
2. Ajoute la source : `https://thomastp.me/botpress.html`
3. Configure l'**Autonomous Node** avec les instructions appropriées

## 🔧 Fonctionnement Technique

### **Interface Utilisateur** (Conservée)
- ✅ Design Material 3 personnalisé
- ✅ Animations et transitions fluides
- ✅ Mode sombre/clair
- ✅ Suggestions de questions
- ✅ Interface responsive

### **Moteur de Réponses** (Maintenant Botpress)
- 🤖 **IA Botpress** pour les réponses intelligentes
- 📚 **Knowledge Base** intégrée
- 🔄 **Compréhension naturelle** du langage
- 💬 **Conversations contextuelles**

### **Fallback System**
Si Botpress n'est pas configuré ou indisponible :
- 🔄 Retour automatique aux réponses locales
- ⚠️ Message d'avertissement dans la console
- 📝 Réponses basiques maintenues

## 🚀 Déploiement

### **Fichiers Modifiés**
- `index.html` - SDK Botpress ajouté
- `js/chatbot.js` - Logique Botpress intégrée
- `js/botpress-config.js` - Configuration centralisée

### **Test Local**
```bash
cd "c:\Users\leole\Downloads\Thomas-TP.github.io-main\Thomas-TP.github.io-main"
python -m http.server 8000
```

Visite `http://localhost:8000` et teste le chatbot !

## 📊 États Possibles

| État | Indicateur | Description |
|------|------------|-------------|
| ✅ **Configuré** | 🤖 Messages IA | Botpress fonctionne parfaitement |
| ⚠️ **Non configuré** | 🔄 Fallback | Configuration manquante, réponses locales |
| ❌ **Erreur** | 🔄 Fallback | Problème technique, réponses locales |

## 🔍 Dépannage

### **Botpress ne répond pas**
1. Vérifie la configuration dans `js/botpress-config.js`
2. Ouvre la console du navigateur (F12)
3. Cherche les messages d'erreur Botpress
4. Vérifie que ton instance Botpress est active

### **Mode fallback activé**
- Message dans la console : "Configuration Botpress incomplète"
- Le chatbot utilise les réponses locales prédéfinies

### **Messages de debug**
Active `debugMode: true` dans la configuration pour voir :
- Messages envoyés à Botpress
- Réponses reçues
- Erreurs de connexion

## 🎯 Avantages de cette Intégration

### **Pour toi (Développeur)**
- 🎨 Interface 100% personnalisable
- 🔧 Contrôle total du design
- 📱 Responsive et accessible
- ⚡ Performant et léger

### **Pour tes visiteurs**
- 🤖 Réponses IA intelligentes
- 📚 Connaissances à jour
- 💬 Conversations naturelles
- 🎯 Réponses précises sur toi

### **Pour Botpress**
- 📊 Analytics et métriques
- 🔄 Mises à jour automatiques
- 📈 Amélioration continue
- 🤝 Intégration transparente

## 📞 Support

Si tu as des problèmes :
1. Vérifie la console du navigateur
2. Teste avec `debugMode: true`
3. Vérifie ta configuration Botpress
4. Consulte la [documentation Botpress](https://docs.botpress.com)

---

**Status :** ✅ Intégration Botpress configurée et prête ! 🚀

Il ne te reste plus qu'à configurer tes vraies informations Botpress dans `js/botpress-config.js`.