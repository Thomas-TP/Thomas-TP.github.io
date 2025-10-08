/**
 * Chatbot 100% Personnalisé pour Thomas P.
 * Interface moderne Material 3 avec mode sombre/clair
 * Animations premium et design responsive
 * Version 2.0 - Suggestions de questions rapides
 */

document.addEventListener("DOMContentLoaded", () => {
  // Masquer le widget Botpress s'il existe
  hideBotpressWidget();
  
  // Initialisation du chatbot avec un léger délai
  setTimeout(() => {
    initChatbot();
  }, 800);
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
      const question = btn.getAttribute("data-question");
      chatbotInput.value = question;
      sendMessage();
      hideSuggestions();
    });
  });
  
  // Animation du bouton après 3 secondes
  setTimeout(() => {
    chatbotToggle.style.animation = "gentle-bounce 2s ease-in-out infinite";
  }, 3000);
  
  // Message de bienvenue après ouverture
  let welcomeShown = false;
  const showWelcome = () => {
    if (!welcomeShown) {
      setTimeout(() => {
        addBotMessage("👋 Bonjour ! Je suis l'assistant virtuel de Thomas. Comment puis-je vous aider ?");
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
        <button class="suggestion-btn" data-question="Parle-moi de tes projets">💼 Projets</button>
        <button class="suggestion-btn" data-question="Quelles sont tes compétences ?">🛠️ Compétences</button>
        <button class="suggestion-btn" data-question="Quelle est ta formation ?">🎓 Formation</button>
        <button class="suggestion-btn" data-question="Comment te contacter ?">📧 Contact</button>
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
  setTimeout(() => {
    // Masque l'indicateur de frappe
    hideTypingIndicator();
    
    // Génère et affiche la réponse
    const response = generateResponse(message);
    addBotMessage(response);
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
 * Génère une réponse en fonction du message de l'utilisateur
 * @param {string} message - Le message de l'utilisateur
 * @returns {string} - La réponse générée
 */
function generateResponse(message) {
  // Convertit le message en minuscules pour faciliter la comparaison
  const lowerMessage = message.toLowerCase();
  
  // Définition des réponses possibles
  const responses = {
    // Salutations
    salutations: {
      triggers: ["bonjour", "salut", "hello", "hey", "coucou", "bonsoir"],
      answers: [
        "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        "Salut ! Que puis-je faire pour vous ?",
        "Hello ! En quoi puis-je vous être utile ?"
      ]
    },
    
    // Questions sur Thomas
    thomas: {
      triggers: ["thomas", "qui est thomas", "parle moi de thomas", "informaticien"],
      answers: [
        "Thomas est un informaticien passionné, actuellement étudiant au Geneva Institute of Technology.",
        "Thomas est un développeur web qui travaille sur plusieurs projets, dont X-clone.",
        "Thomas est spécialisé en développement web, IOT et machine learning."
      ]
    },
    
    // Questions sur les projets
    projets: {
      triggers: ["projets", "projet", "x-clone", "travail", "portfolio"],
      answers: [
        "Thomas travaille actuellement sur X-clone, un projet personnel qui lui permet d'améliorer ses compétences en JavaScript et technologies front-end.",
        "Vous pouvez consulter les projets de Thomas dans la section 'Projets' de ce site.",
        "Thomas a plusieurs projets en cours, notamment dans le développement web et l'IOT."
      ]
    },
    
    // Questions sur les compétences
    competences: {
      triggers: ["compétences", "competences", "skills", "technologies", "langages", "programmation"],
      answers: [
        "Thomas maîtrise plusieurs technologies comme JavaScript, HTML5, CSS3 et GitHub.",
        "Les compétences de Thomas incluent le développement web, l'IOT et le machine learning.",
        "Thomas possède des compétences en développement front-end et back-end."
      ]
    },
    
    // Questions sur la formation
    formation: {
      triggers: ["formation", "études", "etudes", "école", "ecole", "geneva", "institut"],
      answers: [
        "Thomas est actuellement étudiant au Geneva Institute of Technology où il poursuit un CFC d'informaticien.",
        "Thomas étudie l'informatique au Geneva Institute of Technology depuis 2024.",
        "La formation de Thomas au Geneva Institute of Technology se terminera en 2028."
      ]
    },
    
    // Questions sur le contact
    contact: {
      triggers: ["contact", "email", "mail", "téléphone", "telephone", "contacter"],
      answers: [
        "Vous pouvez contacter Thomas via le formulaire de contact disponible sur ce site.",
        "Pour contacter Thomas, utilisez la section 'Contact' de ce site ou ses réseaux sociaux.",
        "Thomas est disponible sur LinkedIn, GitHub et Twitter. Vous trouverez les liens dans la section 'À propos'."
      ]
    },
    
    // Remerciements
    remerciements: {
      triggers: ["merci", "thanks", "thank you", "cool", "super", "génial", "genial"],
      answers: [
        "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
        "Avec plaisir ! Je suis là pour vous aider.",
        "De rien ! Avez-vous besoin d'autre chose ?"
      ]
    },
    
    // Au revoir
    aurevoir: {
      triggers: ["au revoir", "bye", "ciao", "adieu", "à bientôt", "a bientot"],
      answers: [
        "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
        "À bientôt ! Passez une excellente journée.",
        "Au revoir et merci de votre visite !"
      ]
    }
  };
  
  // Parcourt les catégories de réponses
  for (const category in responses) {
    const { triggers, answers } = responses[category];
    
    // Vérifie si le message contient l'un des déclencheurs
    for (const trigger of triggers) {
      if (lowerMessage.includes(trigger)) {
        // Retourne une réponse aléatoire de cette catégorie
        return answers[Math.floor(Math.random() * answers.length)];
      }
    }
  }
  
  // Réponses par défaut si aucune correspondance n'est trouvée
  const defaultResponses = [
    "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?",
    "Désolé, je n'ai pas d'information sur ce sujet. Puis-je vous aider avec autre chose ?",
    "Intéressant ! Malheureusement, je n'ai pas de réponse précise à cette question.",
    "N'hésitez pas à me poser des questions sur Thomas, ses projets ou ses compétences."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
