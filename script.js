// script.js - Erweiterte Version mit globalem Click-Effekt und separatem Countdown

class PixelTransition {
    constructor() {
        this.isTransitioning = false;
        this.pixelCount = 800;
        this.setupPixelOverlay();
        this.initNavigation();
        this.initGlobalClickEffect();
    }

    setupPixelOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pixel-overlay';
        overlay.innerHTML = this.generatePixelGrid();
        document.body.appendChild(overlay);

        // CSS für Pixel-Overlay hinzufügen (from previous style.css)
        const style = document.createElement('style');
        style.textContent = `
            #pixel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                background: var(--bg);
                display: grid;
                grid-template-columns: repeat(32, 1fr);
                grid-template-rows: repeat(25, 1fr);
                gap: 1px;
                will-change: opacity;
                transform: translateZ(0);
            }

            #pixel-overlay.active {
                pointer-events: all;
                opacity: 1;
                transition: opacity 0.15s ease-out;
            }

            .pixel-block {
                background: linear-gradient(135deg, #4fc3f7, #29b6f6);
                transform: scale(0);
                border: 1px solid #81c784;
                will-change: transform;
                transform-origin: center;
                backface-visibility: hidden;
                position: relative;
            }

            .pixel-block::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, #64b5f6, #42a5f5);
                opacity: 0;
                transition: opacity 0.1s;
            }

            .pixel-block.animate {
                transform: scale(1);
                transition: transform 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: 0 0 4px rgba(100, 181, 246, 0.6);
            }

            .pixel-block.animate::after {
                opacity: 0.8;
            }

            .pixel-block.special {
                background: linear-gradient(135deg, #ffb74d, #ff9800);
                border-color: #ffcc02;
            }

            .pixel-block.special.animate {
                box-shadow: 0 0 6px rgba(255, 183, 77, 0.8);
            }

            .pixel-block.rare {
                background: linear-gradient(135deg, #81c784, #66bb6a);
                border-color: #a5d6a7;
            }

            .pixel-block.rare.animate {
                box-shadow: 0 0 8px rgba(129, 199, 132, 0.9);
                animation: pixelGlow 0.4s ease-out;
            }

            @keyframes pixelGlow {
                0% { box-shadow: 0 0 4px rgba(129, 199, 132, 0.5); }
                50% { box-shadow: 0 0 12px rgba(129, 199, 132, 1); }
                100% { box-shadow: 0 0 6px rgba(129, 199, 132, 0.8); }
            }

            .page-transition {
                opacity: 1;
                transform: translateY(0);
                will-change: transform, opacity;
            }

            .page-transition.fade-out {
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.2s ease-out;
            }

            .page-transition.fade-in {
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.2s ease-out;
            }

            .pixel-loading {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                color: var(--text-primary);
                font-family: 'Press Start 2P', monospace;
                font-size: 10px;
                opacity: 0;
                text-shadow: 2px 2px 0px var(--pixel-shadow);
                background: linear-gradient(135deg, var(--white), #343a46);
                padding: 12px 16px;
                border: 2px solid var(--primary);
                box-shadow: 4px 4px 0px var(--pixel-shadow);
                will-change: opacity, transform;
            }

            .pixel-loading.show {
                opacity: 1;
                transition: opacity 0.15s ease-out;
            }

            .pixel-sound-effect {
                position: fixed;
                z-index: 10001;
                font-family: 'Press Start 2P', monospace;
                font-size: 8px;
                color: #ffb74d;
                pointer-events: none;
                opacity: 0;
                will-change: transform, opacity;
                text-shadow: 1px 1px 0px var(--pixel-shadow);
                white-space: nowrap;
            }

            .pixel-sound-effect.show {
                opacity: 1;
                animation: clickPop 0.35s ease-out forwards;
            }

            .pixel-sound-effect.transition {
                animation: soundPop 0.4s ease-out forwards;
            }

            @keyframes clickPop {
                0% {
                    opacity: 1;
                    transform: scale(0.7);
                    color: #ffb74d;
                }
                30% {
                    opacity: 1;
                    transform: scale(1.2);
                    color: #ff9800;
                }
                100% {
                    opacity: 0;
                    transform: scale(0.8);
                    color: #ffc107;
                }
            }

            @keyframes soundPop {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.8);
                    color: #ffb74d;
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -55%) scale(1.15);
                    color: #ff9800;
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -65%) scale(0.9);
                    color: #ffc107;
                }
            }
        `;
        document.head.appendChild(style);

