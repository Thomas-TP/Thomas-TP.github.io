// Configuration Botpress pour Thomas Prudhomme
export default {
  // Configuration du bot - À MODIFIER avec vos vraies informations
  botId: 'your-bot-id-here', // Remplacer par votre bot ID Botpress
  hostUrl: 'https://your-instance.botpress.cloud', // Remplacer par votre host URL Botpress

  // Configuration du widget
  widget: {
    botName: 'Assistant Thomas',
    botAvatarUrl: 'assets/images/profile.jpg',
    website: 'https://thomastp.me',
    emailAddress: 'thomas@prudhomme.li',
    botConversationDescription: 'Assistant virtuel de Thomas Prudhomme - Informaticien passionné',
    composerPlaceholder: 'Tapez votre message...',
    showPoweredBy: false,
    enableReset: true,
    enableTranscriptDownload: false,
    enableConversationDeletion: false,
    showConversationsButton: false,
    disableAnimations: false,
    hideWidget: false,
    showCloseButton: true,
    enablePersistHistory: true,
    enableVoiceComposer: false,
    showBotInfoPage: true,
    lazySocket: false,
    exposeStore: false,
    hideOnNewMessage: false,
    enableDebugMode: false
  },

  // Configuration des événements
  events: {
    onWidgetReady: function() {
      console.log('🤖 Widget Botpress prêt et configuré');
    },
    onMessageReceived: null,
    onMessageSent: null,
    onConversationEnded: null,
    onWidgetOpened: null,
    onWidgetClosed: null
  },

  // Configuration de sécurité
  security: {
    allowedDomains: [
      'cdn.botpress.cloud',
      'files.bpcontent.cloud',
      'messaging.botpress.cloud',
      'avatars.githubusercontent.com'
    ],
    allowedProtocols: ['https:', 'wss:'],
    enableCSP: true
  },

  // Configuration de l'interface
  ui: {
    theme: 'auto', // 'light', 'dark', 'auto'
    primaryColor: '#4f76f7',
    secondaryColor: '#2563eb',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '20px',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
  }
};