/**
 * Configuration Botpress pour l'intégration personnalisée
 * À modifier avec tes vraies informations Botpress
 */
const BOTPRESS_CONFIG = {
  // Remplace ces valeurs par celles de ton instance Botpress
  botId: 'your-bot-id-here', // Ton Bot ID depuis Botpress Studio
  hostUrl: 'https://your-instance.botpress.cloud', // URL de ton instance Botpress
  clientId: 'your-client-id-here', // Ton Client ID si nécessaire

  // Configuration avancée (optionnel)
  messagingUrl: 'https://your-instance.botpress.cloud',
  showPoweredBy: false, // Masquer "Powered by Botpress"

  // Paramètres de fallback
  fallbackEnabled: true, // Activer les réponses de secours si Botpress est indisponible
  debugMode: false // Activer les logs de debug
};

/**
 * INSTRUCTIONS DE CONFIGURATION :
 *
 * 1. Dans Botpress Studio, va dans Settings > Integrations
 * 2. Copie ton Bot ID depuis l'URL ou les paramètres
 * 3. Remplace 'your-bot-id-here' par ton vrai Bot ID
 * 4. Remplace 'https://your-instance.botpress.cloud' par l'URL de ton instance
 * 5. Si tu as un Client ID spécifique, remplace 'your-client-id-here'
 *
 * Exemple d'URL Botpress : https://studio.botpress.cloud/flows?botId=abc123
 * Dans cet exemple, botId = 'abc123'
 */

export default BOTPRESS_CONFIG;