        // Loading-Text hinzufügen
        const loading = document.createElement('div');
        loading.className = 'pixel-loading';
        loading.textContent = 'LOADING...';
        document.body.appendChild(loading);
    }

    generatePixelGrid() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < this.pixelCount; i++) {
            const pixel = document.createElement('div');
            let pixelClass = 'pixel-block';

            const rand = Math.random();
            if (rand < 0.05) {
                pixelClass += ' rare';
            } else if (rand < 0.15) {
                pixelClass += ' special';
            }

            pixel.className = pixelClass;
            fragment.appendChild(pixel);
        }

        const container = document.createElement('div');
        container.appendChild(fragment);
        return container.innerHTML;
    }

    initGlobalClickEffect() {
        // Globaler Click-Listener für alle Mausklicks
        document.addEventListener('click', (e) => {
            // Click-Effekt bei jeder Interaktion
            this.showGlobalClickEffect(e.clientX, e.clientY);
        });
    }

    initNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });

        window.addEventListener('popstate', (e) => {
            this.transitionToPage(window.location.href, false);
        });
    }

    isInternalLink(href) {
        return href.includes(window.location.host) &&
            (href.endsWith('.html') || href === window.location.origin + '/');
    }

    async transitionToPage(url, pushState = true) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            this.showTransitionSoundEffect('*PAGE*');
            await this.showPixelOverlay();
            await this.fadeOutCurrentPage();

            const newContent = await this.loadPage(url);
            this.replacePageContent(newContent);

            if (pushState) {
                history.pushState(null, '', url);
            }

            await this.fadeInNewPage();
            await this.hidePixelOverlay();

            this.showTransitionSoundEffect('LOADED!');
            this.handleContentSpecificInitials(url); // Call for content-specific initializations

        } catch (error) {
            console.error('Transition failed:', error);
            this.showTransitionSoundEffect('ERROR!');
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    showGlobalClickEffect(x, y) {
        const clickTexts = ['*CLICK*', '*POP*', '*ZAP*', '*BEEP*'];
        const randomText = clickTexts[Math.floor(Math.random() * clickTexts.length)];

        const existing = document.querySelector('.pixel-sound-effect:not(.transition)');
        if (existing) existing.remove();

        const effect = document.createElement('div');
        effect.className = 'pixel-sound-effect show';
        effect.textContent = randomText;

        // Position am Mauszeiger
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        effect.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 350);
    }

    showTransitionSoundEffect(text) {
        const existing = document.querySelector('.pixel-sound-effect.transition');
        if (existing) existing.remove();

        const effect = document.createElement('div');
        effect.className = 'pixel-sound-effect transition show';
        effect.textContent = text;
        effect.style.top = '45%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 400);
    }

    showPixelOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('pixel-overlay');
            const loading = document.querySelector('.pixel-loading');
            const pixels = overlay.querySelectorAll('.pixel-block');

            overlay.classList.add('active');
            loading.classList.add('show');

            // Diagonale Animation von oben-links nach unten-rechts
            const animatePixelsDiagonal = (startIndex, batchSize) => {
                const endIndex = Math.min(startIndex + batchSize, pixels.length);

                requestAnimationFrame(() => {
                    for (let i = startIndex; i < endIndex; i++) {
                        const row = Math.floor(i / 32);
                        const col = i % 32;
                        const diagonalDelay = (row + col) * 6;

                        setTimeout(() => {
                            pixels[i].classList.add('animate');
                        }, diagonalDelay);
                    }

                    if (endIndex < pixels.length) {
                        setTimeout(() => animatePixelsDiagonal(endIndex, batchSize), 8);
                    }
                });
            };

            animatePixelsDiagonal(0, 25);
            setTimeout(resolve, 400);
        });
    }

    hidePixelOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('pixel-overlay');
            const loading = document.querySelector('.pixel-loading');
            const pixels = overlay.querySelectorAll('.pixel-block');

            loading.classList.remove('show');

            // Diagonales Ausblenden von unten-rechts nach oben-links
            const removePixelsDiagonal = (startIndex, batchSize) => {
                const endIndex = Math.min(startIndex + batchSize, pixels.length);

                requestAnimationFrame(() => {
                    for (let i = startIndex; i < endIndex; i++) {
                        const row = Math.floor(i / 32);
                        const col = i % 32;
                        const reverseDiagonalDelay = ((24 - row) + (31 - col)) * 4;

                        setTimeout(() => {
                            pixels[i].classList.remove('animate');
                        }, reverseDiagonalDelay);
                    }

                    if (endIndex < pixels.length) {
                        setTimeout(() => removePixelsDiagonal(endIndex, batchSize), 6);
                    }
                });
            };

            removePixelsDiagonal(0, 30);

            setTimeout(() => {
                overlay.classList.remove('active');
                resolve();
            }, 350);
        });
    }

    fadeOutCurrentPage() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            main.classList.add('fade-out');
            setTimeout(resolve, 200);
        });
    }

    fadeInNewPage() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            main.classList.remove('fade-out');
            main.classList.add('fade-in');

            requestAnimationFrame(() => {
                main.classList.remove('fade-in');
                this.revealSections();
            });

            setTimeout(resolve, 200);
        });
    }

    revealSections() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el, index) => {
            el.classList.remove('revealed');
            setTimeout(() => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('revealed');
                }
            }, index * 50);
        });
    }

    async loadPage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');
        return await response.text();
    }

    replacePageContent(html) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        document.title = newDoc.title;

        const newMain = newDoc.querySelector('main');
        const currentMain = document.querySelector('main');
        currentMain.innerHTML = newMain.innerHTML;

        this.updateActiveNavLink();
        this.revealSections(); // Trigger reveal for newly loaded content
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('nav a');
        const current = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === current) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // New method to handle initializations specific to the loaded content
    handleContentSpecificInitials(url) {
        const path = url.split('/').pop() || 'index.html';
        if (path === 'index.html') {
            // Re-initialize the countdown only if it's the index page
            if (window.countdownInstance) { // Clear existing interval if instance exists
                clearInterval(window.countdownInstance.countdownInterval);
            }
            window.countdownInstance = new Countdown('2026-03-01T00:00:00', 'countdown-timer', 'countdown-message');
        }
    }
}

