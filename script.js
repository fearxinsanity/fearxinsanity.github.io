// script.js - Illuminati/Freimaurer Stil (Korrigiertes Timing)

class SecretSocietyTransition {
    constructor() {
        this.isTransitioning = false;
        this.setupEyeOverlay();
        this.initNavigation();
    }

    setupEyeOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'eye-overlay';
        overlay.innerHTML = `
            <div class="eye-container">
                <img src="Bilder/Logo-Illuminati_Freimarurer-Mix.PNG" alt="Projekt Logo" class="eye-image">
            </div>
        `;
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            #eye-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                background: var(--bg);
                display: flex;
                justify-content: center;
                align-items: center;
                transition: opacity 0.4s ease-in-out;
            }

            #eye-overlay.active {
                pointer-events: all;
                opacity: 1;
            }

            .eye-container {
                width: 150px; /* Oder die gewünschte Größe für dein Logo */
                height: 150px; /* Oder die gewünschte Größe für dein Logo */
                position: relative;
                animation: pulse 2s infinite;
                display: flex; /* Zentriert das Bild innerhalb des Containers */
                justify-content: center;
                align-items: center;
                overflow: hidden; /* **WICHTIG:** Schneidet den Inhalt außerhalb des Kreises ab */
                border-radius: 50%; /* **WICHTIG:** Macht den Container kreisförmig */
            }

            .eye-image {
                width: 100%; /* Bild nimmt die volle Breite des Containers ein */
                height: 100%; /* Bild nimmt die volle Höhe des Containers ein */
                object-fit: cover; /* **WICHTIG:** Füllt den Kreis aus, kann aber Teile des Bildes abschneiden */
                border: 2px solid var(--primary); /* Optional: Rahmen um das Bild */
                border-radius: 50%; /* Macht das Bild selbst auch kreisförmig */
                box-shadow: 0 0 10px var(--primary); /* Optional: Schatteneffekt */
                background-color: var(--secondary); /* Hintergrundfarbe für das Logo, falls es transparente Bereiche hat */
            }

            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 10px var(--primary); }
                50% { transform: scale(1.05); box-shadow: 0 0 25px var(--primary); }
                100% { transform: scale(1); box-shadow: 0 0 10px var(--primary); }
            }
            
            main.fade-out {
                opacity: 0;
                transition: opacity 0.3s ease-out;
            }
            
            main.fade-in {
                opacity: 1;
                transition: opacity 0.3s ease-in;
            }
        `;
        document.head.appendChild(style);
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
        return new URL(href, window.location.origin).hostname === window.location.hostname;
    }

    async transitionToPage(url, pushState = true) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            await this.showEyeOverlay();
            await this.fadeOutCurrentPage();

            const newContent = await this.loadPage(url);
            this.replacePageContent(newContent, url);

            if (pushState) {
                history.pushState(null, '', url);
            }

            await this.hideEyeOverlay();
            this.fadeInNewPage();

        } catch (error) {
            console.error('Transition failed:', error);
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    showEyeOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('eye-overlay');
            overlay.classList.add('active');
            setTimeout(resolve, 400); // Wartet bis die Fade-In Animation beendet ist
        });
    }

    hideEyeOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('eye-overlay');
            overlay.classList.remove('active');
            setTimeout(resolve, 400); // Wartet bis die Fade-Out Animation beendet ist
        });
    }

    fadeOutCurrentPage() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            main.classList.add('fade-out');
            setTimeout(resolve, 300);
        });
    }

    fadeInNewPage() {
        const main = document.querySelector('main');
        main.classList.remove('fade-out');
        main.classList.add('fade-in');

        // Initialisiert die "reveal" Animationen für die neue Seite
        revealOnScroll();

        setTimeout(() => {
            main.classList.remove('fade-in');
        }, 300);
    }

    async loadPage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Page not found: ${url}`);
        return await response.text();
    }

    replacePageContent(html, url) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        document.title = newDoc.title;

        const newMain = newDoc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.innerHTML = newMain.innerHTML;
        }

        this.updateActiveNavLink(url);
        this.handleContentSpecificInitials(url);
    }

    updateActiveNavLink(url) {
        const navLinks = document.querySelectorAll('nav a');
        const currentPath = new URL(url).pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || (linkPath.endsWith('index.html') && currentPath === '/')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    handleContentSpecificInitials(url) {
        const path = new URL(url).pathname.split('/').pop() || 'index.html';

        if (path === 'index.html' || path === '') {
            if (window.countdownInstance) {
                clearInterval(window.countdownInstance.countdownInterval);
            }
            window.countdownInstance = new Countdown('2026-03-01T00:00:00', 'countdown-timer', 'countdown-message');
        }
    }
}

class Countdown {
    constructor(targetDateString, timerElementId, messageElementId) {
        this.targetDate = new Date(targetDateString).getTime();
        this.timerElement = document.getElementById(timerElementId);
        this.messageElement = document.getElementById(messageElementId);
        this.countdownInterval = null;

        if (this.timerElement && this.messageElement) {
            this.startCountdown();
        }
    }

    startCountdown() {
        this.updateCountdown();
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            if (this.timerElement) this.timerElement.innerHTML = 'PROJEKT GESTARTET!';
            if (this.messageElement) this.messageElement.textContent = 'Das Warten hat ein Ende! Tauchen Sie ein in die Simulation.';
            clearInterval(this.countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (this.timerElement && this.timerElement.querySelector('#days')) {
            this.timerElement.querySelector('#days').textContent = days;
            this.timerElement.querySelector('#hours').textContent = hours;
            this.timerElement.querySelector('#minutes').textContent = minutes;
            this.timerElement.querySelector('#seconds').textContent = seconds;
            if (this.messageElement) this.messageElement.textContent = 'Die Zeit läuft...';
        }
    }
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal:not(.revealed)');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            el.classList.add('revealed');
        }
    });
}

let scrollTimeout;

function throttledReveal() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            revealOnScroll();
            scrollTimeout = null;
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SecretSocietyTransition();

    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'index.html' || path === '') {
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

function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open'); // Für die "X"-Animation
        });
    }

    // Menü schließen, wenn ein Link geklickt wird
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
            }
        });
    });
}

// Event Listener, um das mobile Menü zu initialisieren
document.addEventListener('DOMContentLoaded', setupMobileMenu);