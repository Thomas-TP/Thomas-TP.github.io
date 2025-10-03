const languageSelect = document.getElementById('languageSelect');

// Translation data (using data-key attributes)
const translations = {
    en: {
        welcome: "Welcome to Thomas-TP's Professional Page",
        description: "This is a professional GitHub Page showcasing my projects and achievements.",
        aboutMeTitle: "About Me",
        aboutMeDescription: "👋 Hello, I'm Thomas! Passionate about web development, currently enhancing skills in JavaScript and front-end technologies while working on X-clone.",
        educationTitle: "Education",
        educationDescription: "Geneva Institute of Technology<br>CFC d'informaticien, Informatique<br>August 2024 - July 2028",
        certificationsTitle: "Certifications",
        certificationsList: "<li>IOT - Programming Hub (Dec 2024) - Certification ID: 99de3518f3787d2</li><li>English for IT 1 - Cisco Networking Academy (Oct 2024)</li><li>Linux Essentials - Programming Hub (Mar 2024) - Certification ID: 1709284761076</li><li>Machine Learning - Programming Hub (Feb 2024) - Certification ID: 1709194876030</li>",
        projectsTitle: "Projects",
        xCloneTitle: "X-clone",
        xCloneDescription: "A realistic clone of X built with JavaScript.",
        projectLink: "Link to project",
        project1: "Check my Github",
        skillsTitle: "Skills & Tools",
        contactTitle: "Contact",
        twitterLink: "@Leo86475265",
        orcidLink: "0009-0006-6167-6989",
        linkedinLink: "Thomas P. on LinkedIn",
        email: "Email:",
        emailLink: "your-email@example.com",
        githubActivityTitle: "GitHub Activity",
        nameLabel: "Name:",
        emailLabel: "Email:",
        messageLabel: "Message:",
        submitButton: "Send",
        namePlaceholder: "Your Name",
        emailPlaceholder: "Your Email",
        messagePlaceholder: "Your Message",
        javascriptSkill: "JavaScript",
        html5Skill: "HTML5",
        css3Skill: "CSS3",
        gitSkill: "GitHub",
        githubSkill: "GitHub",
        githubChart: "GitHub Activity Chart"
    },
    fr: {
        welcome: "Bienvenue sur la page professionnelle de Thomas-TP",
        description: "Ceci est une page professionnelle GitHub présentant mes projets et réalisations.",
        aboutMeTitle: "À propos de moi",
        aboutMeDescription: "👋 Bonjour, je suis Thomas ! Passionné par le développement web, je travaille actuellement à améliorer mes compétences en JavaScript et les technologies front-end tout en travaillant sur X-clone.",
        educationTitle: "Formation",
        educationDescription: "Institut de Technologie de Genève<br>CFC d'informaticien, Informatique<br>août 2024 - juil. 2028",
        certificationsTitle: "Certifications",
        certificationsList: "<li>IOT - Programming Hub (déc. 2024) - Identifiant de la certification : 99de3518f3787d2</li><li>English for IT 1 - Cisco Networking Academy (oct. 2024)</li><li>Linux Essentials - Programming Hub (mars 2024) - Identifiant de la certification : 1709284761076</li><li>Machine Learning - Programming Hub (févr. 2024) - Identifiant de la certification : 1709194876030</li>",
        projectsTitle: "Projets",
        xCloneTitle: "X-clone",
        xCloneDescription: "Un clone réaliste de X construit avec JavaScript.",
        projectLink: "Lien vers le projet",
        project1: "Voir mon Github",
        skillsTitle: "Compétences et outils",
        contactTitle: "Contact",
        twitterLink: "@Leo86475265",
        orcidLink: "0009-0006-6167-6989",
        linkedinLink: "Thomas P. sur LinkedIn",
        email: "Email :",
        emailLink: "your-email@example.com",
        githubActivityTitle: "Activité GitHub",
        nameLabel: "Nom :",
        emailLabel: "Email :",
        messageLabel: "Message :",
        submitButton: "Envoyer",
        namePlaceholder: "Votre nom",
        emailPlaceholder: "Votre email",
        messagePlaceholder: "Votre message",
         javascriptSkill: "JavaScript",
        html5Skill: "HTML5",
        css3Skill: "CSS3",
        gitSkill: "GitHub",
        githubSkill: "GitHub Activity Chart"
    }
};

// Function to update text content based on the selected language
function updateContent(language) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.dataset.key;
        if (translations[language] && translations[language][key]) {
            // Correctly handle different element types
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                element.placeholder = translations[language][key];
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translations[language][key];
            } else {
                element.innerHTML = translations[language][key];
            }
        }
    });
}

// Event listener for language selection
if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
        const language = event.target.value;
        updateContent(language);
    });
}

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js") // Assurez-vous que le chemin est correct
      .then(registration => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      })
      .catch(error => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

// Contact Form Submission with mailto link
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const emailFrom = document.getElementById("email").value;
            const message = document.getElementById("message").value;
            const recipientEmail = "Thomas+SiteWeb@prudhomme.li";

            if (!name || !emailFrom || !message) {
                alert("Veuillez remplir tous les champs du formulaire.");
                return;
            }

            const subject = `Message de ${name} via le site thomastp.me`;
            const body = `Nom: ${name}\nEmail de l'expéditeur: ${emailFrom}\n\nMessage:\n${message}`;
            
            let mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Attempt to add reply-to if supported, though mailto has limited support for it.
            // It's better to include the sender's email in the body.
            // mailtoLink += `&reply-to=${encodeURIComponent(emailFrom)}`;

            window.location.href = mailtoLink;
            // Optionally, reset the form after a short delay, though the page might navigate away
            // setTimeout(() => {
            //     contactForm.reset();
            // }, 500);
        });
    }

    // Initialize language content
    if (languageSelect) {
        updateContent(languageSelect.value);
    }
});