// Separate Countdown Class
class Countdown {
    constructor(targetDateString, timerElementId, messageElementId) {
        this.targetDate = new Date(targetDateString).getTime();
        this.timerElement = document.getElementById(timerElementId);
        this.messageElement = document.getElementById(messageElementId);
        this.countdownInterval = null;

        if (this.timerElement && this.messageElement) {
            this.startCountdown();
        } else {
            console.warn('Countdown elements not found. Countdown not initialized.');
        }
    }

    startCountdown() {
        this.updateCountdown(); // Initial call to display immediately
        // Ensure only one interval is running
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.timerElement.innerHTML = 'PROJEKT GESTARTET!';
            this.messageElement.textContent = 'Das Warten hat ein Ende! Tauchen Sie ein in die Simulation.';
            clearInterval(this.countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.timerElement.querySelector('#days').textContent = days;
        this.timerElement.querySelector('#hours').textContent = hours;
        this.timerElement.querySelector('#minutes').textContent = minutes;
        this.timerElement.querySelector('#seconds').textContent = seconds;
        this.messageElement.textContent = 'Der Startschuss naht!';
    }
}


// Optimierte Scroll-Reveal-Funktion
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal:not(.revealed)');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('revealed');
        }
    });
}

// Throttled Scroll Event
let scrollTimeout;

function throttledReveal() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            revealOnScroll();
            scrollTimeout = null;
        }, 16);
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    const pixelTransition = new PixelTransition();
    // Initial Countdown setup when the page loads
    if (window.location.pathname.split('/').pop() === 'index.html' || window.location.pathname === '/') {
        window.countdownInstance = new Countdown('2026-03-01T00:00:00', 'countdown-timer', 'countdown-message');
    }
    revealOnScroll();

    const navLinks = document.querySelectorAll('nav a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === current) {
            link.setAttribute('aria-current', 'page');
        }
    });
});

window.addEventListener('scroll', throttledReveal, {passive: true});