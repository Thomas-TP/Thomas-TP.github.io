// JavaScript pour activer les fonctionnalités d'animation avancées

document.addEventListener('DOMContentLoaded', function() {
    // ===== Curseur personnalisé =====
    function initCustomCursor() {
        // Créer les éléments du curseur
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'custom-cursor-container';
        
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        
        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        
        cursorContainer.appendChild(cursor);
        cursorContainer.appendChild(cursorRing);
        document.body.appendChild(cursorContainer);
        
        // Tableau pour stocker les particules de la traînée
        const cursorTrails = [];
        const maxTrails = 10;
        
        // Mettre à jour la position du curseur
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
            
            // Créer une nouvelle particule de traînée
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            cursorContainer.appendChild(trail);
            cursorTrails.push(trail);
            
            // Limiter le nombre de particules
            if (cursorTrails.length > maxTrails) {
                const oldTrail = cursorTrails.shift();
                oldTrail.style.opacity = '0';
                setTimeout(() => {
                    if (oldTrail.parentNode) {
                        oldTrail.parentNode.removeChild(oldTrail);
                    }
                }, 500);
            }
            
            // Effet de curseur contextuel selon la section
            const currentSection = getCurrentSection();
            cursor.className = 'cursor ' + currentSection + '-mode';
        });
        
        // Effet au clic
        document.addEventListener('mousedown', function() {
            cursor.classList.add('clicking');
            cursorRing.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', function() {
            cursor.classList.remove('clicking');
            cursorRing.classList.remove('clicking');
        });
        
        // Désactiver sur les appareils tactiles
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            cursorContainer.style.display = 'none';
        }
    }
    
    // Obtenir la section actuelle pour le curseur contextuel
    function getCurrentSection() {
        const scrollPosition = window.scrollY;
        let currentSection = 'view';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                const id = section.getAttribute('id');
                if (id === 'skills') currentSection = 'skills';
                else if (id === 'projects') currentSection = 'projects';
                else if (id === 'contact') currentSection = 'contact';
            }
        });
        
        return currentSection;
    }
    
    // ===== Animations de parallax =====
    function initParallax() {
        // Ajouter les formes de parallax
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-container';
        
        const shape1 = document.createElement('div');
        shape1.className = 'parallax-shape parallax-shape-1';
        
        const shape2 = document.createElement('div');
        shape2.className = 'parallax-shape parallax-shape-2';
        
        const shape3 = document.createElement('div');
        shape3.className = 'parallax-shape parallax-shape-3';
        
        parallaxContainer.appendChild(shape1);
        parallaxContainer.appendChild(shape2);
        parallaxContainer.appendChild(shape3);
        
        // Ajouter au hero
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.classList.add('section-parallax');
            heroSection.insertBefore(parallaxContainer, heroSection.firstChild);
            
            // Ajouter l'effet de parallax à la photo de profil
            const profileImg = heroSection.querySelector('.rounded-full');
            if (profileImg) {
                const profileContainer = profileImg.parentNode;
                profileContainer.classList.add('profile-parallax');
            }
        }
        
        // Ajouter la classe parallax aux sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('section-parallax');
        });
        
        // Effet de parallax au défilement
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Parallax pour les formes
            document.querySelectorAll('.parallax-shape').forEach((shape, index) => {
                const speed = 0.1 * (index + 1);
                const yPos = scrollPosition * speed;
                shape.style.transform = `translateY(${yPos}px)`;
            });
            
            // Parallax pour la photo de profil
            const profileImg = document.querySelector('.profile-parallax img');
            if (profileImg) {
                const rect = profileImg.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const windowCenterX = window.innerWidth / 2;
                const windowCenterY = window.innerHeight / 2;
                
                const moveX = (centerX - windowCenterX) / 20;
                const moveY = (centerY - windowCenterY) / 20;
                
                profileImg.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
            }
            
            // Parallax pour les sections
            document.querySelectorAll('.section-parallax').forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const viewportHeight = window.innerHeight;
                
                if (scrollPosition + viewportHeight > sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const yPos = (scrollPosition - sectionTop) * 0.1;
                    section.querySelector(':scope::before')?.style.setProperty('transform', `translateY(${yPos}px)`);
                }
            });
        });
    }
    
    // ===== Micro-animations =====
    function initMicroAnimations() {
        // Ajouter les classes pour les micro-animations
        
        // Boutons avec effet d'ondulation
        document.querySelectorAll('.btn-primary, .card a, .nav-link').forEach(btn => {
            btn.classList.add('btn-animated', 'ripple');
        });
        
        // Icônes avec effet de pulsation
        document.querySelectorAll('svg').forEach(icon => {
            icon.classList.add('icon-pulse');
        });
        
        // Cartes avec effet 3D
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('card-3d');
            
            // Effet de perspective au survol
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.setProperty('--rotateX', rotateX + 'deg');
                card.style.setProperty('--rotateY', rotateY + 'deg');
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.setProperty('--rotateX', '0deg');
                card.style.setProperty('--rotateY', '0deg');
            });
        });
        
        // Badges avec effet de rebond
        document.querySelectorAll('.skill-badge').forEach(badge => {
            badge.classList.add('badge-bounce');
        });
        
        // Effet de brillance pour les liens
        document.querySelectorAll('a:not(.btn-primary)').forEach(link => {
            link.classList.add('shine');
        });
        
        // Effet de rotation pour les icônes sociales
        document.querySelectorAll('.fa-github, .fa-linkedin, .fa-twitter').forEach(icon => {
            icon.parentNode.classList.add('rotate-hover');
        });
    }
    
    // ===== Transitions entre sections =====
    function initSectionTransitions() {
        // Créer le conteneur de transition
        const transitionContainer = document.createElement('div');
        transitionContainer.className = 'section-transition-container';
        
        // Créer les différents types de transition
        const slideTransition = document.createElement('div');
        slideTransition.className = 'slide-transition';
        
        const maskTransition = document.createElement('div');
        maskTransition.className = 'mask-transition';
        
        const foldTransition = document.createElement('div');
        foldTransition.className = 'fold-transition';
        
        const rotateTransition = document.createElement('div');
        rotateTransition.className = 'rotate-transition';
        
        const clipTransition = document.createElement('div');
        clipTransition.className = 'clip-transition';
        
        // Ajouter les transitions au conteneur
        transitionContainer.appendChild(slideTransition);
        transitionContainer.appendChild(maskTransition);
        transitionContainer.appendChild(foldTransition);
        transitionContainer.appendChild(rotateTransition);
        transitionContainer.appendChild(clipTransition);
        
        // Ajouter le conteneur au body
        document.body.appendChild(transitionContainer);
        
        // Ajouter la classe section-content à toutes les sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('section-content');
        });
        
        // Gérer les transitions lors du clic sur les liens de navigation
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Déterminer le type de transition à utiliser
                    const transitionTypes = ['slide-transition', 'mask-transition', 'fold-transition', 'rotate-transition', 'clip-transition'];
                    const randomType = transitionTypes[Math.floor(Math.random() * transitionTypes.length)];
                    
                    // Activer la transition
                    transitionContainer.classList.add('active');
                    document.querySelector('.' + randomType).classList.add('active');
                    
                    // Masquer la section actuelle
                    document.querySelectorAll('section.active').forEach(section => {
                        section.classList.add('exit');
                        section.classList.remove('active');
                    });
                    
                    // Après un court délai, faire défiler jusqu'à la section cible
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'auto'
                        });
                        
                        // Afficher la nouvelle section
                        targetSection.classList.add('enter');
                        
                        // Terminer la transition
                        setTimeout(() => {
                            document.querySelector('.' + randomType).classList.remove('active');
                            transitionContainer.classList.remove('active');
                            
                            targetSection.classList.remove('enter');
                            targetSection.classList.add('active');
                            
                            document.querySelectorAll('section.exit').forEach(section => {
                                section.classList.remove('exit');
                            });
                        }, 700);
                    }, 500);
                }
            });
        });
    }
    
    // ===== Animations de texte =====
    function initTextAnimations() {
        // Animation de machine à écrire pour le titre principal
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            heroTitle.classList.add('typewriter');
        }
        
        // Animation de révélation lettre par lettre pour les sous-titres
        const heroSubtitle = document.querySelector('#hero p');
        if (heroSubtitle) {
            const text = heroSubtitle.textContent;
            heroSubtitle.textContent = '';
            heroSubtitle.classList.add('letter-reveal');
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.animationDelay = (0.1 * i) + 's';
                heroSubtitle.appendChild(span);
            }
        }
        
        // Animation de texte qui se dévoile pour les titres de section
        document.querySelectorAll('h2.section-title').forEach((title, index) => {
            title.classList.add('text-reveal');
            title.style.animationDelay = (0.2 * index) + 's';
        });
        
        // Animation de texte avec effet de glitch pour certains titres
        const projectsTitle = document.querySelector('#projects h2');
        if (projectsTitle) {
            projectsTitle.classList.add('glitch');
            projectsTitle.setAttribute('data-text', projectsTitle.textContent);
        }
        
        // Animation de texte avec effet de dégradé pour les compétences
        document.querySelectorAll('#skills h3').forEach(title => {
            title.classList.add('gradient-text');
        });
        
        // Animation de texte avec effet de flou pour les descriptions
        document.querySelectorAll('#about p').forEach((p, index) => {
            p.classList.add('blur-text');
            p.style.animationDelay = (0.3 * index) + 's';
        });
        
        // Animation de texte avec effet de rebond pour les titres de projets
        document.querySelectorAll('#projects .card h3').forEach(title => {
            title.classList.add('bounce-text');
            
            const text = title.textContent;
            title.textContent = '';
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.animationDelay = (0.05 * i) + 's';
                title.appendChild(span);
            }
        });
    }
    
    // Initialiser toutes les fonctionnalités
    function initAllFeatures() {
        // Vérifier si l'utilisateur préfère réduire les animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            initCustomCursor();
            initParallax();
            initMicroAnimations();
            initSectionTransitions();
            initTextAnimations();
        }
    }
    
    // Attendre que tout soit chargé
    window.addEventListener('load', initAllFeatures);
});
