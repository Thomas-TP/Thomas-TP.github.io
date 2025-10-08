/**
 * Chatbot - Widget Botpress Standard
 * Interface personnalisée supprimée, utilisation du widget officiel Botpress
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log('🤖 Widget Botpress standard activé');
});

/**
 * Fonction pour récupérer les traductions depuis l'objet global
 * @param {string} key - La clé de traduction
 * @returns {string} - Le texte traduit ou la clé si non trouvée
 */
function getTranslation(key) {
  // Récupère l'objet de traductions depuis la fenêtre (défini dans index.html)
  if (window.translations && window.currentLanguage && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key]) {
    return window.translations[window.currentLanguage][key];
  }
  return key; // Retourne la clé si la traduction n'est pas trouvée
}

// Configuration Botpress
let botpressClient = null;
let botpressConfig = null;

/**
 * Charge la configuration Botpress
 */
async function loadBotpressConfig() {
  try {
    // Importer la configuration
    const configModule = await import('./botpress-config.js');
    botpressConfig = configModule.default;

    // Validation de la configuration
    if (!botpressConfig.botId || botpressConfig.botId === 'your-bot-id-here') {
      console.warn('⚠️ Botpress Bot ID non configuré. Utilisation du mode fallback.');
      return false;
    }

    if (!botpressConfig.hostUrl || botpressConfig.hostUrl === 'https://your-instance.botpress.cloud') {
      console.warn('⚠️ Botpress Host URL non configurée. Utilisation du mode fallback.');
      return false;
    }

    console.log('✅ Configuration Botpress chargée:', botpressConfig.botId);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la configuration Botpress:', error);
    return false;
  }
}

/**
 * Initialise la connexion Botpress
 */
async function initBotpressConnection() {
  try {
    // Charger la configuration d'abord
    const configLoaded = await loadBotpressConfig();
    if (!configLoaded) {
      console.log('ℹ️ Configuration Botpress incomplète - mode fallback activé');
      return;
    }

    // Attendre que le SDK Botpress soit chargé
    if (typeof bp !== 'undefined') {
      botpressClient = bp;

      // Configuration de l'événement pour recevoir les messages
      bp.on('message', (message) => {
        if (message.type === 'text') {
          addBotMessage(message.payload.text);
        }
      });

      // Configuration avancée si disponible
      if (botpressConfig.debugMode) {
        console.log('🔧 Mode debug Botpress activé');
      }

      console.log('🤖 Connexion Botpress établie avec succès');
    } else {
      console.warn('⚠️ SDK Botpress non chargé, utilisation du mode fallback');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Botpress:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Interface personnalisée désactivée - utilisation du widget Botpress standard
  console.log('🤖 Widget Botpress standard activé - interface personnalisée désactivée');
});

/**
 * Masque le widget Botpress natif
 */
function hideBotpressWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #bp-embedded-webchat,
    .bpw-widget,
    .bpw-floating-button,
    [class*="bp-"],
    [id*="bp-"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialise le chatbot et ses fonctionnalités
 */
function initChatbot() {
  // Création des éléments du chatbot dans le DOM
  createChatbotElements();
  
  // Récupération des éléments du DOM
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotSend = document.getElementById("chatbot-send");
  
  // Gestion de l'ouverture/fermeture du chatbot
  chatbotToggle.addEventListener("click", () => {
    toggleChatbot();
  });
  
  chatbotClose.addEventListener("click", () => {
    toggleChatbot(false);
  });
  
  // Gestion de l'envoi de messages
  chatbotSend.addEventListener("click", () => {
    sendMessage();
  });
  
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Gestion des suggestions de questions
  const suggestionButtons = document.querySelectorAll(".suggestion-btn");
  suggestionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const questionKey = btn.getAttribute("data-question-key");
      const question = getTranslation(questionKey);
      chatbotInput.value = question;
      sendMessage();
      hideSuggestions();
    });
  });
  
  // Écouter les changements de langue pour mettre à jour les textes du chatbot
  window.addEventListener('languageChanged', updateChatbotTexts);
  
  // Animation du bouton après 3 secondes
  setTimeout(() => {
    chatbotToggle.style.animation = "gentle-bounce 2s ease-in-out infinite";
  }, 3000);
  
  // Message de bienvenue après ouverture
  let welcomeShown = false;
  const showWelcome = () => {
    if (!welcomeShown) {
      setTimeout(() => {
        // Utilise la traduction pour le message de bienvenue
        const welcomeMessage = getTranslation('chatbotWelcome') || "👋 Bonjour ! Je suis l'assistant virtuel de Thomas. Comment puis-je vous aider ?";
        addBotMessage(welcomeMessage);
      }, 600);
      welcomeShown = true;
    }
  };
  
  // Afficher le message de bienvenue à la première ouverture
  chatbotToggle.addEventListener("click", showWelcome, { once: true });
}

/**
 * Crée et ajoute les éléments HTML du chatbot au DOM
 */
