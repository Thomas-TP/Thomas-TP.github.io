# Configuration Botpress

## Comment configurer le chatbot Botpress

Le chatbot utilise maintenant une configuration modulaire. Pour que le widget fonctionne correctement, vous devez :

### 1. Créer un bot sur Botpress Cloud

1. Allez sur [Botpress Cloud](https://botpress.cloud)
2. Créez un compte ou connectez-vous
3. Créez un nouveau bot

### 2. Configurer le fichier `js/botpress-config.js`

Remplacez les valeurs par défaut par vos vraies informations :

```javascript
export default {
  // Configuration du bot - À MODIFIER avec vos vraies informations
  botId: 'votre-bot-id-ici', // Remplacer par votre bot ID Botpress
  hostUrl: 'https://votre-instance.botpress.cloud', // Remplacer par votre host URL Botpress
  // ... autres configurations
};
```

### 3. Comment trouver votre Bot ID et Host URL

1. Dans Botpress Studio, allez dans les paramètres de votre bot
2. Le **Bot ID** se trouve dans l'URL ou les paramètres
3. Le **Host URL** est généralement `https://votre-nom.botpress.cloud`

### 4. Tester la configuration

Une fois configuré :
1. Sauvegardez les fichiers
2. Actualisez votre site web
3. Le widget chatbot devrait apparaître en bas à droite
4. Ouvrez la console du navigateur (F12) pour voir les messages de débogage

### 5. Dépannage

Si le widget n'apparaît pas :
- Vérifiez que le Bot ID et Host URL sont corrects
- Vérifiez la console pour les erreurs
- Assurez-vous que le CSP autorise les connexions Botpress
- Vérifiez que le bot est publié et actif sur Botpress Cloud

### 6. Personnalisation

Vous pouvez personnaliser l'apparence et le comportement du widget en modifiant les propriétés dans `botpress-config.js` :

- `botName`: Nom du bot
- `botAvatarUrl`: URL de l'avatar du bot
- `theme`: Thème ('light', 'dark', 'auto')
- `primaryColor`: Couleur principale
- etc.

### 7. Sécurité

Le CSP a été configuré pour autoriser :
- `https://cdn.botpress.cloud` (scripts)
- `https://files.bpcontent.cloud` (fichiers)
- `https://messaging.botpress.cloud` (messagerie)
- `wss://*.botpress.cloud` (WebSocket)

Si vous utilisez un domaine personnalisé, ajoutez-le au CSP dans `index.html`.