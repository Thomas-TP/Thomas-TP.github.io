// Hero Section Interactive Animation avec particules de code
class HeroAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.constellationMode = false;
        this.constellationTimer = 0;
        this.constellationDuration = 0;
        this.targetPositions = [];
        this.codeSnippets = [
            'function()', 'const', 'let', 'if()', 'class', 'return',
            '{...}', '=>', '[]', 'async', 'await', 'try', 'catch',
            'import', 'export', '&&', '||', '===', 'new', 'this',
            'Python', 'Java', 'C++', 'JS', 'ML', 'AI', 'IoT'
        ];
        // Constellations célèbres (positions relatives normalisées 0-1)
        this.constellations = {
            bigDipper: [ // Grande Ourse (forme de casserole)
                [0.2, 0.3], [0.3, 0.3], [0.4, 0.3], [0.5, 0.35], // Base de la casserole
                [0.55, 0.5], [0.5, 0.65], [0.4, 0.6] // Manche
            ],
            cassiopeia: [ // Cassiopée (W bien marqué)
                [0.2, 0.5], [0.3, 0.3], [0.4, 0.5], [0.5, 0.25], [0.6, 0.45]
            ],
            orion: [ // Orion (ceinture et étoiles principales)
                [0.35, 0.4], [0.4, 0.4], [0.45, 0.4], // Ceinture (3 étoiles alignées)
                [0.3, 0.25], [0.5, 0.25], // Épaules (Bételgeuse et Bellatrix)
                [0.32, 0.6], [0.48, 0.6], // Pieds (Rigel et Saiph)
                [0.4, 0.5] // Centre
            ],
            leo: [ // Lion (forme triangulaire caractéristique)
                [0.2, 0.4], [0.3, 0.3], [0.4, 0.25], [0.5, 0.3], // Tête et crinière
                [0.55, 0.45], [0.5, 0.6], [0.35, 0.55] // Corps
            ]
        };
        this.init();
    }

    init() {
        // Créer le canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        heroSection.style.position = 'relative';
        heroSection.insertBefore(this.canvas, heroSection.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Créer les particules
        this.createParticles();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        heroSection.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Démarrer l'animation
        this.animate();
        
        // Planifier la première constellation après 10 secondes
        setTimeout(() => this.scheduleConstellation(), 10000);
    }

    resize() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        this.canvas.width = heroSection.offsetWidth;
        this.canvas.height = heroSection.offsetHeight;
        
        // Recréer les particules si nécessaire
        if (this.particles.length === 0) {
            this.createParticles();
        }
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 50; // Moins de particules sur mobile
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                originalVx: (Math.random() - 0.5) * 0.5,
                originalVy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                text: this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)],
                opacity: Math.random() * 0.5 + 0.3,
                speedMultiplier: Math.random() * 0.5 + 0.5,
                targetX: null,
                targetY: null
            });
        }
    }

    scheduleConstellation() {
        // Choisir une constellation aléatoire
        const constellationNames = Object.keys(this.constellations);
        const randomConstellation = constellationNames[Math.floor(Math.random() * constellationNames.length)];
        const constellation = this.constellations[randomConstellation];
        
        // Préparer les positions cibles avec position aléatoire
        this.targetPositions = [];
        // Décalage aléatoire pour varier la position
        const offsetX = (Math.random() - 0.5) * this.canvas.width * 0.3;
        const offsetY = (Math.random() - 0.5) * this.canvas.height * 0.3;
        const centerX = this.canvas.width / 2 + offsetX;
        const centerY = this.canvas.height / 2 + offsetY;
        const scale = Math.min(this.canvas.width, this.canvas.height) * 0.6;
        
        constellation.forEach(([x, y]) => {
            this.targetPositions.push({
                x: centerX + (x - 0.4) * scale,
                y: centerY + (y - 0.35) * scale
            });
        });
        
        // Activer le mode constellation
        this.constellationMode = true;
        this.constellationTimer = 0;
        this.constellationDuration = 180; // 3 secondes à 60fps
        
        // Planifier la prochaine constellation (entre 15 et 30 secondes)
        setTimeout(() => this.scheduleConstellation(), 15000 + Math.random() * 15000);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    drawParticle(particle) {
        // Dessiner le point
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        this.ctx.fill();
        
        // Dessiner le texte de code (seulement sur desktop et pour certaines particules)
        if (window.innerWidth >= 768 && Math.random() > 0.7) {
            this.ctx.font = '10px monospace';
            this.ctx.fillStyle = `rgba(96, 165, 250, ${particle.opacity * 0.6})`;
            this.ctx.fillText(particle.text, particle.x + 5, particle.y + 3);
        }
    }

    drawConnections() {
        // Dessiner des lignes entre particules proches
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(96, 165, 250, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Mode constellation: interpoler vers les positions cibles
            if (this.constellationMode && index < this.targetPositions.length) {
                const target = this.targetPositions[index];
                const lerpFactor = 0.05; // Vitesse d'interpolation
                
                particle.x += (target.x - particle.x) * lerpFactor;
                particle.y += (target.y - particle.y) * lerpFactor;
                
                // Ralentir les particules pendant la constellation
                particle.vx *= 0.95;
                particle.vy *= 0.95;
            } else {
                // Mode normal: mouvement aléatoire
                particle.x += particle.vx * particle.speedMultiplier;
                particle.y += particle.vy * particle.speedMultiplier;
                
                // Rétablir la vélocité originale progressivement
                if (!this.constellationMode) {
                    particle.vx += (particle.originalVx - particle.vx) * 0.01;
                    particle.vy += (particle.originalVy - particle.vy) * 0.01;
                }
            }
            
            // Interaction avec la souris (sauf en mode constellation)
            if (!this.constellationMode) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x -= (dx / distance) * force * 2;
                    particle.y -= (dy / distance) * force * 2;
                }
            }
            
            // Rebond sur les bords
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                if (particle.originalVx) particle.originalVx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                if (particle.originalVy) particle.originalVy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
        });
    }

    animate() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Gérer le timer de constellation
        if (this.constellationMode) {
            this.constellationTimer++;
            if (this.constellationTimer >= this.constellationDuration) {
                this.constellationMode = false;
                this.constellationTimer = 0;
            }
        }
        
        // Dessiner les connexions
        this.drawConnections();
        
        // Dessiner et mettre à jour les particules
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
        
        this.updateParticles();
        
        // Continuer l'animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialiser l'animation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que la page soit complètement chargée
    window.addEventListener('load', () => {
        setTimeout(() => {
            new HeroAnimation();
        }, 100);
    });
});