function createChatbotElements() {
  // Création du conteneur principal
  const chatbotContainer = document.createElement("div");
  chatbotContainer.className = "chatbot-container";
  
  // HTML du chatbot
  chatbotContainer.innerHTML = `
    <!-- Bouton pour ouvrir/fermer le chatbot -->
    <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Ouvrir le chat">
      <span class="chatbot-toggle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </span>
      <span class="chatbot-close-icon hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <!-- Fenêtre du chatbot -->
    <div id="chatbot-window" class="chatbot-window hidden">
      <!-- En-tête du chatbot -->
      <div class="chatbot-header">
        <div class="chatbot-title">Assistant Thomas P.</div>
        <button id="chatbot-close" class="chatbot-close" aria-label="Fermer le chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Corps du chatbot (messages) -->
      <div id="chatbot-messages" class="chatbot-messages"></div>

      <!-- Suggestions de questions rapides -->
      <div id="chatbot-suggestions" class="chatbot-suggestions">
        <button class="suggestion-btn" data-question-key="chatbotQuestionProjects"><span data-key="chatbotProjects">💼 Projets</span></button>
        <button class="suggestion-btn" data-question-key="chatbotQuestionSkills"><span data-key="chatbotSkills">🛠️ Compétences</span></button>
        <button class="suggestion-btn" data-question-key="chatbotQuestionEducation"><span data-key="chatbotEducation">🎓 Formation</span></button>
        <button class="suggestion-btn" data-question-key="chatbotQuestionContact"><span data-key="chatbotContact">📧 Contact</span></button>
      </div>

      <!-- Pied du chatbot (saisie) -->
      <div class="chatbot-footer">
        <textarea 
          id="chatbot-input" 
          class="chatbot-input" 
          placeholder="Écrivez votre message..." 
          autocomplete="off"
          rows="1"
        ></textarea>
        <button id="chatbot-send" class="chatbot-send" aria-label="Envoyer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px; transform: rotate(-45deg);">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Ajout du chatbot au body
  document.body.appendChild(chatbotContainer);
  
  // Ajout du style pour l'animation gentle-bounce
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gentle-bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
  `;
  document.head.appendChild(style);
}


/**
 * Ouvre ou ferme la fenêtre du chatbot
 * @param {boolean} [open] - Si défini, force l'état ouvert (true) ou fermé (false)
 */
function toggleChatbot(open) {
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const toggleIcon = chatbotToggle.querySelector(".chatbot-toggle-icon");
  const closeIcon = chatbotToggle.querySelector(".chatbot-close-icon");
  
  // Détermine si le chatbot doit être ouvert ou fermé
  const shouldOpen = open !== undefined ? open : chatbotWindow.classList.contains("hidden");
  
  if (shouldOpen) {
    // Ouvre le chatbot
    chatbotWindow.classList.remove("hidden");
    toggleIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
    
    // Arrêter l'animation bounce
    chatbotToggle.style.animation = "none";
    
    // Focus sur l'input
    setTimeout(() => {
      const input = document.getElementById("chatbot-input");
      input.focus();
    }, 400);
  } else {
    // Ferme le chatbot
    chatbotWindow.classList.add("hidden");
    toggleIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }
}

/**
 * Envoie un message de l'utilisateur et génère une réponse
 */
function sendMessage() {
  const chatbotInput = document.getElementById("chatbot-input");
  const message = chatbotInput.value.trim();
  
  // Ne fait rien si le message est vide
  if (!message) return;
  
  // Ajoute le message de l'utilisateur
  addUserMessage(message);
  
  // Efface l'input
  chatbotInput.value = "";
  chatbotInput.style.height = 'auto';
  
  // Affiche l'indicateur de frappe
  showTypingIndicator();
  
  // Masquer les suggestions après l'envoi d'un message
  hideSuggestions();
  
  // Génère une réponse après un délai (simule le temps de réflexion)
  setTimeout(async () => {
    // Masque l'indicateur de frappe
    hideTypingIndicator();

    // Envoie le message à Botpress
    await sendMessageToBotpress(message);
  }, 800 + Math.random() * 1200); // Délai aléatoire entre 0.8 et 2 secondes
}

/**
 * Ajoute un message de l'utilisateur à la conversation
 * @param {string} message - Le message à ajouter
 */
function addUserMessage(message) {
  const chatbotMessages = document.getElementById("chatbot-messages");
  
  const messageElement = document.createElement("div");
  messageElement.className = "message message-user";
  messageElement.textContent = message;
  
  chatbotMessages.appendChild(messageElement);
  
  // Défilement automatique vers le bas
  scrollToBottom();
}

/**
 * Ajoute un message du bot à la conversation
 * @param {string} message - Le message à ajouter
 */
function addBotMessage(message) {
  const chatbotMessages = document.getElementById("chatbot-messages");
  
  const messageElement = document.createElement("div");
  messageElement.className = "message message-bot";
  messageElement.textContent = message;
  
  chatbotMessages.appendChild(messageElement);
  
  // Défilement automatique vers le bas
  scrollToBottom();
}

