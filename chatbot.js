/**
 * Chatbot personnalisé pour le site de Thomas P.
 * Ce script gère les fonctionnalités du chatbot, y compris l'ouverture/fermeture,
 * l'envoi de messages, et les réponses automatiques.
 * Compatible avec le thème sombre et responsive.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du chatbot avec un léger délai pour ne pas ralentir le chargement initial de la page
  setTimeout(() => {
    initChatbot();
  }, 1000);
});

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
  const chatbotMessages = document.getElementById("chatbot-messages");
  
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
    if (e.key === "Enter") {
      sendMessage();
    }
  });
  
  // Affichage du message de bienvenue
  setTimeout(() => {
    addBotMessage("Bonjour ! Je suis l'assistant virtuel de Thomas. Comment puis-je vous aider aujourd'hui ?");
  }, 1000);
}

/**
 * Crée et ajoute les éléments HTML du chatbot au DOM
 */
function createChatbotElements() {
  // Création du conteneur principal
  const chatbotContainer = document.createElement("div");
  chatbotContainer.id = "chatbot-container";
  chatbotContainer.className = "chatbot-container";
  
  // HTML du chatbot
  chatbotContainer.innerHTML = `
    <!-- Bouton pour ouvrir/fermer le chatbot -->
    <button id="chatbot-toggle" class="chatbot-toggle btn-animated">
      <span class="chatbot-toggle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </span>
      <span class="chatbot-close-icon hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    </button>

    <!-- Fenêtre du chatbot -->
    <div id="chatbot-window" class="chatbot-window hidden">
      <!-- En-tête du chatbot -->
      <div class="chatbot-header gradient-bg">
        <div class="chatbot-title">Assistant Thomas P.</div>
        <button id="chatbot-close" class="chatbot-close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Corps du chatbot (messages) -->
      <div id="chatbot-messages" class="chatbot-messages"></div>

      <!-- Pied du chatbot (saisie) -->
      <div class="chatbot-footer">
        <input 
          type="text" 
          id="chatbot-input" 
          class="chatbot-input" 
          placeholder="Écrivez votre message..." 
          autocomplete="off"
        />
        <button id="chatbot-send" class="chatbot-send">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Ajout du chatbot au body
  document.body.appendChild(chatbotContainer);
  
  // Ajout des styles CSS
  addChatbotStyles();
}

/**
 * Ajoute les styles CSS du chatbot
 */
function addChatbotStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    /* Styles de base du chatbot */
    .chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: 'Poppins', sans-serif;
    }

    /* Bouton pour ouvrir/fermer le chatbot */
    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      border: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .chatbot-toggle:hover {
      transform: translateY(-5px);
      background-color: var(--primary-dark);
    }

    .chatbot-toggle svg {
      width: 24px;
      height: 24px;
    }

    /* Fenêtre du chatbot */
    .chatbot-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      transform-origin: bottom right;
      animation: zoomIn 0.3s ease forwards;
    }

    .chatbot-window.hidden {
      display: none;
    }

    /* En-tête du chatbot */
    .chatbot-header {
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .chatbot-title {
      font-weight: 600;
      font-size: 16px;
    }

    .chatbot-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }

    /* Corps du chatbot (messages) */
    .chatbot-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Styles des messages */
    .message {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      margin-bottom: 5px;
      animation: fadeIn 0.3s ease forwards;
    }

    .message-bot {
      align-self: flex-start;
      background-color: #f3f4f6;
      border-bottom-left-radius: 5px;
    }

    .message-user {
      align-self: flex-end;
      background-color: var(--primary);
      color: white;
      border-bottom-right-radius: 5px;
    }

    /* Pied du chatbot (saisie) */
    .chatbot-footer {
      padding: 15px;
      display: flex;
      gap: 10px;
      border-top: 1px solid #e5e7eb;
    }

    .chatbot-input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      outline: none;
      font-family: 'Poppins', sans-serif;
    }

    .chatbot-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 118, 247, 0.1);
    }

    .chatbot-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .chatbot-send:hover {
      background-color: var(--primary-dark);
    }

    /* Animation d'écriture */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 15px;
      background-color: #f3f4f6;
      border-radius: 18px;
      border-bottom-left-radius: 5px;
      width: fit-content;
      margin-bottom: 5px;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background-color: #9ca3af;
      border-radius: 50%;
      animation: typingAnimation 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) {
      animation-delay: 0s;
    }

    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typingAnimation {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-5px);
      }
    }

    /* Adaptation pour le thème sombre */
    .dark-theme .chatbot-window {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
    }

    .dark-theme .chatbot-input {
      background-color: var(--bg-card);
      border-color: var(--border-color);
      color: var(--text-primary);
    }

    .dark-theme .chatbot-input::placeholder {
      color: var(--text-muted);
    }

    .dark-theme .message-bot {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }

    .dark-theme .typing-indicator {
      background-color: var(--bg-secondary);
    }

    .dark-theme .chatbot-footer {
      border-top-color: var(--border-color);
    }

    /* Animations spécifiques au chatbot */
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .chatbot-toggle.animate-bounce {
      animation: bounce 1s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .chatbot-window {
        width: calc(100vw - 40px);
        height: 60vh;
        right: 20px;
        bottom: 80px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
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
    
    // Focus sur l'input
    setTimeout(() => {
      document.getElementById("chatbot-input").focus();
    }, 300);
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
  
  // Affiche l'indicateur de frappe
  showTypingIndicator();
  
  // Génère une réponse après un délai (simule le temps de réflexion)
  setTimeout(() => {
    // Masque l'indicateur de frappe
    hideTypingIndicator();
    
    // Génère et affiche la réponse
    const response = generateResponse(message);
    addBotMessage(response);
  }, 1000 + Math.random() * 1000); // Délai aléatoire entre 1 et 2 secondes
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
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