/**
 * Affiche l'indicateur de frappe (bot en train d'écrire)
 */
function showTypingIndicator() {
  const chatbotMessages = document.getElementById("chatbot-messages");
  
  // Vérifie si l'indicateur existe déjà
  if (document.getElementById("typing-indicator")) return;
  
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing-indicator";
  typingIndicator.className = "typing-indicator";
  
  // Ajoute les points d'animation
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    typingIndicator.appendChild(dot);
  }
  
  chatbotMessages.appendChild(typingIndicator);
  
  // Défilement automatique vers le bas
  scrollToBottom();
}

/**
 * Masque l'indicateur de frappe
 */
function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

/**
 * Fait défiler la conversation vers le bas
 */
function scrollToBottom() {
  const chatbotMessages = document.getElementById("chatbot-messages");
  setTimeout(() => {
    chatbotMessages.scrollTo({
      top: chatbotMessages.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}

/**
 * Envoie un message à Botpress et gère la réponse
 * @param {string} message - Le message de l'utilisateur
 */
async function sendMessageToBotpress(message) {
  try {
    if (botpressClient && typeof bp !== 'undefined' && botpressConfig) {
      // Utiliser l'API Botpress avec la configuration
      await bp.sendMessage(message);

      if (botpressConfig.debugMode) {
        console.log('📤 Message envoyé à Botpress:', message);
      }
    } else {
      // Fallback vers les réponses locales si Botpress n'est pas disponible
      console.warn('⚠️ Botpress non disponible ou mal configuré, utilisation du mode fallback');
      const fallbackResponse = generateFallbackResponse(message);
      addBotMessage(fallbackResponse);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message à Botpress:', error);
    // Fallback en cas d'erreur
    const fallbackResponse = generateFallbackResponse(message);
    addBotMessage(fallbackResponse);
  }
}

/**
 * Génère une réponse de fallback (ancienne logique)
 * @param {string} message - Le message de l'utilisateur
 * @returns {string} - La réponse générée
 */
function generateFallbackResponse(message) {
  // Convertit le message en minuscules pour faciliter la comparaison
  const lowerMessage = message.toLowerCase();

  // Définition des réponses possibles (version simplifiée pour fallback)
  const responses = {
    salutations: {
      triggers: ["bonjour", "salut", "hello", "hey", "coucou", "bonsoir"],
      answers: ["Bonjour ! Je suis l'assistant virtuel de Thomas. Comment puis-je vous aider ?"]
    },
    thomas: {
      triggers: ["thomas", "qui est thomas", "parle moi de thomas", "informaticien"],
      answers: ["Thomas est un informaticien passionné, étudiant au Geneva Institute of Technology avec une expérience à l'EPFL."]
    },
    projets: {
      triggers: ["projets", "projet", "x-clone", "travail", "portfolio"],
      answers: ["Thomas travaille sur X-clone et d'autres projets. Découvrez-les sur son portfolio !"]
    },
    contact: {
      triggers: ["contact", "email", "contacter"],
      answers: ["Vous pouvez contacter Thomas via le formulaire de contact ou par email."]
    }
  };

  // Recherche de correspondance
  for (const category in responses) {
    const { triggers, answers } = responses[category];
    for (const trigger of triggers) {
      if (lowerMessage.includes(trigger)) {
        return answers[Math.floor(Math.random() * answers.length)];
      }
    }
  }

  // Réponse par défaut
  return "Je suis l'assistant virtuel de Thomas. Pour des réponses plus précises, Botpress doit être configuré avec votre instance.";
}

/**
 * Masque les suggestions de questions
 */
function hideSuggestions() {
  const suggestions = document.getElementById("chatbot-suggestions");
  if (suggestions) {
    suggestions.classList.add("hidden");
  }
}

/**
 * Affiche les suggestions de questions
 */
function showSuggestions() {
  const suggestions = document.getElementById("chatbot-suggestions");
  if (suggestions) {
    suggestions.classList.remove("hidden");
  }
}

/**
 * Met à jour les textes du chatbot selon la langue sélectionnée
 */
function updateChatbotTexts() {
  // Met à jour les boutons de suggestion
  const suggestionSpans = document.querySelectorAll("#chatbot-suggestions .suggestion-btn span[data-key]");
  suggestionSpans.forEach(span => {
    const key = span.getAttribute("data-key");
    const translatedText = getTranslation(key);
    span.textContent = translatedText;
  });
  
  // Met à jour le placeholder de l'input si nécessaire
  const input = document.getElementById("chatbot-input");
  if (input && input.placeholder) {
    // Vous pouvez ajouter une clé de traduction pour le placeholder si souhaité
    // input.placeholder = getTranslation('chatbotPlaceholder');
  }
  
  // Les boutons utilisent maintenant les clés de traduction, donc ils se mettent à jour automatiquement
}
